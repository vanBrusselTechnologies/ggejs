const Equipment = require("./Equipment");
const RelicEquipment = require("./RelicEquipment");
const Effect = require('./Effect');
const e4kData = require('e4k-data').data;
const equipmentSets = e4kData.equipment_sets;
const effectCaps = e4kData.effectCaps;
const lords = e4kData.lords;

class Lord {
    /**
     * 
     * @param {Client} client 
     * @param {object} data 
     * @returns 
     */
    constructor(client, data) {
        if (data.DLID) {
            /** @type {number} */
            this.id = data.DLID;
            /** @type {boolean} */
            this.isDummy = true;
            /** @type {object} */
            this.rawData = getDummyData(this.id);
            /** @type {Effect[]} */
            this.effects = parseDummyEffects(client, this.rawData.effects);
            return;
        }
        /** @type {number} */
        this.id = data.ID;
        /** @type {boolean} */
        this.isDummy = false;
        /** @type {number} */
        this.wins = data.W;
        /** @type {number} */
        this.defeats = data.D;
        /** @type {number} */
        this.winSpree = data.SPR;
        /** @type {Equipment[] | RelicEquipment[]} */
        this.equipments = parseEquipments(client, data.EQ, this);
        if (this.equipments.length > 0) {
            /** @type {boolean} */
            this.isRelic = data.EQ[0][11] === 3
        }
        /** @type {Gem[] | RelicGem[]} */
        this.gems = parseGems(data.GEM, this.equipments);
        /** @type {Effect[] | RelicEffect[]} */
        this.effects = parseEffects(client, data, this.equipments);
        /** @type {number} */
        this.wearerId = data.WID;
        /** @type {string} */
        this.name = data.N;
        /** @type {number} */
        this.pictureId = data.VIS;
        if (data.LICID)
            /** @type {number} */
            this.attachedCastleId = data.LICID;
    }
}

/**
 * 
 * @param {Client} client 
 * @param {Array} data 
 * @param {Lord} lord 
 * @returns {Equipment[] | RelicEquipment[]}
 */
function parseEquipments(client, data, lord) {
    let _equipments = [];
    for (let d of data) {
        if (d[11] === 3)
            _equipments.push(new RelicEquipment(client, d, lord));
        else
            _equipments.push(new Equipment(client, d, lord));
    }
    return _equipments;
}

/**
 * 
 * @param {*} data 
 * @param {Equipment[] | RelicEquipment[]} equipments 
 * @returns {Gem[] | RelicGem[]}
 */
function parseGems(data, equipments) {
    /** @type {Gem[] | RelicGem[]} */
    let _gems = [];
    if (data) {
        console.log("received additional gems");
        console.log(data);
        for (let i in data) {
            //_gems.push(createGemById(data[i]));
        }
    }
    for (let equipment of equipments) {
        let _gem = equipment.attachedGem;
        if (_gem) _gems.push(_gem);
    }
    return _gems;
}

/**
 * 
 * @param {Client} client 
 * @param {*} data 
 * @param {Equipment[] | RelicEquipment[]} equipments 
 * @returns {Effect[] | RelicEffect[]}
 */
function parseEffects(client, data, equipments) {
    /** @type {Effect[] | RelicEffect[]} */
    let _effects = [];
    /*
     *  if(data["AIE"])
     *  {
     *     _loc3_ = _loc3_.concat(effectsParser.parseJSONMultiple(data["AIE"],EffectSourceEnum.ALIEN_INVASION_EFFECTS));
     *  }
     *  if(data["HME"])
     *  {
     *     _loc3_ = _loc3_.concat(effectsParser.parseJSONMultiple(data["HME"],EffectSourceEnum.SHAPESHIFTER_HARD_MODE));
     *  }
     *  if(data["TAE"])
     *  {
     *     for each(var _loc4_ in data["TAE"])
     *     {
     *        _loc3_ = _loc3_.concat(effectsParser.parseJSONMultiple(_loc4_,EffectSourceEnum.TAUNT_ATTACK_EFFECTS));
     *     }
     *  }
     *  if(data["AE"])
     *  {
     *     _loc3_ = _loc3_.concat(effectsParser.parseJSONMultiple(data["AE"],EffectSourceEnum.AREA_EFFECTS));
     *  }
     *  if(data["E"])
     *  {
     *     _loc3_ = _loc3_.concat(effectsParser.parseJSONMultiple(data["E"]));
     *  }
     *  lord.setAdditionalEffects(_loc3_);
     **/
    let equipmentSetArray = [];
    for (let equipment of equipments) {
        for (let j in equipment.effects) {
            _effects.push(equipment.effects[j]);
        }
        if (equipment.setId) {
            let found = false
            for (let equipmentSet of equipmentSetArray) {
                if (equipmentSet[0] === equipment.setId) {
                    equipmentSet[1] += 1;
                    found = true;
                    break;
                }
            }
            if (!found) equipmentSetArray.push([equipment.setId, 1]);
        }
        let _gem = equipment.attachedGem;
        if (_gem && _gem.effects) {
            for (let j in _gem.effects) {
                _effects.push(_gem.effects[j]);
            }
            if (_gem.setId) {
                let found = false;
                for (let equipmentSet of equipmentSetArray) {
                    if (equipmentSet[0] === _gem.setId) {
                        equipmentSet[1] += 1;
                        found = true;
                        break;
                    }
                }
                if (!found) equipmentSetArray.push([_gem.setId, 1]);
            }
        }
    }

    for (let _equipSet of equipmentSetArray) {
        for (let equipmentSet of equipmentSets) {
            if (equipmentSet.setID === _equipSet[0] && equipmentSet.neededItems <= _equipSet[1]) {
                let __effects = equipmentSet.effects.split(",");
                let data = [];
                for (let effect of __effects) {
                    data.push(effect.split("&amp;"));
                }
                for (let d of data) {
                    _effects.push(new Effect(client, d));
                }
            }
        }
    }
    /** @type {Effect[] | RelicEffect[]} */
    let effects = [];
    for (let i in _effects) {
        let _effect = _effects[i];
        let found = false;
        for (let effect of effects) {
            if (_effect.effectId === effect.effectId) {
                found = true;
                effect.power += _effect.power;
                break;
            }
        }
        if (!found) effects.push(_effect);
    }

    for (let i in effects) {
        let _effect = effects[i];
        _effect.uncappedPower = _effect.power;
        for (let effectCap of effectCaps) {
            if (effectCap.capID === _effect.capId) {
                if (effectCap.maxTotalBonus && effectCap.maxTotalBonus < _effect.power) {
                    _effect.power = effectCap.maxTotalBonus;
                }
            }
        }
    }

    return effects;
}

/**
 * 
 * @param {number} id 
 * @returns {object}
 */
function getDummyData(id) {
    for (let i in lords) {
        if (lords[i].lordID === id)
            return lords[i];
    }
}

/**
 * 
 * @param {Client} client 
 * @param {string} effectsData 
 * @returns {Effect[]}
 */
function parseDummyEffects(client, effectsData) {
    if (!effectsData) return [];
    /** @type {Effect[]} */
    let _effects = [];
    let __effects = effectsData.split(",");
    let data = [];
    for (let i in __effects) {
        data.push(__effects[i].split("&amp;"));
    }
    for (let i in data) {
        _effects.push(new Effect(client, data[i]));
    }
    
    /** @type {Effect[]} */
    let effects = [];
    for (let i in _effects) {
        let _effect = _effects[i];
        let found = false;
        for (let effect of effects) {
            if (_effect.effectId === effect.effectId) {
                found = true;
                effect.power += _effect.power;
                break;
            }
        }
        if (!found) effects.push(_effect);
    }

    for (let i in effects) {
        let _effect = effects[i];
        _effect.uncappedPower = _effect.power;
        for (let effectCap of effectCaps) {
            if (effectCap.capID === _effect.capId) {
                if (effectCap.maxTotalBonus && effectCap.maxTotalBonus < _effect.power) {
                    _effect.power = effectCap.maxTotalBonus;
                }
            }
        }
    }

    return effects;
}

module.exports = Lord;