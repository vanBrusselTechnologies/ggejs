const BasicMessage = require("../structures/messages/BasicMessage");
const UserMessage = require("../structures/messages/UserMessage");
const AllianceNewsMessage = require("../structures/messages/AllianceNewsMessage");
const AllianceRequestMessage = require("../structures/messages/AllianceRequestMessage");
const AllianceWarEnemyAttackMessage = require("../structures/messages/AllianceWarEnemyAttackMessage");
const AllianceWarEnemyDeclarationMessage = require("../structures/messages/AllianceWarEnemyDeclarationMessage");
const AllianceWarEnemyEndMessage = require("../structures/messages/AllianceWarEnemyEndMessage");
const AllianceWarEnemySabotageMessage = require("../structures/messages/AllianceWarEnemySabotageMessage");
const AllianceWarOwnAttackMessage = require("../structures/messages/AllianceWarOwnAttackMessage");
const AllianceWarOwnDeclarationMessage = require("../structures/messages/AllianceWarOwnDeclarationMessage");
const AllianceWarOwnSabotageMessage = require("../structures/messages/AllianceWarOwnSabotageMessage");
const AttackAdvisorFailedMessage = require("../structures/messages/AttackAdvisorFailedMessage");
const AttackAdvisorSummaryMessage = require("../structures/messages/AttackAdvisorSummaryMessage");
const AttackCancelledAbortedMessage = require("../structures/messages/AttackCancelledAbortedMessage");
const AttackCancelledAutoRetreatEnemyMessage = require("../structures/messages/AttackCancelledAutoRetreatEnemyMessage");
const AttackCancelledAutoRetreatMessage = require("../structures/messages/AttackCancelledAutoRetreatMessage");
const AttackCountThresholdMessage = require("../structures/messages/AttackCountThresholdMessage");
const BattleLogConquerMessage = require("../structures/messages/BattleLogConquerMessage");
const BattleLogNormalAttackMessage = require("../structures/messages/BattleLogNormalAttackMessage");
const BattleLogNPCAttackMessage = require("../structures/messages/BattleLogNPCAttackMessage");
const BattleLogOccupyMessage = require("../structures/messages/BattleLogOccupyMessage");
const BreweryMissingResourcesMessage = require("../structures/messages/BreweryMissingResourcesMessage");
const ConquerableAreaConqueredMessage = require("../structures/messages/ConquerableAreaConqueredMessage");
const ConquerableAreaLostMessage = require("../structures/messages/ConquerableAreaLostMessage");
const ConquerableNewSiegeMessage = require("../structures/messages/ConquerableNewSiegeMessage");
const ConquerableSiegeCancelledMessage = require("../structures/messages/ConquerableSiegeCancelledMessage");
const DoubleRubiesMessage = require("../structures/messages/DoubleRubiesMessage");
const HighScoreBonusMessage = require("../structures/messages/HighScoreBonusMessage");
const MarketCarriageArrivedMessage = require("../structures/messages/MarketCarriageArrivedMessage");
const PlayerGiftMessage = require("../structures/messages/PlayerGiftMessage");
const PopupFacebookConnectionMessage = require("../structures/messages/PopupFacebookConnectionMessage");
const PopupLoginBonusMessage = require("../structures/messages/PopupLoginBonusMessage");
const PopupRegistrationGiftMessage = require("../structures/messages/PopupRegistrationGiftMessage");
const PrivateOfferBestsellerShopMessage = require("../structures/messages/PrivateOfferBestsellerShopMessage");
const PrivateOfferDungeonChestMessage = require("../structures/messages/PrivateOfferDungeonChestMessage");
const PrivateOfferTimeChallengeMessage = require("../structures/messages/PrivateOfferTimeChallengeMessage");
const PrivateOfferTippMessage = require("../structures/messages/PrivateOfferTippMessage");
const PrivateOfferWhaleChestMessage = require("../structures/messages/PrivateOfferWhaleChestMessage");
const ProductionDowntimeMessage = require("../structures/messages/ProductionDowntimeMessage");
const RebuyMessage = require("../structures/messages/RebuyMessage");
const RuinInfoMessage = require("../structures/messages/RuinInfoMessage");
const ShadowAttackMessage = require("../structures/messages/ShadowAttackMessage");
const SpecialEventEndMessage = require("../structures/messages/SpecialEventEndMessage");
const SpecialEventHospitalCapacityExceededMessage = require("../structures/messages/SpecialEventHospitalCapacityExceededMessage");
const SpecialEventMonumentResetMessage = require("../structures/messages/SpecialEventMonumentResetMessage");
const SpecialEventStartMessage = require("../structures/messages/SpecialEventStartMessage");
const SpecialEventUpdateMessage = require("../structures/messages/SpecialEventUpdateMessage");
const SpecialEventVIPInfoMessage = require("../structures/messages/SpecialEventVIPInfoMessage");
const SpyCancelledAbortedMessage = require("../structures/messages/SpyCancelledAbortedMessage");
const SpyNPCMessage = require("../structures/messages/SpyNPCMessage");
const SpyPlayerDefenceMessage = require("../structures/messages/SpyPlayerDefenceMessage");
const SpyPlayerEconomicMessage = require("../structures/messages/SpyPlayerEconomicMessage");
const SpyPlayerSabotageFailedMessage = require("../structures/messages/SpyPlayerSabotageFailedMessage");
const SpyPlayerSabotageSuccessfulMessage = require("../structures/messages/SpyPlayerSabotageSuccessfulMessage");
const StarveInfoMessage = require("../structures/messages/StarveInfoMessage");
const UserSurveyMessage = require("../structures/messages/UserSurveyMessage");
const MessageConst = require("../utils/MessageConst");

const NAME = "sne";
/** @type {CommandCallback<MailMessage[]>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = async function (client, errorCode, params) {
    const mailMessages = await parseSNE(client, params);
    require('.').baseExecuteCommand(mailMessages, errorCode, params, callbacks);
}

/**
 * @param {Client} client
 * @return {Promise<MailMessage[]>}
 */
module.exports.showMessages = function (client) {
    const C2SShowMessagesVO = {};
    return require('.').baseSendCommand(client, NAME, C2SShowMessagesVO, callbacks, (_) => true);
}

module.exports.sne = parseSNE;

/**
 * @param {Client} client
 * @param {{MSG: [][]}} params
 * @returns {Promise<MailMessage[]>}
 */
async function parseSNE(client, params) {
    if (!params?.MSG) return null;
    /** @type {MailMessage[]} */
    const mailMessages = params.MSG.map(m => parseMessageInfo(client, m));
    const newMessages = mailMessages.filter(m => client._mailMessages.findIndex(mm => mm.messageId === m.messageId) === -1).reverse();
    client._mailMessages.push(...newMessages);
    client.emit('mailMessageAdd', newMessages);
    return mailMessages;
}

/**
 * @param {Client} client
 * @param {Array} messageInfo
 * @return {MailMessage}
 */
function parseMessageInfo(client, messageInfo) {
    //scripts/EmpireFourKingdoms/com/goodgamestudios/castle/gameplay/messages/controllers/InitMessageFactoryCommand.as

    /** @type {number} */
    const type = messageInfo[1];
    let subType = 0;
    const message = new BasicMessage(client, messageInfo);
    switch (type) {
        case MessageConst.MESSAGE_TYPE_USER_IN:
        case MessageConst.MESSAGE_TYPE_USER_OUT:
            return new UserMessage(client, messageInfo);
        case MessageConst.MESSAGE_TYPE_SPY_PLAYER:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_SPY_SABOTAGE:
                    const successType = parseInt(message.metadata.split("+")[1]);
                    const isSuccessful = successType === 0 || successType === 3;
                    return isSuccessful ? new SpyPlayerSabotageSuccessfulMessage(client, messageInfo) : new SpyPlayerSabotageFailedMessage(client, messageInfo);
                case MessageConst.SUBTYPE_SPY_DEFENCE:
                    return new SpyPlayerDefenceMessage(client, messageInfo);
                case MessageConst.SUBTYPE_SPY_ECO:
                    return new SpyPlayerEconomicMessage(client, messageInfo);
                default:
                    client.logger.w(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    client.logger.d(messageInfo);
                    return message;
            }
        case MessageConst.MESSAGE_TYPE_SPY_NPC:
            return new SpyNPCMessage(client, messageInfo);
        case MessageConst.MESSAGE_TYPE_BATTLE_LOG:
            subType = message.metadata.split('#')[0].split('+')[1];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_ATTACK_NORMAL:
                    return new BattleLogNormalAttackMessage(client, messageInfo);
                case MessageConst.SUBTYPE_ATTACK_CONQUER:
                    return new BattleLogConquerMessage(client, messageInfo);
                case MessageConst.SUBTYPE_ATTACK_NPC:
                    return new BattleLogNPCAttackMessage(client, messageInfo);
                case MessageConst.SUBTYPE_ATTACK_OCCUPY:
                    return new BattleLogOccupyMessage(client, messageInfo);
                case MessageConst.SUBTYPE_ATTACK_SHADOW:
                    return new ShadowAttackMessage(client, messageInfo);
                default:
                    client.logger.w(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    client.logger.d(messageInfo);
                    return message;
            }
        case MessageConst.MESSAGE_TYPE_MARKET_CARRIAGE_ARRIVED:
            return new MarketCarriageArrivedMessage(client, messageInfo);
        case MessageConst.MESSAGE_TYPE_ALLIANCE_NEWSLETTER:
            return new AllianceNewsMessage(client, messageInfo);
        case MessageConst.MESSAGE_TYPE_STARVE_INFO:
            return new StarveInfoMessage(client, messageInfo);
        case MessageConst.MESSAGE_TYPE_BUILDING_DISABLED:
            return new BreweryMissingResourcesMessage(client, messageInfo);
        case MessageConst.MESSAGE_TYPE_PRIVATE_OFFER:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case MessageConst.PRIVATE_OFFER_TIPPMAIL:
                    return new PrivateOfferTippMessage(client, messageInfo);
                case MessageConst.PRIVATE_OFFER_DUNGEON_TREASURE_CHEST:
                    return new PrivateOfferDungeonChestMessage(client, messageInfo);
                case MessageConst.PRIVATE_OFFER_WHALE_CHEST:
                    return new PrivateOfferWhaleChestMessage(client, messageInfo);
                case MessageConst.PRIVATE_OFFER_TIME_CHALLENGE:
                    return new PrivateOfferTimeChallengeMessage(client, messageInfo);
                case MessageConst.PRIVATE_OFFER_BESTSELLER_SHOP:
                    return new PrivateOfferBestsellerShopMessage(client, messageInfo);
                default:
                    client.logger.w(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    client.logger.d(messageInfo);
                    return message;
            }
        case MessageConst.MESSAGE_TYPE_ATTACK_CANCELLED:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_ATTACK_ABORTED:
                    return new AttackCancelledAbortedMessage(client, messageInfo);
                case MessageConst.SUBTYPE_ATTACK_AUTO_RETREAT:
                    return new AttackCancelledAutoRetreatMessage(client, messageInfo);
                case MessageConst.SUBTYPE_ATTACK_AUTO_RETREAT_ENEMY:
                    return new AttackCancelledAutoRetreatEnemyMessage(client, messageInfo);
                default:
                    client.logger.w(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    client.logger.d(messageInfo);
                    return message;
            }
        case MessageConst.MESSAGE_TYPE_SPY_CANCELLED:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_SPY_ABORTED:
                    return new SpyCancelledAbortedMessage(client, messageInfo);
                default:
                    client.logger.w(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    client.logger.d(messageInfo);
                    return message;
            }
        case MessageConst.MESSAGE_TYPE_SPECIAL_EVENT:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case MessageConst.SPECIAL_ID_SPECIAL_EVENT_START:
                    return new SpecialEventStartMessage(client, messageInfo);
                case MessageConst.SPECIAL_ID_SPECIAL_EVENT_UPDATE:
                    return new SpecialEventUpdateMessage(client, messageInfo);
                case MessageConst.SPECIAL_ID_SPECIAL_EVENT_END:
                    return new SpecialEventEndMessage(client, messageInfo);
                case MessageConst.SPECIAL_ID_VIP_INFORMATION:
                    return new SpecialEventVIPInfoMessage(client, messageInfo);
                case MessageConst.SPECIAL_ID_HOSPITAL_CAPACITY_EXCEEDED:
                    return new SpecialEventHospitalCapacityExceededMessage(client, messageInfo);
                case MessageConst.SPECIAL_ID_MONUMENT:
                    return new SpecialEventMonumentResetMessage(client, messageInfo);
                case MessageConst.SPECIAL_ID_WORLD_CUP:
                case MessageConst.SPECIAL_ID_UNDERWORLD:
                case MessageConst.SPECIAL_ID_THORNKING:
                case MessageConst.SPECIAL_ID_EMPIRE_DEALS_DAYS_MESSAGE:
                case MessageConst.SPECIAL_ID_TERMS_AND_CONDITIONS:
                case MessageConst.SPECIAL_ID_WAR_OF_EMPIRES_1:
                case MessageConst.SPECIAL_ID_WAR_OF_EMPIRES_2:
                case MessageConst.SPECIAL_ID_WAR_OF_EMPIRES_3:
                case MessageConst.SPECIAL_ID_WAR_OF_EMPIRES_REWARD_1:
                case MessageConst.SPECIAL_ID_WAR_OF_EMPIRES_REWARD_2:
                case MessageConst.SPECIAL_ID_WAR_OF_EMPIRES_REWARD_3:
                case MessageConst.SPECIAL_ID_ANNOUNCE_INSTANCE:
                case MessageConst.SPECIAL_ID_FAIR_PLAY_MESSAGE:
                case MessageConst.SPECIAL_ID_ALCHEMIST_RETIREMENT:
                case MessageConst.SPECIAL_ID_TREASURE_MAP_PIECE_FOUND:
                case MessageConst.SPECIAL_ID_LABORATORY:
                case MessageConst.SPECIAL_ID_KINGSTOWER:
                case MessageConst.SPECIAL_ID_METROPOLIS:
                    // Not implemented in source code.
                    return message;
                default:
                    client.logger.w(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    client.logger.d(messageInfo);
                    return message;
            }
        case MessageConst.MESSAGE_TYPE_ALLIANCE_WAR:
            subType = message.metadata.split('*')[0];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_ALLIANCE_ENEMY_ATTACK_WAR:
                    return new AllianceWarEnemyAttackMessage(client, messageInfo);
                case MessageConst.SUBTYPE_ALLIANCE_ENEMY_DECLARED_WAR:
                    return new AllianceWarEnemyDeclarationMessage(client, messageInfo);
                case MessageConst.SUBTYPE_ALLIANCE_OUR_DECLARED_WAR:
                    return new AllianceWarOwnDeclarationMessage(client, messageInfo);
                case MessageConst.SUBTYPE_ALLIANCE_OUR_ATTACK_WAR:
                    return new AllianceWarOwnAttackMessage(client, messageInfo);
                case MessageConst.SUBTYPE_ALLIANCE_OUR_SABOTAGE_WAR:
                    return new AllianceWarOwnSabotageMessage(client, messageInfo);
                case  MessageConst.SUBTYPE_ALLIANCE_ENEMY_END_WAR:
                    return new AllianceWarEnemyEndMessage(client, messageInfo);
                case MessageConst.SUBTYPE_ALLIANCE_ENEMY_SABOTAGE_WAR:
                    return new AllianceWarEnemySabotageMessage(client, messageInfo);
                default:
                    client.logger.w(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    client.logger.d(messageInfo);
                    return message;
            }
        case MessageConst.MESSAGE_TYPE_CONQUERABLE_AREA:
            subType = message.metadata.split('+')[1];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_SIEGE_CANCELED:
                    return new ConquerableSiegeCancelledMessage(client, messageInfo);
                case MessageConst.SUBTYPE_NEW_SIEGE:
                    return new ConquerableNewSiegeMessage(client, messageInfo);
                case MessageConst.SUBTYPE_CONQUERABLE_AREA_CONQUERED:
                    return new ConquerableAreaConqueredMessage(client, messageInfo);
                case MessageConst.SUBTYPE_CONQUERABLE_AREA_LOST:
                    return new ConquerableAreaLostMessage(client, messageInfo);
                default:
                    client.logger.w(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    client.logger.d(messageInfo);
                    return message;
            }
        case MessageConst.MESSAGE_TYPE_HIGHSCORE_BONUS:
            return new HighScoreBonusMessage(client, messageInfo);
        case MessageConst.MESSAGE_TYPE_DOWNTIME_STATUS:
            return new ProductionDowntimeMessage(client, messageInfo);
        case MessageConst.MESSAGE_TYPE_PLAYER_GIFT:
            return new PlayerGiftMessage(client, messageInfo);
        case MessageConst.MESSAGE_TYPE_USER_SURVEY:
            return new UserSurveyMessage(client, messageInfo);
        case MessageConst.MESSAGE_TYPE_REBUY:
            return new RebuyMessage(client, messageInfo);
        case MessageConst.MESSAGE_RUIN_INFO:
            return new RuinInfoMessage(client, messageInfo);
        case MessageConst.MESSAGE_TYPE_POPUP:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_POPUP_REGISTRATION_GIFT:
                    return new PopupRegistrationGiftMessage(client, messageInfo);
                case MessageConst.SUBTYPE_POPUP_FACEBOOK_CONNECTION:
                    return new PopupFacebookConnectionMessage(client, messageInfo);
                case MessageConst.SUBTYPE_POPUP_LOGIN_BONUS:
                    return new PopupLoginBonusMessage(client, messageInfo);
                default:
                    client.logger.w(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    client.logger.d(messageInfo);
                    return message;
            }
        case MessageConst.MESSAGE_TYPE_ALLIANCE_REQUEST:
            return new AllianceRequestMessage(client, messageInfo);
        case MessageConst.MESSAGE_TYPE_PAYMENT_DOPPLER:
            return new DoubleRubiesMessage(client, messageInfo);
        case MessageConst.MESSAGE_TYPE_ATTACK_ADVISOR_FAILURE:
            return new AttackAdvisorFailedMessage(client, messageInfo);
        case MessageConst.MESSAGE_TYPE_ATTACK_ADVISOR_SUMMARY:
            return new AttackAdvisorSummaryMessage(client, messageInfo);
        case MessageConst.MESSAGE_TYPE_ATTACK_COUNT_THRESHOLD:
            return new AttackCountThresholdMessage(client, messageInfo);
        default:
            if (client._mailMessages.find(m => m.messageId === message.messageId) != null) break;
            client.logger.w(`Current MailMessage (messageType ${type}) isn't fully supported!`);
            client.logger.d(messageInfo);
            return message;
    }
}