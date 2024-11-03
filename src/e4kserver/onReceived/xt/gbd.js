module.exports.name = "gbd";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    //todo?: setUpActiveActionsServiceSignal.dispatch();
    for (let x in params) {
        switch (x.toLowerCase()) {
            case "WR".toLowerCase():
                socket.client.clientUserData.wasResetted = params[x];
                break;
            case "LA".toLowerCase():
                socket.client.clientUserData.lastUserActivity = params[x];
                break;
            case "ch":
                socket.client.clientUserData.selectedHeroId = params[x]["HID"];
                break;
            case "gal":
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
            case "DTS".toLowerCase():
            case "mvf":
            case "pre":
            case "gls":
            case "mcd":
//#region not handled in gbd source code
            case "gmu":
            case "cpi":
            case "gas":
//#endregion
                try {
                    if (socket.ultraDebug) {
                        const msg = JSON.stringify(params[x])
                        console.log(`[RECEIVED-GBD] ${x} % ${msg.substring(0, Math.min(140, msg.length))}`)
                    }
                    require(`./${x.toLowerCase()}`).execute(socket, errorCode, params[x]);
                } catch (e) {
                    if (socket.debug) console.warn("[GBD]", e);
                }
                break;
//#region not handled in gbd source code
            case "atl":
            case "dsd":
            case "fcs":
            case "gll":
            case "scd":
                //Not implemented in game
                if (socket.ultraDebug) {
                    const msg = JSON.stringify(params[x])
                    console.log(`[RECEIVED-GBD-not_implemented] ${x} % ${msg.substring(0, Math.min(140, msg.length))}`)
                }
                break;
            case "fii":
            //Not implemented in game: Friend invite info
            case "thi":
            //Not implemented in game: Treasure hunt info
            case "wbie":
                //Not implemented in game: Welcome back message info event
                if (socket.ultraDebug) {
                    const msg = JSON.stringify(params[x])
                    console.log(`[RECEIVED-GBD-not_implemented] ${x} % ${msg.substring(0, Math.min(140, msg.length))}`)
                }
                break;
            default:
                if (socket.debug) console.warn(`Unknown part in gbd command: ${x}: ${JSON.stringify(params[x])}`);
                break;
//#endregion
        }
    }
    setTimeout(async () => await handlePostGBDCommandInNextFrame(socket), 10);
}

async function handlePostGBDCommandInNextFrame(socket) {
    /* todo
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
    requestSubscriptionsData(socket);
    /*todo
     * directCommandMap.map(InitPaymentShopCommand).execute();
     * if(!featureRestrictionsModel.isFeatureRestrictedWithType("accountCode",FeatureRestrictionType.HIDDEN))
     * {
     *    directCommandMap.map(WebshopGetAccountIdCommand).execute();
     * }
     * sendInstallerPackageSignal.dispatch();
     * requestTimeForRuinPushNotification();
     */
    requestLoginBonusInfo(socket);
    requestMessagesData(socket);
    await requestAllianceData(socket);
    requestBookmarkData(socket);
    requestConstructionItemInventory(socket);
    requestGeneralsInnData(socket);
    /* todo
         showAccountForcedDialog();
         directCommandMap.map(SendDeviceMetaDataCommand).execute();
         gameStatusModel.gameIsListening = true;
         stopCachingJsonCommandsSignal.dispatch();
         connectionLostModel.reset();
         if(lockConditionModel.hasCondition()) {
            _loc1_ = lockConditionModel.hasCondition();
            debug("client has lock condition in GBD:",_loc1_.originalConditionIds + ", find the original reason where it came from and clean");
            lockConditionModel.conditionComplete();
         }
     */

    //todo????: Code below is added and not in source code
    require('../../commands/getEquipmentInventory').execute(socket);
    socket['gdb finished'] = true;
}

/** @param {Socket} socket */
function requestGeneralsInnData(socket) {
    require('../../commands/getGeneralCharacter').execute(socket);
}

/** @param {Socket} socket */
function requestBookmarkData(socket) {
    require('../../commands/getBookmarksList').execute(socket);
}

/** @param {Socket} socket */
function requestConstructionItemInventory(socket) {
    require('../../commands/getConstructionItemInventory').execute(socket);
}

/** @param {Socket} socket */
function requestMessagesData(socket) {
    require('../../commands/showMessages').execute(socket);
}

/** @param {Socket} socket */
async function requestAllianceData(socket) {
    const client = socket.client;
    if (client.clientUserData.allianceId >= 0) {
        require('../../commands/searchAllianceById').execute(socket, client.clientUserData.allianceId);
        require('../../commands/getAllianceFame').execute(socket);
        require('../../commands/getAllianceChatHistory').execute(socket);
    }
}

/** @param {Socket} socket */
function requestSubscriptionsData(socket) {
    require('../../commands/getSubscriptionInformation').execute(socket);
}

/** @param {Socket} socket */
function requestLoginBonusInfo(socket) {
    require('../../commands/getLoginBonus').execute(socket);
    require('../../commands/getStartupLoginBonus').execute(socket);
}