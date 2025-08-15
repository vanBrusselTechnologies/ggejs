const BasicMessage = require("./BasicMessage");
const {getBattleLogDetail} = require("../../commands/bld");
const {getBattleLogMiddle} = require("../../commands/blm");
const {getBattleLogShort} = require("../../commands/bls");
const EmpireError = require("../../tools/EmpireError");
const Localize = require("../../tools/Localize");

class BasicBattleLogMessage extends BasicMessage {
    /** @type {BaseClient} */
    #client = null;
    /** @type {BattleLog | undefined} */
    _battleLog = undefined;

    /**
     * @param {BaseClient} client
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

    async getBattleLog() {
        try {
            if (this._battleLog !== undefined) return this._battleLog;
            this._battleLog = await getMessageBody(this.#client, this.messageId);
            return this._battleLog;
        } catch (e) {
            throw new EmpireError(this.#client, e);
        }
    }

    /** @param {BaseClient} _
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

        this.setSenderToAreaName(this.areaName, this.areaType, this.kingdomId);
    }
}

/**
 * @param {BaseClient} client
 * @param {number} messageId
 * @returns {Promise<BattleLog>}
 */
async function getMessageBody(client, messageId) {
    /** @type {BattleLog} */
    const body = {};
    try {
        const battleLogShort = await getBattleLogShort(client, messageId);
        for (const key in battleLogShort) {
            if (battleLogShort[key] == null) continue;
            body[key] = battleLogShort[key];
        }
        client._socket[`${body.battleLogId} battleLog`] = body;
        const battleLogMiddle = await getBattleLogMiddle(client, body.battleLogId);
        const battleLogDetail = await getBattleLogDetail(client, body.battleLogId);
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
        delete client._socket[`${body.battleLogId} battleLog`];
        throw e;
    }
}

/**
 * @param {BaseClient} client
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