module.exports.START_XP = 0;
module.exports.START_C1 = 100;
module.exports.START_C2 = 0;
module.exports.START_WOOD = 200;
module.exports.START_STONE = 100;
module.exports.START_FOOD = 0;
module.exports.START_HONOR = 0;
module.exports.START_ACHIEVEMENTPOINTS = 0;
module.exports.MAX_LOGIN_FAILS = 59;
module.exports.MAX_LOGIN_FAIL_RESETTIME = 1800;
module.exports.CASTLE_NAME_MIN_LENGTH = 3;
module.exports.CASTLE_NAME_MAX_LENGTH = 15;
module.exports.OPEN_GATE_COUNT_CAP = 9;
module.exports.PEACE_MODE_HEAT_UP = 86400;
module.exports.PEACE_MODE_HEAT_UP_TEST = 600;
module.exports.PEACE_MODE_COOLDOWN = 172800;
module.exports.WELCOME_GIFT_ID = 0;
module.exports.MAIL_CONFIRMED_ID = 1;
module.exports.CHANGE_CASTLE_NAME_C2 = 2500;
module.exports.NEWSLETTER_CONFIRM_ID = 1;
module.exports.DAILY_FAME_LOSS = 2;
module.exports.MERCENARY_EVENT_MIN_LEVEL = 6;
module.exports.START_LEVEL = 1;
module.exports.LEVEL_CAP = 70;
module.exports.LEVEL_CAP_XP = 147000;
module.exports.START_LEGEND_LEVEL = 1;
module.exports.LEGEND_LEVEL_CAP = 950;
module.exports.COMBINED_LEVEL_CAP = 1020;
module.exports.CUMULATED_LEVEL_CAP = 1020;
module.exports.PREMIUM_FLAG_COST_C2 = 4900;
module.exports.MIN_LEVEL_FOR_RECRUITMENT = 2;
module.exports.MIN_LEVEL_FOR_MESSAGES = 2;
module.exports.MIN_LEVEL_FOR_ACTIVITY_CHEST = 2;
module.exports.LEVEL_FOR_CASTLE_NAME = 3;
module.exports.MIN_LEVEL_FOR_MAP = 3;
module.exports.MIN_LEVEL_FOR_MAIL_POPUP = 3;
module.exports.LEVEL_FOR_FACEBOOK_MESSAGE = 3;
module.exports.MIN_LEVEL_FOR_EXPANSION_TREASURE = 6;
module.exports.MIN_LEVEL_FOR_DAILY_REWARD = 6;
module.exports.DAILY_VIP_POINTS_LOSS = 5;
module.exports.BOOKMARKS_MAX_ENTRYS = 50;
module.exports.PLAYER_MAX_FRIEND_CONNECTIONS = 100;
module.exports.LOGIN_BONUS_REQUIRED_XP = 1200;
module.exports.LOGIN_BONUS_KEYS = 3;
module.exports.DAYS_BEFORE_FINAL_DELETION = 120;
module.exports.MIN_LEVEL_FOR_INVITE_TEASER = 12;
module.exports.DEFAULT_MAIL = "-1";
module.exports.RESEND_MAIL_ACCOUNT_VERIFICATION = 0;
module.exports.MAIL_CHANGE_NO_PENDING_STATE = 0;
module.exports.MAIL_CHANGE_STARTED = 1;
module.exports.MAIL_CHANGE_FIRST_EXPIRATION_TIME_STATE = 2;
module.exports.MAIL_CHANGE_SECOND_EXPIRATION_TIME_STATE = 3;
module.exports.MAIL_CHANGE_CANCEL_STARTED = 4;
module.exports.PLAYER_NAME_CHANGE_COOLDOWN = 43200;
module.exports.NAME_PREFIX = ["strong", "fast", "ultimate", "new", "mighty", "righteous", "amazing", "super", "great", "powerfully", "epic", "legendary", "fabulous", "gorgeous", "wise", "favoured", "heavy", "brave", "famous", "dark", "noble"];
module.exports.NAME_MIDDLE = ["boss", "lord", "king", "manager", "star", "pro", "guru", "gold", "diamond"];
module.exports.NAME_SUFFIX = ["player", "user", "gamer", "adventurer", "hero", "champion", "ruler", "swayer", "ruler", "warrior", "fighter", "berserk", "nobleman"];
module.exports.OPEN_GATE_C2 = [450, 700];
module.exports.OPEN_GATE_DURATION = [21600, 43200];
module.exports.PEACE_MODE_C2 = [5000, 7500, 10000, 20000];
module.exports.PEACE_MODE_DURATION = [604800, 1209600, 1814400, 5184000];
module.exports.MAIL_CONFIRM_C2 = [500, 10000, 30000, 60000, 90000];
module.exports.LOGIN_LP_INCENTIVES_C1 = [0, 6000, 0, 2000, 0, 1500, 0, 1000, 0, 1500, 0, 3000, 0, 5000];
module.exports.LOGIN_LP_INCENTIVES_C2 = [150, 0, 50, 0, 37, 0, 26, 0, 37, 0, 75, 0, 125, 0];
module.exports.LEGEND_MAX_XP = getXPFromLegendLevel(950);
module.exports.LOGIN_BONUS_KEY_PRICES = [[30, 40, 45, 55, 104, 150], [60, 70, 90, 99, 187, 275], [75, 90, 110, 130, 256, 375], [100, 115, 140, 183, 280, 540], [135, 160, 200, 240, 457, 675], [180, 220, 260, 317, 580, 950]];
module.exports.SAVE_ACCOUNT_LEVEL_CATEGORY = [6, 7, 9, 11, 13, 15];

/** @param {number} xp */
module.exports.getLevelFromXP = function (xp) {
    return Math.min(70, Math.floor(Math.sqrt(xp / 30)));
}
/** @param {number} level */
module.exports.getXPFromLevel = function (level) {
    return Math.min(147000, level * level * 30);
}
/** @param {number} xp */
module.exports.getLegendLevelFromXP = function (xp) {
    const legendXp = xp - 147000;
    if (legendXp >= 0) {
        const legendLevel = Math.max(1, Math.floor(Math.pow((legendXp + 2750) / 3000, 0.8403361344537815)));
        return Math.min(950, legendLevel);
    }
    return 0;
}

/** @param {number} legendLevel */
function getXPFromLegendLevel(legendLevel) {
    if (legendLevel < 1) return 0;
    return Math.ceil(3000 * Math.pow(Math.min(950, legendLevel), 1.19)) - 2750 + 147000;
}

module.exports.getXPFromLegendLevel = getXPFromLegendLevel;
/** @param {number} combinedLevel */
module.exports.getXPFromCombinedLevel = function (combinedLevel) {
    if (combinedLevel <= 70) return module.exports.getXPFromLevel(combinedLevel);
    return module.exports.getXPFromLegendLevel(combinedLevel - 70);
}
/**
 * @param {number} attackerLevel
 * @param {number} defenderLevel
 */
module.exports.getAttackCooldown = function (attackerLevel, defenderLevel) {
    return Math.min(47, Math.max(3, Math.floor(3 * (0.65 * attackerLevel - defenderLevel)))) * 60 * 60;
}
/**
 * @param {number} durationId
 * @param {number} timeOfUsage
 */
module.exports.getOpenGateCosts = function (durationId, timeOfUsage) {
    const usagePremium = Math.min(9, timeOfUsage);
    return Math.round(module.exports.OPEN_GATE_C2[durationId] * Math.pow(usagePremium, 1.1 + usagePremium / 10) / 10) * 10;
}
/** @param {number} playerLevel */
module.exports.getLoginBonusLevelCategory = function (playerLevel) {
    if (playerLevel < 15) return 0;
    if (playerLevel < 21) return 1;
    if (playerLevel < 27) return 2;
    if (playerLevel < 38) return 3;
    if (playerLevel < 51) return 4;
    return 5;
}
/** @param {number} playerLevel */
module.exports.getLoginBonusLevelCategoryNew = function (playerLevel) {
    if (playerLevel < 24) return 0;
    if (playerLevel < 40) return 1;
    if (playerLevel < 50) return 2;
    if (playerLevel < 60) return 3;
    if (playerLevel < 69) return 4;
    return 5;
}
/**
 * @param {number} playerLevel
 * @param {number} alreadyBoughtKeysCount
 */
module.exports.getLoginBonusKeyCost = function (playerLevel, alreadyBoughtKeysCount) {
    const levelCategory = module.exports.getLoginBonusLevelCategory(playerLevel);
    return module.exports.LOGIN_BONUS_KEY_PRICES[levelCategory][alreadyBoughtKeysCount];
}
/**
 * @param {number} oldLevel
 * @param {number} newLevel
 * @param {number} levelToReach
 */
module.exports.justReachedLevel = function (oldLevel, newLevel, levelToReach) {
    return newLevel >= levelToReach && oldLevel < levelToReach;
}
/** @param {number} attackerPID */
module.exports.isHumanPlayerOrAlien = function (attackerPID) {
    return module.exports.isHumanPlayer(attackerPID) || module.exports.isAlien(attackerPID);
}
/** @param {number} playerId */
module.exports.isHumanPlayer = function (playerId) {
    return playerId > -1;
}
/** @param {number} playerId */
module.exports.isAlien = function (playerId) {
    return playerId === -1000 || playerId === -1002 || playerId === -1001;
}
/** @param {number} playerLevel */
module.exports.isLegendaryPlayer = function (playerLevel) {
    return playerLevel >= 70;
}
/** @param {number} playerLevel */
module.exports.isGodlikePlayer = function (playerLevel) {
    return playerLevel >= 950;
}
/** @param {number} playerId */
module.exports.isNPC = function (playerId) {
    return !module.exports.isHumanPlayer(playerId);
}