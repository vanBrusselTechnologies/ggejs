//const WebSocket = require('ws')
module.exports = {
    /**
     *
     * @param {Socket} _socket
     */
    connect(_socket) {
        const serverInstance = _socket.client._serverInstance;
        //_socket = new WebSocket(`wss://${serverInstance.server}:${serverInstance.port}`); //empire? WebSocket ipv net.Socket
        _socket.connect(serverInstance.port, serverInstance.server, null);
    },
    login(socket, name, password) {
        require('./commands/loginCommand').execute(socket, name, password);
    },
    onConnection(socket, obj) {
        if (obj.success) {
            let languageCode = "nl";
            let distributorID = 0;
            let zone = socket.client._serverInstance.zone;
            _login(socket, zone, "", `NaN${languageCode}%${distributorID}`);//empire: `${versionDateGame}%${languageCode}%${distributorID}`
            socket["__connected"] = true;
        } else {
            socket["__connected"] = false;
            socket["__connection_error"] = obj.error;
            console.log("\x1b[31m[API ERROR]\x1b[0m" + obj.error);
        }
    },
    async onLogin(socket, error = "") {
        socket["__login_error"] = error;
        if (error !== "") {
            socket["__loggedIn"] = false;
            console.error(error);
            return;
        }
        socket["__loggedIn"] = true;
        require('./commands/pingpong').execute(socket);
        require('./commands/collectTaxCommand').execute(socket);
        await require('./onReceived/xt/dql').execute(socket, 0, {RDQ: [{QID: 7}, {QID: 8}, {QID: 9}, {QID: 10}]})
        if (!socket["inDungeonInterval"]) {
            setInterval(async () => {
                if(!socket["__connected"]) return;
                socket["inDungeonInterval"] = true;
                await require('./onReceived/xt/dql').execute(socket, 0, {RDQ: [{QID: 7}, {QID: 8}, {QID: 9}, {QID: 10}]})
            }, 18 * 60 * 1010); // 18 minutes
        }
    },
    _sendVersionCheck(socket) {
        sendVersionCheck(socket);
    }
}

const majVersion = 1;
const minVersion = 6;
const subVersion = 6;

function sendVersionCheck(socket) {
    let header = {"t": "sys"};
    let version = `<ver v=\'${majVersion}${minVersion}${subVersion}\' />`;
    require('./commands/handlers/xml.js').sendAction(socket, header, "verChk", 0, version);
}

function _login(socket, zone, name, pass) {
    let header = {"t": "sys"};
    let msg = `<login z=\'${zone}\'><nick><![CDATA[${name}]]></nick><pword><![CDATA[${pass}]]></pword></login>`;
    require('./commands/handlers/xml.js').sendAction(socket, header, "login", 0, msg);
}