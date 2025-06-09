const BasicMessage = require("./BasicMessage");
const Localize = require("../../tools/Localize");
const {AttackAdvisorType} = require("../../utils/Constants");

class BasicAttackAdvisorMessage extends BasicMessage {
    advisorType = {id: 0, name: ''};

    parseMetaData(client, metaArray) {
        this.advisorType = AttackAdvisorType[Object.keys(AttackAdvisorType).find(k => AttackAdvisorType[k].id === 1)];
        if(this.advisorType) this.senderName = Localize.text(client,`title_advisor_${this.advisorType.name}`);
    }
}

module.exports = BasicAttackAdvisorMessage;