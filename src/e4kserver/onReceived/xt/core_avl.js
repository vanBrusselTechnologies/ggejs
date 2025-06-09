const Localize = require("../../../tools/Localize");

module.exports.name = "core_avl";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{M:string, P:string}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    //todo:
    switch (errorCode) {
        case -1:
            socket.client.socketManager.connectionError = Localize.text(socket.client, "generic_alert_connection_lost_copy");
            break;
        case 10005:
            require('../../commands/login').execute(socket, params.M, params.P);
            break;
        case 10010:
            //if (_switchInstance) {
            //sendCommand(new CoreC2SChangeInstanceVO(_login, _pass, _language, _accountID, "", _playerName, _advertisingId, _appsFlyerUID, _iosIDFV));
            break;
        //}
        case 10011:
        case 10012:
        default:
            socket.client.socketManager.connectionError = Localize.text(socket.client, "generic_login_wronglogin");
    }
    //responseSignal.dispatch(value);
}