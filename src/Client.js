'use strict'

const EventEmitter = require('node:events');
const {NetworkInstance, languages} = require('e4k-data');
const AllianceManager = require('./managers/AllianceManager');
const EquipmentManager = require("./managers/EquipmentManager");
const MovementManager = require('./managers/MovementManager');
const PlayerManager = require('./managers/PlayerManager');
const SocketManager = require("./managers/SocketManager");
const WorldMapManager = require('./managers/WorldMapManager');
const {WaitUntil} = require('./tools/wait');
const ClientUserDataManager = require("./managers/ClientUserDataManager");
const PremiumBoostData = require("./structures/boosters/PremiumBoostData");
const QuestData = require("./structures/quests/QuestData");
const {execute: verifyLoginData} = require('./commands/commands/verifyLoginData');
const {execute: registerOrLogin} = require('./commands/commands/registerOrLogin');
const {ConnectionStatus} = require("./utils/Constants");
const Logger = require("./tools/Logger");

class Client extends EventEmitter {
    #name = "";
    #password = "";
    /** @type {{token:string, tokenExpirationDate: Date}} */
    #apiToken;
    uniqueAccountId = "";
    /** @type {Client | null} */
    externalClient = null;

    _networkId = -1;

    logger = new Logger();

//#region TODO: MOVE TO CORRECT MANAGER
    /** @type {MailMessage[]} */
    _mailMessages = [];
    /** @type {ActiveEvent[]} */
    _activeSpecialEvents = [];
//#endregion

    get _socket() {
        return this.socketManager.socket;
    }

    /**
     * @param {string} name
     * @param {string} password
     * @param {NetworkInstance} serverInstance
     */
    constructor(name, password, serverInstance) {
        super();
        this.#name = name;
        this.#password = password;
        this.socketManager = new SocketManager(this, serverInstance);

        this.alliances = new AllianceManager(this);
        this.clientUserData = new ClientUserDataManager();
        this.clientUserData.boostData = new PremiumBoostData(this);
        this.clientUserData.questData = new QuestData(this);
        this.equipments = new EquipmentManager(this);
        this.movements = new MovementManager(this);
        this.players = new PlayerManager(this);
        this.worldMaps = new WorldMapManager(this);
    }

    static registerNewAccount() {
    }

    _language = 'en';

    /** @param {string} val */
    set language(val) {
        if (languages[val] == null) return;
        this._language = val;
    }

    /** @param {number} val */
    set reconnectTimeout(val) {
        this.socketManager.reconnectTimeout = val;
    }

    /** @return {MailMessage[]} */
    get mailMessages() {
        return this._mailMessages;
    }

    async connect() {
        if (this.socketManager.connectionStatus === ConnectionStatus.Connected) return this;
        await this.socketManager.connect();
        this.emit('connected');
        return this;
    }

    _verifyLoginData() {
        if (this.#name === "" && this.#password !== "") {
            registerOrLogin(this, this.#password);
            return;
        }
        verifyLoginData(this, this.#name, this.#password);
    }

    /** @param {string} message */
    sendChatMessage(message) {
        //TODO(?): Move into MyAlliance
        require('./commands/commands/sendAllianceChatMessage').execute(this, message);
    }

    /**
     * @param {string} playerName
     * @param {string} subject
     * @param {string} message
     */
    sendMailMessage(playerName, subject, message) {
        require('./commands/commands/sendMailMessage').execute(this, playerName, subject, message);
    }

    /**
     * @param {InteractiveMapobject} mapObject
     * @returns {Promise<Castle>}
     */
    async getCastleInfo(mapObject) {
        if (!mapObject || !mapObject.objectId) throw "WorldMapArea is not valid";
        require('./commands/commands/joinArea').execute(this, mapObject);
        const data = await WaitUntil(this, `join_area_${mapObject.objectId}_data`, "join_area_error");
        delete this._socket[`join_area_${mapObject.objectId}_data`];
        return data;
    }

    /** @param {{token:string, tokenExpirationDate: Date}} val */
    set _apiToken(val) {
        this.#apiToken = val;
        (async () => {
            try {
                const gameId = 16;
                const f = await fetch(`https://accounts.public.ggs-ep.com/players/${gameId}-${this._networkId}-${this.socketManager.serverInstance.value}-${this.clientUserData.playerId}/gnip-phrase`, {
                    headers: {Authorization: `Bearer ${val.token}`}
                });
                this.uniqueAccountId = JSON.parse(Buffer.from(await f.arrayBuffer()).toString())["gnipPhrase"] ?? "";
                /*
                    const f2 = await fetch(`https://accounts.public.ggs-ep.com/players/${gameId}-${this._networkId}-${this.socketManager.serverInstance.value}-${this.clientUserData.playerId}/onetime-links/mbs`, {
                        headers: {Authorization: `Bearer ${val.token}`}
                    })
                    this.webshopOneTimeLink = JSON.parse(Buffer.from(await f2.arrayBuffer()).toString())["link"];

                    const storeId = "googleplay" // "googleplay" || "local"
                    const f3 = await fetch(`https://mobile-payments.public.ggs-e4k.com/api/players/${gameId}-${this._networkId}-${this.socketManager.serverInstance.value}-${this.clientUserData.playerId}/catalog/${storeId}`, {
                        headers: {Authorization: `Bearer ${val.token}`}
                    })
                    this.logger.d( JSON.parse(Buffer.from(await f3.arrayBuffer()).toString()) );
                 */
            } catch (e) {
                this.logger.d(e);
            }
        })();
    }
}

module.exports = Client;