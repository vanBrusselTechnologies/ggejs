const BasicMapobject = require("./BasicMapobject");
const {villages, buildings} = require('e4k-data').data;

class VillageMapobject extends BasicMapobject {
    /**
     *
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
        if (data.length <= 3) return;
        /** @type {number} */
        this.objectId = data[3];
        /** @type {number} */
        this.occupierId = data[4];
        /** @type {number} */
        this.villageType = data[5];
        /** @type {number} */
        this.kingdomId = data[6];
        if (data[7] > 0) /** @type {Date} */
        this.lastSpyDate = new Date(Date.now() - data[7] * 1000);
        /** @type {string} */
        this.customName = data[8];
        const _data = parseVillageData(this.kingdomId, this.villageType);
        this.wallLevel = buildings.find(b => b.wodID === _data.wallWodId)?.level;
        this.gateLevel = buildings.find(b => b.wodID === _data.gateWodId)?.level;
        this.keepLevel = buildings.find(b => b.wodID === _data.keepWodId)?.level;
        this.unitWallCount = _data.unitWallCount;
        this.peasants = _data.peasants;
        this.guards = _data.guards;
        this.productivityWoodBoost = _data.productivityWoodBoost;
        this.productivityStoneBoost = _data.productivityStoneBoost;
        this.productivityFoodBoost = _data.productivityFoodBoost;
    }

    parseAreaInfoBattleLog(data) {
        super.parseAreaInfoBattleLog(data);

        this.keepLevel = data.KL;
        this.wallLevel = data.WL;
        this.gateLevel = data.GL;
        this.towerLevel = data.TL;
        this.moatLevel = data.ML;
        this.customName = data.N;
        this.equipmentId = data.EID;
        this.villageType = data.RT;
        return this;
    }
}

function parseVillageData(kId, villageType) {
    const data = villages.find(v => v.kID === kId);
    data.productivityWoodBoost = villageType === 0 ? data.productivityWoodBoost : 0;
    data.productivityStoneBoost = villageType === 1 ? data.productivityStoneBoost : 0;
    data.productivityFoodBoost = villageType === 2 ? data.productivityFoodBoost : 0;
    return data;
}

module.exports = VillageMapobject;