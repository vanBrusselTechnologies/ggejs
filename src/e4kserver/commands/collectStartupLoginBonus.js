module.exports.name = "slc";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SCollectTaxVO = {
        getCmdId: "slc", params: {}
    }
    require('../data').sendCommandVO(socket, C2SCollectTaxVO);
}