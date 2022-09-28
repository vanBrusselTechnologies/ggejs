const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
    name: "ssd",
    /**
     *
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        socket.client.emit('serverShutdown');
        setTimeout(checkMaintenanceOver, 10000, socket.client);
    }
}

/**
 *
 * @param {Client} client
 * @returns {Promise<void>}
 */
async function checkMaintenanceOver(client){
    let response = await fetch('https://media.goodgamestudios.com/games-config/network/status/16/maint.json');
    let json = await response.json();
    if (json.toString() === "") {
        await client.connect();
        socket.client.emit('serverShutdownOver');
    } else {
        setTimeout(checkMaintenanceOver, 10000);
    }
}