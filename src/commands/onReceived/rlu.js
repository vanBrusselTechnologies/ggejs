module.exports.name = "rlu";
/**
 * @param {BaseClient} client
 * @param {number} _
 * @param {Array} __
 */
module.exports.execute = function (client, _, __) {
    client.socketManager.setConnected()
}