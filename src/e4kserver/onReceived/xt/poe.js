module.exports = {
    name: "poe",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if(!params) return;
        console.log("POE parser code isn't finished: \n" + JSON.stringify(params))
        let _loc3_ = new PrimeTimeVO();
        _loc3_.type = params.type;
        _loc3_.premiumBonus = params.bonusPremium;
        _loc3_.standardBonus = params.bonusStandard;
        _loc3_.remainingTime = new TimeSpan();
        _loc3_.remainingTime.timeSec = params.remainingTime;
        _loc3_.isTimeless = params.isTimeless;
        if(_loc3_.remainingTime.time <= 0)
            primeTimeData.activePrimeTime = null;
        else
            primeTimeData.activePrimeTime = _loc3_;
    }
}