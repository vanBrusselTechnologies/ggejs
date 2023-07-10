const BasicConquerableMessage = require("./BasicConquerableMessage");
const Localize = require("../tools/Localize");
class ConquerableNewSiegeMessage extends BasicConquerableMessage {
    parseMetaData(client, metaArray)
    {
        this.areaType = parseInt(metaArray[0]);
        this.ownerId = parseInt(metaArray[3]);
        this.areaName = metaArray[4];
        this.senderName = this.areaName;
        this.attackerPlayerId = parseInt(metaArray[5]);
        this.attackerName = metaArray[6];
        metaArray = metaArray[2].split("#");
        this.subType = parseInt(metaArray[0]);
        this.kingdomId = parseInt(metaArray[1]);
        this.initSubject(this.areaType);
    }

    initSubject(client, _){
        this.subject = Localize.text(client, "dialog_messageHeader_outpostNewConquering");
    }
}

module.exports = ConquerableNewSiegeMessage;