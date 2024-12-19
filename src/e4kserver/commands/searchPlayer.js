module.exports.name = "wsp";
/**
 * @param {Socket} socket
 * @param {string} playerName
 */
module.exports.execute = function (socket, playerName) {
    const C2SSearchPlayerVO = {
        getCmdId: "wsp", params: {PN: playerName}
    }
    require('../data').sendCommandVO(socket, C2SSearchPlayerVO);
}