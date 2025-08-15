const NAME = "core_rld";
/** @type {CommandCallback<{M:string, P:string}>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{M:string, P:string}} params
 */
module.exports.execute = function (client, errorCode, params) {
    require('.').baseExecuteCommand(client, params, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @return {Promise<{M:string, P:string}>}
 */
module.exports.requestLoginData = function (client) {
    const accountId = Date.now().toString() + (Math.random() * 999999).toFixed();
    const CoreC2SRequestLoginDataVO = {AID: accountId, S: "local", SID: -1, DID: 5, PLFID: "3", ADID: "null", AFUID: "appsFlyerUID", IDFV: null,};
    return require('.').baseSendCommand(client, NAME, CoreC2SRequestLoginDataVO, callbacks, () => true);
}