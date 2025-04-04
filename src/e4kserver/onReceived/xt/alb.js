module.exports.name = "alb";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{D:number, R:Object[]}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    const cud = socket.client.clientUserData;
    /*todo:
        cud.loginBonusData.setActiveDay(params.D);
        parseDays(cud, params.R);
     */
}

/**
 * @param {ClientUserDataManager} cud
 * @param {Array} days
 */
function parseDays(cud, days) {
    const daysCount = days.length;
    let i = daysCount - 1;
    const loginBonusDayRewardsArray = [...Array(daysCount).keys()].map(day => null);
    const _loc2_ = cud.loginBonusData.activeDay / daysCount;
    cud.loginBonusData.setHasCollectedAllRewardsToday(false);
    while (i >= 0) {
        /** @type {Array} */
        const dayReward = days[i][`D${i + 1}`];
        const loginBonusDayRewards = new LoginBonusDayRewardsVO();
        loginBonusDayRewards.dayIndex = i;
        loginBonusDayRewards.dayValue = _loc2_ * daysCount + (i + 1) % 8;
        loginBonusDayRewards.dailyRewards = parseSingleReward(dayReward[0]["REW"], true);
        const castleRewardsCollection = parseSingleReward(dayReward[1]["PICK"], true);
        if (castleRewardsCollection) {
            loginBonusDayRewards.pickedDailyRewardIndex = getPickedRewardIndex(castleRewardsCollection.rewards[0], loginBonusDayRewards.dailyRewards);
        } else {
            loginBonusDayRewards.pickedDailyRewardIndex = -1;
        }
        if (dayReward[2]["ALLI"]) {
            loginBonusDayRewards.allianceReward = parseSingleReward(dayReward[2]["ALLI"][0]["R"], false);
        }
        if (dayReward[3]["VIP"]) {
            loginBonusDayRewards.vipReward = parseSingleReward(dayReward[3]["VIP"][0]["R"], false);
        }
        loginBonusDayRewards.allRewardsPicked = loginBonusDayRewards.pickedDailyRewardIndex > -1 && loginBonusDayRewards.allianceReward && loginBonusDayRewards.vipReward;
        if (cud.loginBonusData.activeDay % 7 === loginBonusDayRewards.dayIndex && loginBonusDayRewards.allRewardsPicked) {
            cud.loginBonusData.setHasCollectedAllRewardsToday(true);
        }
        loginBonusDayRewardsArray[i] = loginBonusDayRewards;
        i--;
    }
    cud.loginBonusData.setRewards(loginBonusDayRewardsArray);
}

/**
 * @param {ICastleRewardVO} wantedReward
 * @param {CastleRewardsCollection} rewardCollection
 * @return {number}
 */
function getPickedRewardIndex(wantedReward, rewardCollection) {
    let i = 0;
    const size = rewardCollection.rewards.length;
    i = 0;
    while (i < size) {
        const reward = rewardCollection.rewards[i];
        if (compare(reward, wantedReward)) {
            return i;
        }
        i++;
    }
    return -1;
}

/**
 * @param {ICastleRewardVO} reward1
 * @param {ICastleRewardVO} reward2
 * @return {Boolean}
 */
function compare(reward1, reward2) {
    return reward1.type == reward2.type && reward1.wodID == reward2.wodID && reward1.amount == reward2.amount;
}

/**
 * @param {Array} rewards
 * @param {Boolean} hasAdditionalArray
 * @return {CastleRewardsCollection | null}
 */
function parseSingleReward(rewards, hasAdditionalArray) {
    if (rewards && rewards.length === 1) {
        if (hasAdditionalArray) {
            return rewardParser.parseRewards(rewards[0]);
        }
        return rewardParser.parseRewards(rewards);
    }
    return null;
}
