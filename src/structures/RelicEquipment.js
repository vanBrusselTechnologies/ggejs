const RelicEffect = require("./RelicEffect");
const RelicGem = require("./RelicGem");

class RelicEquipment {
    constructor(client, data, lord = null) {
        this.id = data[0];
        this.slotId = data[1];
        this.wearerId = data[2];
        this.rarityId = data[3]
        this.canSlotGem = this.slotId !== 6;
        this.enhancementLevel = data[8];
        this.relicTypeId = data[12][0];
        this.relicCategoryId = data[12][1];
        this.mightValue = data[12][2];
        if (data[12][3]?.length > 0)
            this.attachedGem = parseGem(client, data[12][3], this);
        this.effects = parseEffects(client, data[5]);
        if (lord)
            this.equippedLord = lord;
    }
}

function parseGem(client, data, equipment) {
    return new RelicGem(client, data, equipment);
}

function parseEffects(client, data) {
    let effects = [];
    for (let i in data) {
        effects.push(new RelicEffect(client, data[i]));
    }
    return effects;
}

module.exports = RelicEquipment;