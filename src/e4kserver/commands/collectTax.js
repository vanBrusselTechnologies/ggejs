module.exports.name = "txc";
/**
 * @param {Socket} socket
 * @param {number} taxRemaining
 */
module.exports.execute = function (socket, taxRemaining = 29) {
    const C2SCollectTaxVO = {
        getCmdId: "txc", params: {TR: taxRemaining}
    }
    require('../data').sendCommandVO(socket, C2SCollectTaxVO);
}