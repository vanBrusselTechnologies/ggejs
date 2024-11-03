const BasicMessage = require("./BasicMessage");
const {WaitUntil} = require("../../tools/wait");
const {execute: readMessage} = require("../../e4kserver/commands/readMessages");

class UserMessage extends BasicMessage {
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
    }

    /** @return {Promise<void>} */
    init() {
        return new Promise(async (resolve, reject) => {
            try {
                this.body = await getMessageBody(this.#client._socket, this.messageId);
                this.#client._socket[`rms -> ${this.messageId}`] = null;
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    }

    parseMetaData(client, metaArray) {
        this.subject = metaArray[0];
    }
}

/**
 *
 * @param {Socket} socket
 * @param {number} messageId
 * @returns {Promise<string>}
 */
function getMessageBody(socket, messageId) {
    return new Promise(async (resolve, reject) => {
        try {
            readMessage(socket, messageId);
            const data = await WaitUntil(socket, `rms -> ${messageId}`);
            delete socket[`rms -> ${messageId}`];
            resolve(data);
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = UserMessage;