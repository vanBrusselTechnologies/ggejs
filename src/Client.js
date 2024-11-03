'use strict'

const connection = require('./e4kserver/connection');
const {onData} = require('./e4kserver/data');
const AllianceManager = require('./managers/AllianceManager');
const EquipmentManager = require("./managers/EquipmentManager");
const MovementManager = require('./managers/MovementManager');
const PlayerManager = require('./managers/PlayerManager');
const WorldmapManager = require('./managers/WorldmapManager');
const {WaitUntil} = require('./tools/wait');
const EventEmitter = require('node:events');
const {NetworkInstance, languages} = require('e4k-data');
const ClientUserDataManager = require("./managers/ClientUserDataManager");
const PremiumBoostData = require("./structures/boosters/PremiumBoostData");
const QuestData = require("./structures/quests/QuestData");
const {execute: verifyLoginData} = require('./e4kserver/commands/verifyLoginData');
const {execute: registerOrLogin} = require('./e4kserver/commands/registerOrLogin');

class Client extends EventEmitter {
    #name = "";
    #password = "";
    /** @type {{token:string, tokenExpirationDate: Date}} */
    #apiToken;
    uniqueAccountId = "";
    externalClient = null;

    _serverInstance = require('e4k-data').network.instances.instance[33];
    /** @type {Socket} */
    _socket = new (require("net").Socket)();
    _networkId = -1;

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
        this.clientUserData = new ClientUserDataManager();
        this.clientUserData.boostData = new PremiumBoostData(this);
        this.clientUserData.questData = new QuestData(this);
        this.equipments = new EquipmentManager(this);
        this.movements = new MovementManager(this);
        this.players = new PlayerManager(this);
        this.worldmaps = new WorldmapManager(this);
        this.#addSocketListeners(this._socket);
    }

    static registerNewAccount() {
        // see room
    }

    _language = 'en';

    /** @param {string} val */
    set language(val) {
        if (languages[val] == null) return;
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
    async connect() {
        if (this._socket["__connected"]) return this;
        await _connect(this._socket);
        this.emit('connected');
        return this;
    }

    _verifyLoginData() {
        if (this.#name === "" && this.#password !== "") return registerOrLogin(this._socket, this.#password);
        verifyLoginData(this._socket, this.#name, this.#password);
    }

    /**
     *
     * @param {string} message
     */
    sendChatMessage(message) {
        require('./e4kserver/commands/sendAllianceChatMessage').execute(this._socket, message);
    }

    /**
     *
     * @param {string} playerName
     * @param {string} subject
     * @param {string} message
     */
    sendMailMessage(playerName, subject, message) {
        require('./e4kserver/commands/sendMailMessage').execute(this._socket, playerName, subject, message);
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
                require('./e4kserver/commands/joinArea').execute(this._socket, worldmapArea);
                const data = await WaitUntil(this._socket, `join_area_${worldmapArea.objectId}_data`, "join_area_error");
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
    async __x__x__relogin() {
        await _disconnect(this._socket);
        await WaitUntil(this._socket, "__connected", "__connection_error");
    }

    /** @param {Socket} socket */
    #addSocketListeners(socket) {
        socket["unfinishedDataString"] = "";
        socket.addListener("error", (err) => {
            console.error(`\x1b[31m[SOCKET ERROR] ${err}\x1b[0m`);
            console.error(err)
            socket.end();
        });
        socket.addListener('data', (data) => {
            onData(socket, data);
        });
        socket.addListener('ready', () => {
            connection.sendVersionCheck(socket);
        })
        socket.addListener('end', () => {
            if (socket["isReconnecting"]) return;
            if (socket.debug) console.warn("Socket Ended!");
            socket["__disconnecting"] = false;
            socket["__connected"] = false;
            socket["__disconnect"] = true;
        });
        socket.addListener('timeout', () => {
            if (socket.debug) console.warn("Socket Timeout!");
            socket.end();
        });
        socket.addListener('close', hadError => {
            if (socket["isReconnecting"]) return;
            socket["isReconnecting"] = true;
            this._socket = {};
            if (socket.debug) console.warn(`Socket Closed${hadError ? ", caused by error" : ""}!`);
            socket.removeAllListeners()
            /** @type {Socket} */
            const new_socket = createCleanSocket(socket);
            socket = null;
            this.#addSocketListeners(new_socket);
            setTimeout(async () => {
                new_socket.client = this;
                this._socket = new_socket;
                if (new_socket.debug) console.log("Reconnecting!");
                let connected = false
                while (!connected) {
                    try {
                        await this.connect();
                        connected = true
                    } catch (e) {
                        await new Promise((res) => setTimeout(res, 1000));
                    }
                }
            }, new_socket["__reconnTimeoutSec"] * 1000);
        });
    }

    /** @param {{token:string, tokenExpirationDate: Date}} val */
    set _apiToken(val) {
        this.#apiToken = val;
        (async () => {
            try {
                const gameId = 16
                const f = await fetch(`https://accounts.public.ggs-ep.com/players/${gameId}-${this._networkId}-${this._serverInstance.value}-${this.clientUserData.playerId}/gnip-phrase`, {
                    headers: {Authorization: `Bearer ${val.token}`}
                })
                this.uniqueAccountId = JSON.parse(Buffer.from(await f.arrayBuffer()).toString())["gnipPhrase"] ?? "";
                /*
                    const f2 = await fetch(`https://accounts.public.ggs-ep.com/players/${gameId}-${this._networkId}-${this._serverInstance.value}-${this.clientUserData.playerId}/onetime-links/mbs`, {
                        headers: {Authorization: `Bearer ${val.token}`}
                    })
                    this.webshopOneTimeLink = JSON.parse(Buffer.from(await f2.arrayBuffer()).toString())["link"];

                    const storeId = "googleplay" // "googleplay" || "local"
                    const f3 = await fetch(`https://mobile-payments.public.ggs-e4k.com/api/players/${gameId}-${this._networkId}-${this._serverInstance.value}-${this.clientUserData.playerId}/catalog/${storeId}`, {
                        headers: {Authorization: `Bearer ${val.token}`}
                    })
                    console.log( JSON.parse(Buffer.from(await f3.arrayBuffer()).toString()) );
                 */
            } catch (e) {
            }
        })()
    }
}

/**
 *
 * @param {Socket} socket
 * @returns {Promise<void>}
 */
async function _connect(socket) {
    connection.connect(socket);
    await WaitUntil(socket, "__connected", "__connection_error");
}

/**
 *
 * @param {Socket} socket
 * @param {string} name
 * @param {string} password
 * @returns {Promise<void>}
 */
function login(socket, name, password) {
    return new Promise(async (resolve, reject) => {
        try {
            if (name === "") return reject("Missing name while logging in");
            if (password === "") return reject("Missing password while logging in");
            connection.login(socket, name, password);
            await WaitUntil(socket, "__connected", "__connection_error");
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
            if (socket?._host == null) return reject("Socket missing!");
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
    new_socket['mailMessages'] = old_socket['mailMessages'] || [];
    return new_socket;
}

module.exports = Client;