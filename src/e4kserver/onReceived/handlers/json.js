const sys = require('./sys.js');
const xt = require('./xt');

module.exports = {
    /**
     * @param {Socket} socket
     * @param {string} msg
     */
    execute(socket, msg) {
        try {
            let json = JSON.parse(msg);
            let type = json["t"];
            if (type === "xt") {
                xtHandleMessage(socket, json["b"])
            }
            else if (type === "sys") {
                sys.onResponse(socket, json["b"]);
            }
        } catch (e) {
        }
    }
}

/**
 * @param {Socket} socket
 * @param {any} msgObj
 */
function xtHandleMessage(socket, msgObj) {
    let event = {
        dataObj: msgObj.o,
        type: "json",
    }
    xt.onResponse(socket, event)
}