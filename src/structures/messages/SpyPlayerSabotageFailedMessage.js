const BasicSpyPlayerMessage = require("./BasicSpyPlayerMessage");
const Localize = require("../../tools/Localize");

class SpyPlayerSabotageFailedMessage extends BasicSpyPlayerMessage {
    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray)
        this.initSubject(client, Localize.text(client, "dialog_spy_titleSabotage"));
    }
}

module.exports = SpyPlayerSabotageFailedMessage;