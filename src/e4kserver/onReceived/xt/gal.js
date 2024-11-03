module.exports.name = "gal";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{AID: number, R:number, ACF: number, SA: number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    socket.client.clientUserData.allianceId = params.AID;
    socket.client.clientUserData.allianceRank = params.R;
    socket.client.clientUserData.allianceCurrentFame = params.ACF;
    socket.client.clientUserData.isSearchingAlliance = params.SA === 1;
}