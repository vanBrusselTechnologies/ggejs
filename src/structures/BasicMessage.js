class BasicMessage {
    subType = 0;
    subject = "";

    /**
     *
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        /** @type {number} */
        this.messageId = data[0];
        this.messageType = data[1];
        /** @type {string} */
        this.metadata = data[2];
        this.senderName = data[3];
        this.playerId = data[4];
        this.deliveryTime = new Date(Date.now() - data[5] * 1000);
        this.isRead = data[6] === 1;
        this.isArchived = data[7] === 1;
        this.isForwarded = data[8] === 1;
        this.canBeForwarded = false;
        this.parseMetaData(client, this.metadata.split('+'))
    }

    /** @return {Promise<void>} */
    init() {
        return new Promise((resolve) => {
            resolve();
        })
    }

    /**
     *
     * @param {Client} client
     * @param {Array<string>} metaArray
     */
    parseMetaData(client, metaArray) {
    }
}

module.exports = BasicMessage;