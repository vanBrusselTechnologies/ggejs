const Localize = require("../../../tools/Localize");
const {login} = require('../../connection')

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
            const error1 = Localize.text(socket.client, "generic_alert_connection_lost_copy");
            socket["__connection_error"] = error1
            if (socket.debug) console.error(error1);
            break;
        case 10005:
            login(socket, params.M, params.P);
            break;
        case 10010:
            //if (_switchInstance) {
            //sendCommandVO(new CoreC2SChangeInstanceVO(_login, _pass, _language, _accountID, "", _playerName, _advertisingId, _appsFlyerUID, _iosIDFV));
            break;
        //}
        case 10011:
        case 10012:
        default:
            const error = Localize.text(socket.client, "generic_login_wronglogin");
            socket["__connection_error"] = error
            if (socket.debug) console.error(error);
    }
    //responseSignal.dispatch(value);
}