const Equipment = require("./Equipment");
const RelicEquipment = require("./RelicEquipment");
const Effect = require('./Effect');
const equipmentSets = require("./../data/ingame_data/equipment_sets.json");
const effectCaps = require("./../data/ingame_data/effectCaps.json");

class Lord {
    constructor(client, data) {
        if (data.DLID) { if(client._socket["debug"]) console.log("received dummy lord!");console.log(data); return null; }//DummyLord => CreateAndParseDummyLord()
        this.id = data.ID;
        this.wins = data.W;
        this.defeats = data.D;
        this.winSpree = data.SPR;
        this.equipments = parseEquipments(client, data.EQ, this);
        if (this.equipments.length > 0) {
            this.isRelic = data.EQ[0][11] === 3
        }
        this.gems = parseGems(data.GEM, this.equipments);
        this.effects = parseEffects(client, data, this.equipments);
        this.wearerId = data.WID;
        this.name = data.N;
        this.pictureId = data.VIS;
    }
}

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

function parseGems(data, equipments) {
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

function parseEffects(client, data, equipments) {
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