module.exports.name = "gdi";
/**
 * @param {Socket} socket
 * @param {number} playerId
 */
module.exports.execute = function (socket, playerId) {
    let C2SGetDetailPlayerInfo = {
        getCmdId: "gdi", params: {PID: playerId}
    }
    require('../data').sendCommandVO(socket, C2SGetDetailPlayerInfo);
}