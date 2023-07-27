const BasicBattleLogMessage = require("./BasicBattleLogMessage");
const Localize = require("../../tools/Localize");

class BattleLogConquerMessage extends BasicBattleLogMessage {
    initSubject(client)
    {
        let textId = this.isDefenseReport ? "dialog_battleLog_conquerVictim" : "dialog_battleLog_conquer";
        textId += this.hasBattleLogOwnerWon ? "Victory" : "Lost";
        this.subject = Localize.text(client, textId);
    }
}

module.exports = BattleLogConquerMessage;