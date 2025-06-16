const PrimeTime = require("../../structures/PrimeTime");
const {Events} = require("../../utils/Constants");

module.exports.name = "core_poe";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    client.emit(Events.PRIME_TIME, new PrimeTime(client, params));
}