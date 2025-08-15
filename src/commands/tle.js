const NAME = "tle";
/** @type {CommandCallback<void>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    require('.').baseExecuteCommand(client, undefined, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @param {string} loginToken
 * @return {Promise<void>}
 */
module.exports.registerOrLogin = function (client, loginToken) {
    const C2SRegisterOrLoginVO = {
        GST: client.socketManager.serverType, TLT: loginToken, ADID: "null", AFUID: "appsFlyerUID", IDFV: null,
    };
    return require('.').baseSendCommand(client, NAME, C2SRegisterOrLoginVO, callbacks, () => true);
}