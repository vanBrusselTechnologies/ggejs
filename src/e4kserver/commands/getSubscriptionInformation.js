module.exports.name = "sie";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SSubscriptionsInformationVO = {};
    socket.client.socketManager.sendCommand("sie", C2SSubscriptionsInformationVO);
}