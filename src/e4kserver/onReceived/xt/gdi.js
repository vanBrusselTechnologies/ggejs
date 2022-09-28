const Player = require('./../../../structures/Player');

module.exports = {
    name: "gdi",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if (errorCode === 21 || !params) {
            return socket["__get_player_error"] = "Player not found!";
        }
        const player = new Player(socket.client, params);
        socket[`__player_${player.playerId}_found`] = true;
        socket[`__player_${player.playerId}_data`] = player;
    }
}