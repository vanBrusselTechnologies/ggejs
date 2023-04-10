const Effect = require('./Effect');
const relicEffects = require('e4k-data').data.relicEffects;

class RelicEffect extends Effect {
    /**
     * 
     * @param {Client} client 
     * @param {Array} data 
     */
    constructor(client, data) {
        let _data = getDataFromJson(data[0]);
        super(client, _data.effectID);
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
    for(let i in relicEffects){
        if(relicEffects[i].id === id){
            return relicEffects[i];
        }
    }
}

module.exports = RelicEffect;