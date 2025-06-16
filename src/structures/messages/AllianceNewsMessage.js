const BasicMessage = require("./BasicMessage");
const {WaitUntil} = require("../../tools/wait");
const {execute: readMessage} = require("../../commands/commands/readMessages");

class AllianceNewsMessage extends BasicMessage {
    /** @type {Client} */
    #client = null;

    /**
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
        this.#client = client;
    }

    async init() {
        this.body = await getMessageBody(this.#client, this.messageId);
        this.#client._socket[`rms -> ${this.messageId}`] = null;
    }

    parseMetaData(client, metaArray) {
        this.subject = metaArray[0];
    }
}

/**
 * @param {Client} client
 * @param {number} messageId
 */
async function getMessageBody(client, messageId) {
    readMessage(client, messageId);
    /** @type {string} */
    const data = await WaitUntil(client, `rms -> ${messageId}`);
    delete client._socket[`rms -> ${messageId}`];
    return data;
}

module.exports = AllianceNewsMessage;