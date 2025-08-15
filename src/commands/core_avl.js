const NAME = "core_avl";
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
 * @param {string} name
 * @param {string} password
 * @return {Promise<{M:string, P:string}>}
 */
module.exports.verifyLoginData = function (client, name, password) {
    const CoreC2SVerifyLoginDataVO = {LN: name, P: password};
    return require('.').baseSendCommand(client, NAME, CoreC2SVerifyLoginDataVO, callbacks, () => true);
}