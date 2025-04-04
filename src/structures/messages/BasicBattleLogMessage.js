const BasicMessage = require("./BasicMessage");
const {WaitUntil} = require("../../tools/wait");
const {execute: getBattleLogDetail} = require("../../e4kserver/commands/getBattleLogDetail");
const {execute: getBattleLogMiddle} = require("../../e4kserver/commands/getBattleLogMiddle");
const {execute: getBattleLogShort} = require("../../e4kserver/commands/getBattleLogShort");
const Localize = require("../../tools/Localize");

class BasicBattleLogMessage extends BasicMessage {
    /** @type {Client} */
    #client = null;

    /**
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

    async init() {
        try {
            this.battleLog = await getMessageBody(this.#client._socket, this.messageId, this);
        } finally {
            delete this.#client._socket[`bls -> ${this.messageId}`];
            delete this.#client._socket['bls -> errorCode'];
            if (this.battleLog) {
                delete this.#client._socket[`blm -> ${this.battleLog.battleLogId}`];
                delete this.#client._socket[`bld -> ${this.battleLog.battleLogId}`];
            }
        }
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

        this.setSenderToAreaName(this.areaName, this.areaType, this.kingdomId)
    }
}

/**
 * @param {Socket} socket
 * @param {number} messageId
 * @param {BasicBattleLogMessage} battleLogMessage
 * @returns {Promise<BattleLog>}
 */
async function getMessageBody(socket, messageId, battleLogMessage) {
    /** @type {BattleLog} */
    const body = {};
    try {
        socket[`${messageId} battleLogMessage`] = battleLogMessage;
        getBattleLogShort(socket, messageId);
        const battleLogShort = await WaitUntil(socket, `bls -> ${messageId}`, "bls -> errorCode", 30000);
        for (const key in battleLogShort) {
            if (battleLogShort[key] == null) continue;
            body[key] = battleLogShort[key];
        }
        socket[`${body.battleLogId} battleLog`] = body;
        getBattleLogMiddle(socket, body.battleLogId);
        getBattleLogDetail(socket, body.battleLogId);
        const battleLogMiddle = await WaitUntil(socket, `blm -> ${body.battleLogId}`, "", 30000);
        const battleLogDetail = await WaitUntil(socket, `bld -> ${body.battleLogId}`, "", 30000);
        for (const key in battleLogMiddle) {
            if (battleLogMiddle[key] == null) continue;
            body[key] = battleLogMiddle[key];
        }
        for (const key in battleLogDetail) {
            if (battleLogDetail[key] == null) continue;
            body[key] = battleLogDetail[key];
        }
        return body;
    } catch (e) {
        delete socket[`${messageId} battleLogMessage`]
        delete socket[`${body.battleLogId} battleLog`]
        throw e;
    }
}

/**
 * @param {Client} client
 * @param {BasicBattleLogMessage} thisMessage
 * @return {string}
 */
function getExceptionalSenderName(client, thisMessage) {
    switch (thisMessage.areaType) {
        case 17:
            return Localize.text(client, "factionwatchtower_name");
        case 16:
            return Localize.text(client, "faction_village");
        case 18:
            return Localize.text(client, "faction_capital");
        case 7:
            if (thisMessage.treasureMapNodeType === 2) {
                return Localize.text(client, "bladecoast_finalboss");
            }
            return Localize.text(client, "bladecoast_tower");
        case 41:
            return Localize.text(client, "allianceTower_placeholder", thisMessage.areaName);
        case 40:
            return Localize.text(client, "resourceTower");
        default:
            return thisMessage.areaName;
    }
}

module.exports = BasicBattleLogMessage;