'use strict'

const connection = require('./e4kserver/connection');
const e4kData = require('./e4kserver/data');
const AllianceManager = require('./managers/AllianceManager');
const EquipmentManager = require("./managers/EquipmentManager");
const MovementManager = require('./managers/MovementManager');
const PlayerManager = require('./managers/PlayerManager');
const WorldmapManager = require('./managers/WorldmapManager');
const {WaitUntil} = require('./tools/wait');
const EventEmitter = require('node:events');
const {NetworkInstance} = require('e4k-data');

class Client extends EventEmitter {
    #name = "";
    #password = "";
    _serverInstance = require('e4k-data').network.instances.instance[33];
    /** @type {Socket} */
    _socket = new (require("net").Socket)();

    /**
     *
     * @param {string} name
     * @param {string} password
     * @param {boolean} debug
     * @param {NetworkInstance} serverInstance
     */
    constructor(name, password, serverInstance, debug = false) {
        super();
        this._serverInstance = serverInstance;
        this.#name = name;
        this.#password = password;
        this._socket = new (require("net").Socket)();
        this._socket.client = this;
        this._socket["__reconnTimeoutSec"] = 300;
        this._socket.debug = debug;
        this.alliances = new AllianceManager(this);
        this.equipments = new EquipmentManager(this);
        this.movements = new MovementManager(this);
        this.players = new PlayerManager(this);
        this.worldmaps = new WorldmapManager(this);
        this.#addSocketListeners(this._socket);
    }

    _language = 'en';

    /** @param {string} val */
    set language(val) {
        if (require('e4k-data').languages[val] == null) return;
        this._language = val;
    }

    /** @param {number} val */
    set reconnectTimeout(val) {
        this._socket["__reconnTimeoutSec"] = val;
    }

    /** @return {Message[]} */
    get mailMessages() {
        return this._socket['mailMessages'];
    }

    /** @returns {Promise<Client>} */
    connect() {
        return new Promise(async (resolve, reject) => {
            try {
                if (this._socket["__connected"]) resolve(this);
                await _connect(this._socket);
                await _login(this._socket, this.#name, this.#password);
                this.emit('connected');
                resolve(this);
            } catch (e) {
                reject(e);
            }
        })
    }

    /**
     *
     * @param {string} message
     */
    sendChatMessage(message) {
        require('./e4kserver/commands/sendAllianceChatMessageCommand').execute(this._socket, message);
    }

    /**
     *
     * @param {string} playerName
     * @param {string} subject
     * @param {string} message
     */
    sendMailMessage(playerName, subject, message) {
        require('./e4kserver/commands/sendMailMessageCommand').execute(this._socket, playerName, subject, message);
    }

    /**
     *
     * @param {InteractiveMapobject} worldmapArea
     * @returns {Promise<Castle>}
     */
    getCastleInfo(worldmapArea) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!worldmapArea || !worldmapArea.objectId) reject("WorldmapArea is not valid");
                require('./e4kserver/commands/joinAreaCommand').execute(this._socket, worldmapArea);
                await WaitUntil(this._socket, `join_area_${worldmapArea.objectId}_finished`, "join_area_error");
                const data = this._socket[`join_area_${worldmapArea.objectId}_data`];
                delete this._socket[`join_area_${worldmapArea.objectId}_data`];
                delete this._socket[`join_area_${worldmapArea.objectId}_finished`];
                resolve(data);
            } catch (e) {
                if (worldmapArea && worldmapArea.objectId) {
                    delete this._socket[`join_area_${worldmapArea.objectId}_data`];
                    delete this._socket[`join_area_${worldmapArea.objectId}_finished`];
                }
                reject(e);
            }
        })
    }

    /** @returns {Promise<void>} */
    __x__x__relogin() {
        return new Promise(async (resolve, reject) => {
            try {
                await _disconnect(this._socket);
                await WaitUntil(this._socket, "__connected", "__connection_error");
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    }

    /**
     *
     * @param {Socket} socket
     */
    #addSocketListeners(socket) {
        socket["unfinishedDataString"] = "";
        socket.addListener("error", (err) => {
            console.log("\x1b[31m[SOCKET ERROR] " + err + "\x1b[0m");
            socket.end();
        });
        socket.addListener('data', (data) => {
            e4kData.onData(socket, data);
        });
        socket.addListener('ready', () => {
            connection._sendVersionCheck(socket);
        })
        socket.addListener('end', () => {
            if (socket["isReconnecting"]) return;
            if (socket.debug) console.log("Socket Ended!");
            socket["__disconnecting"] = false;
            socket["__connected"] = false;
            socket["__disconnect"] = true;
        });
        socket.addListener('timeout', () => {
            if (socket.debug) console.log("Socket Timeout!");
            socket.end();
        });
        socket.addListener('close', hadError => {
            if (socket["isReconnecting"]) return;
            socket["isReconnecting"] = true;
            this._socket = {};
            if (socket.debug) console.log("Socket Closed!" + (hadError ? " Caused by error!" : ""));
            socket.removeAllListeners()
            /** @type {Socket} */
            const new_socket = createCleanSocket(socket);
            socket = null;
            this.#addSocketListeners(new_socket);
            setTimeout(async () => {
                new_socket.client = this;
                this._socket = new_socket;
                if (new_socket.debug) console.log("Reconnecting!");
                await this.connect();
            }, new_socket["__reconnTimeoutSec"] * 1000);
        });
    }
}

/**
 *
 * @param {Socket} socket
 * @returns {Promise<void>}
 */
function _connect(socket) {
    return new Promise(async (resolve, reject) => {
        try {
            connection.connect(socket);
            await WaitUntil(socket, "__connected", "__connection_error");
            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

/**
 *
 * @param {Socket} socket
 * @param {string} name
 * @param {string} password
 * @returns {Promise<void>}
 */
function _login(socket, name, password) {
    return new Promise(async (resolve, reject) => {
        try {
            if (name === "") reject("Missing name while logging in");
            if (password === "") reject("Missing password while logging in");
            connection.login(socket, name, password);
            await WaitUntil(socket, "__loggedIn", "__login_error");
            resolve();
        } catch (e) {
            reject(e);
        }
    })
}

/**
 * @param {Socket} socket
 * @returns {Promise<void>}
 */
function _disconnect(socket) {
    return new Promise(async (resolve, reject) => {
        try {
            socket["__disconnect"] = false;
            socket["__disconnecting"] = true;
            socket.end();
            await WaitUntil(socket, "__disconnect");
            resolve();
        } catch (e) {
            reject(e);
        }
    })
}

/**
 * Creates new socket and only copies important fields.
 * @param {Socket} old_socket
 * @returns {Socket}
 */
function createCleanSocket(old_socket) {
    /** @type {Socket} */
    const new_socket = new (require("net").Socket)();
    new_socket["__reconnTimeoutSec"] = old_socket["__reconnTimeoutSec"];
    new_socket.debug = old_socket.debug;
    new_socket["ultraDebug"] = old_socket["ultraDebug"];
    new_socket['mailMessages'] = old_socket['mailMessages'];
    delete new_socket["__disconnecting"];
    delete new_socket["__connected"];
    delete new_socket["__disconnect"];
    return new_socket;
}

module.exports = Client;