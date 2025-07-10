const BasicMessage = require("./BasicMessage");
const Localize = require("../../tools/Localize");
const Coordinate = require("../Coordinate");

class RuinInfoMessage extends BasicMessage {
    #client;

    constructor(client, data) {
        super(client, data);
        this.#client = client;
    }

    parseMetaData(client, metaArray) {
        const metaArray2 = metaArray[0].split("#");
        this.position = new Coordinate([parseInt(metaArray2[0]), parseInt(metaArray2[1])]);
        this.senderName = Localize.text(client, "dialog_messages_system");
        this.subject = Localize.text(client, "relocate_freeWorldmapPosition_toolTip");
        this.endRuinTime = new Date(this.deliveryTime.getTime() + parseFloat(metaArray2[2]) * 1000)
    }

    get subject() {
        if (this.endRuinTime.getTime() < Date.now()) {
            return Localize.text(this._client, "relocate_freeWorldmapPosition_toolTip");
        }
        const seconds = Math.round((Date.now() - this.endRuinTime.getTime()) / 1000)
        return Localize.text(this.#client, "dialog_relocateRuin_remainingRuinTime", seconds.toString());
    }
}

module.exports = RuinInfoMessage;