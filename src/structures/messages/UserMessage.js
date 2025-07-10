const BasicMessage = require("./BasicMessage");
const {readMessages} = require("../../commands/rms");

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
        this.body = await readMessages(this.#client, this.messageId);
    }

    parseMetaData(client, metaArray) {
        this.subject = metaArray[0];
    }
}

module.exports = UserMessage;