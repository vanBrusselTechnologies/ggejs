module.exports = {
    name: "ssd", /**
     *
     * @param {Socket} socket
     * @param {number} _
     * @param {object} __
     */
    execute(socket, _, __) {
        socket.client.emit('serverShutdown');
        setTimeout(checkMaintenanceOver, 10000, socket.client);
    }
}

/**
 *
 * @param {Client} client
 * @returns {Promise<void>}
 */
async function checkMaintenanceOver(client) {
    let response = await fetch('https://media.goodgamestudios.com/games-config/network/status/16/maint.json');
    let json = await response.json();
    if (json.toString() === "") {
        await client.connect();
        client.emit('serverShutdownEnd');
    } else {
        setTimeout(checkMaintenanceOver, 10000, client);
    }
}