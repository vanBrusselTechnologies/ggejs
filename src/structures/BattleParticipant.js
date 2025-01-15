const Good = require("./Good");

class BattleParticipant {
    /**
     *
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        this.playerId = data[0];
        this.ownerInfo = client.worldmaps._ownerInfoData.getOwnerInfo(this.playerId);
        this.front = data[1];
        this.startArmySize = data[2];
        this.lostUnits = data[3];
        let lootGoods = [];
        for (const g of data[4]) lootGoods.push(new Good(client, g));
        this.lootGoods = lootGoods;
        this.famePoints = data[5];
        this.xp = data[6];
        this.kingstowersEffect = data[7];
        this.factionPoint = data[8];
        this.attackBoost = data[9];
        this.woundedUnits = data[10];
        this.isEnvironment = this.playerId < 0;
        this.isShadowUnit = this.playerId === -333;
    }
}

module.exports = BattleParticipant;