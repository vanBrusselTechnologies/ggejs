module.exports.name = "sge";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {[]} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (errorCode !== 0) client._socket["sge -> errorCode"] = errorCode;
    if (!params) return;
    client._socket["sge -> sold"] = true;
}