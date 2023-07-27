const BasicSpyPlayerMessage = require("./BasicSpyPlayerMessage");
const Localize = require("../../tools/Localize");

class SpyPlayerSabotageSuccessfulMessage extends BasicSpyPlayerMessage {
    initSubject(client, spyTypeName) {
        if (!this.isForwarded && !this.isAttacking) this.subject = Localize.text(client, "dialog_spy_affectedBySabotage"); else super.initSubject(client, spyTypeName);
    }

    parseMetaData(client, metaArray) {
        this.subType = parseInt(metaArray[0]);
        this.successType = parseInt(metaArray[1]);
        if (!this.isAttacking) this.areaId = parseInt(metaArray[3]);
        metaArray = metaArray[2].split("#");
        this.areaType = parseInt(metaArray[0]);
        this.senderName = this.areaName = metaArray[1];
        this.initSubject(client, Localize.text(client, "dialog_spy_titleSabotage"));
    }
}

module.exports = SpyPlayerSabotageSuccessfulMessage;