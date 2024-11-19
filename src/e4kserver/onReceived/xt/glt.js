const Constants = require('../../../utils/Constants');

module.exports.name = "glt";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = async function (socket, errorCode, params) {
    if (errorCode !== 0 || params == null) return;
    let LoginTokenServerInfoVO = {
        token: params["TLT"],
        ip: params["TSIP"],
        port: params["TSP"],
        zone: params["TSZ"],
        zoneId: params["ZID"],
        instanceId: params["IID"],
        isCrossPlay: params["ICS"]
    }
    const externalClient = new (require('../../../Client'))("", LoginTokenServerInfoVO.token, LoginTokenServerInfoVO, socket.debug);
    externalClient._socket.ultraDebug = socket.ultraDebug;
    externalClient.language = socket.client._language;
    await externalClient.connect()
    socket.client.externalClient = externalClient
    socket.client.emit(Constants.Events.EXTERNAL_CLIENT_READY, externalClient)
}