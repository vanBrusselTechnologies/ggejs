module.exports.name = "txs";
/**
 * @param {Socket} socket
 * @param {number} taxType
 * @param {number} taxes
 */
module.exports.execute = function (socket, taxType, taxes = 3) {
    let C2SStartCollectTaxVO = {
        getCmdId: "txs", params: {TT: taxType, TX: taxes}
    }
    require('../data').sendCommandVO(socket, C2SStartCollectTaxVO);
}