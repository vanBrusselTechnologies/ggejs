const Equipment = require("./Equipment");
const RelicEquipment = require("./RelicEquipment");
const Effect = require('./Effect');
const equipmentSets = require("./../data/ingame_data/equipment_sets.json");
const effectCaps = require("./../data/ingame_data/effectCaps.json");
const lords = require("./../data/ingame_data/lords.json");

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
    for (let i in data) {
        if (data[i][11] === 3)
            _equipments.push(new RelicEquipment(client, data[i], lord));
        else
            _equipments.push(new Equipment(client, data[i], lord));
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
    for (let i in equipments) {
        let _gem = equipments[i].attachedGem;
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
    for (let i in equipments) {
        for (let j in equipments[i].effects) {
            _effects.push(equipments[i].effects[j]);
        }
        if (equipments[i].setId) {
            let found = false
            for (let k in equipmentSetArray) {
                if (equipmentSetArray[k][0] === equipments[i].setId) {
                    equipmentSetArray[k][1] += 1;
                    found = true;
                    break;
                }
            }
            if (!found) equipmentSetArray.push([equipments[i].setId, 1]);
        }
        let _gem = equipments[i].attachedGem;
        if (_gem && _gem.effects) {
            for (let j in _gem.effects) {
                _effects.push(_gem.effects[j]);
            }
            if (_gem.setId) {
                let found = false;
                for (let k in equipmentSetArray) {
                    if (equipmentSetArray[k][0] === _gem.setId) {
                        equipmentSetArray[k][1] += 1;
                        found = true;
                        break;
                    }
                }
                if (!found) equipmentSetArray.push([_gem.setId, 1]);
            }
        }
    }

    for (let i in equipmentSetArray) {
        let _equipSet = equipmentSetArray[i];
        for (let j in equipmentSets) {
            if (parseInt(equipmentSets[j].setID) === _equipSet[0] && parseInt(equipmentSets[j].neededItems) <= _equipSet[1]) {
                let __effects = equipmentSets[j].effects.split(",");
                let data = [];
                for (i in __effects) {
                    data.push(__effects[i].split("&amp;"));
                }
                for (let i in data) {
                    _effects.push(new Effect(client, data[i]));
                }
            }
        }
    }
    /** @type {Effect[] | RelicEffect[]} */
    let effects = [];
    for (let i in _effects) {
        let _effect = _effects[i];
        let found = false;
        for (let j in effects) {
            if (_effect.effectId === effects[j].effectId) {
                found = true;
                effects[j].power += _effect.power;
                break;
            }
        }
        if (!found) effects.push(_effect);
    }

    for (let i in effects) {
        let _effect = effects[i];
        _effect.uncappedPower = _effect.power;
        for (let j in effectCaps) {
            if (parseInt(effectCaps[j].capID) === _effect.capId) {
                if (effectCaps[j].maxTotalBonus && parseFloat(effectCaps[j].maxTotalBonus) < _effect.power) {
                    _effect.power = parseFloat(effectCaps[j].maxTotalBonus);
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
        if (parseInt(lords[i].lordID) === id)
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
        for (let j in effects) {
            if (_effect.effectId === effects[j].effectId) {
                found = true;
                effects[j].power += _effect.power;
                break;
            }
        }
        if (!found) effects.push(_effect);
    }

    for (let i in effects) {
        let _effect = effects[i];
        _effect.uncappedPower = _effect.power;
        for (let j in effectCaps) {
            if (parseInt(effectCaps[j].capID) === _effect.capId) {
                if (effectCaps[j].maxTotalBonus && parseFloat(effectCaps[j].maxTotalBonus) < _effect.power) {
                    _effect.power = parseFloat(effectCaps[j].maxTotalBonus);
                }
            }
        }
    }

    return effects;
}

module.exports = Lord;