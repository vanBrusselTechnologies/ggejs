const Player = require('../../structures/Player');

module.exports.name = "gdi";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (errorCode !== 0) {
        client._socket[`__get_player_error`] = (() => {
            switch (errorCode) {
                case 21:
                    return "player_not_found";
            }
        })();
        return;
    }
    client.worldMaps._ownerInfoData.parseOwnerInfo(params["O"]);
    const player = new Player(client, params);
    client._socket[`__get_player_${player.playerId}`] = player;
}
