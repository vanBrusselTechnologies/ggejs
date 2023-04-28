const BasicMessage = require("./BasicMessage");
const Localize = require("../tools/Localize");

class ProductionDowntimeMessage extends BasicMessage {
    parseMetaData(client, metaArray) {
        this.downtimeStatus = parseInt(metaArray[0]);
        this.messageScope = parseInt(metaArray[1]);
        this.senderName = Localize.text(client, "dialog_messages_system");
        const _loc3_ = this.downtimeStatus === 1 ? "freeze" : "unfreeze";
        const _loc2_ = this.messageScope === 0 ? "foodmead" : this.messageScope === 1 ? "food" : null;
        this.subject = Localize.text(client, `message_productionDownTime_${_loc3_}_${_loc2_}_header`);
    }
}

module.exports = ProductionDowntimeMessage;