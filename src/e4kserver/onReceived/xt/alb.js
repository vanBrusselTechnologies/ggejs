module.exports.name = "alb";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    if (socket.debug) console.log("Daily Reward: ALB missing.")
}