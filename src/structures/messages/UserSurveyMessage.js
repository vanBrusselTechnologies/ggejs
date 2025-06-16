const BasicMessage = require("./BasicMessage");
const Localize = require("../../tools/Localize");

class UserSurveyMessage extends BasicMessage {
    parseMetaData(client, metaArray) {
        this.senderName = Localize.text(client, "dialog_messages_system");
        this.subject = Localize.text(client, "dialog_messageHeader_survey");
        if (metaArray.length > 0) {
            this.surveyId = parseInt(metaArray[0]);
        } else client.logger.w(`Missing metaArray for UserSurveyMessage: ${metaArray}!`);
    }
}

module.exports = UserSurveyMessage;