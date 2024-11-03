const InteractiveMapobject = require("./InteractiveMapobject");
const {villages, buildings} = require('e4k-data').data;

class VillageMapobject extends InteractiveMapobject {
    /**
     *
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data.slice(0, 3));
        if (data.length <= 3) return;
        /** @type {number} */
        this.objectId = data[3];
        /** @type {number} */
        this.occupierId = data[4];
        if (this.occupierId >= 0) this.ownerInfo = client.worldmaps._ownerInfoData.getOwnerInfo(this.occupierId);
        /** @type {number} */
        this.villageType = data[5];
        /** @type {number} */
        this.kingdomId = data[6];
        if (data[7] > 0) /** @type {Date} */
        this.lastSpyDate = new Date(Date.now() - data[7] * 1000);
        /** @type {string} */
        this.customName = data[8];
        const _data = parseVillageData(this.kingdomId, this.villageType);
        if (_data == null) return;
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

/**
 * @param {number} kId
 * @param {number} villageType
 */
function parseVillageData(kId, villageType) {
    const data = villages.find(v => v.kID === kId);
    if (data == null) return null;
    data.productivityWoodBoost = villageType === 0 ? data.productivityWoodBoost : 0;
    data.productivityStoneBoost = villageType === 1 ? data.productivityStoneBoost : 0;
    data.productivityFoodBoost = villageType === 2 ? data.productivityFoodBoost : 0;
    return data;
}

module.exports = VillageMapobject;