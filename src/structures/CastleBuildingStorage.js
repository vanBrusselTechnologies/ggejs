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
    const output = []
    for (let i of data) output.push(new InventoryItem(new BasicBuilding(client, [i[0]]), i[1]))
    return output
}

/**
 * @param {Client} client
 * @param {number[]} data
 * @param {boolean} isUnique
 * @returns {InventoryItem<BasicBuilding>[]}
 */
function parseUniqueBuildings(client, data, isUnique) {
    const output = []
    for (let i of data) {
        const building = new BasicBuilding(client, [i[0]])
        building.uniqueDecorationId = i[1];
        building.customAttributeValue = i[2];
        building.isFusionUniqueDeco = isUnique;
        output.push(new InventoryItem(building, 1))
    }
    return output
}

module.exports = CastleBuildingStorage;