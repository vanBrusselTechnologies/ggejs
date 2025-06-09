module.exports.name = "irc";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SResourceCitizenVO = {};
    socket.client.socketManager.sendCommand("irc", C2SResourceCitizenVO);
}