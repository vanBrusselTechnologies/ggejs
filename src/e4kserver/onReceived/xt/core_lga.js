const Localize = require("../../../tools/Localize");
module.exports.name = "core_lga";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{D:{GDPR?: 0|1, RS?: number}}} params
 */
module.exports.execute = async function (socket, errorCode, params) {
    //todo: Core_LGA has massive source code update
    switch (errorCode - 10005) {
        case 0:
            await socket.client.socketManager.onLogin();
            break;
        case 1:
            await socket.client.socketManager.onLogin();
            break;
        case 2:
            await socket.client.socketManager.onLogin("[AuthenticationError] Missing LoginData!");
            break;
        case 5:
            await socket.client.socketManager.onLogin("[AuthenticationError] User Not Found!");
            break;
        case 6:
            await socket.client.socketManager.onLogin(`[AuthenticationError] ${Localize.text(socket.client, 'generic_login_wronglogin')}`);
            break;
        case 7:
            if(params.D.GDPR === 1) {
                await socket.client.socketManager.onLogin(`[AuthenticationError] ${Localize.text(socket.client, 'generic_login_deleted')}`);
            }
            else {
                const banTimeInSeconds = params.D.RS;
                const banUntil = new Date(Date.now() + banTimeInSeconds * 1000);
                await socket.client.socketManager.onLogin(`[AuthenticationError] ${Localize.text(socket.client, 'generic_login_banned', banUntil.toString())}`);
            }
            break;
        case 11:
            await socket.client.socketManager.onLogin("[AuthenticationError] Invalid Language!");
            break;
        case 15:
            await socket.client.socketManager.onLogin(`[AuthenticationError] ${Localize.text(socket.client, 'generic_alert_serverIsUpdating_title')}`);
            break;
        default:
            await socket.client.socketManager.onLogin(`[AuthenticationError] ${errorCode}: ${JSON.stringify(params)}`);
            break;
    }
}