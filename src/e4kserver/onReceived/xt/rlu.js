module.exports.name = "rlu";
/**
 * @param {Client} client
 * @param {number} _
 * @param {Array} __
 */
module.exports.execute = function (client, _, __) {
    client._verifyLoginData();
}