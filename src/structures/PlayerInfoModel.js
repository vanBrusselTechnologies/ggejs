const PlayerInfoModel = {
    get pingDashed() {
        return [this.pingVO.g, this.pingVO.n, this.pingVO.i, this.pingVO.p].join('-');
    },
    get pingVO() {
        //return new PingVO(this.playerId, this.instanceModel.selectedInstanceVO.instanceId, 72/*this.baseGlobals.networkId*/, 16/*this.baseGlobals.gameId*/);
    },
    /**@private*/
    _playerId: -1,
    set playerId(val) {
        this._playerId = val;
        /*
        if(_playerID != -1)
        {
           playerIdDefinedSignal.dispatch();
        }
        */
    },
    get playerId() {
        return this._playerId;
    },
    userId: -1,
    userName: "",
    email: "",
    pendingEmailChange: "",
    registrationEmailVerified: false,
    userLevel: -1,
    isAccountSaved: false,
    wasEverChangedName: false,
    wasResetted: false,
    isPayUser: false,
    paymentDoublerCount: 0,
    hasPaymentDoubler() {
        return this.paymentDoublerCount > 0;
    },
    isCheater: false,
    sernameMinimumLength: 1,
    registrationTimestamp: 0,
    hasConfirmedTOC: false,
    hasNewsletterSubscription: false,
    canGetNewsletterReward: false
}

module.exports = PlayerInfoModel;