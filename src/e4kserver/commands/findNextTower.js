module.exports.name = "fnt";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SFindNextTowerVO = {getCmdId: "fnt", params: {}};
    require('../data').sendCommandVO(socket, C2SFindNextTowerVO);
}