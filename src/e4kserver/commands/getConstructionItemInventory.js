module.exports.name = "gii";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    let C2SGetConstructionItemInventoryVO = {
        getCmdId: "gii", params: {},
    }
    require('../data').sendCommandVO(socket, C2SGetConstructionItemInventoryVO);
}