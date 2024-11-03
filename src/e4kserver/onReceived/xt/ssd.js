module.exports.name = "ssd";
/**
 *
 * @param {Socket} socket
 * @param {number} _
 * @param {Object} __
 */
module.exports.execute = function (socket, _, __) {
    socket.client.emit('serverShutdown');
    setTimeout(checkMaintenanceOver, 10000, socket.client);
}

/**
 *
 * @param {Client} client
 * @returns {Promise<void>}
 */
async function checkMaintenanceOver(client) {
    try {
        const gameId = 16 // TODO: gameID to config file
        let response = await fetch(`https://media.goodgamestudios.com/games-config/network/status/${gameId}/maint.json`);
        let json = await response.json();
        if (json.toString() === "") {
            await client.connect();
            client.emit('serverShutdownEnd');
        } else {
            setTimeout(checkMaintenanceOver, 10000, client);
        }
    } catch (e) {
        setTimeout(checkMaintenanceOver, 10000, client);
    }
}