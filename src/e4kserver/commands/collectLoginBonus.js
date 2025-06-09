module.exports.name = "clb";
/**
 * @param {Socket} socket
 * @param {{rewards: [{dailyRewards:{rewards:[]}}], activeDay: number}} loginBonusData
 * @param {number} dailyRewardIndex
 * @param {"ALLI" | "VIP" | ""} specialRewardType
 */
module.exports.execute = function (socket, loginBonusData, dailyRewardIndex = -1, specialRewardType = "") {
    const C2SCatchLoginBonusVO = {I: null, ID: -1, SP: null};
    if (dailyRewardIndex !== -1) {
        let id = -1;
        const reward = loginBonusData.rewards[loginBonusData.activeDay % 7].dailyRewards.rewards[dailyRewardIndex];
        if (reward.type === GameAssetEnumerator.UNIT) {
            id = reward.wodID;
        }
        C2SCatchLoginBonusVO.I = reward.type.serverName;
        C2SCatchLoginBonusVO.ID = id;
    } else if (specialRewardType !== "") {
        if (specialRewardType === "ALLI" && socket.client.clientUserData.allianceId === -1) return;
        if (specialRewardType === "VIP" && !socket.client.clientUserData.isVipActive) return;
        C2SCatchLoginBonusVO.SP = specialRewardType;
    }
    socket.client.socketManager.sendCommand("clb", C2SCatchLoginBonusVO);
}