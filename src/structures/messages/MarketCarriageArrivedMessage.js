const BasicMessage = require("./BasicMessage");
const Localize = require("../../tools/Localize");
const {WaitUntil} = require("../../tools/wait");
const {execute: getTradeData} = require("../../e4kserver/commands/getTradeData");

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
        if (metaArray.length > 0) {
            this.areaName = metaArray[0];
        }
        this.subject = Localize.text(client, "dialog_tradeMessage_title");
        if (this.areaName) {
            this.senderName = this.areaName.toString() === "-24" ? Localize.text(client, "monthevents_expeditioncamp") : this.areaName;
        }

        this.setSenderToAreaName(this.areaName, this.areaType, this.kingdomId)
    }

    init() {
        return new Promise(async (resolve, reject) => {
            try {
                try {
                    this.tradeData = await getMessageBody(this.#client._socket, this.messageId);
                } catch (e) {
                    delete this.#client._socket[`mmn -> errorCode`];
                }
                delete this.#client._socket[`mmn -> ${this.tradeData.messageId}`];
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
 * @returns {Promise<TradeData>}
 */
function getMessageBody(socket, messageId) {
    return new Promise(async (resolve, reject) => {
        try {
            socket['mmn -> errorCode'] = "";
            getTradeData(socket, messageId);
            resolve(await WaitUntil(socket, `mmn -> ${messageId}`, `mmn -> errorCode`, 30000));
        } catch (e) {
            socket['mmn -> errorCode'] = "";
            reject(e);
        }
    })
}

module.exports = MarketCarriageArrivedMessage;