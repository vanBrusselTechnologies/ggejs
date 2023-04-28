const BasicMessage = require("./BasicMessage");
const Localize = require("../tools/Localize");
const {WaitUntil} = require("../tools/wait");
const {execute: getSpyLog} = require("../e4kserver/commands/getSpyLogCommand");

class BasicSpyPlayerMessage extends BasicMessage {
    /** @type{Client}*/
    #client;
    /** @type{number}*/
    successType;

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

    init() {
        return new Promise(async (resolve, reject) => {
            try {
                try {
                    this.spyLog = await getMessageBody(this.#client._socket, this.messageId);
                    this.#client._socket[`bsd -> ${this.spyLog.messageId}`] = null;
                } catch (e) {
                    this.#client._socket[`bsd -> errorCode`] = "";
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    }

    /**
     * @param {Client} client,
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
}

/**
 *
 * @param {Socket} socket
 * @param {number} messageId
 * @returns {Promise<SpyLog>}
 */
function getMessageBody(socket, messageId) {
    return new Promise(async (resolve, reject) => {
        try {
            socket['bsd -> errorCode'] = "";
            getSpyLog(socket, messageId);
            await WaitUntil(socket, `bsd -> ${messageId}`, `bsd -> errorCode`, 30000);
            resolve(socket[`bsd -> ${messageId}`]);
        } catch (e) {
            if (e !== 130) console.log(e);
            socket['bsd -> errorCode'] = "";
            reject(e);
        }
    })
}

module.exports = BasicSpyPlayerMessage;