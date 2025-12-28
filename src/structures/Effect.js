const {effects} = require('e4k-data').data;

class Effect {
    /**
     * @param {BaseClient} client
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
        const _data = getDataFromJson(client, this.effectId);
        if (_data === undefined) {
            client.logger.w(`Unknown effect id: ${this.effectId}`);
            return;
        }
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
 * @param {BaseClient} client
 * @param {number} id
 * @returns {Object}
 */
function getDataFromJson(client, id) {
    return effects.find(e => e.effectID === id);
}

module.exports = Effect;