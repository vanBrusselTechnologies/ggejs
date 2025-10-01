const BASIC_FIELD_TRAVEL_TIME = 600;
const GUESS_SIZE_PRECISION = 3;
const DEFAULT_SIGHT_RADIUS = 6;
const INNER_CIRCLE_DIVISOR = 2;
const TRAVEL_PREMIUM_COMMANDER_COSTS_C2 = 125;
const KINGDOM_TOOL_TRAVEL_COST_C1 = 100;
const TRAVEL_BOOST_TUTORIAL = 80;
const MAX_FALLBACK_TIME = 600;
const BARON_SPEED = 2;
const CAPITAL_CONQUER_SPEED = 5;
const CAPITAL_CONQUER_MIN_ATTACK_DISTANCE = 6;
const CAPITAL_CONQUER_MAX_ATTACK_DISTANCE = 144;
const CAPITAL_CONQUER_MIN_BIG_SIGHT_RADIUS = 30;
const METROPOL_CONQUER_SPEED = 5;
const METROPOL_CONQUER_MIN_ATTACK_DISTANCE = 6;
const METROPOL_CONQUER_MAX_ATTACK_DISTANCE = 144;
const METROPOL_CONQUER_MIN_BIG_SIGHT_RADIUS = 30;
const DEFENSE_SUPPORT_DURATION_HOURS_MAX = 99;
const DEFENSE_SUPPORT_DURATION_HOURS_FREE = 12;
const DEFENSE_SUPPORT_DURATION_HOURS_FREE_OCCUPIED = 24;
const DEFENSE_SUPPORT_DURATION_HOURS_FREE_CAPITAL_METROPOL = 72;
const DEFENSE_SUPPORT_DURATION_HOURLY_C2_COST = 275;
const MAX_SLOWDOWN_DURATION_IN_SECONDS = 43200;
const SLOWDOWN_C2_COSTS = 200;
const TRAVEL_BOOST_CHEAT = 5;
const HORSE_BOOST_FIELDS = 10;
const LOW_DISTANCE_BOOST_FIELDS = 100;
const ALIEN_TRAVEL_DISTANCE = 50;
const NOMAD_TRAVEL_DISTANCE = 2;
const SAMURAI_TRAVEL_DISTANCE = 2;
const FACTION_TRAVEL_DISTANCE = 5;
const ALLIANCE_INVASION_CAMP_TRAVEL_DISTANCE = 2;
const COLLECTOR_TRAVEL_DISTANCE = 50;
const TEMPSERVER_RANKSWAP_TRAVEL_DISTANCE = 25.2;
const DAIMYO_CASTLE_TRAVEL_DISTANCE = 2;
const DAIMYO_TOWNSHIP_TRAVEL_DISTANCE = 2;
const DAIMYO_TAUNT_TRAVEL_DISTANCE = 2;
const ALLIANCE_BATTLE_GROUND_RESOURCE_TOWER_DISTANCE = 10;
const ALLIANCE_BATTLE_GROUND_TOWER_DISTANCE = 25;
const WOLFKING_TRAVEL_DISTANCE = 1;
const WOLFKING_TAUNT_TRAVEL_DISTANCE = 0.5;
const PLAGUE_TRAVEL_TIME = 600;
const MAX_TOOL_SLOTS = 9;
const MAX_TOOLS_PER_SLOT = 99999;
const TESTSERVER_DEFENSE_WAIT_DIVISOR = 4;
const MAX_KINGDOM_GOODS_MOVEMENTS = 1;
const MAX_KINGDOM_ARMY_MOVEMENTS = 1;
const COMMANDER_PREMIUM = -14;
const COMMANDER_DUNGEON = -15;
const WOLFKING_COMMANDER = -213;
const COMMANDER_BOSS_DUNGEON = -45;
const COMMANDER_TREASURE = -12;
const MAX_LEVEL_FOR_LOW_LEVEL_TRAVEL_BOOST = 25;

/**
 * @param {boolean} isTravelCheater
 * @return {number}
 */
module.exports.getPlagueTravelTime = function (isTravelCheater) {
    return getSpecialTravelTime(isTravelCheater, 600);
}

/**
 * @param {boolean} isTravelCheater
 * @param {number} time
 * @return {number}
 */
function getSpecialTravelTime(isTravelCheater, time) {
    if (isTravelCheater) return TRAVEL_BOOST_CHEAT;
    return time;
}

/**
 * @param {number} armySize
 * @return {number}
 */
module.exports.getArmySightRadius = function (armySize) {
    return Math.max(0.6 * Math.pow(armySize, 0.4), DEFAULT_SIGHT_RADIUS);
}

/**
 * @param {number} durationHours
 * @param {boolean} isOccupied
 * @param {boolean} isCapital
 * @param {boolean} isMetropol
 * @return {number}
 */
module.exports.getSupportDurationCostC2 = function (durationHours, isOccupied, isCapital, isMetropol) {
    const freeHours = isCapital || isMetropol ? DEFENSE_SUPPORT_DURATION_HOURS_FREE_CAPITAL_METROPOL : isOccupied ? DEFENSE_SUPPORT_DURATION_HOURS_FREE_OCCUPIED : DEFENSE_SUPPORT_DURATION_HOURS_FREE;
    return Math.max(0, (durationHours - freeHours) * DEFENSE_SUPPORT_DURATION_HOURLY_C2_COST);
}

/**
 * @param {number} distance
 * @param {number} amountOfUnitsAndTools
 * @param {number} travelCostReduction
 * @param {number} travelCostSkillReduction
 * @return {number}
 */
module.exports.getTravelCostC1 = function (distance, amountOfUnitsAndTools, travelCostReduction, travelCostSkillReduction) {
    const _loc5_ = (100 - travelCostReduction) * (100 - travelCostSkillReduction) / 10000;
    return Math.max(0, Math.ceil(0.6 * _loc5_ * (amountOfUnitsAndTools * Math.log(distance + 1) / Math.log(2.3))));
}

/**
 * @param {number} distance
 * @param {number} amountOfUnitsAndTools
 * @param {number} travelCostReduction
 * @param {number} travelCostSkillReduction
 * @param {number} attackCount
 * @param {number} attackCountThreshold
 * @param {number} attackCountGrowthrate
 * @return {number}
 */
module.exports.getAttackTravelCostC1 = function (distance, amountOfUnitsAndTools, travelCostReduction, travelCostSkillReduction, attackCount, attackCountThreshold, attackCountGrowthrate) {
    const travelCostC1 = module.exports.getTravelCostC1(distance, amountOfUnitsAndTools, travelCostReduction, travelCostSkillReduction);
    if (attackCount <= attackCountThreshold) return travelCostC1;
    return Math.min(Math.exp(attackCountGrowthrate * (attackCount - attackCountThreshold)) * travelCostC1, 2147483647);
}

/**
 * @param {number} distance
 * @param {number} amountOfUnitsAndTools
 * @param {number} travelCostEQReduction
 * @param {number} travelCostSkillReduction
 * @return {number}
 */
module.exports.getRedeployTravelCostC1 = function (distance, amountOfUnitsAndTools, travelCostEQReduction, travelCostSkillReduction) {
    return module.exports.getTravelCostC1(distance, amountOfUnitsAndTools, travelCostEQReduction, travelCostSkillReduction) / 2;
}

/**
 * @param {number} distance
 * @return {number}
 */
module.exports.getTravelBoostCostC2 = function (distance) {
    return Math.ceil(Math.pow(distance, 0.5) * 179);
}

/**
 * @param {number} travelSpeed
 * @param {number} distance
 * @param {number} boost
 * @param {number} boostEQ
 * @param {boolean} isTravelCheater
 * @return {number}
 */
module.exports.getTravelTime = function (travelSpeed, distance, boost, boostEQ, isTravelCheater) {
    return Math.floor(module.exports.getTravelTimeAsFloat(travelSpeed, distance, boost, boostEQ, isTravelCheater));
}

/**
 * @param {number} travelSpeed
 * @param {number} distance
 * @param {number} boost
 * @param {number} boostEQ
 * @param {number} titleBoost
 * @param {boolean} isTravelCheater
 * @return {number}
 */
module.exports.getTravelTimeWithTitle = function (travelSpeed, distance, boost, boostEQ, titleBoost, isTravelCheater) {
    return Math.floor(module.exports.getTravelTimeAsFloat(travelSpeed, distance, boost, boostEQ + titleBoost, isTravelCheater));
}

/**
 * @param {number} travelSpeed
 * @param {number} boost
 * @param {number} boostEQ
 * @return {number}
 */
function getBoostedUnitSpeed(travelSpeed, boost, boostEQ) {
    const eqBoost = boostEQ / 100;
    return travelSpeed / 10 / BASIC_FIELD_TRAVEL_TIME * (boost + eqBoost);
}

/**
 * @param {number} travelSpeed
 * @param {number} distance
 * @param {number} boost
 * @param {number} boostEQ
 * @param {boolean} isTravelCheater
 * @return {number}
 */
module.exports.getTravelTimeAsFloat = function (travelSpeed, distance, boost, boostEQ, isTravelCheater) {
    if (isTravelCheater) return TRAVEL_BOOST_CHEAT;
    return distance / getBoostedUnitSpeed(travelSpeed, boost, boostEQ);
}

/**
 * @param {number} distance
 * @param {number} unitCount
 * @param {number} costFactorC1
 * @return {number}
 */
module.exports.getHorseCostC1 = function (distance, unitCount, costFactorC1) {
    return costFactorC1 * Math.ceil(0.2 * (unitCount * Math.log(distance + 1) / Math.log(2.3)));
}

/**
 * @param {number} distance
 * @param {number} unitCount
 * @param {number} costFactorC2
 * @return {number}
 */
module.exports.getHorseCostC2 = function (distance, unitCount, costFactorC2) {
    const _loc4_ = Math.floor(1.5 * (-25 * Math.sqrt(distance + 60) * Math.pow(1.5, -0.0002 * Math.pow(distance + 60, 2)) + 145) * (1 + unitCount / 1100));
    return Math.round(Math.max(1, _loc4_) * costFactorC2);
}

/**
 * @param {number} unitSpeed
 * @param {number} distance
 * @param {number} boostFactor
 * @param {number} horseBoost
 * @param {number} percentageBoost
 * @param {number} totalDistance
 * @param {boolean} isTravelCheater
 * @return {number}
 */
module.exports.getTravelTimeWithHorseAndWithoutLowLevelBoost = function (unitSpeed, distance, boostFactor, horseBoost, percentageBoost, totalDistance, isTravelCheater) {
    return module.exports.getTravelTimeWithHorse(unitSpeed, distance, boostFactor, horseBoost, percentageBoost, totalDistance, isTravelCheater);
}

/**
 * @param {number} unitSpeed
 * @param {number} distance
 * @param {number} boostFactor
 * @param {number} horseBoost
 * @param {number} percentageBoost
 * @param {number} totalDistance
 * @param {boolean} isTravelCheater
 * @return {number}
 */
module.exports.getTravelTimeWithHorse = function (unitSpeed, distance, boostFactor, horseBoost, percentageBoost, totalDistance, isTravelCheater) {
    if (isTravelCheater) return TRAVEL_BOOST_CHEAT;
    let horseUnitBoost = NaN;
    const boostedUnitSpeed = getBoostedUnitSpeed(unitSpeed, boostFactor, percentageBoost)
    if (distance < 100) {
        horseUnitBoost = 1 + horseBoost / 100 / 10 * 60 * (Math.log(totalDistance / 2 + 1) / Math.log(8));
    } else if (horseBoost > 0) {
        horseUnitBoost = 1 + horseBoost / 100 / 10 * (totalDistance - 10);
        distance -= 10;
    } else {
        horseUnitBoost = 1 + horseBoost / 100 / 10 * totalDistance;
    }
    const horseBoostedUnitSpeed = boostedUnitSpeed * horseUnitBoost;
    return Math.floor(distance / horseBoostedUnitSpeed);
}

/**
 * @param {number} distance
 * @return {number}
 */
module.exports.getInstantSpyHorseTravelTime = function (distance) {
    return Math.floor(Math.log(distance) / Math.log(10) + 1);
}

/**
 * @param {number} unitSpeed
 * @param {number} distance
 * @param {number} boostFactor
 * @param {number} horseBoost
 * @param {number} boostEQ
 * @param {number} totalDistance
 * @param {number} titleBoost
 * @param {number} skillBoost
 * @param {boolean} isTravelCheater
 * @param {number} lowLevelBoost
 * @return {number}
 */
module.exports.getTravelTimeWithTitleAndHorse = function (unitSpeed, distance, boostFactor, horseBoost, boostEQ, totalDistance, titleBoost, skillBoost, isTravelCheater, lowLevelBoost) {
    return module.exports.getTravelTimeWithHorse(unitSpeed, distance, boostFactor + lowLevelBoost, horseBoost, boostEQ + titleBoost + skillBoost, totalDistance, isTravelCheater);
}


/**
 * @param {number} radius
 * @param {number} circleX
 * @param {number} circleY
 * @param {number} startX
 * @param {number} startY
 * @param {number} endX
 * @param {number} endY
 * @return {number}
 */
module.exports.calculateSightDistance = function (radius, circleX, circleY, startX, startY, endX, endY) {
    const diffX = endX - startX;
    const diffY = endY - startY;
    if (diffX === 0 && diffY === 0) return NaN;
    const toCircleX = startX - circleX;
    const toCircleY = startY - circleY;
    const squaredDistance = diffX * diffX + diffY * diffY;
    const b = (2 * diffX * toCircleX + 2 * diffY * toCircleY) / squaredDistance;
    const c = (toCircleX * toCircleX + toCircleY * toCircleY - radius * radius) / squaredDistance;
    const discriminant = b * b / 4 - c;
    if (discriminant < 0) return NaN;
    const t1 = -b / 2 - Math.sqrt(discriminant);
    const t2 = -b / 2 + Math.sqrt(discriminant);
    if (t1 < 0 && t2 < 0) return NaN;
    if (t1 > 1 && t2 > 1) return NaN;
    const t = Math.max(0, Math.min(t1, t2));
    return t * Math.sqrt(squaredDistance);
}

/**
 * @param {number} playerLevel
 * @param {boolean} isGlobalServer
 * @return {number}
 */
module.exports.calculateLowLevelBoost = function (playerLevel, isGlobalServer) {
    if (isGlobalServer || playerLevel >= MAX_LEVEL_FOR_LOW_LEVEL_TRAVEL_BOOST) return 0;
    return Math.max(0, -0.1667 * playerLevel + 4.167);
}