const {effects} = require('e4k-data').data;

class Effect {
    /**
     *
     * @param {Client} client
     * @param {Array | number} data
     */
    constructor(client, data) {
        if (typeof data === "number") {
            /** @type {number} */
            this.effectId = data;
        } else {
            this.effectId = parseFloat(data[0]);
            /** @type {number} */
            this.power = parseFloat(data[1]);
        }
        let _data = getDataFromJson(this.effectId);
        if (_data === null || _data === undefined) return;
        /** @type {Object} */
        this.rawData = _data;
        /** @type {string} */
        this.name = _data.name;
        /** @type {number} */
        this.capId = _data.capID;
        /** @type {number} */
        this.uncappedPower = this.power;
    }
}

/**
 *
 * @param {number} id
 * @returns {Object}
 */
function getDataFromJson(id) {
    for (let effect of effects) {
        if (effect.effectID === id) {
            return effect;
        }
    }
    console.warn(`Unknown effect id: ${id}`);
    return null;
}

module.exports = Effect;