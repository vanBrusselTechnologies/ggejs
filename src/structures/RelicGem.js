const RelicEffect = require("./RelicEffect");

class RelicGem {
    constructor(client, data, equipment = null) {
        this.id = data[0];
        this.slotId = this.id % 4 + 7;
        this.relicTypeId = data[1];
        this.relicCategoryId = data[2];
        this.mightValue = data[3];
        this.enhancementLevel = data[5];
        if (equipment)
            this.attachedEquipment = equipment;
        this.effects = parseEffects(client, data[4]);
    }
}

function parseEffects(client, data) {
    let effects = [];
    for (let i in data) {
        effects.push(new RelicEffect(client, data[i]));
    }
    return effects;
}

module.exports = RelicGem;