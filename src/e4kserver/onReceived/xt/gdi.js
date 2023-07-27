const Player = require('./../../../structures/Player');

module.exports.name = "gdi";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (errorCode === 21 || !params) return;
    const player = new Player(socket.client, params);
    socket[`__player_${player.playerId}_data`] = player;
}
