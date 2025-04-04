const {HorseType} = require("../utils/Constants");
const {horses, buildings} = require('e4k-data').data;

class Horse {
    /**
     * @param {Client} client
     * @param {Castle} castleData
     * @param {number} horseType
     */
    constructor(client, castleData, horseType) {
        const isPegasusHorse = horseType === HorseType.Feather;
        if (isPegasusHorse) horseType -= 1;
        this.wodId = getHorseWodId(castleData.buildingInfo.buildings, horseType);
        if (this.wodId === -1) return;
        let horse = horses.find(h => h.wodID === this.wodId);
        if (isPegasusHorse) horse = horses.find(h => h.type === horse.type && h.isPegasusHorse === 1)
        this.comment1 = horse.comment1;
        this.comment2 = horse.comment2;
        this.type = horse.type;
        this.unitBoost = horse.unitBoost;
        this.marketBoost = horse.marketBoost;
        this.spyBoost = horse.spyBoost;
        this.costFactorC1 = horse.costFactorC1;
        this.costFactorC2 = horse.costFactorC2;
        this.isInstantSpyHorse = horse.isInstantSpyHorse === 1;
        this.isPegasusHorse = horse.isPegasusHorse === 1;
    }
}

/**
 * @param {BasicBuilding[]} castleBuildings
 * @param {number} type
 * @returns {number}
 */
function getHorseWodId(castleBuildings, type) {
    const stableBuildings = buildings.filter(b => b.unlockHorses != null);
    for (let k in castleBuildings) {
        const stableBuilding = stableBuildings.find(b => b.wodID === castleBuildings[k].wodId);
        if (stableBuilding != null) return parseInt(stableBuilding.unlockHorses.split(",")[type]);
    }
    return -1;
}

module.exports = Horse;