const playerInfoModel = require('./../../../structures/PlayerInfoModel');
const castleUserData = require('./../../../structures/CastleUserData');

module.exports = {
    name: "gbd",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        /**
         * setUpActiveActionsServiceSignal.dispatch();
         * castleUserData.lastUserActivity = paramObj.LA;
         * castleUserData.selectedHeroID = paramObj.ch["HID"];
         * castleUserData.parse_GAL(paramObj.gal);
         */
        for (let x in params) {
            switch (x.toLowerCase()) {
                case "wr":
                    playerInfoModel.wasResetted = params[x];
                    break;
                case "la":
                    castleUserData.lastUserActivity = params[x];
                    break;
                case "hid":
                    castleUserData.selectedHeroID = params[x]["HID"];
                    break;
                case "gcu":
                case "gho":
                case "gxp":
                case "gpi":
                case "upi":
                case "ufa":
                case "ufp":
                case "uar":
                case "gem":
                case "gpf":
                case "gms":
                case "gpc":
                case "gcl":
                case "kgv":
                case "uap":
                case "gri":
                case "gkl":
                case "vip":
                case "opt":
                case "pgl":
                case "boi":
                case "sei":
                case "tei":
                case "txi":
                case "rei":
                case "kpi":
                case "mpe":
                case "vli":
                case "dql":
                case "gli":
                case "drt":
                case "tmp":
                case "sce":
                case "esl":
                case "ggm":
                case "lts":
                case "skl":
                case "rww":
                case "dcl":
                case "ahl":
                case "mre":
                case "gml":
                case "sin":
                case "nrf":
                case "gatp":
                case "bie":
                case "ree":
                case "dts":
                case "mvf":
                case "pre":
                case "gls":
                case "gal":
                    try {
                        require(`./${x}`).execute(socket, errorCode, params[x]);
                    } catch (e) {
                        if(socket.debug) console.log(e.toString().split('\n')[0]);
                    }
                    break;
                default:
                    if (socket.debug) console.log("Unknown part in gbd command: " + x + ": " + JSON.stringify(params[x]));
                    break;
            }
        }
        setTimeout(() => handlePostGBDCommandInNextFrame(socket), 100);
    }
}

function handlePostGBDCommandInNextFrame(socket) {
    /*
     *  restoreTutorialIfRuined();
     *  enableIAPmanagerStartupIntervalSignal.dispatch(false);
     *  if(hasValidInvitation.approve())
     *  {
     *     setFacebookConnectionSignal.dispatch();
     *  }
     *  else
     *  {
     *     facebookAutoLoginSignal.dispatch();
     *  }
     *  configureNotificationsSignal.dispatch();
     *  worldmapCameraData.currentCenteredWorldMapObject = castleListService.getMainCastleByKingdomId(kingdomData.activeKingdomID);
     *  if(!_loc2_)
     *  {
     *     startTutorialSignal.dispatch(true);
     *  }
     *  else
     *  {
     *     castleRemoveLoadingScreenSignal.dispatch();
     *  }
     *  restoreLastSessionGameStateSignal.dispatch();
     *  initMarketingTracking();
     *  trackDevice();
     *  trackDisconnection();
     */
    require('./../../commands/getSubscriptionInformationCommand').execute(socket);
    /*
    *  directCommandMap.map(InitPaymentShopCommand).execute();
    *  if(!featureRestrictionsModel.isFeatureRestrictedWithType("accountCode",FeatureRestrictionType.HIDDEN))
    *  {
    *     directCommandMap.map(WebshopGetAccountIdCommand).execute();
    *  }
    *  sendInstallerPackageSignal.dispatch();
    *  requestTimeForRuinPushNotification();
    */
    requestLoginBonusInfo(socket);
    requestMessagesData(socket);
    //requestAllianceData(); alles in false if-statement
    requestBookmarkData(socket);
    requestConstructionItemInventory(socket);
    requestEquipmentInventory(socket);
    socket['gdb finished'] = true;
    /*
     *  directCommandMap.map(SendDeviceMetaDataCommand).execute();
     *  gameStatusModel.gameIsListening = true;
     *  stopCachingJsonCommandsSignal.dispatch();
     *  connectionLostModel.reset();
     *  if(lockConditionModel.hasCondition())
     *  {
     *     _loc1_ = lockConditionModel.hasCondition();
     *     debug("client has lock condition in GBD:",_loc1_.originalConditionIds + ", find the original reason where it came from and clean");
     *     lockConditionModel.conditionComplete();
     *  }
     */
}

function requestLoginBonusInfo(socket) {
    require('./../../commands/getLoginBonusCommand').execute(socket);
    require('./../../commands/getStartupLoginBonusCommand').execute(socket);
}

function requestMessagesData(socket) {
    require('./../../commands/showMessagesCommand').execute(socket);
}

function requestBookmarkData(socket) {
    require('./../../commands/getBookmarksListCommand').execute(socket);
}

function requestConstructionItemInventory(socket) {
    require('./../../commands/getConstructionItemInventoryCommand').execute(socket);
}

function requestEquipmentInventory(socket){
    require('./../../commands/getEquipmentInventoryCommand').execute(socket);
}