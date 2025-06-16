module.exports.name = "afa";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{CF:number, HF:number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    const myAlliance = client.clientUserData.myAlliance;
    myAlliance.allianceFamePoints = params.CF;
    myAlliance.allianceFamePointsHighestReached = params.HF;
}