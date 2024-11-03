const {execute: sendPingPong} = require('../../commands/pingpong.js');

module.exports.name = "pin";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{NP:number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    let nextPingTimeout = 15000;
    if (errorCode === 0 && params) {
        nextPingTimeout = params.NP * 1000;
    }
    if (socket["inPingTimeout"]) return;
    socket["inPingTimeout"] = true;
    setTimeout(function () {
        socket["inPingTimeout"] = false;
        sendPingPong(socket);
    }, nextPingTimeout);
}