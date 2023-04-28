const BasicBattleLogMessage = require("./BasicBattleLogMessage");
const Localize = require("../tools/Localize");

class BattleLogOccupyMessage extends BasicBattleLogMessage {
    initSubject(client) {
        if (this.hasAttackerWon) {
            if (this.areaType === 3) {
                this.subject = Localize.text(client, "dialog_messageHeader_capitalConquered");
            } else if (this.areaType === 22) {
                this.subject = Localize.text(client, "dialog_messageHeader_metropolConquered");
            } else {
                this.subject = Localize.text(client, "dialog_messageHeader_outpostConquered");
            }
        } else {
            this.subject = Localize.text(client, "dialog_battleLog_conquerLost");
        }
    }
}

module.exports = BattleLogOccupyMessage;