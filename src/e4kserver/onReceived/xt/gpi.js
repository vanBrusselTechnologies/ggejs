module.exports.name = "gpi";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    const cud = socket.client.clientUserData;
    cud.userId = params["UID"];
    cud.playerId = params["PID"];
    cud.userName = params["PN"];
    let email = params["E"];
    if (email !== cud.email)// && !CompilationFlags.CONFIG.isBrowserInvoked
    {
        //_loc5_ = accountData.getAccountInfoForInstance(instanceData.selectedInstanceVO);
        //accountData.deleteAccount(_loc5_.instanceID);
        //accountData.addAccount(email,_loc5_.password,_loc5_.instanceID);
        cud.email = email;
        cud.pendingEmailChange = null;
        //_loc3_ = true;
    }
    cud.isCheater = params["CL"] > 0;
    cud.hasEverChangedName = params["ECN"] > 0;
    cud.registrationTimestamp = params["RD"];
    cud.hasConfirmedTOC = params["CTAC"] === 1;
    cud.hasFreeCastleRename = params["FCR"] === 1;
    cud.isAccountSaved = cud.email.search("xxxxxxx.xx") <= 0;
    cud.facebookId = params.hasOwnProperty("FID") ? params["FID"] : null;
    /*
     userNameChangedSignal.dispatch();
     backupGameDataSignal.dispatch();
     trackRetentionDaySignal.dispatch();
     if(_loc3_) mailChangedSignal.dispatch();
    */
}
