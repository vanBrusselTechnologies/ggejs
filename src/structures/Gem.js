const Effect = require("./Effect");
const gems = require('e4k-data').data.gems;

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
    for (let i in gems) {
        if (gems[i].gemID === id) {
            return gems[i];
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
    for (let i in _effects) {
        data.push(_effects[i].split("&amp;"));
    }
    let effects = [];
    for (let i in data) {
        effects.push(new Effect(client, data[i]));
    }
    return effects;
}

module.exports = Gem;