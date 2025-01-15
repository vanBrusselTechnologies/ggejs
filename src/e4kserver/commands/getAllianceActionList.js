module.exports.name = "all";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SAllianceActionListVO = {getCmdId: "all", params: {}}
    require('../data').sendCommandVO(socket, C2SAllianceActionListVO);
}