const BasicBattleLogMessage = require("./BasicBattleLogMessage");
const Localize = require("../../tools/Localize");

class ShadowAttackMessage extends BasicBattleLogMessage {
    /**
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
    }

    /** @param {Client} client */
    initSubject(client) {
        const _loc1_ = Localize.text(client, "attack");
        const _loc2_ = this.hasBattleLogOwnerWon ? Localize.text(client, "dialog_battleLog_victory") : Localize.text(client, "dialog_battleLog_defeat");
        this.subject = Localize.text(client, "value_assign_colon", _loc1_, _loc2_);
    }
}

module.exports = ShadowAttackMessage;