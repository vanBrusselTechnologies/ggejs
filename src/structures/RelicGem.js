const RelicEffect = require("./RelicEffect");

class RelicGem {
    /**
     * @param {BaseClient} client
     * @param {Array} data
     * @param {RelicEquipment} equipment
     */
    constructor(client, data, equipment = null) {
        /** @type {number} */
        this.id = data[0];
        /** @type {number} */
        this.slotId = this.id % 4 + 7;
        /** @type {number} */
        this.relicTypeId = data[1];
        /** @type {number} */
        this.relicCategoryId = data[2];
        /** @type {number} */
        this.mightValue = data[3];
        /** @type {number} */
        this.enhancementLevel = data[5];
        if (equipment)
            /** @type {RelicEquipment} */
            this.attachedEquipment = equipment;
        /** @type {RelicEffect[]} */
        this.effects = parseEffects(client, data[4]);
    }
}

/**
 * @param {BaseClient} client
 * @param {Array} data
 * @returns {RelicEffect[]}
 */
function parseEffects(client, data) {
    let effects = [];
    for (let i in data) {
        effects.push(new RelicEffect(client, data[i]));
    }
    return effects;
}

module.exports = RelicGem;