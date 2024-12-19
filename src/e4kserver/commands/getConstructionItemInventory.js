module.exports.name = "gii";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SGetConstructionItemInventoryVO = {getCmdId: "gii", params: {},}
    require('../data').sendCommandVO(socket, C2SGetConstructionItemInventoryVO);
}