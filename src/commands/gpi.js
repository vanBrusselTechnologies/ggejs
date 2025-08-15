const NAME = "gpi";
/** @type {CommandCallback<void>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    parseGPI(client, params);
    require('.').baseExecuteCommand(client, undefined, errorCode, params, callbacks);
}

module.exports.gpi = parseGPI;

/**
 * @param {BaseClient} client
 * @param {{UID: number, PID: number, PN: string, E: string, V: number, CL: number, ECN: number, RD: number, CTAC: number, FCR: number, FID: string}} params
 */
function parseGPI(client, params) {
    const cud = client.clientUserData;
    cud.userId = params.UID;
    cud.playerId = params.PID;
    cud.userName = params.PN;
    const email = params.E;
    if (email !== cud.email /* && !CompilationFlags.CONFIG.isBrowserInvoked */) {
        //_loc5_ = accountData.getAccountInfoForInstance(instanceData.selectedInstanceVO);
        //accountData.deleteAccount(_loc5_.instanceID);
        //accountData.addAccount(email,_loc5_.password,_loc5_.instanceID);
        cud.email = email;
        cud.pendingEmailChange = null;
        //cud._playerInfo.pendingEmailChangeStatus = 0;
        //_loc3_ = true;
    }
    //cud._playerInfo.registrationEmailVerified = params["V"] === 1;
    cud.isCheater = params.CL > 0;
    cud.hasEverChangedName = params.ECN > 0;
    cud.registrationTimestamp = params.RD;
    cud.hasConfirmedTOC = params.CTAC === 1;
    cud.hasFreeCastleRename = params.FCR === 1;
    cud.isAccountSaved = cud.email.search("xxxxxxx.xx") <= 0;
    cud.facebookId = params.hasOwnProperty("FID") ? params.FID : null;
    /*
     userNameChangedSignal.dispatch();
     backupGameDataSignal.dispatch();
     trackRetentionDaySignal.dispatch();
     if (_loc3_) mailChangedSignal.dispatch();
    */
}