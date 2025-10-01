const {execute: pep} = require("./onReceived/pep");

const NAME = "lws";
/** @type {CommandCallback<any>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    parseLWS(client, params);
    require('.').baseExecuteCommand(client, undefined, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @param {number} wheelOfFortuneServerTypeId
 * @return {Promise<any>}
 */
module.exports.spinWheelOfFortune = function (client, wheelOfFortuneServerTypeId) {
    const C2SWheelOfFortuneSpinVO = {LWET: wheelOfFortuneServerTypeId};
    return require('.').baseSendCommand(client, NAME, C2SWheelOfFortuneSpinVO, callbacks, (p) => p?.LWET === wheelOfFortuneServerTypeId);
}

module.exports.lws = parseLWS;

/**
 * @param {BaseClient} client
 * @param {{LWET: number, OP: number[], OR:number[], R: [], CWC: number, WCP: number, HFS: number, HVPM: number, JSID: number, JHID: number, PMA: number}} params
 * @returns {any}
 */
function parseLWS(client, params) {
    if (!params) return;
    const serverTypeId = params.LWET;
    /* TODO: S2C_LUCKY_WHEEL_SPIN
        var properties:IWheelOfFortuneProperties = propertiesFactory.getPropertiesByServerTypeId(serverTypeId);
        wheelOfFortuneData = wheelOfFortuneService.getWheelOfFortuneData(properties.wheelOfFortuneType);
        var luckyWheelEvent:ILuckyWheelEventVO = wheelOfFortuneData.eventVO;
     */
    /** @type {BaseLuckyWheelEvent} */
    const luckyWheelEvent = client._activeSpecialEvents.find(e => e.eventId === (serverTypeId === 0 ? 15 : 89));
    luckyWheelEvent.hasFreeSpin = params.HFS === 1;
    luckyWheelEvent.hasLevelUp = !isNaN(luckyWheelEvent.currentWinClass) && luckyWheelEvent.currentWinClass !== params.CWC;
    luckyWheelEvent.currentWinClass = params.CWC;
    luckyWheelEvent.winClassProgress = params.WCP;
    luckyWheelEvent.isProMode = params.PMA === 1;
    luckyWheelEvent.nextJackpotSetId = params.JSID;
    luckyWheelEvent.hasVisitedProMode = !params.HVPM;
    luckyWheelEvent.nextJackpotSpinJackpotSet = params.JHID;
    if (params.hasOwnProperty("WC")) {
        luckyWheelEvent.winningCategory = params.WC;
        // TODO: localStorageModel.setValue(properties.getLocalStorageKeyById(2), String(luckyWheelEvent.winningCategory));
    }
    // TODO: resetRewardItem(properties);
    const rewards = params["R"];
    if (rewards && rewards.length > 0) {
        /* TODO: S2C_LUCKY_WHEEL_SPIN
            loc4_ = RewardJSONParser.ungroupRewardsFromServer(rewards);
            if ((_loc7_ = rewardParser.parseRewards(_loc4_).rewards).length > 0) {
                wheelOfFortuneData.rewardedItem = _loc7_[0];
                _loc3_ = properties.getLocalStorageKeyById(1);
                localStorageHelper.saveObjectToLocalStorage(rewards, _loc3_);
            }
        */
        console.log("Rewards:", rewards)
    }
    if (params.OP != null && params.OR != null) {
        pep(client, 0, {"OP": params.OP, "OR": params.OR, "EID": luckyWheelEvent.eventId});
    }
}

/** @param {IWheelOfFortuneProperties} wofProperties */
function resetRewardItem(wofProperties) {
    /* TODO:
        var _loc3_ = wofProperties.getLocalStorageKeyById(0);
        var _loc2_ = wofProperties.getLocalStorageKeyById(1);
        if (localStorageModel.getValue(_loc3_))
        {
            localStorageModel.removeValue(_loc3_);
            wheelOfFortuneData.rewardedItem = null;
            localStorageHelper.saveObjectToLocalStorage(null,_loc2_);
        }
     */
}