module.exports.name = "glt";
/**
 * @param {Socket} socket
 * @param {number} serverType
 */
module.exports.execute = function (socket, serverType) {
    const C2SGenerateLoginTokenVO = {GST: serverType};
    socket.client.socketManager.sendCommand("glt", C2SGenerateLoginTokenVO);
}