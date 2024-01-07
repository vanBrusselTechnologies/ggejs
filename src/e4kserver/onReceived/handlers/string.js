const sys = require('./sys.js');
const xt = require('./xt');
/**
 * @param {Socket} socket
 * @param {string} msg
 */
module.exports.execute = function (socket, msg) {
    const msgParts = msg.substring(1, msg.length - 1).split("%");
    let type = msgParts[0];
    if (type === "xt") {
        xtHandleMessage(socket, msgParts.splice(1, msgParts.length - 1))
    } else if (type === "sys") {
        sys.onResponse(socket, msgParts.splice(1, msgParts.length - 1));
    }
}

/**
 * @param {Socket} socket
 * @param {any} msgObj
 */
function xtHandleMessage(socket, msgObj) {
    let event = {
        dataObj: msgObj, type: "str",
    }
    xt.onResponse(socket, event);
}