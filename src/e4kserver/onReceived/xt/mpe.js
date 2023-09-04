const {execute: mercenaryPackageCommand} = require('../../commands/mercenaryPackageCommand');

module.exports = {
    name: "mpe",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute: function (socket, errorCode, params) {
        if (!params?.M) return;
        let mercenaryCampMissions = [];
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
                setTimeout(() => {
                    if(!socket["__connected"]) return;
                    mercenaryPackageCommand(socket, __mission.missionId);
                }, __mission.remainingDuration * 1100)
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
            mercenaryPackageCommand(socket, bestMission.missionId)
        }
    }
}