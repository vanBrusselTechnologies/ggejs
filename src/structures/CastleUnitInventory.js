const Unit = require("./Unit");
const {execute: gsi} = require("../commands/onReceived/gsi");

class CastleUnitInventory {

    /** @type {InventoryItem<Unit>[]} */
    units = [];
    /** @type {InventoryItem<Unit>[]} */
    unitsTraveling = [];
    /** @type {InventoryItem<Unit>[]} */
    unitsInHospital = [];
    /** @type {InventoryItem<Unit>[]} */
    unitsInStronghold = [];
    /** @type {number} */
    totalShadowUnits = 0;
    /** @type {number} */
    travellingShadowUnits = 0;
    /** @type {InventoryItem<Unit>[]} */
    shadowUnits = [];

    /**
     * @param {Client} client
     * @param {{I:[], HI:[],SHI:[],TU:[],gsi:Object}} data
     */
    constructor(client, data) {
        if (!data) return;
        this.units = parseUnits(client, data.I);
        this.unitsInHospital = parseUnits(client, data.HI);
        this.unitsInStronghold = parseUnits(client, data.SHI);
        this.unitsTraveling = parseUnits(client, data.TU);
        if (data.gsi) {
            const shadowUnitsInfo = gsi(client, 0, data.gsi);
            this.totalShadowUnits = shadowUnitsInfo.totalShadowUnits;
            this.travellingShadowUnits = shadowUnitsInfo.travellingShadowUnits;
            this.shadowUnits = shadowUnitsInfo.shadowUnits;
        }
    }
}

/**
 * @param {Client} client
 * @param {[]} data
 * @return {InventoryItem<Unit>[]}
 */
function parseUnits(client, data) {
    let units = [];
    for (let u of data) {
        units.push({
            item: new Unit(client, u[0]), count: u[1]
        })
    }
    return units;
}

module.exports = CastleUnitInventory;