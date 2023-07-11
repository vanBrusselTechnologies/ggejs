const BasicMessage = require("./BasicMessage");
const {WaitUntil} = require("../tools/wait");
const {execute: getBattleLogDetail} = require("../e4kserver/commands/getBattleLogDetailCommand");
const {execute: getBattleLogMiddle} = require("../e4kserver/commands/getBattleLogMiddleCommand");
const {execute: getBattleLogShort} = require("../e4kserver/commands/getBattleLogShortCommand");
const Localize = require("../tools/Localize");

class BasicBattleLogMessage extends BasicMessage {
    /** @type {Client} */
    #client = null;

    /**
     *
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
        this.#client = client;
        this.parseMetaData(client, this.metadata.split('#'))
    }

    /**
     * @return {boolean}
     * @protected
     */
    get hasBattleLogOwnerWon() {
        return this.hasAttackerWon !== this.isDefenseReport;
    }

    init() {
        return new Promise(async (resolve, reject) => {
            try {
                this.battleLog = await getMessageBody(this.#client._socket, this.messageId, this);
                delete this.#client._socket[`bls -> ${this.messageId}`];
                if (this.battleLog) {
                    delete this.#client._socket[`blm -> ${this.battleLog.battleLogId}`];
                    delete this.#client._socket[`bld -> ${this.battleLog.battleLogId}`];
                }
                resolve();
            } catch (e) {
                delete this.#client._socket[`bls -> ${this.messageId}`];
                if (this.battleLog) {
                    delete this.#client._socket[`blm -> ${this.battleLog.battleLogId}`];
                    delete this.#client._socket[`bld -> ${this.battleLog.battleLogId}`];
                }
                reject(e);
            }
        })
    }

    /** @param {Client} _
     @protected */
    initSubject(_) {
        this.subject = "";
    }

    parseMetaData(client, metaArray) {
        const _metaArray0 = metaArray[0].split('+');
        const _metaArray1 = metaArray[1].split('+');
        this.canBeForwarded = true;
        this.areaType = parseInt(_metaArray0[0]);
        this.subType = parseInt(_metaArray0[1]);
        const _ = parseInt(_metaArray0[2]);
        this.hasAttackerWon = _ === 0 || _ === 3;
        this.isDefenseReport = _ === 1 || _ === 3;
        this.treasureMapId = _metaArray0.length >= 4 ? _metaArray0[3] : -1;
        this.treasureMapNodeType = _metaArray0.length === 5 ? _metaArray0[4] : -1;
        this.kingdomId = parseInt(_metaArray1[0]);
        this.ownerId = parseInt(_metaArray1[1]);
        this.areaName = _metaArray1.length === 3 ? _metaArray1[2] : null;
        if (!this.isForwarded) {
            this.senderName = getExceptionalSenderName(client, this);
        }
        if (this.isForwarded) {
            this.subject = Localize.text(client, "dialog_forwardlog_message", Localize.text(client, "battlelog"));
        } else {
            this.initSubject(client);
        }
    }
}

/**
 *
 * @param {Socket} socket
 * @param {number} messageId
 * @param {BasicBattleLogMessage} battleLogMessage
 * @returns {Promise<BattleLog>}
 */
function getMessageBody(socket, messageId, battleLogMessage) {
    return new Promise(async (resolve, reject) => {
        try {
            /** @type {BattleLog} */
            const body = {};
            socket[`${messageId} battleLogMessage`] = battleLogMessage;
            getBattleLogShort(socket, messageId);
            await WaitUntil(socket, `bls -> ${messageId}`, "", 30000);
            const battleLogShort = socket[`bls -> ${messageId}`];
            for (let key in battleLogShort) {
                if (battleLogShort[key] == null) continue;
                body[key] = battleLogShort[key];
            }
            socket[`${body.battleLogId} battleLog`] = body;
            getBattleLogMiddle(socket, body.battleLogId);
            getBattleLogDetail(socket, body.battleLogId);
            await WaitUntil(socket, `blm -> ${body.battleLogId}`, "", 30000);
            await WaitUntil(socket, `bld -> ${body.battleLogId}`, "", 30000);
            const battleLogMiddle = socket[`blm -> ${body.battleLogId}`];
            for (let key in battleLogMiddle) {
                if (battleLogMiddle[key] == null) continue;
                body[key] = battleLogMiddle[key];
            }
            const battleLogDetail = socket[`bld -> ${body.battleLogId}`];
            for (let key in battleLogDetail) {
                if (battleLogDetail[key] == null) continue;
                body[key] = battleLogDetail[key];
            }
            resolve(body);
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })
}

/**
 * @param {Client} client
 * @param {BasicBattleLogMessage} thisMessage
 * @return {string}
 */
function getExceptionalSenderName(client, thisMessage) {
    if (thisMessage.areaType === 17) {
        return Localize.text(client, "factionwatchtower_name");
    }
    if (thisMessage.areaType === 16) {
        return Localize.text(client, "faction_village");
    }
    if (thisMessage.areaType === 18) {
        return Localize.text(client, "faction_capital");
    }
    if (thisMessage.areaType === 7) {
        if (thisMessage.treasureMapNodeType === 2) {
            return Localize.text(client, "bladecoast_finalboss");
        }
        return Localize.text(client, "bladecoast_tower");
    }
    if (thisMessage.areaType === 41) {
        return Localize.text(client, "allianceTower_placeholder", thisMessage.areaName);
    }
    if (thisMessage.areaType === 40) {
        return Localize.text(client, "resourceTower");
    }
    return thisMessage.areaName;
}

module.exports = BasicBattleLogMessage;