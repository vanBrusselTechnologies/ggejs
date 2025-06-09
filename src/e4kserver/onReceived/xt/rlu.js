module.exports.name = "rlu";
/**
 * @param {Socket} socket
 * @param {number} _
 * @param {Array} __
 */
module.exports.execute = function (socket, _, __) {
    socket.client._verifyLoginData();
}