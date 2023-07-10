const BasicConquerableMessage = require("./BasicConquerableMessage");
const Localize = require("../tools/Localize");
class ConquerableAreaLostMessage extends BasicConquerableMessage {

    initSubject(client, areaType){
        if(areaType === 4)
        {
            this.subject = Localize.text(client, "dialog_messageHeader_outpostLost");
        }
        else if(areaType === 15)
        {
            this.subject = Localize.text(client, "dialog_messageHeader_factionCampLost");
        }
        else if(areaType === 10)
        {
            this.subject = Localize.text(client, "dialog_messageHeader_villageLost");
        }
        else if(areaType === 22)
        {
            this.subject = Localize.text(client, "dialog_messageHeader_metropolLost");
        }
        else if(areaType === 3)
        {
            this.subject = Localize.text(client, "dialog_messageHeader_capitalLost");
        }
    }
}

module.exports = ConquerableAreaLostMessage;