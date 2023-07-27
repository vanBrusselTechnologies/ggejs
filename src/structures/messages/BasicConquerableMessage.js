const BasicMessage = require("./BasicMessage");

class BasicConquerableMessage extends BasicMessage {
    parseMetaData(client, metaArray) {
        this.areaType = parseInt(metaArray[0]);
        this.ownerId = parseInt(metaArray[2]);
        this.areaName = metaArray[3];
        this.senderName = this.areaName;
        this.attackerPlayerId = parseInt(metaArray[4]);
        this.attackerName = metaArray[5];
        metaArray = metaArray[1].split("#");
        this.subType = parseInt(metaArray[0]);
        this.kingdomId = parseInt(metaArray[1]);
        this.initSubject(client, this.areaType);
    }

    /**
     *
     * @param {Client} _
     * @param {number} __
     */
    initSubject(_, __) {
    }
}

module.exports = BasicConquerableMessage;