const BasicConquerableMessage = require("./BasicConquerableMessage");
const Localize = require("../../tools/Localize");
class ConquerableAreaConqueredMessage extends BasicConquerableMessage {
    initSubject(client, areaType){
        if(areaType === 4)
        {
            this.subject = Localize.text(client, "dialog_messageHeader_outpostConquered");
        }
        else if(areaType === 15)
        {
            this.subject = Localize.text(client, "dialog_messageHeader_factionCampConquered");
        }
        else if(areaType === 10)
        {
            this.subject = Localize.text(client, "dialog_messageHeader_villageConquered");
        }
        else if(areaType === 22)
        {
            this.subject = Localize.text(client, "dialog_messageHeader_metropolConquered");
        }
        else if(areaType === 3)
        {
            this.subject = Localize.text(client, "dialog_messageHeader_capitalConquered");
        }
    }
}

module.exports = ConquerableAreaConqueredMessage;