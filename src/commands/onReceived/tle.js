module.exports.name = "tle";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {[]} params
 */
module.exports.execute = async function (client, errorCode, params) {
    if (errorCode === 10005) return await client.socketManager.onLogin();
    client.logger.d('tle', errorCode, params);
}