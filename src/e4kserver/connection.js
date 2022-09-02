const Socket = require("node:net").Socket;

module.exports = {
    /**
     * 
     * @param {Socket} _socket
     */
    connect(_socket) {
        _socket.connect(443, "e4k-live-nl1-game.goodgamestudios.com", () => { });
    },
    login(socket, name, password) {
        require('./commands/loginCommand').execute(socket, name, password);
    },
    onConnection(socket, obj) {
        if (obj.success) {
            socket["__connected"] = true;
            let languageCode = "nl";
            let distributorID = 0;
            let zone = "EmpirefourkingdomsExGG_6";
            _login(socket, zone, "", `${NaN}${languageCode}%${distributorID}`);
        } else {
            socket["__connected"] = false;
            socket["__connection_error"] = obj.error;
            console.log("\x1b[31m[API ERROR]\x1b[0m" + obj.error);
        }
    },
    onLogin(socket, error = "") {
        socket["__login_error"] = error;
        if (error !== "") {
            socket["__loggedIn"] = false;
            return;
        }
        socket["__loggedIn"] = true;
        require('./commands/pingpong.js').execute(socket);
        require('./commands/collectTaxCommand').execute(socket);
    },
    _sendVersionCheck(socket) {
        sendVersionCheck(socket);
    }
}

const majVersion = 1;
const minVersion = 6;
const subVersion = 6;

function sendVersionCheck(socket) {
    let header = { "t": "sys" };
    let version = `<ver v=\'${majVersion}${minVersion}${subVersion}\' />`;
    require('./commands/handlers/xml.js').sendAction(socket, header, "verChk", 0, version);
}

function _login(socket, zone, name, pass) {
    let header = { "t": "sys" };
    let msg = `<login z=\'${zone}\'><nick><![CDATA[${name}]]></nick><pword><![CDATA[${pass}]]></pword></login>`;
    require('./commands/handlers/xml.js').sendAction(socket, header, "login", 0, msg);
}