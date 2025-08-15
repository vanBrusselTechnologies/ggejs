module.exports.name = "csl";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{SL:number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return -1;
    return params.SL;
}