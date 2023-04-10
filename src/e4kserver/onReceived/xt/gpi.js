const playerInfoModel = require('./../../../structures/PlayerInfoModel');

module.exports = {
    name: "gpi",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        socket.client.players._setThisPlayer(params.PID);
        playerInfoModel.userId = params["UID"];
        playerInfoModel.playerId = params["PID"];
        playerInfoModel.userName = params["PN"];
        let email = params["E"];
        if(email !== playerInfoModel.email)// && !CompilationFlags.CONFIG.isBrowserInvoked)
        {
            //_loc5_ = accountData.getAccountInfoForInstance(instanceData.selectedInstanceVO);
            //accountData.deleteAccount(_loc5_.instanceID);
            //accountData.addAccount(email,_loc5_.password,_loc5_.instanceID);
            playerInfoModel.email = email;
            playerInfoModel.pendingEmailChange = null;
            //_loc3_ = true;
        }
        playerInfoModel.isCheater = params["CL"] > 0;
        playerInfoModel.hasEverChangedName = params["ECN"] > 0;
        playerInfoModel.registrationTimestamp = params["RD"];
        playerInfoModel.hasConfirmedTOC = params["CTAC"] === 1;
        //userData.hasFreeCastleRename = params["FCR"] === 1;
        playerInfoModel.isAccountSaved = playerInfoModel.email.search("xxxxxxx.xx") <= 0;
        //userData.user_data_internal::facebookID = params.hasOwnProperty("FID") ? params["FID"] : null;
        /*
         userNameChangedSignal.dispatch();
         backupGameDataSignal.dispatch();
         trackRetentionDaySignal.dispatch();
         if(_loc3_)
         {
            mailChangedSignal.dispatch();
         }
        */
    }
}