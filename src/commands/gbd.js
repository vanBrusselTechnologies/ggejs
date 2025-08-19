const {EmpireError} = require("../tools/EmpireError");

const NAME = "gbd";
/** @type {CommandCallback<void>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    parseGBD(client, params);
    require('.').baseExecuteCommand(client, undefined, errorCode, params, callbacks);
}

/**
 * @param {BaseClient} client
 * @returns {Promise<void>}
 */
module.exports.registerGbdListener = function (client) {
    return new Promise((resolve, reject) => {
        const id = require('crypto').randomUUID();
        callbacks.push({id, clientId: client._id, match: () => true, resolve, reject});
        setTimeout(() => {
            const i = callbacks.findIndex(c => c.id === id);
            if (i !== -1) callbacks.splice(i, 1);
            resolve();
        }, 1000);
    });
}

module.exports.gbd = parseGBD;

/**
 * @param {BaseClient} client
 * @param {{WR: number, LA: number, ch: {HID: number}, [p: string]: Object}} params
 * @return {Player}
 */
function parseGBD(client, params) {
    client.clientUserData.wasResetted = params.WR === 1;
    client.clientUserData.lastUserActivity = params.LA;
    client.clientUserData.selectedHeroID = params.ch["HID"];
    // castleUserData.parse_GAL(paramObj.gal);
    // parseNestedJsonResponse("gcu");
    // parseNestedJsonResponse("gho");
    // parseNestedJsonResponse("gxp");
    require('./gpi').gpi(client, params.gpi);
    // parseNestedJsonResponse("upi");
    // parseNestedJsonResponse("ufa");
    // parseNestedJsonResponse("ufp");
    // parseNestedJsonResponse("uar");
    // parseNestedJsonResponse("gem");
    // parseNestedJsonResponse("gpf");
    // parseNestedJsonResponse("gms");
    // parseNestedJsonResponse("gpc");
    require('./gcl').gcl(client, params.gcl);
    // parseNestedJsonResponse("kgv");
    // parseNestedJsonResponse("uap");
    // parseNestedJsonResponse("gri");
    // parseNestedJsonResponse("gkl");
    // parseNestedJsonResponse("vip");
    // parseNestedJsonResponse("opt");
    // parseNestedJsonResponse("pgl");
    // parseNestedJsonResponse("boi");
    // parseNestedJsonResponse("sei");
    // parseNestedJsonResponse("tei");
    // parseNestedJsonResponse("txi");
    // parseNestedJsonResponse("rei");
    // parseNestedJsonResponse("kpi");
    // parseNestedJsonResponse("mpe");
    // parseNestedJsonResponse("vli");
    // parseNestedJsonResponse("dql");
    // parseNestedJsonResponse("gli");
    // parseNestedJsonResponse("drt");
    // parseNestedJsonResponse("tmp");
    // parseNestedJsonResponse("sce");
    // parseNestedJsonResponse("esl");
    // parseNestedJsonResponse("ggm");
    // parseNestedJsonResponse("lts");
    // parseNestedJsonResponse("skl");
    // parseNestedJsonResponse("rww");
    // parseNestedJsonResponse("dcl");
    // parseNestedJsonResponse("ahl");
    // parseNestedJsonResponse("gai");
    // if (!_loc2_) {
    //     parseNestedJsonResponse("mre");
    //     parseNestedJsonResponse("gml");
    // }
    // parseNestedJsonResponse("sin");
    // parseNestedJsonResponse("nrf");
    // parseNestedJsonResponse("gatp");
    // parseNestedJsonResponse("bie");
    // parseNestedJsonResponse("ree");
    // parseNestedJsonResponse("DTS");
    // parseNestedJsonResponse("mvf");
    // parseNestedJsonResponse("pre");
    // parseNestedJsonResponse("gls");
    // parseNestedJsonResponse("mcd");
    for (const x in params) {
        const msg = JSON.stringify(params[x]);
        switch (x.toLowerCase()) {
            case "WR".toLowerCase():
            case "LA".toLowerCase():
            case "ch":
            case "gpi":
            case "gcl":
                // Handled before for-loop
                break;
            case "gal":
            case "gcu":
            case "gho":
            case "gxp":
            case "upi":
            case "ufa":
            case "ufp":
            case "uar":
            case "gem":
            case "gpf":
            case "gms":
            case "gpc":
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
    setTimeout(() => handlePostGBDCommandInNextFrame(client), 10);
}

/** @param {BaseClient} client */
function handlePostGBDCommandInNextFrame(client) {
    try {
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
        requestMessagesData(client);
        requestAllianceData(client);
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
    } catch (e) {
    }
}

/** @param {BaseClient} client */
function requestGeneralsInnData(client) {
    require('./commands/getGeneralCharacter').execute(client);
}

/** @param {BaseClient} client */
function requestBookmarkData(client) {
    require('./commands/getBookmarksList').execute(client);
}

/** @param {BaseClient} client */
function requestConstructionItemInventory(client) {
    require('./commands/getConstructionItemInventory').execute(client);
}

/** @param {BaseClient} client */
function requestMessagesData(client) {
    require('./sne').showMessages(client).catch(e => client.logger.w(new EmpireError(e)));
}

/** @param {BaseClient} client */
function requestAllianceData(client) {
    if (client.clientUserData.allianceId >= 0) {
        require('./ain').getAllianceInfo(client, client.clientUserData.allianceId).catch(e => client.logger.w(new EmpireError(e)));
        require('./commands/getAllianceFame').execute(client);
        require('./commands/getAllianceChatHistory').execute(client);
    }
}

/** @param {BaseClient} client */
function requestSubscriptionsData(client) {
    require('./commands/getSubscriptionInformation').execute(client);
}

/** @param {BaseClient} client */
function requestLoginBonusInfo(client) {
    require('./commands/getLoginBonus').execute(client);
    require('./commands/getStartupLoginBonus').execute(client);
}