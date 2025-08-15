module.exports.name = "upi";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{PU: number, DC: number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    client.clientUserData.isPayUser = params.PU === 1;
    client.clientUserData.paymentDoublerCount = params.DC;
}