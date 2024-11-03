const Player = require('../../../structures/Player');

module.exports.name = "gdi";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (errorCode !== 0) {
        socket[`__get_player_error`] = (() => {
            switch (errorCode) {
                case 21:
                    return "player_not_found";
            }
        })();
        return;
    }
    socket.client.worldmaps._ownerInfoData.parseOwnerInfo(params["O"]);
    const player = new Player(socket.client, params);
    socket[`__get_player_${player.playerId}`] = player;
}
