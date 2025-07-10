module.exports.name = "gbd";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    // TODO?: setUpActiveActionsServiceSignal.dispatch();
    for (let x in params) {
        switch (x.toLowerCase()) {
            case "WR".toLowerCase():
                client.clientUserData.wasResetted = params[x];
                break;
            case "LA".toLowerCase():
                client.clientUserData.lastUserActivity = params[x];
                break;
            case "ch":
                client.clientUserData.selectedHeroId = params[x]["HID"];
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
            case "gai":
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
            case "gabgap":
//#endregion
                try {
                    const msg = JSON.stringify(params[x]);
                    client.logger.t(`[RECEIVED-GBD] ${x} % ${msg.substring(0, Math.min(140, msg.length))}`);
                    require(`./${x.toLowerCase()}`).execute(client, errorCode, params[x]);
                } catch (e) {
                    client.logger.d("[GBD]", e);
                }
                break;
//#region not handled in gbd source code
            case "atl":
            case "dsd":
            case "fcs":
            case "gll":
            case "scd":
                //Not implemented in game
                const msg = JSON.stringify(params[x]);
                client.logger.t(`[RECEIVED-GBD-not_implemented] ${x} % ${msg.substring(0, Math.min(140, msg.length))}`);
                break;
            case "fii":
            //Not implemented in game: Friend invite info
            case "thi":
            //Not implemented in game: Treasure hunt info
            case "wbie":
                //Not implemented in game: Welcome back message info event
                const msg2 = JSON.stringify(params[x]);
                client.logger.t(`[RECEIVED-GBD-not_implemented] ${x} % ${msg2.substring(0, Math.min(140, msg2.length))}`);
                break;
            default:
                client.logger.d(`Unknown part in gbd command: ${x}: ${JSON.stringify(params[x])}`);
                break;
//#endregion
        }
    }
    setTimeout(async () => await handlePostGBDCommandInNextFrame(client), 10);
}

/** @param {Client} client */
async function handlePostGBDCommandInNextFrame(client) {
    /* todo
     *  restoreTutorialIfRuined();
     *  enableIAPmanagerStartupIntervalSignal.dispatch(false);
     *  configureNotificationsSignal.dispatch();
     *  worldmapCameraData.currentCenteredWorldMapObject = castleListService.getMainCastleByKingdomId(kingdomData.activeKingdomID);
     *  if (!_loc2_)
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
    requestSubscriptionsData(client);
    /*todo
     * directCommandMap.map(InitPaymentShopCommand).execute();
     * if (!featureRestrictionsModel.isFeatureRestrictedWithType("accountCode",FeatureRestrictionType.HIDDEN))
     * {
     *    directCommandMap.map(WebshopGetAccountIdCommand).execute();
     * }
     * sendInstallerPackageSignal.dispatch();
     * requestTimeForRuinPushNotification();
     */
    requestLoginBonusInfo(client);
    requestMessagesData(client);
    await requestAllianceData(client);
    requestBookmarkData(client);
    requestConstructionItemInventory(client);
    requestGeneralsInnData(client);
    /* todo
         showAccountForcedDialog();
         directCommandMap.map(SendDeviceMetaDataCommand).execute();
         gameStatusModel.gameIsListening = true;
         stopCachingJsonCommandsSignal.dispatch();
         connectionLostModel.reset();
         if (lockConditionModel.hasCondition()) {
            _loc1_ = lockConditionModel.hasCondition();
            debug("client has lock condition in GBD:",_loc1_.originalConditionIds + ", find the original reason where it came from and clean");
            lockConditionModel.conditionComplete();
         }
     */

    // TODO????: Code below is added and not in source code
    require('../commands/getEquipmentInventory').execute(client);
    client._socket['gbd finished'] = true;
}

/** @param {Client} client */
function requestGeneralsInnData(client) {
    require('../commands/getGeneralCharacter').execute(client);
}

/** @param {Client} client */
function requestBookmarkData(client) {
    require('../commands/getBookmarksList').execute(client);
}

/** @param {Client} client */
function requestConstructionItemInventory(client) {
    require('../commands/getConstructionItemInventory').execute(client);
}

/** @param {Client} client */
function requestMessagesData(client) {
    require('../commands/showMessages').execute(client);
}

/** @param {Client} client */
async function requestAllianceData(client) {
    if (client.clientUserData.allianceId >= 0) {
        await require('../ain').getAllianceInfo(client, client.clientUserData.allianceId);
        require('../commands/getAllianceFame').execute(client);
        require('../commands/getAllianceChatHistory').execute(client);
    }
}

/** @param {Client} client */
function requestSubscriptionsData(client) {
    require('../commands/getSubscriptionInformation').execute(client);
}

/** @param {Client} client */
function requestLoginBonusInfo(client) {
    require('../commands/getLoginBonus').execute(client);
    require('../commands/getStartupLoginBonus').execute(client);
}