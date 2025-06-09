module.exports.name = "gcs";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SGetCharactersStatusVO = {};
    socket.client.socketManager.sendCommand("gcs", C2SGetCharactersStatusVO);
}