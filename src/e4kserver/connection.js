//const WebSocket = require('ws')
const {WaitUntil} = require("../tools/wait");
const {execute: loginCommand} = require('./commands/loginCommand');
const {execute: pingpong} = require('./commands/pingpong');
const {execute: showMessages} = require("./commands/showMessagesCommand");
const {execute: collectTaxCommand} = require('./commands/collectTaxCommand');
const {execute: dailyQuestListParser} = require('./onReceived/xt/dql');
const {sendAction: sendXmlAction} = require('./commands/handlers/xml.js');

/**
 *
 * @type {{
 * connect(socket: Socket): void,
 * login(socket: Socket, name: string, password: string): void,
 * onConnection(socket: Socket, obj: {success:boolean, error:string}): void,
 * onLogin(socket: Socket, error?:string): Promise<void>,
 * _sendVersionCheck(socket: Socket): void,
 * }}
 */
module.exports = {
    connect(socket) {
        const serverInstance = socket.client._serverInstance;
        //_socket = new WebSocket(`wss://${serverInstance.server}:${serverInstance.port}`); //empire? WebSocket ipv net.Socket
        socket.connect(serverInstance.port, serverInstance.server, null);
    }, login(socket, name, password) {
        loginCommand(socket, name, password);
    }, onConnection(socket, obj) {
        if (obj.success) {
            let languageCode = socket.client._language;
            let distributorID = 0;
            let zone = socket.client._serverInstance.zone;
            _login(socket, zone, "", `1${languageCode}%${distributorID}`);//empire: `${versionDateGame}%${languageCode}%${distributorID}`
            socket["__connected"] = true;
        } else {
            socket["__connected"] = false;
            socket["__connection_error"] = obj.error;
            console.log("\x1b[31m[API ERROR]\x1b[0m" + obj.error);
        }
    }, async onLogin(socket, error = "") {
        socket["__login_error"] = error;
        if (error !== "") {
            socket["__loggedIn"] = false;
            console.error(error);
            return;
        }
        socket['mailMessages'] = [];
        socket['isWaitingForSNE'] = false;
        pingpong(socket);
        await WaitUntil(socket, 'gdb finished');
        socket["__loggedIn"] = true;
        collectTaxCommand(socket);
        await dailyQuestListParser(socket, 0, {RDQ: [{QID: 7}, {QID: 8}, {QID: 9}, {QID: 10}]})
        if (!socket["inDungeonInterval"]) {
            setInterval(async () => {
                if (!socket["__connected"]) return;
                socket["inDungeonInterval"] = true;
                await dailyQuestListParser(socket, 0, {RDQ: [{QID: 7}, {QID: 8}, {QID: 9}, {QID: 10}]})
            }, 18 * 60 * 1010); // 18 minutes
            setInterval(() => {
                if (!socket["__connected"]) return;
                if (socket['isWaitingForSNE']) return;
                showMessages(socket)
            }, 1000)
        }
    }, _sendVersionCheck(socket) {
        sendVersionCheck(socket);
    }
}

const majVersion = 1;
const minVersion = 6;
const subVersion = 6;

/**
 *
 * @param {Socket} socket
 */
function sendVersionCheck(socket) {
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
 * @private
 */
function _login(socket, zone, name, pass) {
    let header = {"t": "sys"};
    let msg = `<login z=\'${zone}\'><nick><![CDATA[${name}]]></nick><pword><![CDATA[${pass}]]></pword></login>`;
    sendXmlAction(socket, header, "login", 0, msg);
}