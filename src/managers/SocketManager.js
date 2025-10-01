const {WebSocket} = require('ws')
const {NetworkInstance} = require('e4k-data');
const {onResponse} = require('../commands');
const EmpireError = require("../tools/EmpireError");
const {ConnectionStatus} = require("../utils/Constants");

const versionDateGame = 1756306047494;

class SocketManager {
    #connectionStatus = ConnectionStatus.Disconnected;

    reconnectTimeout = 300;
    serverType = 1;

    /**
     * @param {BaseClient} client
     * @param {NetworkInstance} serverInstance
     */
    constructor(client, serverInstance) {
        this.client = client;
        this.serverInstance = serverInstance;
        serverInstance.server
        const protocol = serverInstance.zone.startsWith('EmpirefourkingdomsExGG') ? 'ws' : 'wss';
        this.url = `${protocol}://${serverInstance.server}`
        this.socket = new WebSocket(this.url);
        this.#addSocketListeners(this.socket);
    }

    get connectionStatus() {
        return this.#connectionStatus;
    }

    /** @param {number} connectionStatus */
    set connectionStatus(connectionStatus) {
        this.client.logger.i("[SocketManager] Connection status:", Object.keys(ConnectionStatus).find(k => ConnectionStatus[k] === connectionStatus));
        this.#connectionStatus = connectionStatus;
    }

    async connect() {
        this.connectionStatus = ConnectionStatus.Connecting;
        await waitForConnectionStatus(this, ConnectionStatus.Connected);
    }

    async reconnect() {
        if (this.reconnectTimeout === -1) return;
        if (this.connectionStatus === ConnectionStatus.Connected) {
            await this.disconnect();
            await new Promise(resolve => setTimeout(resolve, this.reconnectTimeout * 1000));
        }
        await waitForConnectionStatus(this, ConnectionStatus.Connected);
    }

    async disconnect() {
        if (this.connectionStatus === ConnectionStatus.Disconnected) return;
        this.connectionStatus = ConnectionStatus.Disconnecting;
        this.socket.close();
        await waitForConnectionStatus(this, ConnectionStatus.Disconnected);
    }

    setConnected() {
        this.connectionStatus = ConnectionStatus.Connected;
    }

    /**
     * @param {string} commandId
     * @param {Object} paramObject
     */
    sendCommand(commandId, paramObject) {
        const params = [JSON.stringify(paramObject)];
        let i = 0;
        while (i < params.length) {
            params[i] ? "string" == typeof params[i] && (params[i] = getValidSmartFoxText(params[i])) : params[i] = "<RoundHouseKick>";
            i++;
        }
        const message = ["", "xt", this.serverInstance.zone, commandId, 1].concat(params, [""]).join("%");
        return this.writeToSocket(message);
    }

    /** @param {string} msg */
    writeToSocket(msg) {
        if (this.connectionStatus === ConnectionStatus.Disconnecting || this.connectionStatus === ConnectionStatus.Disconnected) return false;
        this.client.logger.t('[WRITE]', msg.substring(0, Math.min(150, msg.length)));
        this.socket.send(msg, {}, (err) => {
            if (err) this.client.logger.w(`\x1b[31m[SOCKET WRITE ERROR] ${err}\x1b[0m`);
        });
        return true;
    }

    /** @param {WebSocket} socket */
    #addSocketListeners(socket) {
        socket.addListener('open', () => onSocketReady(this));
        socket.addListener('message', (data) => onSocketData(socket, this.client, data));
        socket.addListener('error', (err) => {
            this.client.logger.w(`\x1b[31m[SOCKET ERROR] ${err}\x1b[0m`);
            this.client.logger.d(err);
            socket.close();
        });
        socket.addListener('close', () => {
            if (this.connectionStatus === ConnectionStatus.Disconnected) return;
            this.connectionStatus = ConnectionStatus.Disconnected;
            this.client.logger.d(`[SocketManager] Socket Closed!`);
            socket.removeAllListeners();

            if (this.reconnectTimeout === -1) return;
            setTimeout(async () => {
                if (this.reconnectTimeout === -1) return;
                socket = null;
                this.client.logger.i("[SocketManager] Reconnecting!");
                while (true) {
                    try {
                        const new_socket = new WebSocket(this.url);
                        this.#addSocketListeners(new_socket);
                        this.socket = new_socket;
                        socket = null;
                        await this.client._reconnect();
                        break;
                    } catch (e) {
                        await new Promise(res => setTimeout(res, 10000));
                    }
                }
            }, this.reconnectTimeout * 1000);
        });
    }
}

module.exports = SocketManager;

/** @param {SocketManager} socketManager */
function onSocketReady(socketManager) {
    const languageCode = socketManager.client._language;
    const distributorId = 0;
    const zone = socketManager.serverInstance.zone;
    const pass = `${versionDateGame}%${languageCode}%${distributorId}`;
    const msg = `<login z=\'${zone}\'><nick><![CDATA[]]></nick><pword><![CDATA[${pass}]]></pword></login>`;
    const message = `<msg t=\'sys\'><body action=\'login\' r=\'0\'>${msg}</body></msg>`;
    socketManager.writeToSocket(message);
}

/**
 * @param {WebSocket} socket
 * @param {BaseClient} client
 * @param {Buffer} data
 */
function onSocketData(socket, client, data) {
    const command = data.toString('utf-8')
    client.logger.t("[RECEIVED]", command.substring(0, Math.min(150, command.length)));
    const params = command.substring(1, command.length - 1).split("%");
    if (params[0] === "xt") return onResponse(client, params.splice(1, params.length - 1));
    client.logger.w("[DATA] Cannot handle command:", command);
}

/**
 * @param {SocketManager} socketManager
 * @param {number} connectionStatus
 * @param {number} maxMs
 */
async function waitForConnectionStatus(socketManager, connectionStatus, maxMs = 10000) {
    return waitForConnectionStatusTS(socketManager, connectionStatus, new Date(Date.now() + maxMs).getTime());
}

/**
 * @param {SocketManager} socketManager
 * @param {number} connectionStatus
 * @param {number} endDateTimestamp
 */
async function waitForConnectionStatusTS(socketManager, connectionStatus, endDateTimestamp) {
    if (socketManager.connectionStatus === connectionStatus) return;
    if (endDateTimestamp < Date.now()) throw new EmpireError(socketManager.client, "[Connection Error] Exceeded max time!");
    await new Promise(resolve => setTimeout(resolve, 1));
    return await waitForConnectionStatusTS(socketManager, connectionStatus, endDateTimestamp);
}

/** @param {string} value */
function getValidSmartFoxText(value) {
    value = value.replace(/%/g, "&percnt;");
    return value.replace(/'/g, "");
}