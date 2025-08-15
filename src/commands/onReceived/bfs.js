module.exports.name = "bfs";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{T:number, RT:number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    client.clientUserData.boostData.feast.setData(params);
}