module.exports.name = "aha";
/**
 * @param {Socket} socket
 * @param {number} kingdomId
 */
module.exports.execute = function (socket, kingdomId = 15) {
    const C2SAllianceHelpAllVO = {getCmdId: "aha", params: {KID: kingdomId}}
    require('../data').sendCommandVO(socket, C2SAllianceHelpAllVO);
}