const {Socket} = require('node:net');
const {NetworkInstance} = require('e4k-data');
const {WaitUntil} = require("../tools/wait");
const {execute: collectTax} = require('../commands/commands/collectTax');
const {execute: pingPong} = require('../commands/commands/pingpong');
const {execute: generateLoginToken} = require('../commands/commands/generateLoginToken');
const {execute: mercenaryPackage} = require('../commands/commands/mercenaryPackage');
const {execute: dql} = require('../commands/onReceived/dql');
const {onResponse} = require('../commands');
const {ConnectionStatus, ServerType} = require("../utils/Constants");
const EventConst = require("../utils/EventConst");

const versionDateGame = 1749809954089;

class SocketManager {
    #connectionStatus = ConnectionStatus.Disconnected;

    connectionError = "";
    reconnectTimeout = 300;
    serverType = 1;

    /**
     * @param {Client} client
     * @param {NetworkInstance} serverInstance
     */
    constructor(client, serverInstance) {
        this.client = client;
        this.serverInstance = serverInstance;
        this.socket = new Socket();
        // this.socket = new (require('ws').WebSocket)(`wss://${serverInstance.server}:${serverInstance.port}`); //empire? WebSocket ipv net.Socket
        this.#addSocketListeners(this.socket);
    }

    /** @param {number} connectionStatus */
    set connectionStatus(connectionStatus) {
        this.client.logger.i("[SocketManager] Connection status:", Object.keys(ConnectionStatus).find(k => ConnectionStatus[k] === connectionStatus));
        this.#connectionStatus = connectionStatus;
    }

    get connectionStatus() {
        return this.#connectionStatus;
    }

    async connect() {
        this.connectionStatus = ConnectionStatus.Connecting;
        this.socket.connect(this.serverInstance.port, this.serverInstance.server);
        await waitForConnectionStatus(this, ConnectionStatus.Connected);
    }

    async reconnect() {
        if (this.connectionStatus === ConnectionStatus.Connected) {
            await this.disconnect();
            await new Promise(resolve => setTimeout(resolve, this.reconnectTimeout * 1000));
        }
        await waitForConnectionStatus(this, ConnectionStatus.Connected);
    }

    async disconnect() {
        if (this.connectionStatus === ConnectionStatus.Disconnected) return;
        this.connectionStatus = ConnectionStatus.Disconnecting;
        this.socket.end();
        await waitForConnectionStatus(this, ConnectionStatus.Disconnected);
    }

    async onLogin(error = "") {
        try {
            this.connectionError = error;
            if (error !== "") return;

            await WaitUntil(this.client, 'gbd finished');
            this.connectionStatus = ConnectionStatus.Connected;
            pingPong(this.client);

            //todo: Below isn't in source code
            if (this.client.externalClient == null && this.serverType === ServerType.NormalServer) {
                const activeEvents = this.client._activeSpecialEvents;
                if (activeEvents.map(e => e.eventId).includes(EventConst.EVENTTYPE_TEMPSERVER)) generateLoginToken(this.client, ServerType.TempServer)
                if (activeEvents.map(e => e.eventId).includes(EventConst.EVENTTYPE_ALLIANCE_BATTLEGROUND)) generateLoginToken(this.client, ServerType.AllianceBattleGround)
            }
            this.#botting();
        } catch (e) {
            this.client.logger.w(e);
        }
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
        this.writeToSocket(message);
    }

    /** @param {string} msg */
    writeToSocket(msg) {
        if (this.connectionStatus === ConnectionStatus.Disconnecting || this.connectionStatus === ConnectionStatus.Disconnected) return;
        this.client.logger.t(`[WRITE]: ${msg.substring(0, Math.min(150, msg.length))}`);
        let _buff0 = Buffer.from(msg);
        let _buff1 = Buffer.alloc(1);
        _buff1.writeInt8(0);
        let bytes = Buffer.concat([_buff0, _buff1]);
        this.socket.write(bytes, "utf-8", (err) => {
            if (err) this.client.logger.w(`\x1b[31m[SOCKET WRITE ERROR] ${err}\x1b[0m`);
        });
    }

    /** @param {net.Socket} socket */
    #addSocketListeners(socket) {
        socket.addListener('ready', () => onSocketReady(this));
        socket.addListener('data', (data) => onSocketData(socket, this.client, data));
        socket.addListener('error', (err) => {
            this.client.logger.w(`\x1b[31m[SOCKET ERROR] ${err}\x1b[0m`);
            this.client.logger.d(err);
            socket.end();
        });
        socket.addListener('timeout', () => {
            this.client.logger.d("[SocketManager] Socket Timeout!");
            socket.end();
        });
        socket.addListener('end', () => {
            if (this.connectionStatus === ConnectionStatus.Disconnected) return;
            this.client.logger.d("[SocketManager] Socket Ended!");
        });
        socket.addListener('close', _ => {
            if (this.connectionStatus === ConnectionStatus.Disconnected) return;
            this.connectionStatus = ConnectionStatus.Disconnected;
            this.client.logger.d(`[SocketManager] Socket Closed!`);
            socket.removeAllListeners();
            this.currentData = "";

            setTimeout(async () => {
                const new_socket = new Socket();
                this.#addSocketListeners(new_socket);
                this.socket = new_socket;
                socket = null;
                this.client.logger.i("[SocketManager] Reconnecting!");
                while (true) {
                    try {
                        await this.client.connect();
                        break;
                    } catch (e) {
                        await new Promise(res => setTimeout(res, 10000));
                    }
                }
            }, this.reconnectTimeout * 1000);
        });
    }

    // TODO: REMOVE
    isIntervalSetup = false;

    #botting() {
        collectTax(this.client);
        mercenaryPackage(this.client, -1);
        if (!this.isIntervalSetup) {
            this.isIntervalSetup = true;
            if (this.serverType !== ServerType.AllianceBattleGround) {
                dql(this.client, 0, {RDQ: [{QID: 7}, {QID: 8}, {QID: 9}, {QID: 10}]}).then();
                setInterval(() => {
                    if (this.connectionStatus !== ConnectionStatus.Connected) return;
                    dql(this.client, 0, {RDQ: [{QID: 7}, {QID: 8}, {QID: 9}, {QID: 10}]}).then();
                }, 5 * 60 * 1010); // 5 minutes
            }
        }
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
 * @param {net.Socket} socket
 * @param {Client} client
 * @param {Buffer} data
 */
function onSocketData(socket, client, data) {
    if (socket["currentData"] === undefined) socket["currentData"] = "";
    const newData = data.toString('utf-8');
    const totalData = socket["currentData"] + newData;
    const commands = totalData.split(String.fromCharCode(0)).filter(c => c !== "");
    socket["currentData"] = totalData.charCodeAt(totalData.length - 1) !== 0 ? commands.pop() : "";

    commands.forEach(command => {
        client.logger.t("[RECEIVED]", command.substring(0, Math.min(150, command.length)));
        const params = command.substring(1, command.length - 1).split("%");
        if (params[0] === "xt") return onResponse(client, params.splice(1, params.length - 1));
        client.logger.w("[DATA] Cannot handle command:", command);
    })
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
    if (socketManager.connectionError !== "") {
        const e = socketManager.connectionError;
        socketManager.connectionError = "";
        throw `[Connection Error] ${e}`;
    }
    if (endDateTimestamp < Date.now()) throw "[Connection Error] Exceeded max time!";
    await new Promise(resolve => setTimeout(resolve, 1));
    return await waitForConnectionStatusTS(socketManager, connectionStatus, endDateTimestamp);
}

/** @param {string} value */
function getValidSmartFoxText(value) {
    value = value.replace(/%/g, "&percnt;");
    return value.replace(/'/g, "");
}