const NAME = "glt";
/** @type {CommandCallback<{token: string, ip: string, port: string, zone: string, zoneId: string, instanceId: string, isCrossPlay: boolean}>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{M:string, P:string}} params
 */
module.exports.execute = function (client, errorCode, params) {
    const LoginTokenServerInfoVO = {
        token: params["TLT"],
        ip: params["TSIP"],
        port: params["TSP"],
        zone: params["TSZ"],
        zoneId: params["ZID"],
        instanceId: params["IID"],
        isCrossPlay: params["ICS"] === 1
    }
    require('.').baseExecuteCommand(client, LoginTokenServerInfoVO, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @param {number} serverType
 * @return {Promise<{token: string, ip: string, port: string, zone: string, zoneId: string, instanceId: string, isCrossPlay: boolean}>}
 */
module.exports.generateLoginToken = function (client, serverType) {
    const C2SGenerateLoginTokenVO = {GST: serverType};
    return require('.').baseSendCommand(client, NAME, C2SGenerateLoginTokenVO, callbacks, () => true);
}