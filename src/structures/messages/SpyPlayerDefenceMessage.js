const BasicSpyPlayerMessage = require("./BasicSpyPlayerMessage");
const Localize = require("../../tools/Localize");

class SpyPlayerDefenceMessage extends BasicSpyPlayerMessage {
    parseMetaData(client, metaArray) {
        this.canBeForwarded = true;
        this.subType = parseInt(metaArray[0]);
        this.successType = parseInt(metaArray[1]);
        this.ownerId = parseInt(metaArray[3]);
        this.areaName = metaArray[4];
        const metaArray2 = metaArray[2].split("#");
        this.areaType = parseInt(metaArray2[0]);
        this.kingdomId = parseInt(metaArray2[1]);
        this.initSubject(client, Localize.text(client, "dialog_attack_spyInfo"));
    }
}

module.exports = SpyPlayerDefenceMessage;