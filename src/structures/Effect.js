const effectsJson = require('./../data/ingame_data/effects.json');

class Effect {
    constructor(client, data) {
        if (typeof data === "number") {
            this.effectId = data;
        }
        else {
            this.effectId = parseFloat(data[0]);
            this.power = parseFloat(data[1]);
        }
        let _data = getDataFromJson(this.effectId);
        this.name = _data.name;
        this.capId = parseInt(_data.capID);
        this.uncappedPower = this.power;
    }
}

function getDataFromJson(id) {
    for (i in effectsJson) {
        if (parseInt(effectsJson[i].effectID) === id) {
            return effectsJson[i];
        }
    }
}

module.exports = Effect;