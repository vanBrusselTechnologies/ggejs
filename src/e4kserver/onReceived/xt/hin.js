module.exports.name = "hin";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{FB:number, WSR:number}} params
 * @returns {{foodBoost: number, woodStoneReduction: number}}
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return {foodBoost: 0, woodStoneReduction: 0};
    return {foodBoost: params.FB, woodStoneReduction: params.WSR}
}