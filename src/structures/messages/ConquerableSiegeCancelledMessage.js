const BasicConquerableMessage = require("./BasicConquerableMessage");
const Localize = require("../../tools/Localize");
class ConquerableSiegeCancelledMessage extends BasicConquerableMessage {
    initSubject(client, _){
        this.subject = Localize.text(client, "dialog_messageHeader_siegeCancelledByPlayer");
    }
}

module.exports = ConquerableSiegeCancelledMessage;