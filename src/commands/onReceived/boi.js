const {execute: bfs} = require('./bfs');
const {execute: deleteMessages} = require("../commands/deleteMessages");

module.exports.name = "boi";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{BO:[], PB:[], SB:[], SU: Object, ST: Object, bfs: {T:number, RT:number}}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    const premiumBoostData = client.clientUserData.boostData;
    removeBoosterExpiredMails(client, premiumBoostData, params.BO);
    parseTempBoosterObjects(premiumBoostData, params.BO);
    parsePermBoosterObjects(premiumBoostData, params.PB);
    if (params.SB) premiumBoostData.boughtBuildingSlots = params.SB.filter(s => s > 0).length;
    if (params.SU) premiumBoostData.boughtUnitSlots = params.SU.filter(s => s > 0).length;
    if (params.ST) premiumBoostData.boughtToolSlots = params.ST.filter(s => s > 0).length;
    bfs(client, errorCode, params.bfs);
}

/**
 * @param {Client} client
 * @param {PremiumBoostData} premiumBoostData
 * @param {{PC:number, ID: number, RT: number}[]} tempBoosterObjects
 */
function removeBoosterExpiredMails(client, premiumBoostData, tempBoosterObjects) {
    if (!tempBoosterObjects) return;
    /** @type {number[]} */
    const boosterIds = [];
    for (const tempBoosterObject of tempBoosterObjects) {
        let booster = premiumBoostData.getBoosterById(tempBoosterObject.ID);
        if (booster !== undefined && booster.remainingTimeInSeconds <= 86400 && tempBoosterObject.RT > 86400) boosterIds.push(booster.id);
    }
    if (boosterIds.length > 0) {
        const messagesIds = client._mailMessages.filter(m => boosterIds.includes(m.boosterId)).map(m => m.messageId);
        if (messagesIds.length > 0) deleteMessages(client, messagesIds);
    }
}

/**
 * @param {PremiumBoostData} premiumBoostData
 * @param {{ID: number, B: number, L:number}[]} permBoosterObjects
 */
function parsePermBoosterObjects(premiumBoostData, permBoosterObjects) {
    if (!permBoosterObjects) return;
    for (const permBoosterObject of permBoosterObjects) {
        const booster = premiumBoostData.getBoosterById(permBoosterObject.ID);
        if (booster !== undefined) parseSingleBoost(premiumBoostData, booster, permBoosterObject, true);
    }
}

/**
 * @param {PremiumBoostData} premiumBoostData
 * @param {{PC:number, ID: number, RT: number}[]} tempBoosterObjects
 */
function parseTempBoosterObjects(premiumBoostData, tempBoosterObjects) {
    if (!tempBoosterObjects) return;
    for (const tempBoosterObject of tempBoosterObjects) {
        const booster = premiumBoostData.getBoosterById(tempBoosterObject.ID);
        if (booster !== undefined) parseSingleBoost(premiumBoostData, booster, tempBoosterObject);
    }
}

/**
 * @param {PremiumBoostData} premiumBoostData
 * @param {HeroBoosterShop} booster
 * @param {{PC?:number, ID: number, RT?: number, B?:number, L?:number}} data
 * @param {boolean} permanent
 */
function parseSingleBoost(premiumBoostData, booster, data, permanent = false) {
    const wasActive = booster.isActive;
    if (!permanent) {
        booster.parseDuration(data.RT);
        booster.continuousPurchaseCount = data.PC;
    }
    if (data.B) booster.bonusValue = data.B;
    if (data.L) booster.level = data.L;
    if (wasActive && !booster.isActive) {
        premiumBoostData.removeActiveBooster(booster);
    } else if (!wasActive && booster.isActive) {
        premiumBoostData.addActiveBooster(booster);
    }
}