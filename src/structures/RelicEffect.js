const Effect = require('./Effect');
const relicEffectsJson = require('./../data/ingame_data/relicEffects.json');

class RelicEffect extends Effect {
    constructor(client, data) {
        let _data = getDataFromJson(data[0]);
        super(client, parseInt(_data.effectID));
        this.relicEffectId = data[0];
        //this.? = data[1];
        this.power = parseFloat(data[2][0]);
    }
}

function getDataFromJson(id){
    for(i in relicEffectsJson){
        if(parseInt(relicEffectsJson[i].id) === id){
            return relicEffectsJson[i];
        }
    }
}

module.exports = RelicEffect;