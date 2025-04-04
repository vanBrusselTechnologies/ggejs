module.exports.name = "afd";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SGetAttackableFactionDataVO = {getCmdId: "afd", params: {}};
    require('../data').sendCommandVO(socket, C2SGetAttackableFactionDataVO);
}