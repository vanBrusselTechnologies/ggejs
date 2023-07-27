const BasicMessage = require("./BasicMessage");
const Localize = require("../../tools/Localize");
const {WaitUntil} = require("../../tools/wait");
const {execute: getTradeData} = require("../../e4kserver/commands/getTradeDataCommand");

class MarketCarriageArrivedMessage extends BasicMessage {
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

    parseMetaData(client, metaArray) {
        if(metaArray.length > 0)
        {
            this.areaName = metaArray[0];
        }
        this.subject = Localize.text(client, "dialog_tradeMessage_title");
        if(this.areaName)
        {
            this.senderName = this.areaName === -24 ? Localize.text(client, "monthevents_expeditioncamp") : this.areaName;
        }
    }

    init() {
        return new Promise(async (resolve, reject) => {
            try {
                try {
                    this.tradeData = await getMessageBody(this.#client._socket, this.messageId);
                    delete this.#client._socket[`mmn -> ${this.tradeData.messageId}`];
                } catch (e) {
                    delete this.#client._socket[`mmn -> ${this.tradeData.messageId}`];
                    delete this.#client._socket[`mmn -> errorCode`];
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        })
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
            socket['mmn -> errorCode'] = "";
            getTradeData(socket, messageId);
            await WaitUntil(socket, `mmn -> ${messageId}`, `mmn -> errorCode`, 30000);
            resolve(socket[`mmn -> ${messageId}`]);
        } catch (e) {
            if (e !== 130) console.log(e);
            socket['mmn -> errorCode'] = "";
            reject(e);
        }
    })
}

module.exports = MarketCarriageArrivedMessage;