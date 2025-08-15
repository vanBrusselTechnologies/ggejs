'use strict'

const EventEmitter = require('node:events');
const {NetworkInstance, languages} = require('e4k-data');
const {sendAllianceChat} = require("./commands/acm");
const {joinArea} = require('./commands/jaa');
const {pingpong} = require("./commands/pin");
const {sendMessage} = require("./commands/sms");
const AllianceManager = require('./managers/AllianceManager');
const ClientUserDataManager = require("./managers/ClientUserDataManager");
const EquipmentManager = require("./managers/EquipmentManager");
const MovementManager = require('./managers/MovementManager');
const PlayerManager = require('./managers/PlayerManager');
const SocketManager = require("./managers/SocketManager");
const WorldMapManager = require('./managers/WorldMapManager');
const PremiumBoostData = require("./structures/boosters/PremiumBoostData");
const QuestData = require("./structures/quests/QuestData");
const EmpireError = require("./tools/EmpireError");
const Logger = require("./tools/Logger");

class BaseClient extends EventEmitter {
    /** @type {{token:string, tokenExpirationDate: Date}} */
    #apiToken;
    uniqueAccountId = "";
    bannedUntil = new Date(0);

    _networkId = -1;

    logger = new Logger();

    /** @param {NetworkInstance} serverInstance */
    constructor(serverInstance) {
        super();
        this._id = require('crypto').randomUUID();
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

//#region TODO: MOVE TO CORRECT MANAGER
    /** @type {MailMessage[]} */
    _mailMessages = [];
    /** @return {MailMessage[]} */
    get mailMessages() {
        return this._mailMessages;
    }

    /** @type {ActiveEvent[]} */
    _activeSpecialEvents = [];
//#endregion

    get _socket() {
        return this.socketManager.socket;
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
                    });
                    this.webshopOneTimeLink = JSON.parse(Buffer.from(await f2.arrayBuffer()).toString())["link"];

                    const storeId = "googleplay" // "googleplay" || "local";
                    const f3 = await fetch(`https://mobile-payments.public.ggs-e4k.com/api/players/${gameId}-${this._networkId}-${this.socketManager.serverInstance.value}-${this.clientUserData.playerId}/catalog/${storeId}`, {
                        headers: {Authorization: `Bearer ${val.token}`}
                    });
                    this.logger.d( JSON.parse(Buffer.from(await f3.arrayBuffer()).toString()) );
                 */
            } catch (e) {
                this.logger.d(e);
            }
        })();
    }

    async _reconnect(){}

    async _sendPingPong() {
        try {
            await pingpong(this);
        } catch (errorCode) {
            throw new EmpireError(this, errorCode);
        }
    }

    /** @param {string} message */
    async sendChatMessage(message) {
        try {
            // TODO(?): Move into MyAlliance
            await sendAllianceChat(this, message);
        } catch (errorCode) {
            throw new EmpireError(this, errorCode);
        }
    }

    /**
     * @param {string} playerName
     * @param {string} subject
     * @param {string} message
     */
    async sendMailMessage(playerName, subject, message) {
        try {
            await sendMessage(this, playerName, subject, message);
        } catch (errorCode) {
            const overrideTextId = (() => {
                switch (errorCode) {
                    case 12:
                        return this.clientUserData.userXp < 1080 ? 'errorCode_12' : 'alert_writeNewMessage_blocked_lowLevel';
                    case 68:
                        return 'dialog_receiverNotFound';
                    case 98:
                        return 'alert_textTooShort';
                    default:
                        return '';
                }
            })();
            throw new EmpireError(this, errorCode, overrideTextId);
        }
    }

    /**
     * @param {InteractiveMapobject} mapObject
     * @returns {Promise<Castle>}
     */
    async getCastleInfo(mapObject) {
        if (!mapObject || !mapObject.objectId) throw new EmpireError(this, "WorldMapArea is not valid");
        try {
            return await joinArea(this, mapObject);
        } catch (errorCode) {
            throw new EmpireError(this, errorCode);
        }
    }
}

module.exports = BaseClient;