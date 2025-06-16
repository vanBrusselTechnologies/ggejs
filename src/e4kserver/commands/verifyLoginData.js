module.exports.name = "core_avl";
/**
 * @param {Client} client
 * @param {string} name
 * @param {string} password
 */
module.exports.execute = function (client, name, password) {
    const CoreC2SVerifyLoginDataVO = {LN: name, P: password};
    client.socketManager.sendCommand("core_avl", CoreC2SVerifyLoginDataVO);
}