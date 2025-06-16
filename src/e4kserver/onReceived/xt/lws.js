const {execute: pep} = require('./pep');

module.exports.name = "lws";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{LWET: number, OP: number[], OR:number[], R: [], CWC: number, WCP: number, HFS: number, HVPM: number, JSID: number, JHID: number, PMA: number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    const serverTypeId = params.LWET;
    /* TODO: S2C_LUCKY_WHEEL_SPIN
        var properties:IWheelOfFortuneProperties = propertiesFactory.getPropertiesByServerTypeId(serverTypeId);
        wheelOfFortuneData = wheelOfFortuneService.getWheelOfFortuneData(properties.wheelOfFortuneType);
        var luckyWheelEvent:ILuckyWheelEventVO = wheelOfFortuneData.eventVO;
     */
    /** @type {BaseLuckyWheelEvent} */
    const luckyWheelEvent = client._socket["activeSpecialEvents"].find(e => e.eventId === (serverTypeId === 0 ? 15 : 89));
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
        //todo: localStorageModel.setValue(properties.getLocalStorageKeyById(2), String(luckyWheelEvent.winningCategory));
    }
    //todo: resetRewardItem(properties);
    const _loc5_ = params["R"];
    if (_loc5_ && _loc5_.length > 0) {
        /* TODO: S2C_LUCKY_WHEEL_SPIN
            loc4_ = RewardJSONParser.ungroupRewardsFromServer(_loc5_);
            if ((_loc7_ = rewardParser.parseRewards(_loc4_).rewards).length > 0) {
                wheelOfFortuneData.rewardedItem = _loc7_[0];
                _loc3_ = properties.getLocalStorageKeyById(1);
                localStorageHelper.saveObjectToLocalStorage(_loc5_, _loc3_);
            }
        */
    }
    if (params.OP && params.OR) {
        pep(client, 0, {
            "OP": params.OP, "OR": params.OR, "EID": serverTypeId === 0 ? 15 : 89//TODO: properties.eventId});
        })
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