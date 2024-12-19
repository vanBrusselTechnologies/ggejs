module.exports.name = "afa";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SAllianceGetFameVO = {getCmdId: "afa", params: {}}
    require('../data').sendCommandVO(socket, C2SAllianceGetFameVO);
}