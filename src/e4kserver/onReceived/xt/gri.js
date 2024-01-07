const {Coordinate} = require("./../../../structures/Coordinate");

module.exports.name = "gri";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    const cud = socket.client.clientUserData;
    cud.relocationCount = params["RLC"];
    cud.relocationDurationEndTime = new Date(Date.now() + Math.max(0, params["RD"]) * 1000);
    cud.relocationCooldownEndTime = new Date(Date.now() + Math.max(0, params["RMC"]) * 1000);
    if (params["JM"] && params["JM"] === 1) {
        cud.relocationDurationEndTime = new Date();
    }
    if (params["DX"] && params["DY"]) {
        cud.relocationDestination = new Coordinate(socket.client, [params["DX"], params["DY"]]);
    }
}