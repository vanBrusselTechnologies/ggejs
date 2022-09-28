const Effect = require('./Effect');
const relicEffectsJson = require('./../data/ingame_data/relicEffects.json');

class RelicEffect extends Effect {
    /**
     * 
     * @param {Client} client 
     * @param {Array} data 
     */
    constructor(client, data) {
        let _data = getDataFromJson(data[0]);
        super(client, parseInt(_data.effectID));
        /** @type {number} */
        this.relicEffectId = data[0];
        //this.? = data[1];
        /** @type {number} */
        this.power = parseFloat(data[2][0]);
    }
}

/**
 * 
 * @param {number} id 
 * @returns {object}
 */
function getDataFromJson(id){
    for(let i in relicEffectsJson){
        if(parseInt(relicEffectsJson[i].id) === id){
            return relicEffectsJson[i];
        }
    }
}

module.exports = RelicEffect;