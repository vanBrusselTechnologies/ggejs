const Gem = require("./Gem");
const Effect = require("./Effect");

class Equipment {
    constructor(client, data, lord = null) {
        this.id = data[0];
        this.slotId = data[1];
        this.wearerId = data[2];
        this.rarityId = data[3];
        this.pictureId = data[4];
        this.canSlotGem = this.slotId !== 6;
        this.enhancementLevel = data[8];
        this.setId = data[7] || true;
        this.effects = parseEffects(client, data[5]);
        if(data[10] !== -1)
            this.attachedGem = parseGem(client, data[10], this);
        if(lord)
            this.equippedLord = lord;
    }
}

function parseEffects(client, data) {
    let effects = [];
    for(let i in data){
        effects.push(new Effect(client, data[i]));
    }
    return effects;
}

function parseGem(client, data, equipment){
    return new Gem(client, data, equipment)
}

module.exports = Equipment;