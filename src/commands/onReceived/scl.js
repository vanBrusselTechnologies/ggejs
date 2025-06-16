const ConstructionSlot = require("../../structures/ConstructionSlot");

module.exports.name = "scl";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{OIDL: []}} params
 */
module.exports.execute = function (client, errorCode, params) {
    return params.OIDL.map(cs => new ConstructionSlot(client, cs))
}