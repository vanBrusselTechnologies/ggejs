const {execute: mercenaryPackage} = require('../../commands/mercenaryPackage');
const {ConnectionStatus} = require("../../../utils/Constants");

module.exports.name = "mpe";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{NM:number, M:{D:number, RD:number, P:number, Q:number, S:number, R:[], ID: number}[]}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params?.M) return;
    if (params.M.length === 0) return refreshMissions(socket, params.NM + 5);

    /** @type {{missionId: number, duration: number, remainingDuration: number, price: number, quality: number, state: number, rewards: [], rewardsChanged: boolean}[]} */
    const mercenaryCampMissions = params.M.map(m => {
        return /* MercenariesCampMissionItemVO */{
            missionId: m.ID,
            duration: m.D,
            remainingDuration: m.RD,
            price: m.P,
            quality: m.Q,
            state: m.S,
            rewards: m.R,
            rewardsChanged: true,
        }
    });

    /** @type {{missionId: number, duration: number, remainingDuration: number, price: number, quality: number, state: number, rewards: [], rewardsChanged: boolean}} */
    const currentMission = mercenaryCampMissions.find(m => m.state === 1 || m.state === 2);
    if (currentMission) {
        switch (currentMission.state) {
            case 1:
                return refreshMissions(socket, currentMission.remainingDuration + 5);
            case 2:
                return mercenaryPackage(socket, currentMission.missionId);
            default:
                break;
        }
    }

    /** @type {{missionId: number, duration: number, remainingDuration: number, price: number, quality: number, state: number, rewards: [], rewardsChanged: boolean}[]} */
    const sortedMissions = mercenaryCampMissions.filter(m => m.state === 0).sort((a, b) => a.price - b.price);
    if (sortedMissions.length === 0) return refreshMissions(socket, params.NM + 5);
    /** @type {{missionId: number, duration: number, remainingDuration: number, price: number, quality: number, state: number, rewards: [], rewardsChanged: boolean}} */
    const cheapestMission = sortedMissions[0];
    const currentCoins = socket.client.clientUserData.globalCurrencies.find(g => g.item === "currency1")?.count ?? 0;
    if (cheapestMission.price <= currentCoins) {
        mercenaryPackage(socket, cheapestMission.missionId);
        refreshMissions(socket, cheapestMission.duration + 5);
        return;
    }
    // Coin shortage => Retry after a minute
    return refreshMissions(socket, 60);
}

function refreshMissions(socket, seconds) {
    if (socket["inMpeTimeout"]) return;
    socket["inMpeTimeout"] = true;
    setTimeout(() => {
        socket["inMpeTimeout"] = false;
        if (socket.client.socketManager.connectionStatus !== ConnectionStatus.Connected) return;
        mercenaryPackage(socket, -1);
    }, seconds * 1000);
}