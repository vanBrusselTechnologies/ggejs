const {execute: deleteMessages} = require("../commands/deleteMessages");
const Constants = require('../../utils/Constants');
const MessageConst = require('../../utils/MessageConst');
const BasicMessage = require("../../structures/messages/BasicMessage");
const UserMessage = require("../../structures/messages/UserMessage");
const AllianceNewsMessage = require("../../structures/messages/AllianceNewsMessage");
const PrivateOfferWhaleChestMessage = require("../../structures/messages/PrivateOfferWhaleChestMessage");
const HighScoreBonusMessage = require("../../structures/messages/HighScoreBonusMessage");
const BattleLogNormalAttackMessage = require("../../structures/messages/BattleLogNormalAttackMessage");
const ShadowAttackMessage = require("../../structures/messages/ShadowAttackMessage");
const BattleLogOccupyMessage = require("../../structures/messages/BattleLogOccupyMessage");
const BattleLogNPCAttackMessage = require("../../structures/messages/BattleLogNPCAttackMessage");
const BattleLogConquerMessage = require("../../structures/messages/BattleLogConquerMessage");
const SpyPlayerSabotageSuccessfulMessage = require("../../structures/messages/SpyPlayerSabotageSuccessfulMessage");
const SpyPlayerSabotageFailedMessage = require("../../structures/messages/SpyPlayerSabotageFailedMessage");
const SpyPlayerDefenceMessage = require("../../structures/messages/SpyPlayerDefenceMessage");
const SpyPlayerEconomicMessage = require("../../structures/messages/SpyPlayerEconomicMessage");
const SpyNPCMessage = require("../../structures/messages/SpyNPCMessage");
const MarketCarriageArrivedMessage = require("../../structures/messages/MarketCarriageArrivedMessage");
const PrivateOfferTippMessage = require("../../structures/messages/PrivateOfferTippMessage");
const PrivateOfferDungeonChestMessage = require("../../structures/messages/PrivateOfferDungeonChestMessage");
const PrivateOfferTimeChallengeMessage = require("../../structures/messages/PrivateOfferTimeChallengeMessage");
const PrivateOfferBestsellerShopMessage = require("../../structures/messages/PrivateOfferBestsellerShopMessage");
const BreweryMissingResourcesMessage = require('../../structures/messages/BreweryMissingResourcesMessage');
const StarveInfoMessage = require("../../structures/messages/StarveInfoMessage");
const AttackCancelledAbortedMessage = require("../../structures/messages/AttackCancelledAbortedMessage");
const AttackCancelledAutoRetreatMessage = require("../../structures/messages/AttackCancelledAutoRetreatMessage");
const AttackCancelledAutoRetreatEnemyMessage = require("../../structures/messages/AttackCancelledAutoRetreatEnemyMessage");
const SpyCancelledAbortedMessage = require("../../structures/messages/SpyCancelledAbortedMessage");
const ProductionDowntimeMessage = require("../../structures/messages/ProductionDowntimeMessage");
const PlayerGiftMessage = require('../../structures/messages/PlayerGiftMessage');
const SpecialEventStartMessage = require("../../structures/messages/SpecialEventStartMessage");
const SpecialEventVIPInfoMessage = require("../../structures/messages/SpecialEventVIPInfoMessage");
const SpecialEventMonumentResetMessage = require("../../structures/messages/SpecialEventMonumentResetMessage");
const AllianceWarEnemyAttackMessage = require("../../structures/messages/AllianceWarEnemyAttackMessage");
const AllianceWarEnemyDeclarationMessage = require("../../structures/messages/AllianceWarEnemyDeclarationMessage");
const AllianceWarOwnDeclarationMessage = require("../../structures/messages/AllianceWarOwnDeclarationMessage");
const AllianceWarOwnSabotageMessage = require("../../structures/messages/AllianceWarOwnSabotageMessage");
const AllianceWarOwnAttackMessage = require("../../structures/messages/AllianceWarOwnAttackMessage");
const AllianceWarEnemyEndMessage = require("../../structures/messages/AllianceWarEnemyEndMessage");
const AllianceWarEnemySabotageMessage = require("../../structures/messages/AllianceWarEnemySabotageMessage");
const SpecialEventUpdateMessage = require("../../structures/messages/SpecialEventUpdateMessage");
const UserSurveyMessage = require("../../structures/messages/UserSurveyMessage");
const ConquerableSiegeCancelledMessage = require("../../structures/messages/ConquerableSiegeCancelledMessage");
const ConquerableNewSiegeMessage = require("../../structures/messages/ConquerableNewSiegeMessage");
const ConquerableAreaConqueredMessage = require("../../structures/messages/ConquerableAreaConqueredMessage");
const ConquerableAreaLostMessage = require("../../structures/messages/ConquerableAreaLostMessage");
const RebuyMessage = require("../../structures/messages/RebuyMessage");
const SpecialEventEndMessage = require("../../structures/messages/SpecialEventEndMessage");
const RuinInfoMessage = require("../../structures/messages/RuinInfoMessage");
const PopupRegistrationGiftMessage = require("../../structures/messages/PopupRegistrationGiftMessage");
const PopupFacebookConnectionMessage = require("../../structures/messages/PopupFacebookConnectionMessage");
const PopupLoginBonusMessage = require("../../structures/messages/PopupLoginBonusMessage");
const SpecialEventHospitalCapacityExceededMessage = require("../../structures/messages/SpecialEventHospitalCapacityExceededMessage");
const AllianceRequestMessage = require("../../structures/messages/AllianceRequestMessage");
const DoubleRubiesMessage = require("../../structures/messages/DoubleRubiesMessage");
const AttackAdvisorFailedMessage = require("../../structures/messages/AttackAdvisorFailedMessage");
const AttackAdvisorSummaryMessage = require("../../structures/messages/AttackAdvisorSummaryMessage");
const AttackCountThresholdMessage = require("../../structures/messages/AttackCountThresholdMessage");

module.exports.name = "sne";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{MSG:Array}} params
 */
module.exports.execute = async function (client, errorCode, params) {
    // TODO: not same as Source code;
    try {
        if (params?.MSG) await handleSNE(client, params.MSG);
    } catch (e) {
        client.logger.d(e)
    }
}

/**
 * @param {Client} client
 * @param {Array<Array>} messages
 * @return {Promise<void>}
 */
async function handleSNE(client, messages) {
    const deleteMessageIds = []
    messages.reverse()
    for (const msg of messages) {
        try {
            const m = await parseMessageInfo(client, msg);
            if (client._mailMessages.findIndex(mm => mm.messageId === m.messageId) !== -1) continue;
            if (m.messageType === MessageConst.MESSAGE_TYPE_BATTLE_LOG) {
                if (m.battleLog == null) continue;
                const eq = m.battleLog.rewardEquipment;
                if (eq) {
                    try {
                        await client.equipments._autoSellEquipment(eq);
                    } catch (e) {
                        client.logger.d('[SNE]', e);
                    }
                }
                const gem = m.battleLog.rewardGem
                if (gem) {
                    try {
                        await client.equipments._autoSellGem(gem);
                    } catch (e) {
                        client.logger.d('[SNE]', e);
                    }
                }
                if (m.battleLog.defender?.playerId < 0 && m.battleLog.mapobject?.areaType === Constants.WorldMapArea.Dungeon) {
                    deleteMessageIds.push(m.messageId); //auto delete attacks on dungeons.
                    continue;
                }
            } else if (m.messageType === MessageConst.MESSAGE_TYPE_SPY_NPC || m.messageType === MessageConst.MESSAGE_TYPE_SPY_PLAYER) {
                if (m.subType === MessageConst.SUBTYPE_SPY_SABOTAGE && m.spyLog?.targetOwner?.playerId === client.clientUserData.playerId) {
                    // When receiving sabotage, do not delete it
                } else if (!m.isSuccessful) {
                    deleteMessageIds.push(m.messageId); //auto delete failed spies
                    continue;
                } else if (m.spyLog == null) {
                    deleteMessageIds.push(m.messageId); //auto delete spies without spyLog: outdated
                    continue;
                } else if (m.spyLog.targetOwner?.playerId < 0 && m.spyLog.targetMapObject?.areaType === Constants.WorldMapArea.Dungeon) {
                    deleteMessageIds.push(m.messageId); //auto delete spies on dungeons
                    continue;
                } else if (m.subType === MessageConst.SUBTYPE_SPY_SABOTAGE && m.spyLog.targetOwner?.isRuin) {
                    deleteMessageIds.push(m.messageId); //auto delete sabotage on ruin player: daily quest
                    continue;
                }
            } else if (m.messageType === MessageConst.MESSAGE_TYPE_SPY_CANCELLED || m.messageType === MessageConst.MESSAGE_TYPE_ATTACK_CANCELLED) {
                deleteMessageIds.push(m.messageId); //auto delete Cancelled/No-Fight Messages
                continue;
            }
            if (client._mailMessages.findIndex(mm => mm.messageId === m.messageId) === -1) {
                client.emit('mailMessageAdd', m);
                client._mailMessages.unshift(m);
            }
        } catch (e) {
            if (e === "Socket disconnected!") {
                client.logger.d('[SNE]', e);
                break;
            }
            client.logger.d('[SNE]', e, msg);
        }
    }
    if (deleteMessageIds.length > 0) deleteMessages(client, deleteMessageIds);
}

/**
 * @param {Client} client
 * @param {Array} messageInfo
 * @return {MailMessage}
 */
async function parseMessageInfo(client, messageInfo) {
    //scripts/EmpireFourKingdoms/com/goodgamestudios/castle/gameplay/messages/controllers/InitMessageFactoryCommand.as

    /** @type {number} */
    const type = messageInfo[1];
    let subType = 0;
    /** @type {MailMessage} */
    let message = new BasicMessage(client, messageInfo);
    let savedMessage = client._mailMessages.find(mm => mm.messageId === message.messageId);
    if (savedMessage != null) return savedMessage;
    switch (type) {
        case MessageConst.MESSAGE_TYPE_USER_IN:
        case MessageConst.MESSAGE_TYPE_USER_OUT:
            message = new UserMessage(client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_SPY_PLAYER:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_SPY_SABOTAGE:
                    const successType = parseInt(message.metadata.split("+")[1]);
                    const isSuccessful = successType === 0 || successType === 3;
                    message = isSuccessful ? new SpyPlayerSabotageSuccessfulMessage(client, messageInfo) : new SpyPlayerSabotageFailedMessage(client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_SPY_DEFENCE:
                    message = new SpyPlayerDefenceMessage(client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_SPY_ECO:
                    message = new SpyPlayerEconomicMessage(client, messageInfo);
                    break;
                default:
                    client.logger.w(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    client.logger.d(messageInfo);
                    break;
            }
            break;
        case MessageConst.MESSAGE_TYPE_SPY_NPC:
            message = new SpyNPCMessage(client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_BATTLE_LOG:
            subType = message.metadata.split('#')[0].split('+')[1];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_ATTACK_NORMAL:
                    message = new BattleLogNormalAttackMessage(client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ATTACK_CONQUER:
                    message = new BattleLogConquerMessage(client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ATTACK_NPC:
                    message = new BattleLogNPCAttackMessage(client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ATTACK_OCCUPY:
                    message = new BattleLogOccupyMessage(client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ATTACK_SHADOW:
                    message = new ShadowAttackMessage(client, messageInfo);
                    break;
                default:
                    client.logger.w(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    client.logger.d(messageInfo);
                    break;
            }
            break;
        case MessageConst.MESSAGE_TYPE_MARKET_CARRIAGE_ARRIVED:
            message = new MarketCarriageArrivedMessage(client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_ALLIANCE_NEWSLETTER:
            message = new AllianceNewsMessage(client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_STARVE_INFO:
            message = new StarveInfoMessage(client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_BUILDING_DISABLED:
            message = new BreweryMissingResourcesMessage(client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_PRIVATE_OFFER:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case MessageConst.PRIVATE_OFFER_TIPPMAIL:
                    message = new PrivateOfferTippMessage(client, messageInfo);
                    break;
                case MessageConst.PRIVATE_OFFER_DUNGEON_TREASURE_CHEST:
                    message = new PrivateOfferDungeonChestMessage(client, messageInfo);
                    break;
                case MessageConst.PRIVATE_OFFER_WHALE_CHEST:
                    message = new PrivateOfferWhaleChestMessage(client, messageInfo);
                    break;
                case MessageConst.PRIVATE_OFFER_TIME_CHALLENGE:
                    message = new PrivateOfferTimeChallengeMessage(client, messageInfo);
                    break;
                case MessageConst.PRIVATE_OFFER_BESTSELLER_SHOP:
                    message = new PrivateOfferBestsellerShopMessage(client, messageInfo);
                    break;
                default:
                    client.logger.w(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    client.logger.d(messageInfo);
                    break;
            }
            break;
        case MessageConst.MESSAGE_TYPE_ATTACK_CANCELLED:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_ATTACK_ABORTED:
                    message = new AttackCancelledAbortedMessage(client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ATTACK_AUTO_RETREAT:
                    message = new AttackCancelledAutoRetreatMessage(client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ATTACK_AUTO_RETREAT_ENEMY:
                    message = new AttackCancelledAutoRetreatEnemyMessage(client, messageInfo);
                    break;
                default:
                    client.logger.w(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    client.logger.d(messageInfo);
                    break;
            }
            break;
        case MessageConst.MESSAGE_TYPE_SPY_CANCELLED:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_SPY_ABORTED:
                    message = new SpyCancelledAbortedMessage(client, messageInfo);
                    break;
                default:
                    client.logger.w(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    client.logger.d(messageInfo);
                    break;
            }
            break;
        case MessageConst.MESSAGE_TYPE_SPECIAL_EVENT:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case MessageConst.SPECIAL_ID_SPECIAL_EVENT_START:
                    message = new SpecialEventStartMessage(client, messageInfo);
                    break;
                case MessageConst.SPECIAL_ID_SPECIAL_EVENT_UPDATE:
                    message = new SpecialEventUpdateMessage(client, messageInfo);
                    break;
                case MessageConst.SPECIAL_ID_SPECIAL_EVENT_END:
                    message = new SpecialEventEndMessage(client, messageInfo);
                    break;
                case MessageConst.SPECIAL_ID_VIP_INFORMATION:
                    message = new SpecialEventVIPInfoMessage(client, messageInfo);
                    break;
                case MessageConst.SPECIAL_ID_HOSPITAL_CAPACITY_EXCEEDED:
                    message = new SpecialEventHospitalCapacityExceededMessage(client, messageInfo)
                    break;
                case MessageConst.SPECIAL_ID_MONUMENT:
                    message = new SpecialEventMonumentResetMessage(client, messageInfo);
                    break;
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
                    break;
                default:
                    client.logger.w(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    client.logger.d(messageInfo);
                    break;
            }
            break;
        case MessageConst.MESSAGE_TYPE_ALLIANCE_WAR:
            subType = message.metadata.split('*')[0];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_ALLIANCE_ENEMY_ATTACK_WAR:
                    message = new AllianceWarEnemyAttackMessage(client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ALLIANCE_ENEMY_DECLARED_WAR:
                    message = new AllianceWarEnemyDeclarationMessage(client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ALLIANCE_OUR_DECLARED_WAR:
                    message = new AllianceWarOwnDeclarationMessage(client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ALLIANCE_OUR_ATTACK_WAR:
                    message = new AllianceWarOwnAttackMessage(client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ALLIANCE_OUR_SABOTAGE_WAR:
                    message = new AllianceWarOwnSabotageMessage(client, messageInfo);
                    break;
                case  MessageConst.SUBTYPE_ALLIANCE_ENEMY_END_WAR:
                    message = new AllianceWarEnemyEndMessage(client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ALLIANCE_ENEMY_SABOTAGE_WAR:
                    message = new AllianceWarEnemySabotageMessage(client, messageInfo);
                    break;
                default:
                    client.logger.w(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    client.logger.d(messageInfo);
                    break;
            }
            break;
        case MessageConst.MESSAGE_TYPE_CONQUERABLE_AREA:
            subType = message.metadata.split('+')[1];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_SIEGE_CANCELED:
                    message = new ConquerableSiegeCancelledMessage(client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_NEW_SIEGE:
                    message = new ConquerableNewSiegeMessage(client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_CONQUERABLE_AREA_CONQUERED:
                    message = new ConquerableAreaConqueredMessage(client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_CONQUERABLE_AREA_LOST:
                    message = new ConquerableAreaLostMessage(client, messageInfo);
                    break;
                default:
                    client.logger.w(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    client.logger.d(messageInfo);
                    break;
            }
            break;
        case MessageConst.MESSAGE_TYPE_HIGHSCORE_BONUS:
            message = new HighScoreBonusMessage(client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_DOWNTIME_STATUS:
            message = new ProductionDowntimeMessage(client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_PLAYER_GIFT:
            message = new PlayerGiftMessage(client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_USER_SURVEY:
            message = new UserSurveyMessage(client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_REBUY:
            message = new RebuyMessage(client, messageInfo);
            break;
        case MessageConst.MESSAGE_RUIN_INFO:
            message = new RuinInfoMessage(client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_POPUP:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_POPUP_REGISTRATION_GIFT:
                    message = new PopupRegistrationGiftMessage(client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_POPUP_FACEBOOK_CONNECTION:
                    message = new PopupFacebookConnectionMessage(client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_POPUP_LOGIN_BONUS:
                    message = new PopupLoginBonusMessage(client, messageInfo);
                    break;
                default:
                    client.logger.w(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    client.logger.d(messageInfo);
                    break;
            }
            break;
        case MessageConst.MESSAGE_TYPE_ALLIANCE_REQUEST:
            message = new AllianceRequestMessage(client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_PAYMENT_DOPPLER:
            message = new DoubleRubiesMessage(client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_ATTACK_ADVISOR_FAILURE:
            message = new AttackAdvisorFailedMessage(client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_ATTACK_ADVISOR_SUMMARY:
            message = new AttackAdvisorSummaryMessage(client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_ATTACK_COUNT_THRESHOLD:
            message = new AttackCountThresholdMessage(client, messageInfo);
            break;
        default:
            if (client._mailMessages.find(m => m.messageId === message.messageId) != null) break;
            client.logger.w(`Current MailMessage (messageType ${type}) isn't fully supported!`);
            client.logger.d(messageInfo);
            break;
    }
    try {
        await message.init();
    } catch (e) {
        if (e === 130) deleteMessages(client, [message.messageId]);
        if (e === 225) deleteMessages(client, [message.messageId]);
        throw e;
    }
    return message;
}