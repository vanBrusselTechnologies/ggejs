const Localize = require("../../../tools/Localize");

module.exports.name = "core_avl";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{M:string, P:string}} params
 */
module.exports.execute = function (client, errorCode, params) {
    //todo:
    switch (errorCode) {
        case -1:
            client.socketManager.connectionError = Localize.text(client, "generic_alert_connection_lost_copy");
            break;
        case 10005:
            require('../../commands/login').execute(client, params.M, params.P);
            break;
        case 10010:
            //if (_switchInstance) {
            //sendCommand(new CoreC2SChangeInstanceVO(_login, _pass, _language, _accountID, "", _playerName, _advertisingId, _appsFlyerUID, _iosIDFV));
            break;
        //}
        case 10011:
        case 10012:
        default:
            client.socketManager.connectionError = Localize.text(client, "generic_login_wronglogin");
    }
    //responseSignal.dispatch(value);
}