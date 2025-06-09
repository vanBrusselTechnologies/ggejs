module.exports.name = "core_avl";
/**
 * @param {Socket} socket
 * @param {string} name
 * @param {string} password
 */
module.exports.execute = function (socket, name, password) {
    const CoreC2SVerifyLoginDataVO = {LN: name, P: password};
    socket.client.socketManager.sendCommand("core_avl", CoreC2SVerifyLoginDataVO);
}