const Effect = require("./Effect");
const gems = require('./../data/ingame_data/gems.json');

class Gem {
    constructor(client, data, equipment = null) {
        let _data = getDataFromJson(data);
        if (!_data) { console.log(data); return; }
        this.id = _data.gemID;
        if (_data.setID)
            this.setId = _data.setID;
        this.effects = parseEffects(client, _data.effects);
        if (equipment)
            this.attachedEquipment = equipment;
    }
}

function getDataFromJson(id) {
    for (i in gems) {
        if (parseInt(gems[i].gemID) === id) {
            return gems[i];
        }
    }
}

function parseEffects(client, _data) {
    let _effects = _data.split(",");
    let data = [];
    for (i in _effects) {
        data.push(_effects[i].split("&amp;"));
    }
    let effects = [];
    for (let i in data) {
        effects.push(new Effect(client, data[i]));
    }
    return effects;
}

module.exports = Gem;