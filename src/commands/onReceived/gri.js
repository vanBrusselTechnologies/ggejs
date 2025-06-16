const {Coordinate} = require("../../structures/Coordinate");

module.exports.name = "gri";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    const cud = client.clientUserData;
    cud.relocationCount = params["RLC"];
    cud.relocationDurationEndTime = new Date(Date.now() + Math.max(0, params["RD"]) * 1000);
    cud.relocationCooldownEndTime = new Date(Date.now() + Math.max(0, params["RMC"]) * 1000);
    if (params["JM"] && params["JM"] === 1) {
        cud.relocationDurationEndTime = new Date();
    }
    if (params["DX"] && params["DY"]) {
        cud.relocationDestination = new Coordinate(client, [params["DX"], params["DY"]]);
    }
}