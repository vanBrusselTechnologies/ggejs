module.exports.name = "hin";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{FB:number, WSR:number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params || params.FB === undefined) return {foodBoost: 0, woodStoneReduction: 0};
    return {foodBoost: params.FB, woodStoneReduction: params.WSR}
}