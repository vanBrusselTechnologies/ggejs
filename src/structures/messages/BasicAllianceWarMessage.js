const BasicMessage = require("./BasicMessage");
const Localize = require("../../tools/Localize");

class BasicAllianceWarMessage extends BasicMessage {

    /**
     * @param {BaseClient} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
        this.parseMetaData(client, data[2].split('*'))
    }

    parseMetaData(client, metaArray) {
        this.subType = parseInt(metaArray[0]);
        this.enemyAllianceId = parseInt(metaArray[3]);
        this.enemyAllianceName = metaArray[4];
        if (!this.isForwarded) this.senderName = this.enemyAllianceName;
        this.subject = Localize.text(client, "message_autoWar_subject");
    }
}

module.exports = BasicAllianceWarMessage;