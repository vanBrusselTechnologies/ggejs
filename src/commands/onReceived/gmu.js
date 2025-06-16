module.exports.name = "gmu";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{MP:number, HMP:number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    client.clientUserData.mightpoints = params.MP;
    client.clientUserData.highestAchievedMight = params.HMP;
    // TEMP_SERVER_BUILDING_MIGHT : params.TSBM;
}