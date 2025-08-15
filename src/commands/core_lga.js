const NAME = "core_lga";
/** @type {CommandCallback<{errorCode: number, error: string, args: []}>[]}*/
const callbacks = [];

const accountId = Date.now().toString() + (Math.random() * 999999).toFixed();

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{D: {RS: number, GDPR: number}}} params
 */
module.exports.execute = function (client, errorCode, params) {
    /** @type {{error: string, args: []}} */
    const loginError = (() => {
        switch (errorCode - 10005) {
            case 0:
            case 1:
                return {errorCode, error: "", args: []};
            case 2:
                return {errorCode, error: "Missing LoginData!", args: []};
            case 5:
                return {errorCode, error: "User Not Found!", args: []};
            case 6:
                return {errorCode, error: "generic_login_wronglogin", args: []};
            case 7:
                if (params.D.GDPR === 1) return {errorCode, error: "generic_login_deleted", args: []};
                const banTimeInSeconds = params.D.RS;
                const banUntil = new Date(Date.now() + banTimeInSeconds * 1000);
                return {errorCode, error: "generic_login_banned", args: [banUntil]};
            case 11:
                return {errorCode, error: "Invalid Language!", args: []};
            case 15:
                return {errorCode, error: "generic_alert_serverIsUpdating_title", args: []};
            default:
                return {errorCode, error: `${errorCode}: ${JSON.stringify(params)}`, args: []};
        }
    })()

    require('.').baseExecuteCommand(client, loginError, 10005, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @param {string} name
 * @param {string} password
 * @return {Promise<{errorCode: number, error: string, args: []}>}
 */
module.exports.login = function (client, name, password) {
    const CoreC2SLoginWithAuthenticationVO = {
        NM: name, PW: password, L: client._language, AID: accountId, DID: 5, PLFID: "3", /*Android = 3, iOs = 2, (PC = 1(?))*/
        ADID: "null", AFUID: "appsFlyerUID", IDFV: null,
    };

    /* TODO Empire (?)
        params: {
            name: name,
            pw: password,
            did: (1).toString(),
            connectTime: (1).toString(),
            ping: (1).toString(),
            accountId: accountId.toString(),
        },
        getCmdId: "lgn",
        (e.name = l.BasicModel.userData.userName,
        e.pw = l.BasicModel.userData.loginPwd,
        e.lang = a.GGSCountryController.instance.currentCountry.ggsLanguageCode,
        e.did = s.EnvGlobalsHandler.globals.distributorId,
        e.connectTime = l.BasicModel.smartfoxClient.connectionTime,
        e.ping = l.BasicModel.smartfoxClient.roundTripTime,
        e.accountId = s.EnvGlobalsHandler.globals.accountId,
        r.BasicController.getInstance().sendServerMessageAndWait(o.BasicSmartfoxConstants.C2S_LOGIN, [JSON.stringify(e)], o.BasicSmartfoxConstants.C2S_LOGIN))
     */
    return require('.').baseSendCommand(client, NAME, CoreC2SLoginWithAuthenticationVO, callbacks, () => true);
}