module.exports.name = "ssd";
/**
 * @param {BaseClient} client
 * @param {number} _
 * @param {Object} __
 */
module.exports.execute = function (client, _, __) {
    client.emit('serverShutdown');
    setTimeout(checkMaintenanceOver, 10000, client);
}

/**
 * @param {BaseClient} client
 * @returns {Promise<void>}
 */
async function checkMaintenanceOver(client) {
    try {
        const gameId = 16 // TODO: gameID to config file
        let response = await fetch(`https://media.goodgamestudios.com/games-config/network/status/${gameId}/maint.json`);
        let json = await response.json();
        if (json.toString() === "") {
            await client._reconnect();
            client.emit('serverShutdownEnd');
        } else {
            setTimeout(checkMaintenanceOver, 10000, client);
        }
    } catch (e) {
        setTimeout(checkMaintenanceOver, 10000, client);
    }
}