const effectsJson = require('./../data/ingame_data/effects.json');

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
        }
        else {
            this.effectId = parseFloat(data[0]);
            /** @type {number} */
            this.power = parseFloat(data[1]);
        }
        let _data = getDataFromJson(this.effectId);
        /** @type {object} */
        this.rawData = _data;
        /** @type {string} */
        this.name = _data.name;
        /** @type {number} */
        this.capId = parseInt(_data.capID);
        /** @type {number} */
        this.uncappedPower = this.power;
    }
}

/**
 * 
 * @param {number} id 
 * @returns {object}
 */
function getDataFromJson(id) {
    for (let i in effectsJson) {
        if (parseInt(effectsJson[i].effectID) === id) {
            return effectsJson[i];
        }
    }
}

module.exports = Effect;