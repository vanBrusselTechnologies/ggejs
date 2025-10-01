const NAME = "lli";
/** @type {CommandCallback<{M:string, P:string}>[]}*/
const callbacks = [];

const accountId = Date.now().toString() + (Math.random() * 999999).toFixed();

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
module.exports.login = function (client, name, password) {
    const LLI = {CONM: 175, RTM: 24, ID: 0, PL: 1, NOM: name, PW: password, LT: null, LANG: client._language, DID: "0", AID: accountId, KID: "", REF: "https://empire.goodgamestudios.com", CGI: "", SID: 9, PLFID: 1};
    return require('.').baseSendCommand(client, NAME, LLI, callbacks, () => true);
}