const BasicMessage = require("./BasicMessage");
const Localize = require("../../tools/Localize");
const Coordinate = require("../Coordinate");

class BasicAttackCancelledMessage extends BasicMessage {
    areaType = -1;
    reason = -1;

    parseMetaData(client, metaArray) {
        this.subType = parseInt(metaArray[0]);
        this.kingdomId = parseInt(metaArray[1]);
        this.targetPlayerId = parseInt(metaArray[2]);
        this.areaName = metaArray[3];
        this.position = new Coordinate(client, metaArray.slice(4, 6));
        this.subject = Localize.text(client, "dialog_messageHeader_noFight");
        this.senderName = Localize.text(client, "dialog_messages_system");
    }
}

module.exports = BasicAttackCancelledMessage;