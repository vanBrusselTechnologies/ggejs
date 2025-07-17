const {getAllianceInfo} = require("./ain");
const {showMessages} = require("./sne");

const NAME = "gbd";
/** @type {CommandCallback<void>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    parseGBD(client, params);
    require('.').baseExecuteCommand(undefined, errorCode, params, callbacks);
}

module.exports.gbd = parseGBD;

/**
 * @param {Client} client
 * @param {Object} params
 * @return {Player}
 */
function parseGBD(client, params) {
    for (let x in params) {
        const msg = JSON.stringify(params[x]);
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
                    client.logger.t(`[RECEIVED-GBD] ${x} % ${msg.substring(0, Math.min(140, msg.length))}`);
                    try {
                        require(`./${x.toLowerCase()}`)[x.toLowerCase()](client, params[x]);
                    } catch (e) {
                        require(`./onReceived/${x.toLowerCase()}`).execute(client, 0, params[x]);
                    }
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
                client.logger.t(`[RECEIVED-GBD-not_implemented] ${x} % ${msg.substring(0, Math.min(140, msg.length))}`);
                break;
            case "fii":
            //Not implemented in game: Friend invite info
            case "thi":
            //Not implemented in game: Treasure hunt info
            case "wbie":
                //Not implemented in game: Welcome back message info event
                client.logger.t(`[RECEIVED-GBD-not_implemented] ${x} % ${msg.substring(0, Math.min(140, msg.length))}`);
                break;
            default:
                client.logger.t(`Unknown part in gbd command: ${x}: ${msg}`);
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
     *  if (!_loc2_) {
     *      startTutorialSignal.dispatch(true);
     *  }
     *  else {
     *      castleRemoveLoadingScreenSignal.dispatch();
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
    await requestMessagesData(client);
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

    client._socket['gbd finished'] = true;
}

/** @param {Client} client */
function requestGeneralsInnData(client) {
    require('./commands/getGeneralCharacter').execute(client);
}

/** @param {Client} client */
function requestBookmarkData(client) {
    require('./commands/getBookmarksList').execute(client);
}

/** @param {Client} client */
function requestConstructionItemInventory(client) {
    require('./commands/getConstructionItemInventory').execute(client);
}

/** @param {Client} client */
async function requestMessagesData(client) {
    await showMessages(client);
}

/** @param {Client} client */
async function requestAllianceData(client) {
    if (client.clientUserData.allianceId >= 0) {
        await getAllianceInfo(client, client.clientUserData.allianceId);
        require('./commands/getAllianceFame').execute(client);
        require('./commands/getAllianceChatHistory').execute(client);
    }
}

/** @param {Client} client */
function requestSubscriptionsData(client) {
    require('./commands/getSubscriptionInformation').execute(client);
}

/** @param {Client} client */
function requestLoginBonusInfo(client) {
    require('./commands/getLoginBonus').execute(client);
    require('./commands/getStartupLoginBonus').execute(client);
}