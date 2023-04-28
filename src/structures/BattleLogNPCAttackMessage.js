const BasicBattleLogMessage = require("./BasicBattleLogMessage");
const Localize = require("../tools/Localize");

class BattleLogNPCAttackMessage extends BasicBattleLogMessage {
    initSubject(client) {
        const _loc1_ = Localize.text(client, "dialog_battleLog_raid");
        const _loc2_ = this.hasAttackerWon ? Localize.text(client, "dialog_battleLog_defeat") : Localize.text(client, "dialog_battleLog_victory");
        this.subject = Localize.text(client, "value_assign_colon", _loc1_, _loc2_);
    }
}

module.exports = BattleLogNPCAttackMessage;