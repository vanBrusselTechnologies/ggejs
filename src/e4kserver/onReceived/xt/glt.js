const Constants = require('../../../utils/Constants');

module.exports.name = "glt";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = async function (socket, errorCode, params) {
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
    const externalClient = new (require('../../../Client'))("", LoginTokenServerInfoVO.token, serverInstance, socket.debug);
    externalClient._socket.ultraDebug = socket.ultraDebug;
    externalClient.language = socket.client._language;
    await externalClient.connect()
    socket.client.externalClient = externalClient
    socket.client.emit(Constants.Events.EXTERNAL_CLIENT_READY, externalClient)
}