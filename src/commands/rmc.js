const NAME = "rmc";
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
 * @param {string} email
 * @return {Promise<void>}
 */
module.exports.changeAccountMail = function (client, email) {
    const C2SChangeAccountMailEventVO = {PMA: email};
    return require('.').baseSendCommand(client, NAME, C2SChangeAccountMailEventVO, callbacks, () => true);
}