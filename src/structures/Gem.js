const Effect = require("./Effect");
const {gems} = require('e4k-data').data;

class Gem {
    /**
     * 
     * @param {Client} client 
     * @param {number} id 
     * @param {Equipment} equipment 
     * @returns 
     */
    constructor(client, id, equipment = null) {
        let _data = getDataFromJson(id);
        if (!_data) { console.log(id + " without data"); return; }
        this.rawData = _data;
        /** @type {number} */
        this.id = _data.gemID;
        if (_data.setID)
            /** @type {number} */
            this.setId = _data.setID;
        /** @type {Effect[]} */
        this.effects = parseEffects(client, _data.effects);
        if (equipment)
            /** @type {Equipment} */
            this.attachedEquipment = equipment;
    }
}

/**
 * 
 * @param {number} id 
 * @returns {object}
 */
function getDataFromJson(id) {
    for (let g of gems) {
        if (g.gemID === id) {
            return g;
        }
    }
}

/**
 * 
 * @param {Client} client 
 * @param {string} _data 
 * @returns {Effect[]}
 */
function parseEffects(client, _data) {
    let _effects = _data.split(",");
    let data = [];
    for (let e of _effects) {
        data.push(e.split("&amp;"));
    }
    let effects = [];
    for (let d of data) {
        effects.push(new Effect(client, d));
    }
    return effects;
}

module.exports = Gem;