const BasicMessage = require("./BasicMessage");
const {getSpyLog} = require("../../commands/bsd");
const EmpireError = require("../../tools/EmpireError");
const Localize = require("../../tools/Localize");

class BasicSpyPlayerMessage extends BasicMessage {
    /** @type{Client}*/
    #client;
    /** @type {SpyLog | undefined} */
    _spyLog = undefined;

    constructor(client, data) {
        super(client, data);
        this.#client = client;
    }

    /** @return {boolean}*/
    get isSuccessful() {
        return this.successType === 0 || this.successType === 3;
    }

    /** @return {boolean}*/
    get isAttacking() {
        return this.successType === 0 || this.successType === 2;
    }

    async getSpyLog() {
        try {
            if (this._spyLog !== undefined) return this._spyLog;
            this._spyLog = await getSpyLog(this.#client, this.messageId);
            return this._spyLog;
        } catch (e) {
            throw EmpireError(this.#client, e);
        }
    }

    /**
     * @param {Client} client
     * @param {string} spyTypeName
     * @protected
     */
    initSubject(client, spyTypeName) {
        let val = "";
        if (this.isForwarded) {
            this.subject = Localize.text(client, "dialog_forwardlog_message", Localize.text(client, "dialog_spy_military"));
            return;
        }
        if (this.isSuccessful) {
            val = Localize.text(client, "dialog_spyLog_success");
        } else if (this.isAttacking) {
            val = Localize.text(client, "dialog_spyLog_failure");
        } else {
            val = Localize.text(client, "dialog_spyLog_keptAway");
        }
        this.subject = Localize.text(client, "value_assign_colon", spyTypeName, val);
    }

    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray)
        this.subType = parseInt(metaArray[0]);
        this.successType = parseInt(metaArray[1]);
        this.ownerId = parseInt(metaArray[3]);
        this.areaName = metaArray[4];
        const metaArray2 = metaArray[2].split("#");
        this.areaType = parseInt(metaArray2[0]);
        this.kingdomId = parseInt(metaArray2[1]);
        this.setSenderToAreaName(this.areaName, this.areaType, this.kingdomId);
    }
}

module.exports = BasicSpyPlayerMessage;