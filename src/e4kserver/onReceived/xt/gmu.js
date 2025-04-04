module.exports.name = "gmu";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{MP:number, HMP:number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    socket.client.clientUserData.mightpoints = params.MP;
    socket.client.clientUserData.highestAchievedMight = params.HMP;
    // TEMP_SERVER_BUILDING_MIGHT : params.TSBM;
}