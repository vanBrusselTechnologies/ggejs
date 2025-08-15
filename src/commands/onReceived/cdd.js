const {execute: gam} = require("./gam");
const {execute: gcu} = require("./gcu");

module.exports.name = "cdd";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{gcu: {C1: number, C2: number}, A:{}, O:[]}} params
 */
module.exports.execute = function (client, errorCode, params) {
    client.worldMaps._ownerInfoData.parseOwnerInfoArray(params.O);
    gam(client, 0, {M: [params.A]});
    gcu(client, 0, params.gcu);
}