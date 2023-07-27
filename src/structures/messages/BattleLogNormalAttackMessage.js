const BasicBattleLogMessage = require("./BasicBattleLogMessage");
const Localize = require("../../tools/Localize");

class BattleLogNormalAttackMessage extends BasicBattleLogMessage {
    initSubject(client) {
        if (this.hasAttackerWon && this.areaType === 24) {
            this.subject = this.isDefenseReport ? Localize.text(client, "dialog_messageHeader_islandLost") : Localize.text(client, "dialog_messageHeader_islandConquered");
        } else if (this.hasAttackerWon && this.isDefenseReport && this.areaType === 23) {
            this.subject = Localize.text(client, "dialog_messageHeader_towerLost");
        } else {
            const _loc1_ = this.isDefenseReport ? Localize.text(client, "dialog_battleLog_defence") : Localize.text(client, "attack");
            const _loc2_ = this.hasBattleLogOwnerWon ? Localize.text(client, "dialog_battleLog_victory") : Localize.text(client, "dialog_battleLog_defeat");
            this.subject = Localize.text(client, "value_assign_colon", _loc1_, _loc2_);
        }
    }
}

module.exports = BattleLogNormalAttackMessage;