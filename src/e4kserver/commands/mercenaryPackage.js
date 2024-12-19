module.exports.name = "mpe";
/**
 * @param {Socket} socket
 * @param {number} missionId
 */
module.exports.execute = function (socket, missionId) {
    const C2SMercenariesPackageVO = {
        getCmdId: "mpe", params: {MID: missionId,},
    }
    require('../data').sendCommandVO(socket, C2SMercenariesPackageVO);
}