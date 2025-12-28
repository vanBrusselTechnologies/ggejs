const {equipment_effects, equipment_sets, effectCaps, lords} = require('e4k-data').data;
const Equipment = require("./Equipment");
const RelicEquipment = require("./RelicEquipment");
const Effect = require('./Effect');
const Gem = require("./Gem");

class Lord {
    /**
     * @param {BaseClient} client
     * @param {Object} data
     * @returns
     */
    constructor(client, data) {
        /** @type {boolean} */
        this.isDummy = data.DLID != null;
        if (this.isDummy) {
            /** @type {number} */
            this.id = data.DLID;
            this.rawData = getDummyData(this.id);
            this.name = this.rawData.type
            this.wearerId = this.rawData.wearerID;
            this.effects = parseDummyEffects(client, this.rawData.effects);
            return;
        }
        /** @type {number} */
        this.id = data.ID;
        /** @type {number} */
        this.wins = data.W ?? 0;
        /** @type {number} */
        this.defeats = data.D ?? 0;
        /** @type {number} */
        this.winSpree = data.SPR ?? 0;
        /** @type {Equipment[] | RelicEquipment[]} */
        this.equipments = parseEquipments(client, data.EQ, this);
        this.generalId = data["GID"];
        if (this.equipments.length > 0) {
            /** @type {boolean} */
            this.isRelic = data.EQ[0][11] === 3
        }
        /** @type {Gem[] | RelicGem[]} */
        this.gems = parseGems(client, data.GEM, this.equipments);
        /** @type {Effect[] | RelicEffect[]} */
        this.effects = parseEffects(client, data, this.equipments);
        /** @type {number} */
        this.wearerId = data.WID;
        /** @type {string} */
        this.name = data.N ?? "";
        /** @type {number} */
        this.pictureId = data.VIS;
        if (data.LICID) /** @type {number} */ this.attachedCastleId = data.LICID;
    }
}

/**
 * @param {BaseClient} client
 * @param {Array} data
 * @param {Lord} lord
 * @returns {Equipment[] | RelicEquipment[]}
 */
function parseEquipments(client, data, lord) {
    return (data ?? []).map(d => d[11] === 3 ? new RelicEquipment(client, d, lord) : new Equipment(client, d, lord));
}

/**
 * @param {BaseClient} client
 * @param {[]} data
 * @param {Equipment[] | RelicEquipment[]} equipments
 * @returns {Gem[] | RelicGem[]}
 */
function parseGems(client, data, equipments) {
    /** @type {Gem[] | RelicGem[]} */
    const gems = (data ?? []).map(id => new Gem(client, id));
    equipments.filter(e => e.attachedGem != null).forEach(e => gems.push(e.attachedGem))
    return gems;
}

/**
 * @param {BaseClient} client
 * @param {{AIE: [], HME: [], TAE: [], AE: [], E: []}} data
 * @param {Equipment[] | RelicEquipment[]} equipments
 * @returns {Effect[] | RelicEffect[]}
 */
function parseEffects(client, data, equipments) {
    /** @type {Effect[] | RelicEffect[]} */
    const _effects = [];
    if (!data.E) _effects.push(...(data.AIE ?? []).map(d => new Effect(client, [d[0], d[1][0]])))
    _effects.push(...(data.HME ?? []).map(d => new Effect(client, [d[0], d[1][0]])))
    _effects.push(...(data.TAE?.[0] ?? []).map(d => new Effect(client, [d[0], d[1][0]])))
    _effects.push(...(data.AE ?? []).map(d => new Effect(client, [d[0], d[1][0]])))
    _effects.push(...(data.E ?? []).map(d => new Effect(client, [d[0], d[1][0]])))

    const equipmentSetArray = [];
    if (!data.E) for (const equipment of equipments) {
        equipment.effects.forEach(e => _effects.push(e))
        if (equipment.setId) {
            const set = equipmentSetArray.find(eSet => eSet[0] === equipment.setId);
            if (set !== undefined) set[1] += 1; else equipmentSetArray.push([equipment.setId, 1]);
        }
        const gem = equipment.attachedGem;
        if (gem && gem.effects) {
            gem.effects.forEach(e => _effects.push(e))
            if (gem.setId) {
                const set = equipmentSetArray.find(eSet => eSet[0] === gem.setId);
                if (set !== undefined) set[1] += 1; else equipmentSetArray.push([gem.setId, 1]);
            }
        }
    }

    for (const _equipSet of equipmentSetArray) {
        equipment_sets.filter(s => s.setID === _equipSet[0] && s.neededItems <= _equipSet[1]).forEach(set => {
            _effects.push(...set.effects.split(",").map(e => e.split("&amp;")).map(d =>{
            const effectData = [...d]
            effectData[0] = eqEffectIdToEffectId(parseInt(d[0]))
            return new Effect(client, effectData);
        }))})
    }
    /** @type {Effect[] | RelicEffect[]} */
    const effects = [];
    _effects.forEach(e1 => {
        const effect = effects.find(e => e.effectId === e1.effectId);
        if (effect !== undefined) effect.power += e1.power; else effects.push(e1);
    })

    effects.forEach(e => {
        e.uncappedPower = e.power;
        e.power = Math.min(e.power, effectCaps.find(c => c.capID === e.capId)?.maxTotalBonus ?? Infinity);
    })

    return effects;
}

/** @param {number} id */
function getDummyData(id) {
    return lords.find(l => l.lordID === id);
}

/**
 * @param {BaseClient} client
 * @param {string} effectsData
 */
function parseDummyEffects(client, effectsData) {
    if (!effectsData) return [];
    /** @type {Effect[] | RelicEffect[]} */
    const effects = [];
    effectsData.split(",").map(e => e.split("&amp;")).map(d => {
        const effectData = [...d]
        effectData[0] = eqEffectIdToEffectId(parseInt(d[0]))
        return new Effect(client, effectData)
    }).forEach(e1 => {
        const effect = effects.find(e => e.effectId === e1.effectId);
        if (effect !== undefined) effect.power += e1.power; else effects.push(e1);
    })

    effects.forEach(e => {
        e.uncappedPower = e.power;
        e.power = Math.min(e.power, effectCaps.find(c => c.capID === e.capId)?.maxTotalBonus ?? Infinity);
    })

    return effects;
}

/** @param {number} eqEffectId */
function eqEffectIdToEffectId(eqEffectId) {
    return equipment_effects.find(e => e.equipmentEffectID === eqEffectId).effectID
}

module.exports = Lord;