const BasicMessage = require("./BasicMessage");
const Localize = require("../tools/Localize");

class RebuyMessage extends BasicMessage {
    #client;

    constructor(client, data) {
        super(client, data);
        this.#client = client;
    }

    /*get subject() {
        const subject = boosterService.isBoosterActive(this.boosterId)?"dialog_rebuy_mailHeader":"dialog_overseerExpired_mailHeader";
        return Localize.text(this.#client, subject, this.boosterName);
    }*/

    parseMetaData(client, metaArray) {
        this.boosterId = parseInt(metaArray[0]);
        this.senderName = Localize.text(client, "dialog_messages_system");
        if (client._socket.debug) console.warn("Missing Boosterdata in RebuyMessage");
        //this.boosterName = boosterService.getBoosterName(this.boosterId);
    }
}

module.exports = RebuyMessage;