const Effect = require("./Effect");
const {gems} = require('e4k-data').data;

class Gem {
    /**
     * @param {BaseClient} client
     * @param {number} id
     * @param {Equipment} equipment
     */
    constructor(client, id, equipment = null) {
        let _data = getDataFromJson(id);
        if (!_data) {
            client.logger.w(`gem id ${id} without data`);
            return;
        }
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
 * @param {number} id
 * @returns {Object}
 */
function getDataFromJson(id) {
    for (let g of gems) {
        if (g.gemID === id) {
            return g;
        }
    }
}

/**
 * @param {BaseClient} client
 * @param {string} _data
 * @returns {Effect[]}
 */
function parseEffects(client, _data) {
    let _effects = _data.split(",");
    const data = [];
    for (let e of _effects) {
        data.push(e.split("&amp;"));
    }
    const effects = [];
    for (let d of data) {
        effects.push(new Effect(client, d));
    }
    return effects;
}

module.exports = Gem;