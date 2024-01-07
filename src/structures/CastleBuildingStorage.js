const BasicBuilding = require("./BasicBuilding");
const InventoryItem = require("./InventoryItem");

class CastleBuildingStorage {
    globalStorage = {
        /** @type {InventoryItem<BasicBuilding>[]} */ regularBuildings: [],
        /** @type {InventoryItem<BasicBuilding>[]} */ customBuildings: [],
        /** @type {InventoryItem<BasicBuilding>[]} */ uniqueBuildings: [],
    }
    areaStorage = {
        /** @type {InventoryItem<BasicBuilding>[]} */
        regularBuildings: []
    }


    /**
     *
     * @param {Client} client
     * @param {{SID:number, RD:[number[]], CD:[number[]], UD:[number[]]}[]} data
     */
    constructor(client, data) {
        if (!data) return;
        for (let s of data) {
            if (s.SID === 1) {
                this.globalStorage.regularBuildings = parseBuildings(client, s.RD);
                this.globalStorage.customBuildings = parseUniqueBuildings(client, s.CD, false);
                this.globalStorage.uniqueBuildings = parseUniqueBuildings(client, s.UD, true);
            } else if (s.SID === 2) {
                this.areaStorage.regularBuildings = parseBuildings(client, s.RD);
            }
        }
    }
}

/**
 * @param {Client} client
 * @param {number[]} data
 * @returns {InventoryItem<BasicBuilding>[]}
 */
function parseBuildings(client, data) {
    return data.map(d => new InventoryItem(new BasicBuilding(client, [d[0]]), d[1]))
}

/**
 * @param {Client} client
 * @param {number[]} data
 * @param {boolean} isUnique
 * @returns {InventoryItem<BasicBuilding>[]}
 */
function parseUniqueBuildings(client, data, isUnique) {
    return data.map(d => {
        const building = new BasicBuilding(client, [d[0]])
        building.uniqueDecorationId = d[1];
        building.customAttributeValue = d[2];
        building.isFusionUniqueDeco = isUnique;
        return new InventoryItem(building, 1)
    })
}

module.exports = CastleBuildingStorage;