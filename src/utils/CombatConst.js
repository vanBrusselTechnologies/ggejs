const flankBonus = [0, 0.7, 1, 1.3];
const waveUnlockLevels = [0, 13, 26, 51];
const wallWodIdsVillages = [503, 504, 505];
const gateWodIdsVillages = [452, 453, 469];
const unitSlotFlankUnlockLevels = [0, 13];
const toolSlotFlankUnlockLevels = [0, 37];
const unitSlotFrontUnlockLevels = [0, 0, 26];
const toolSlotFrontUnlockLevels = [0, 11, 37];

/**
 *
 * @param {boolean} defeatedLWall
 * @param {boolean} defeatedMWall
 * @param {boolean} defeatedRWall
 * @returns {number}
 */
module.exports.getFlankBonus = function (defeatedLWall = false, defeatedMWall = false, defeatedRWall = false) {
    return flankBonus[(defeatedLWall ? 1 : 0) + (defeatedMWall ? 1 : 0) + (defeatedRWall ? 1 : 0)];
}
/**
 *
 * @param {number} side
 * @param {number} defenderLevel
 * @param {number} flankBonus
 * @param {number} frontBonus
 * @returns {number}
 */
module.exports.getAmountSoldiers = function (side, defenderLevel, flankBonus = 0, frontBonus = 0) {
    side === 1 ? this.getAmountSoldiersMiddle(defenderLevel, frontBonus) : this.getAmountSoldiersFlank(defenderLevel, flankBonus);
}
/**
 *
 * @param {number} defenderLevel
 * @param {number} flankBonus
 * @returns {number}
 */
module.exports.getAmountSoldiersFlank = function (defenderLevel, flankBonus = 0) {
    return Math.ceil(this.getMaxAttackers(defenderLevel) * 0.2 * (1 + flankBonus / 100));
}
/**
 *
 * @param {number} defenderLevel
 * @returns {number}
 */
module.exports.getAmountSoldiersFlankWithoutBonus = function (defenderLevel) {
    return Math.ceil(this.getMaxAttackers(defenderLevel) * 0.2);
}
/**
 *
 * @param {number} defenderLevel
 * @param {number} frontBonus
 * @returns {number}
 */
module.exports.getAmountSoldiersMiddle = function (defenderLevel, frontBonus = 0) {
    return Math.ceil((this.getMaxAttackers(defenderLevel) - this.getAmountSoldiersFlankWithoutBonus(defenderLevel) * 2) * (1 + frontBonus / 100))
}
/**
 *
 * @param {number} defenderLevel
 * @returns {number}
 */
module.exports.getMinSoldiers = function (defenderLevel) {
    return Math.floor(this.getMaxAttackers(defenderLevel) * 0.1);
}
/**
 *
 * @param {number} level
 * @returns {number}
 */
module.exports.getMaxDamagedBuildings = function (level) {
    return Math.round(0.179 * Math.exp((level - 4) * 0.199));
}
/**
 *
 * @param {number} defenderLevel
 * @param {number} toolFlankBonus
 * @returns {number}
 */
module.exports.getTotalAmountToolsFlank = function (defenderLevel, toolFlankBonus = 0) {
    return this.getTotalAmountTools(0, defenderLevel, toolFlankBonus);
}
/**
 *
 * @param {number} defenderLevel
 * @returns {number}
 */
module.exports.getTotalAmountToolsMiddle = function (defenderLevel) {
    return this.getTotalAmountTools(1, defenderLevel, 0);
}
/**
 *
 * @param {number} side
 * @param {number} defenderLevel
 * @param {number} toolFlankBonus
 * @returns {number}
 */
module.exports.getTotalAmountTools = function (side, defenderLevel, toolFlankBonus = 0) {
    if (side === 1) {
        if (defenderLevel < 11) return 10;
        if (defenderLevel < 37) return 20;
        if (defenderLevel < 50) return 30;
        if (defenderLevel < 69) return 40;
        return 50;
    }
    if (defenderLevel < 37) return 10;
    if (defenderLevel < 50) return 20;
    if (defenderLevel < 69) return 30;
    return Math.ceil(40 + toolFlankBonus);
}
/**
 *
 * @param {number} defenderLevel
 * @returns {number}
 */
module.exports.getMaxAttackers = function (defenderLevel) {
    if (defenderLevel <= 69) return Math.min(260, 5 * defenderLevel + 8);
    return 320;
}
/**
 * @param {number} attackerCumulatedLevel
 * @param {number} defenderLevel
 * @param {number} effectBonus
 * @param {number} effectModifier
 * @returns {number}
 */
module.exports.getMaxUnitsInReinforcementWave = function (attackerCumulatedLevel, defenderLevel, effectBonus, effectModifier) {
    const maxUnits = Math.sqrt(attackerCumulatedLevel) * 20 + 50 + defenderLevel * 20 + effectBonus;
    return Math.round(maxUnits * effectModifier);
}
/**
 *
 * @param {number} attackerLevel
 * @returns {number}
 */
module.exports.getMaxLevelDif1 = function (attackerLevel) {
    return Math.max(5, Math.round(0.002 * attackerLevel * attackerLevel + 0.17 * attackerLevel + 3));
}
/**
 *
 * @param {number} attackerLevel
 * @returns {number}
 */
module.exports.getMaxLevelDif2 = function (attackerLevel) {
    return Math.max(5, Math.round(0.0015 * attackerLevel * attackerLevel + 0.12 * attackerLevel + 3));
}
/**
 *
 * @param {number} attackerHonor
 * @param {number} defenderHonor
 * @param {number} attackerLevel
 * @param {number} defenderLevel
 * @param {boolean} attackerWon
 * @returns {number}
 */
module.exports.getHonorChange = function (attackerHonor, defenderHonor, attackerLevel, defenderLevel, attackerWon) {
    let winnerHonor = 0;
    let loserHonor = 0;
    if (attackerLevel > defenderLevel + this.getMaxLevelDif2(attackerLevel)) {
        if (attackerLevel > defenderLevel + this.getMaxLevelDif1(attackerLevel)) {
            return (defenderLevel - attackerLevel) * 3;
        }
        return 0;
    }
    if (!attackerWon) {
        winnerHonor = defenderHonor;
        loserHonor = attackerHonor;
    } else {
        winnerHonor = attackerHonor;
        loserHonor = defenderHonor;
    }
    return Math.round(Math.max((loserHonor - winnerHonor) / 7 + 100, 0));
}
/**
 *
 * @param {number} attackerHonor
 * @param {number} defenderHonor
 * @param {number} attackerLevel
 * @param {number} defenderLevel
 * @param {number} titleBoost
 * @param {number} researchHonorBoost
 * @param {number} attackerHonorBoost
 * @param {boolean} attackerWon
 * @returns {number}
 */
module.exports.getHonorChangeWithBoost = function (attackerHonor, defenderHonor, attackerLevel, defenderLevel, titleBoost, researchHonorBoost, attackerHonorBoost, attackerWon) {
    return Math.round(this.getHonorChange(attackerHonor, defenderHonor, attackerLevel, defenderLevel, attackerWon) * (1 + (attackerHonorBoost + researchHonorBoost + titleBoost) / 100));
}
/**
 *
 * @param {number} attackerHonor
 * @param {number} defenderHonor
 * @param {number} attackerLevel
 * @param {number} defenderLevel
 * @param {boolean} attackerWon
 * @returns {number}
 */
module.exports.getAttackerHonorChangeOnShadowAttack = function (attackerHonor, defenderHonor, attackerLevel, defenderLevel, attackerWon) {
    if (!attackerWon) return 0;
    const _ = Math.min(Math.round(Math.max((attackerHonor - defenderHonor) / 7 + 100, 0)), 0);
    const __ = (attackerLevel > defenderLevel + this.getMaxLevelDif1(attackerLevel)) ? (defenderLevel - attackerLevel) * 2 : 0;
    return _ + __;
}
/**
 *
 * @param {number} moral
 * @returns {number}
 */
module.exports.getMoralBonus = function (moral) {
    return moral >= 0 ? 2 - 1 / (1 + Math.abs(moral) / 250) : 1 / (1 + Math.abs(moral) / 250);
}
/**
 *
 * @param {number} honorOfPlayer
 * @returns {number}
 */
module.exports.getFameBonusForHonor = function (honorOfPlayer) {
    if (honorOfPlayer === 0) return 0;
    return Math.min(1, (2 * Math.exp(0.00115 * honorOfPlayer) + (0.012 * honorOfPlayer + 1)) / 100);
}
/**
 *
 * @param {number} level
 * @param {boolean} conquerAttack
 * @returns {number}
 */
module.exports.getMaxWaveCount = function (level, conquerAttack = false) {
    let waveCount = getUnlockCountByLevel(waveUnlockLevels, level);
    if (conquerAttack) waveCount += 2;
    return waveCount;
}
/**
 *
 * @param {number} level
 * @param {boolean} conquerAttack
 * @param {number} additionalWaves
 * @returns {number}
 */
module.exports.getMaxWaveCountWithBonus = function (level, conquerAttack = false, additionalWaves = 0) {
    return this.getMaxWaveCount(level, conquerAttack) + additionalWaves;
}
/**
 *
 * @param {number} userLevel
 * @returns {number}
 */
module.exports.getShadowUnitCapacity = function (userLevel) {
    const maxWaveCount = this.getMaxWaveCount(userLevel, false);
    return Math.round(maxWaveCount * 1.02 * (5 * userLevel + 15) / 10) * 10 * 2;
}
/**
 *
 * @param {AttackType} attackType
 * @returns {boolean}
 */
module.exports.isConquerAttack = function (attackType) {
    switch (attackType - 1) {
        case 0:
        case 1:
        case 2:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
            return true;
        default:
            return false;
    }
}
/**
 *
 * @param {number} defenderLevel
 * @returns {number}
 */
module.exports.getSurvivingDefenderRate = function (defenderLevel) {
    return Math.max(0.1, (-0.25 * defenderLevel * defenderLevel + 104) / 100);
}
/**
 *
 * @param {number}dungeonLevel
 * @returns {number}
 */
module.exports.getXpForAttackingDungeon = function (dungeonLevel) {
    return Math.round(Math.max(1, Math.pow(0.5 * dungeonLevel, 1.1)));
}
/**
 *
 * @param {number} amountOfKilledEnemyUnits
 * @param {number} amountOfKilledPeasants
 * @returns {number}
 */
module.exports.getXpForPlayerBattle = function (amountOfKilledEnemyUnits, amountOfKilledPeasants) {
    return Math.round(Math.max(1, 0.05 * amountOfKilledEnemyUnits + 0.005 * amountOfKilledPeasants));
}
/**
 *
 * @param {number} attackerLevel
 * @param defenderLevel
 * @returns {boolean}
 * @private
 */
isTargetLowLevelProtected = function (attackerLevel, defenderLevel) {
    if (defenderLevel <= 10) return attackerLevel > defenderLevel + 5;
    return false;
}
/**
 *
 * @param {number} attackerLevel
 * @param {number} defenderLevel
 * @param {number} defenderPlayerId
 * @returns {boolean}
 */
module.exports.isLowLevelProtectionActive = function (attackerLevel, defenderLevel, defenderPlayerId) {
    return isTargetLowLevelProtected(attackerLevel, defenderLevel) && defenderPlayerId > -1;
}
/**
 *
 * @param {number} attackerLevel
 * @returns {number}
 */
module.exports.getMinTargetLevelForFindEnemyCastle = function (attackerLevel) {
    return Math.max(5, attackerLevel - Math.max(5, Math.round(0.002 * attackerLevel * attackerLevel + 0.17 * attackerLevel + 3)) + 1);
}
/**
 *
 * @param {number} attackerLevel
 * @returns {number}
 */
module.exports.getMaxTargetLevelForFindEnemyCastle = function (attackerLevel) {
    return Math.round(attackerLevel * 1.3);
}
/**
 *
 * @param {number} defenderLevel
 * @returns {number}
 */
module.exports.getMaxUnitCountWallByLevelForVillages = function (defenderLevel) {
    if (defenderLevel >= 70) return 320;
    if (defenderLevel >= 51) return 260;
    return 200;
}
/**
 *
 * @param {number} defenderLevel
 * @param {boolean} isWall
 * @returns {number}
 */
module.exports.getWallOrGateWodIdForVillages = function (defenderLevel, isWall) {
    if (defenderLevel >= 69) {
        if (isWall) return wallWodIdsVillages[2];
        return gateWodIdsVillages[2];
    }
    if (defenderLevel >= 50) {
        if (isWall) return wallWodIdsVillages[1];
        return gateWodIdsVillages[1];
    }
    if (isWall) return wallWodIdsVillages[0];
    return gateWodIdsVillages[0];
}
/**
 *
 * @param {number} buildingBonus
 * @param {number} defenderToolsBonus
 * @param {number} defenderBaronBonus
 * @param {number} defenderSkillBonus
 * @param {number} attackerToolsBonus
 * @param {number} attackerLordBonus
 * @param {number} attackerSkillBonus
 * @returns {number}
 */
module.exports.getDefenseBonus = function (buildingBonus, defenderToolsBonus, defenderBaronBonus, defenderSkillBonus, attackerToolsBonus, attackerLordBonus, attackerSkillBonus) {
    return 1 + Math.max(0, buildingBonus + defenderToolsBonus + defenderBaronBonus + defenderSkillBonus - attackerLordBonus - attackerToolsBonus - attackerSkillBonus) / 100;
}
/**
 *
 * @param {number} defWall
 * @param {number} defGate
 * @param {number} defMoat
 * @returns {number}
 */
module.exports.getTotalDefenseBonus = function (defWall, defGate, defMoat) {
    return defWall * defGate * defMoat;
}
/**
 *
 * @param {number} moralBonus
 * @param {number} islandTitleBonus
 * @param {number} highestFameTitleBonus
 * @param {number} allianceAttackStrengthBuffBonus
 * @param {number} kingsTowerBonus
 * @returns {number}
 */
module.exports.getAttackBonus = function (moralBonus, islandTitleBonus, highestFameTitleBonus, allianceAttackStrengthBuffBonus, kingsTowerBonus) {
    return moralBonus + islandTitleBonus + highestFameTitleBonus + allianceAttackStrengthBuffBonus + kingsTowerBonus;
}
/**
 *
 * @param {number} flankFactor
 * @param {number} attackBonus
 * @param {number} attackerGemBonus
 * @param {number} attackerSkillBonus
 * @param {number} attackerLordTypeBonus
 * @param {number} attackerLordOffensiveTypeBonus
 * @param {number} attackerLordAttackBonus
 * @param {number} attackerLordYardBonus
 * @param {number} attackerSkillTypeBonus
 * @param {number} offTypeToolsBonus
 * @returns {number}
 */
module.exports.getAttackTypeSpecificBonus = function (flankFactor, attackBonus, attackerGemBonus, attackerSkillBonus, attackerLordTypeBonus, attackerLordOffensiveTypeBonus, attackerLordAttackBonus, attackerLordYardBonus, attackerSkillTypeBonus, offTypeToolsBonus) {
    return flankFactor * (attackBonus + attackerGemBonus + attackerSkillBonus + Math.max(-1, (attackerLordTypeBonus + attackerLordOffensiveTypeBonus + attackerLordAttackBonus + attackerLordYardBonus + attackerSkillTypeBonus) / 100) + offTypeToolsBonus);
}
/**
 *
 * @param {number} defFactor
 * @param {number} defMoral
 * @param {number} defenderGemBonus
 * @param {number} defenderSkillBonus
 * @param {number} defenderLordTypeBonus
 * @param {number} defenderAllianceBuff
 * @param {number} defenderLordDefenseBonus
 * @param {number} defenderLordYardBonus
 * @param {number} defenderSkillTypeBonus
 * @param {number} defTypeToolsBonus
 * @returns {number}
 */
module.exports.getDefenseTotalTypeSpecificBonus = function (defFactor, defMoral, defenderGemBonus, defenderSkillBonus, defenderLordTypeBonus, defenderAllianceBuff, defenderLordDefenseBonus, defenderLordYardBonus, defenderSkillTypeBonus, defTypeToolsBonus) {
    return defFactor * (defMoral + defenderGemBonus + defenderSkillBonus) * (1 + Math.max(-1, (defenderLordTypeBonus + defenderAllianceBuff + defenderLordDefenseBonus + defenderLordYardBonus + defenderSkillTypeBonus) / 100 + defTypeToolsBonus));
}
/**
 *
 * @param {number} attMelee
 * @param {number} attRange
 * @param {number} defMelee
 * @param {number} defRange
 * @returns {[number,number]}
 */
module.exports.getDefenseValues = function (attMelee, attRange, defMelee, defRange) {
    const attTotal = attMelee + attRange
    const meleePerc = attTotal !== 0 ? attMelee / attTotal : 0.5;
    const rangePerc = 1 - meleePerc;
    if (attMelee < defMelee * meleePerc && attRange > defRange * rangePerc) {
        defRange = Math.round((1 - attMelee / defMelee) * defRange);
        defMelee = attMelee;
    } else if (attMelee > defMelee * meleePerc && attRange < defRange * rangePerc) {
        defMelee = Math.round((1 - attRange / defRange) * defMelee);
        defRange = attRange;
    } else {
        defMelee = Math.round(defMelee * meleePerc);
        defRange = Math.round(defRange * rangePerc);
    }
    return [defMelee, defRange];
}
/**
 *
 * @param {number} defenderLevel
 * @returns {number}
 */
module.exports.getUnitSlotCountFlank = function (defenderLevel) {
    return getUnlockCountByLevel(unitSlotFlankUnlockLevels, defenderLevel);
}
/**
 *
 * @param {number} defenderLevel
 * @returns {number}
 */
module.exports.getToolSlotCountFlank = function (defenderLevel) {
    return getUnlockCountByLevel(toolSlotFlankUnlockLevels, defenderLevel);
}
/**
 *
 * @param {number} defenderLevel
 * @returns {number}
 */
module.exports.getUnitSlotCountFront = function (defenderLevel) {
    return getUnlockCountByLevel(unitSlotFrontUnlockLevels, defenderLevel);
}
/**
 *
 * @param {number} defenderLevel
 * @returns {number}
 */
module.exports.getToolSlotCountFront = function (defenderLevel) {
    return getUnlockCountByLevel(toolSlotFrontUnlockLevels, defenderLevel);
}
/**
 *
 * @param {number[]} array
 * @param {number} level
 * @returns {number}
 */
getUnlockCountByLevel = function(array, level){
    let unlockCount = 1;
    let index = array.length - 1;
    while (index >= 0) {
        if (level >= array[index]) {
            unlockCount = index + 1;
            break;
        }
        index--;
    }
    return unlockCount;
}