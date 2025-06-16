const Localize = require("../../tools/Localize");

module.exports.name = "core_lga";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{D:{GDPR?: 0|1, RS?: number}}} params
 */
module.exports.execute = async function (client, errorCode, params) {
    //todo: Core_LGA has massive source code update
    switch (errorCode - 10005) {
        case 0:
            await client.socketManager.onLogin();
            break;
        case 1:
            await client.socketManager.onLogin();
            break;
        case 2:
            await client.socketManager.onLogin("[AuthenticationError] Missing LoginData!");
            break;
        case 5:
            await client.socketManager.onLogin("[AuthenticationError] User Not Found!");
            break;
        case 6:
            await client.socketManager.onLogin(`[AuthenticationError] ${Localize.text(client, 'generic_login_wronglogin')}`);
            break;
        case 7:
            if(params.D.GDPR === 1) {
                await client.socketManager.onLogin(`[AuthenticationError] ${Localize.text(client, 'generic_login_deleted')}`);
            }
            else {
                const banTimeInSeconds = params.D.RS;
                const banUntil = new Date(Date.now() + banTimeInSeconds * 1000);
                await client.socketManager.onLogin(`[AuthenticationError] ${Localize.text(client, 'generic_login_banned', banUntil.toString())}`);
            }
            break;
        case 11:
            await client.socketManager.onLogin("[AuthenticationError] Invalid Language!");
            break;
        case 15:
            await client.socketManager.onLogin(`[AuthenticationError] ${Localize.text(client, 'generic_alert_serverIsUpdating_title')}`);
            break;
        default:
            await client.socketManager.onLogin(`[AuthenticationError] ${errorCode}: ${JSON.stringify(params)}`);
            break;
    }
}