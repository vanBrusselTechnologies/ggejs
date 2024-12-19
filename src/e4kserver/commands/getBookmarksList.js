module.exports.name = "gbl";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    const C2SBookmarkGetListVO = {getCmdId: "gbl", params: {},}
    require('../data').sendCommandVO(socket, C2SBookmarkGetListVO);
}