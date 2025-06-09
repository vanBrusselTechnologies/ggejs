const BasicAttackAdvisorMessage = require("./BasicAttackAdvisorMessage");
const Localize = require("../../tools/Localize");

class AttackAdvisorFailedMessage extends BasicAttackAdvisorMessage {
    lordId;
    reasonId;

    parseMetaData(client, metaArray) {
        super.parseMetaData(client, metaArray);
        this.lordId = metaArray[1];
        this.reasonId = metaArray[2];
        this.subject = Localize.text(client, `title_advisor_AttackFailed`);
    }
}

module.exports = AttackAdvisorFailedMessage;