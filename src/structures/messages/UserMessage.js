const BasicMessage = require("./BasicMessage");
const {readMessages} = require("../../commands/rms");
const EmpireError = require("../../tools/EmpireError");

class UserMessage extends BasicMessage {
    /** @type {Client} */
    #client = null;
    _body = ""

    /**
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
        this.#client = client;
    }

    async getBody() {
        try {
            if (this._body !== "") return this._body;
            this._body = await readMessages(this.#client, this.messageId);
            return this._body;
        } catch (e) {
            throw new EmpireError(this.#client, e);
        }
    }

    parseMetaData(client, metaArray) {
        this.subject = metaArray[0];
    }
}

module.exports = UserMessage;