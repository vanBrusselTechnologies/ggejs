const units = require('e4k-data').data.units;
const Effect = require("./Effect");

class Unit {
    /**
     *
     * @param {Client} client
     * @param {number} wodId
     */
    constructor(client, wodId) {
        this.wodId = wodId;
        this.rawData = getData(wodId);
        for (let i in this.rawData) {
            /** @type {number | string} */
            let item = this.rawData[i];
            if (i === "kIDs" || i === "slotTypes" || i === "lowLevelRecruitmentTime") {
                this[i] = [];
                if(typeof item == "number"){
                    this[i].push(item);
                    continue;
                }
                item.split(",").forEach((j) => {
                    this[i].push(parseInt(j))
                })
                continue;
            }
            if (i === "allowedToAttack" || i === "allowedToTravel") {
                this[i] = [];
                item.split("#").forEach((_) => {
                    let __split_val = _.split("+");
                    let _kId = parseInt(__split_val[0]);
                    let _areaId = parseInt(__split_val[1]);
                    this[i].push({kingdomId: _kId, areaId: _areaId});
                })
                continue;
            }
            if (i === "effects") {
                this[i] = [];
                item.split(",").forEach((_) => {
                    let __split_val = _.split("&amp;");
                    let _effectId = parseInt(__split_val[0]);
                    let _power = parseInt(__split_val[1]);
                    this[i].push(new Effect(client, [_effectId, _power]));
                })
                continue;
            }
            if (i === "researchLocked" || i === "canBeUsedByNPC" || i === "hybrid" || i === "canBeUsedToAttackNPC" ||
                i === "isAuxiliary" || i === "isKamikaze" || i === "allowedToTravel" || i === "attackscreenBuyable" ||
                i === "allowedToAttack" || i === "deleteToolAfterBattle" || i === "isYardTool"
            ) {
                this[i] = item === 1;
                continue;
            }
            if(typeof item == "number"){
                this[i] = item;
                continue;
            }
            let _intItem = parseInt(item);
            if (!isNaN(_intItem)) {
                this[i] = _intItem;
                continue;
            }
            this[i] = item;
        }
        if(this.canBeUsedToAttackNPC !== false) this.canBeUsedToAttackNPC = true;
        this.isSoldier = isSoldier(this.rawData);
    }
}

/**
 *
 * @param {Unit} rawData
 * @returns {boolean}
 */
function isSoldier(rawData) {
    return rawData.rangeDefence != null && rawData.meleeDefence != null;

}

/**
 *
 * @param {number} wodId
 * @returns {Unit}
 */
function getData(wodId) {
    for (let i in units) {
        if (wodId === units[i].wodID) {
            return units[i];
        }
    }
}

module.exports = Unit;