const BasicMessage = require("./BasicMessage");
const {WaitUntil} = require("../../tools/wait");
const {execute: readMessage} = require("../../e4kserver/commands/readMessages");

class UserMessage extends BasicMessage {
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
 * @returns {Promise<string>}
 */
async function getMessageBody(client, messageId) {
    readMessage(client, messageId);
    const data = await WaitUntil(client._socket, `rms -> ${messageId}`);
    delete client._socket[`rms -> ${messageId}`];
    return data;
}

module.exports = UserMessage;