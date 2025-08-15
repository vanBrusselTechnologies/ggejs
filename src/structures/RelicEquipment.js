const RelicEffect = require("./RelicEffect");
const RelicGem = require("./RelicGem");

class RelicEquipment {
    /**
     * @param {BaseClient} client
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
        this.rarityId = data[3]
        /** @type {boolean} */
        this.canSlotGem = this.slotId !== 6;
        /** @type {number} */
        this.enhancementLevel = data[8];
        /** @type {number} */
        this.relicTypeId = data[12][0];
        /** @type {number} */
        this.relicCategoryId = data[12][1];
        /** @type {number} */
        this.mightValue = data[12][2];
        if (data[12][3]?.length > 0)
            /** @type {RelicGem} */
            this.attachedGem = parseGem(client, data[12][3], this);
        /** @type {RelicEffect[]} */
        this.effects = parseEffects(client, data[5]);
        if (lord)
            /** @type {Lord} */
            this.equippedLord = lord;
    }
}

/**
 * @param {BaseClient} client
 * @param {Array} data
 * @param {RelicEquipment} equipment
 */
function parseGem(client, data, equipment) {
    return new RelicGem(client, data, equipment);
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

module.exports = RelicEquipment;