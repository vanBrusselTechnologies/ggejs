module.exports.name = "gab";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{B:number}} params
 * @returns {number}
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params?.B) return 0;
    return params.B;
}