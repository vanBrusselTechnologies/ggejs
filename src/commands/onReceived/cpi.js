module.exports.name = "cpi";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{MC:number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    client.clientUserData.availablePlagueMonks = params.MC;
}