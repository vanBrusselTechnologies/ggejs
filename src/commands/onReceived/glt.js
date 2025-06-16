const {NetworkInstance} = require('e4k-data');
const Constants = require('../../utils/Constants');

module.exports.name = "glt";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = async function (client, errorCode, params) {
    if (errorCode !== 0 || params == null) return;
    const LoginTokenServerInfoVO = {
        token: params["TLT"],
        ip: params["TSIP"],
        port: params["TSP"],
        zone: params["TSZ"],
        zoneId: params["ZID"],
        instanceId: params["IID"],
        isCrossPlay: params["ICS"]
    }

    /** @type {NetworkInstance} */
    const serverInstance = {
        server: LoginTokenServerInfoVO.ip,
        port: LoginTokenServerInfoVO.port,
        zone: LoginTokenServerInfoVO.zone,
        zoneId: LoginTokenServerInfoVO.zoneId,
        value: LoginTokenServerInfoVO.instanceId,
    }
    // Inline require because of circular dependency (Client -> SocketManager -> commands.index -> glt -> Client)
    const externalClient = new (require('../../Client'))("", LoginTokenServerInfoVO.token, serverInstance);
    externalClient.logger.verbosity = client.logger.verbosity;
    externalClient.language = client._language;
    await externalClient.connect()
    client.externalClient = externalClient
    client.emit(Constants.Events.EXTERNAL_CLIENT_READY, externalClient)
}