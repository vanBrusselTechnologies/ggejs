module.exports.name = "ain";
/**
 * @param {Socket} socket
 * @param {number} allianceId
 */
module.exports.execute = function (socket, allianceId) {
    if (allianceId == null) return;
    const C2SGetAllianceInfoVO = {getCmdId: "ain", params: {AID: allianceId}};
    require('../data').sendCommandVO(socket, C2SGetAllianceInfoVO);
}