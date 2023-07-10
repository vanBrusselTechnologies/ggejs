const Gem = require("./Gem");
const Effect = require("./Effect");
const equipmentEffects = require('e4k-data').data.equipment_effects;

class Equipment {
    /**
     * 
     * @param {Client} client 
     * @param {Array} data 
     * @param {Lord} lord 
     */
    constructor(client, data, lord = null) {
        /** @type {number} */
        this.id = data[0];
        /** @type {number} */
        this.slotId = data[1];
        /** @type {number} */
        this.wearerId = data[2];
        /** @type {number} */
        this.rarityId = data[3];
        /** @type {number} */
        this.pictureId = data[4];
        /** @type {boolean} */
        this.canSlotGem = this.slotId !== 6;
        /** @type {number} */
        this.enhancementLevel = data[8];
        /** @type {number} */
        this.setId = data[7];
        /** @type {Effect[]} */
        this.effects = parseEffects(client, data[5]);
        if (data[10] !== -1)
            /** @type {Gem} */
            this.attachedGem = parseGem(client, data[10], this);
        if (lord)
            /** @type {Lord} */
            this.equippedLord = lord;
    }
}

/**
 * 
 * @param {Client} client 
 * @param {Array} data 
 * @returns {Effect[]}
 */
function parseEffects(client, data) {
    let effects = [];
    for (let d of data) {
        for(let e of equipmentEffects){
            if(e.equipmentEffectID === d[0]){
                d[0] = e.effectID
            }
        }
        effects.push(new Effect(client, d));
    }
    return effects;
}

/**
 * 
 * @param {Client} client 
 * @param {number} data 
 * @param {Equipment} equipment 
 * @returns {Gem}
 */
function parseGem(client, data, equipment) {
    return new Gem(client, data, equipment)
}

module.exports = Equipment;