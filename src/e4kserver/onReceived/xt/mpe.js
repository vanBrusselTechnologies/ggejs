const {execute: mercenaryPackage} = require('../../commands/mercenaryPackage');

module.exports.name = "mpe";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{NM:number, M:{D:number, RD:number, P:number, Q:number, S:number, R:[], ID: number}[]}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params?.M) return;
    if (socket["inMpeTimeout"]) return;
    const mercenaryCampMissions = [];
    for (let i in params.M) {
        let _mission = params.M[i];
        let mission = /* MercenariesCampMissionItemVO */{
            missionId: _mission.ID,
            duration: _mission.D,
            remainingDuration: _mission.RD,
            price: _mission.P,
            quality: _mission.Q,
            state: _mission.S,
            rewards: _mission.R,
            rewardsChanged: true,
        }
        mercenaryCampMissions.push(mission);
    }

    let bestMission = /* MercenariesCampMissionItemVO */{
        missionId: -1,
        duration: 0,
        remainingDuration: 0,
        price: 0,
        quality: 0,
        state: 0,
        rewards: 0,
        rewardsChanged: true,
    }
    for (let i in mercenaryCampMissions) {
        let __mission = mercenaryCampMissions[i];
        if (__mission.state === 1) {
            bestMission.missionId = -1;
            socket["inMpeTimeout"] = true
            setTimeout(() => {
                socket["inMpeTimeout"] = false
                if (!socket["__connected"]) return;
                mercenaryPackage(socket, -1);
            }, __mission.remainingDuration * 1005 + 5000)
            break;
        }
        if (__mission.state === 2) {
            bestMission = __mission;
            break;
        }
        if (__mission.state === 3) continue;
        if (bestMission.missionId === -1 || __mission.price < bestMission.price) {
            bestMission = __mission;
        }
    }
    if (bestMission.missionId !== -1) {
        const currentCoins = socket.client.clientUserData.globalCurrencies.find(g => g.item === "currency1").count
        if (bestMission.price > currentCoins) { // Having not enough coins
            socket["inMpeTimeout"] = true
            setTimeout(() => {
                socket["inMpeTimeout"] = false
                if (!socket["__connected"]) return;
                mercenaryPackage(socket, -1);
            }, 60000) // Retry after a minute
        } else mercenaryPackage(socket, bestMission.missionId)
    } else {
        socket["inMpeTimeout"] = true
        setTimeout(() => {
            socket["inMpeTimeout"] = false
            if (!socket["__connected"]) return;
            mercenaryPackage(socket, -1);
        }, params.NM * 1005 + 5000)
    }
}