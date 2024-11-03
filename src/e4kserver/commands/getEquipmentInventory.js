module.exports.name = "gei";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    let C2SGetEquipmentInventoryVO = {
        getCmdId: "gei", params: {},
    }
    require('../data').sendCommandVO(socket, C2SGetEquipmentInventoryVO);
}