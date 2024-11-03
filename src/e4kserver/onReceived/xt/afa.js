module.exports.name = "afa";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{CF:number, HF:number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    const myAlliance = socket.client.clientUserData.myAlliance;
    myAlliance.allianceFamePoints = params.CF;
    myAlliance.allianceFamePointsHighestReached = params.HF;
}