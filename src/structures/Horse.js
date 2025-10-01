const {horses, buildings} = require('e4k-data').data;
const {HorseType} = require("../utils/Constants");

class Horse {
    /**
     * @param {Castle} castleData
     * @param {number} horseType
     */
    constructor(castleData, horseType) {
        const isPegasusHorse = horseType === HorseType.Feather;
        if (isPegasusHorse) horseType -= 1;
        this.wodId = getHorseWodId(castleData.buildingInfo.buildings, horseType);
        if (this.wodId === -1) return;
        const horse = horses.find(h => h.wodID === this.wodId);
        this.wodId = horse.wodID;
        this.comment1 = horse.comment1;
        this.comment2 = horse.comment2;
        this.type = horse.type;
        this.unitBoost = horse.unitBoost;
        this.marketBoost = horse.marketBoost;
        this.spyBoost = horse.spyBoost;
        this.costFactorC1 = isPegasusHorse ? 0 : horse.costFactorC1;
        this.costFactorC2 = isPegasusHorse ? 0 : horse.costFactorC2;
        this.isInstantSpyHorse = horse.isInstantSpyHorse === 1;
        this.isPegasusHorse = isPegasusHorse;
    }
}

/**
 * @param {BasicBuilding[]} castleBuildings
 * @param {number} type
 * @returns {number}
 */
function getHorseWodId(castleBuildings, type) {
    const stableBuildings = buildings.filter(b => b.unlockHorses != null);
    for (const building of castleBuildings) {
        const stableBuilding = stableBuildings.find(b => b.wodID === building.wodId);
        if (stableBuilding !== undefined) return parseInt(stableBuilding.unlockHorses.split(",")[type]);
    }
    return -1;
}

module.exports = Horse;