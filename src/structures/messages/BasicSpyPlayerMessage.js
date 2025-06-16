const BasicMessage = require("./BasicMessage");
const Localize = require("../../tools/Localize");
const {WaitUntil} = require("../../tools/wait");
const {execute: getSpyLog} = require("../../commands/commands/getSpyLog");

class BasicSpyPlayerMessage extends BasicMessage {
    /** @type{Client}*/
    #client;

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

    async init() {
        try {
            this.spyLog = await getMessageBody(this.#client, this.messageId);
            delete this.#client._socket[`bsd -> ${this.spyLog.messageId}`];
        } catch (e) {
            delete this.#client._socket[`bsd -> errorCode`];
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

/**
 * @param {Client} client
 * @param {number} messageId
 * @returns {Promise<SpyLog>}
 */
async function getMessageBody(client, messageId) {
    try {
        client._socket['bsd -> errorCode'] = "";
        getSpyLog(client, messageId);
        return await WaitUntil(client, `bsd -> ${messageId}`, `bsd -> errorCode`, 30000);
    } catch (e) {
        client._socket['bsd -> errorCode'] = "";
        throw e;
    }
}

module.exports = BasicSpyPlayerMessage;