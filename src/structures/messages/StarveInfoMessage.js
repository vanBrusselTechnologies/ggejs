const BasicMessage = require("./BasicMessage");
const Localize = require("../../tools/Localize");
const Good = require("../Good");

class StarveInfoMessage extends BasicMessage {
    parseMetaData(client, metaArray) {
        this.numberOfDesertedTroops = parseInt(metaArray[0]);
        this.areaName = metaArray[1];
        this.kingdomId = parseInt(metaArray[2]);
        this.areaId = parseInt(metaArray[3]);
        this.areaType = metaArray.length > 4 ? parseInt(metaArray[4]) : -1;
        this.resourceName = new Good(client, [metaArray.length > 5 ? metaArray[5] : "F", 0]).item;
        this.initSubject(client);
        this.senderName = parseInt(this.areaName) === -24 ? Localize.text(client, "monthevents_expeditioncamp") : this.areaName;

        this.setSenderToAreaName(this.areaName, this.areaType, this.kingdomId)
    }

    initSubject(client) {
        this.subject = Localize.text(client, `dialog_desertedTroops_${this.resourceName === "food" ? "f" : this.resourceName}Units_title`);
        if (this.kingdomId === -1) {
            if (this.areaType === 23) {
                this.subject = Localize.text(client, "dialog_messageHeader_towerLost");
            } else if (this.areaType === 26) {
                this.subject = Localize.text(client, "dialog_messageHeader_monumentLost");
            } else if (this.areaType === 10) {
                this.subject = Localize.text(client, "dialog_messageHeader_villageLost");
            }
        }
    }
}

module.exports = StarveInfoMessage;