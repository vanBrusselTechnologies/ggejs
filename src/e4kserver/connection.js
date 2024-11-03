//const WebSocket = require('ws')
const {WaitUntil} = require("../tools/wait");
const {execute: loginCommand} = require('./commands/login');
const {execute: showMessages} = require("./commands/showMessages");
const {execute: collectTaxCommand} = require('./commands/collectTax');
const {execute: dql} = require('./onReceived/xt/dql');
const {execute: generateLoginToken} = require('./commands/generateLoginToken');
const {sendAction: sendXmlAction} = require('./commands/handlers/xml.js');

const majVersion = 1;
const minVersion = 6;
const subVersion = 6;
const versionDateGame = "1720624555356";

/** @param {Socket} socket */
module.exports.connect = function (socket) {
    const serverInstance = socket.client._serverInstance;
    //_socket = new WebSocket(`wss://${serverInstance.server}:${serverInstance.port}`); //empire? WebSocket ipv net.Socket
    socket.connect(serverInstance.port, serverInstance.server ?? serverInstance.host ?? serverInstance.ip, null);
}

/**
 * @param {Socket} socket
 * @param {string} name
 * @param {string} password
 */
module.exports.login = function (socket, name, password) {
    loginCommand(socket, name, password);
}

/**
 * @param {Socket} socket
 * @param {{success:boolean, error?:string}} obj
 */
module.exports.onConnection = function (socket, obj) {
    if (obj.success) {
        let languageCode = socket.client._language;
        let distributorId = 0;
        let zone = socket.client._serverInstance.zone;
        login(socket, zone, "", `${versionDateGame}%${languageCode}%${distributorId}`);//empire: `${versionDateGame}%${languageCode}%${distributorID}`
    } else {
        socket["__connected"] = false;
        socket["__connection_error"] = obj.error;
        console.error(`\x1b[31m[API ERROR]\x1b[0m${obj.error}`);
    }
}

/**
 * @param {Socket} socket
 * @param {string?} error
 * @return {Promise<void>}
 */
module.exports.onLogin = async function (socket, error = "") {
    try {
        socket["__connection_error"] = error;
        if (error !== "") {
            socket["__connected"] = false;
            console.error(error);
            return;
        }
        //Added, not in source code
        socket["__connected"] = true;
        //todo: Below isn't in source code
        if (socket['mailMessages'] === undefined) socket['mailMessages'] = [];
        socket['isWaitingForSNE'] = false;
        await WaitUntil(socket, 'gdb finished');

        collectTaxCommand(socket);

        await dql(socket, 0, {RDQ: [{QID: 7}, {QID: 8}, {QID: 9}, {QID: 10}]})
        if (!socket["inDungeonInterval"]) {
            setInterval(async () => {
                if (!socket["__connected"]) return;
                socket["inDungeonInterval"] = true;
                await dql(socket, 0, {RDQ: [{QID: 7}, {QID: 8}, {QID: 9}, {QID: 10}]})
            }, 5 * 60 * 1010); // 5 minutes
            setInterval(() => {
                if (!socket["__connected"]) return;
                if (socket['isWaitingForSNE']) return;
                showMessages(socket)
            }, 1000)
        }
        if(socket["currentServerType"] === 1) generateLoginToken(socket)
    } catch (e) {
        console.error(e);
    }
}

/** @param {Socket} socket */
module.exports.sendVersionCheck = function (socket) {
    let header = {"t": "sys"};
    let version = `<ver v=\'${majVersion}${minVersion}${subVersion}\' />`;
    sendXmlAction(socket, header, "verChk", 0, version);
}

/**
 *
 * @param {Socket} socket
 * @param {string} zone
 * @param {string} name
 * @param {string} pass
 */
function login(socket, zone, name, pass) {
    let header = {"t": "sys"};
    let msg = `<login z=\'${zone}\'><nick><![CDATA[${name}]]></nick><pword><![CDATA[${pass}]]></pword></login>`;
    sendXmlAction(socket, header, "login", 0, msg);
}