module.exports.name = "hin";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{FB:number, WSR:number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params || params.FB === undefined) return {foodBoost: 0, woodStoneReduction: 0};
    return {foodBoost: params.FB, woodStoneReduction: params.WSR}
}