const Effect = require("./Effect");
const {gems} = require('e4k-data').data;

class Gem {
    /**
     * @param {BaseClient} client
     * @param {number} id
     * @param {Equipment} equipment
     */
    constructor(client, id, equipment = null) {
        const _data = getDataFromJson(id);
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

/** @param {number} id */
function getDataFromJson(id) {
    return gems.find(g => g.gemID === id);
}

/**
 * @param {BaseClient} client
 * @param {string} _data
 */
function parseEffects(client, _data) {
    const _effects = _data.split(",");
    const data = _effects.map(e => e.split("&amp;"));
    return data.map(d => new Effect(client, d));
}

module.exports = Gem;