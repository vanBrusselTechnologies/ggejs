const Constants = require('../../../utils/Constants');
const MessageConst = require('../../../utils/MessageConst');
const BasicMessage = require("../../../structures/messages/BasicMessage");
const UserMessage = require("../../../structures/messages/UserMessage");
const AllianceNewsMessage = require("../../../structures/messages/AllianceNewsMessage");
const PrivateOfferWhaleChestMessage = require("../../../structures/messages/PrivateOfferWhaleChestMessage");
const HighScoreBonusMessage = require("../../../structures/messages/HighScoreBonusMessage");
const BattleLogNormalAttackMessage = require("../../../structures/messages/BattleLogNormalAttackMessage");
const ShadowAttackMessage = require("../../../structures/messages/ShadowAttackMessage");
const BattleLogOccupyMessage = require("../../../structures/messages/BattleLogOccupyMessage");
const BattleLogNPCAttackMessage = require("../../../structures/messages/BattleLogNPCAttackMessage");
const BattleLogConquerMessage = require("../../../structures/messages/BattleLogConquerMessage");
const SpyPlayerSabotageSuccessfulMessage = require("../../../structures/messages/SpyPlayerSabotageSuccessfulMessage");
const SpyPlayerSabotageFailedMessage = require("../../../structures/messages/SpyPlayerSabotageFailedMessage");
const SpyPlayerDefenceMessage = require("../../../structures/messages/SpyPlayerDefenceMessage");
const SpyPlayerEconomicMessage = require("../../../structures/messages/SpyPlayerEconomicMessage");
const SpyNPCMessage = require("../../../structures/messages/SpyNPCMessage");
const MarketCarriageArrivedMessage = require("../../../structures/messages/MarketCarriageArrivedMessage");
const PrivateOfferTippMessage = require("../../../structures/messages/PrivateOfferTippMessage");
const PrivateOfferDungeonChestMessage = require("../../../structures/messages/PrivateOfferDungeonChestMessage");
const PrivateOfferTimeChallengeMessage = require("../../../structures/messages/PrivateOfferTimeChallengeMessage");
const PrivateOfferBestsellerShopMessage = require("../../../structures/messages/PrivateOfferBestsellerShopMessage");
const BreweryMissingResourcesMessage = require('../../../structures/messages/BreweryMissingResourcesMessage');
const StarveInfoMessage = require("../../../structures/messages/StarveInfoMessage");
const AttackCancelledAbortedMessage = require("../../../structures/messages/AttackCancelledAbortedMessage");
const AttackCancelledAutoRetreatMessage = require("../../../structures/messages/AttackCancelledAutoRetreatMessage");
const AttackCancelledAutoRetreatEnemyMessage = require("../../../structures/messages/AttackCancelledAutoRetreatEnemyMessage");
const SpyCancelledAbortedMessage = require("../../../structures/messages/SpyCancelledAbortedMessage");
const ProductionDowntimeMessage = require("../../../structures/messages/ProductionDowntimeMessage");
const PlayerGiftMessage = require('../../../structures/messages/PlayerGiftMessage');
const SpecialEventStartMessage = require("../../../structures/messages/SpecialEventStartMessage");
const SpecialEventVIPInfoMessage = require("../../../structures/messages/SpecialEventVIPInfoMessage");
const SpecialEventMonumentResetMessage = require("../../../structures/messages/SpecialEventMonumentResetMessage");
const AllianceWarEnemyAttackMessage = require("../../../structures/messages/AllianceWarEnemyAttackMessage");
const AllianceWarEnemyDeclarationMessage = require("../../../structures/messages/AllianceWarEnemyDeclarationMessage");
const AllianceWarOwnDeclarationMessage = require("../../../structures/messages/AllianceWarOwnDeclarationMessage");
const AllianceWarOwnSabotageMessage = require("../../../structures/messages/AllianceWarOwnSabotageMessage");
const AllianceWarOwnAttackMessage = require("../../../structures/messages/AllianceWarOwnAttackMessage");
const AllianceWarEnemyEndMessage = require("../../../structures/messages/AllianceWarEnemyEndMessage");
const AllianceWarEnemySabotageMessage = require("../../../structures/messages/AllianceWarEnemySabotageMessage");
const SpecialEventUpdateMessage = require("../../../structures/messages/SpecialEventUpdateMessage");
const UserSurveyMessage = require("../../../structures/messages/UserSurveyMessage");
const ConquerableSiegeCancelledMessage = require("../../../structures/messages/ConquerableSiegeCancelledMessage");
const ConquerableNewSiegeMessage = require("../../../structures/messages/ConquerableNewSiegeMessage");
const ConquerableAreaConqueredMessage = require("../../../structures/messages/ConquerableAreaConqueredMessage");
const ConquerableAreaLostMessage = require("../../../structures/messages/ConquerableAreaLostMessage");
const RebuyMessage = require("../../../structures/messages/RebuyMessage");
const {execute: deleteMessages} = require("../../commands/deleteMessages");
const SpecialEventEndMessage = require("../../../structures/messages/SpecialEventEndMessage");
const RuinInfoMessage = require("../../../structures/messages/RuinInfoMessage");
const PopupRegistrationGiftMessage = require("../../../structures/messages/PopupRegistrationGiftMessage");
const PopupFacebookConnectionMessage = require("../../../structures/messages/PopupFacebookConnectionMessage");
const PopupLoginBonusMessage = require("../../../structures/messages/PopupLoginBonusMessage");
const SpecialEventHospitalCapacityExceededMessage = require("../../../structures/messages/SpecialEventHospitalCapacityExceededMessage");
const AllianceRequestMessage = require("../../../structures/messages/AllianceRequestMessage");
const DoubleRubiesMessage = require("../../../structures/messages/DoubleRubiesMessage");

module.exports.name = "sne";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{MSG:Array}} params
 */
module.exports.execute = async function (socket, errorCode, params) {
    //todo: not same as Source code;
    try {
        if (params?.MSG) await handleSNE(socket, params.MSG);
        socket['isWaitingForSNE'] = false;
    } catch (e) {
        if (socket.debug) console.error(e)
    }
}

/**
 * @param {Socket} socket
 * @param {Array<Array>} messages
 * @return {Promise<void>}
 */
async function handleSNE(socket, messages) {
    const deleteMessageIds = []
    messages.reverse()
    for (const msg of messages) {
        if (socket?._host == null || socket["__disconnecting"] || socket.closed) break;
        try {
            const m = await parseMessageInfo(socket, msg);
            if (socket['mailMessages'].findIndex(mm => mm.messageId === m.messageId) !== -1) continue;
            if (m.messageType === MessageConst.MESSAGE_TYPE_BATTLE_LOG) {
                if (m.battleLog == null) continue;
                const eq = m.battleLog.rewardEquipment;
                if (eq) {
                    try {
                        await socket.client.equipments._autoSellEquipment(eq);
                    } catch (e) {
                    }
                }
                const gem = m.battleLog.rewardGem
                if (gem) {
                    try {
                        await socket.client.equipments._autoSellGem(gem);
                    } catch (e) {
                    }
                }
                if (m.battleLog.defender?.playerId < 0 && m.battleLog.mapobject?.areaType === Constants.WorldMapArea.Dungeon) {
                    deleteMessageIds.push(m.messageId); //auto delete attacks on dungeons.
                    continue;
                }
            } else if (m.messageType === MessageConst.MESSAGE_TYPE_SPY_NPC || m.messageType === MessageConst.MESSAGE_TYPE_SPY_PLAYER) {
                if (m.subType === MessageConst.SUBTYPE_SPY_SABOTAGE && m.spyLog?.targetOwner?.playerId === socket.client.clientUserData.playerId) {
                    //When receiving sabotage, do not delete;
                } else if (!m.isSuccessful) {
                    deleteMessageIds.push(m.messageId); //auto delete failed spies
                    continue;
                } else if (m.spyLog == null) {
                    deleteMessageIds.push(m.messageId); //auto delete spies without spylog: outdated or NPC spy
                    continue;
                } else if (m.subType === MessageConst.SUBTYPE_SPY_SABOTAGE && m.spyLog?.targetOwner?.isRuin) {
                    deleteMessageIds.push(m.messageId); //auto delete sabotage on ruin player: daily quest
                    continue;
                }
            } else if (m.messageType === MessageConst.MESSAGE_TYPE_SPY_CANCELLED || m.messageType === MessageConst.MESSAGE_TYPE_ATTACK_CANCELLED) {
                deleteMessageIds.push(m.messageId); //auto delete Cancelled/No-Fight Messages
                continue;
            }
            if (socket['mailMessages'].findIndex(mm => mm.messageId === m.messageId) === -1) {
                socket.client.emit('mailMessageAdd', m);
                socket['mailMessages'].unshift(m);
            }
        } catch (e) {
            if (socket?._host == null || socket["__disconnecting"] || socket.closed) break;
            if (socket.debug) console.error(e);
        }
    }
    if (deleteMessageIds.length > 0) deleteMessages(socket, deleteMessageIds)
}

/**
 * @param {Socket} socket
 * @param {Array} messageInfo
 * @return {MailMessage}
 */
async function parseMessageInfo(socket, messageInfo) {
    //scripts/EmpireFourKingdoms/com/goodgamestudios/castle/gameplay/messages/controllers/InitMessageFactoryCommand.as

    /** @type {number} */
    const type = messageInfo[1];
    let subType = 0;
    /** @type {MailMessage} */
    let message = new BasicMessage(socket.client, messageInfo);
    let savedMessage = socket['mailMessages'].find(mm => mm.messageId === message.messageId);
    if (savedMessage != null) return savedMessage;
    switch (type) {
        case MessageConst.MESSAGE_TYPE_USER_IN:
        case MessageConst.MESSAGE_TYPE_USER_OUT:
            message = new UserMessage(socket.client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_SPY_PLAYER:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_SPY_SABOTAGE:
                    const successType = parseInt(message.metadata.split("+")[1]);
                    const isSuccessful = successType === 0 || successType === 3;
                    message = isSuccessful ? new SpyPlayerSabotageSuccessfulMessage(socket.client, messageInfo) : new SpyPlayerSabotageFailedMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_SPY_DEFENCE:
                    message = new SpyPlayerDefenceMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_SPY_ECO:
                    message = new SpyPlayerEconomicMessage(socket.client, messageInfo);
                    break;
                default:
                    console.warn(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            break;
        case MessageConst.MESSAGE_TYPE_SPY_NPC:
            message = new SpyNPCMessage(socket.client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_BATTLE_LOG:
            subType = message.metadata.split('#')[0].split('+')[1];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_ATTACK_NORMAL:
                    message = new BattleLogNormalAttackMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ATTACK_CONQUER:
                    message = new BattleLogConquerMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ATTACK_NPC:
                    message = new BattleLogNPCAttackMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ATTACK_OCCUPY:
                    message = new BattleLogOccupyMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ATTACK_SHADOW:
                    message = new ShadowAttackMessage(socket.client, messageInfo);
                    break;
                default:
                    console.warn(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            break;
        case MessageConst.MESSAGE_TYPE_MARKET_CARRIAGE_ARRIVED:
            message = new MarketCarriageArrivedMessage(socket.client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_ALLIANCE_NEWSLETTER:
            message = new AllianceNewsMessage(socket.client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_STARVE_INFO:
            message = new StarveInfoMessage(socket.client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_BUILDING_DISABLED:
            message = new BreweryMissingResourcesMessage(socket.client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_PRIVATE_OFFER:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case MessageConst.PRIVATE_OFFER_TIPPMAIL:
                    message = new PrivateOfferTippMessage(socket.client, messageInfo);
                    break;
                case MessageConst.PRIVATE_OFFER_DUNGEON_TREASURE_CHEST:
                    message = new PrivateOfferDungeonChestMessage(socket.client, messageInfo);
                    break;
                case MessageConst.PRIVATE_OFFER_WHALE_CHEST:
                    message = new PrivateOfferWhaleChestMessage(socket.client, messageInfo);
                    break;
                case MessageConst.PRIVATE_OFFER_TIME_CHALLENGE:
                    message = new PrivateOfferTimeChallengeMessage(socket.client, messageInfo);
                    break;
                case MessageConst.PRIVATE_OFFER_BESTSELLER_SHOP:
                    message = new PrivateOfferBestsellerShopMessage(socket.client, messageInfo);
                    break;
                default:
                    console.warn(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            break;
        case MessageConst.MESSAGE_TYPE_ATTACK_CANCELLED:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_ATTACK_ABORTED:
                    message = new AttackCancelledAbortedMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ATTACK_AUTO_RETREAT:
                    message = new AttackCancelledAutoRetreatMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ATTACK_AUTO_RETREAT_ENEMY:
                    message = new AttackCancelledAutoRetreatEnemyMessage(socket.client, messageInfo);
                    break;
                default:
                    console.warn(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            break;
        case MessageConst.MESSAGE_TYPE_SPY_CANCELLED:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_SPY_ABORTED:
                    message = new SpyCancelledAbortedMessage(socket.client, messageInfo);
                    break;
                default:
                    console.warn(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            break;
        case MessageConst.MESSAGE_TYPE_SPECIAL_EVENT:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case MessageConst.SPECIAL_ID_SPECIAL_EVENT_START:
                    message = new SpecialEventStartMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SPECIAL_ID_SPECIAL_EVENT_UPDATE:
                    message = new SpecialEventUpdateMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SPECIAL_ID_SPECIAL_EVENT_END:
                    message = new SpecialEventEndMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SPECIAL_ID_VIP_INFORMATION:
                    message = new SpecialEventVIPInfoMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SPECIAL_ID_HOSPITAL_CAPACITY_EXCEEDED:
                    message = new SpecialEventHospitalCapacityExceededMessage(socket.client, messageInfo)
                    break;
                case MessageConst.SPECIAL_ID_MONUMENT:
                    message = new SpecialEventMonumentResetMessage(socket.client, messageInfo);
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
                    console.warn(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            break;
        case MessageConst.MESSAGE_TYPE_ALLIANCE_WAR:
            subType = message.metadata.split('*')[0];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_ALLIANCE_ENEMY_ATTACK_WAR:
                    message = new AllianceWarEnemyAttackMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ALLIANCE_ENEMY_DECLARED_WAR:
                    message = new AllianceWarEnemyDeclarationMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ALLIANCE_OUR_DECLARED_WAR:
                    message = new AllianceWarOwnDeclarationMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ALLIANCE_OUR_ATTACK_WAR:
                    message = new AllianceWarOwnAttackMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ALLIANCE_OUR_SABOTAGE_WAR:
                    message = new AllianceWarOwnSabotageMessage(socket.client, messageInfo);
                    break;
                case  MessageConst.SUBTYPE_ALLIANCE_ENEMY_END_WAR:
                    message = new AllianceWarEnemyEndMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_ALLIANCE_ENEMY_SABOTAGE_WAR:
                    message = new AllianceWarEnemySabotageMessage(socket.client, messageInfo);
                    break;
                default:
                    console.warn(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            break;
        case MessageConst.MESSAGE_TYPE_CONQUERABLE_AREA:
            subType = message.metadata.split('+')[1];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_SIEGE_CANCELED:
                    message = new ConquerableSiegeCancelledMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_NEW_SIEGE:
                    message = new ConquerableNewSiegeMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_CONQUERABLE_AREA_CONQUERED:
                    message = new ConquerableAreaConqueredMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_CONQUERABLE_AREA_LOST:
                    message = new ConquerableAreaLostMessage(socket.client, messageInfo);
                    break;
                default:
                    console.warn(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            break;
        case MessageConst.MESSAGE_TYPE_HIGHSCORE_BONUS:
            message = new HighScoreBonusMessage(socket.client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_DOWNTIME_STATUS:
            message = new ProductionDowntimeMessage(socket.client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_PLAYER_GIFT:
            message = new PlayerGiftMessage(socket.client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_USER_SURVEY:
            message = new UserSurveyMessage(socket.client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_REBUY:
            message = new RebuyMessage(socket.client, messageInfo);
            break;
        case MessageConst.MESSAGE_RUIN_INFO:
            message = new RuinInfoMessage(socket.client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_POPUP:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case MessageConst.SUBTYPE_POPUP_REGISTRATION_GIFT:
                    message = new PopupRegistrationGiftMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_POPUP_FACEBOOK_CONNECTION:
                    message = new PopupFacebookConnectionMessage(socket.client, messageInfo);
                    break;
                case MessageConst.SUBTYPE_POPUP_LOGIN_BONUS:
                    message = new PopupLoginBonusMessage(socket.client, messageInfo);
                    break;
                default:
                    console.warn(`Current MailMessage (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            break;
        case MessageConst.MESSAGE_TYPE_ALLIANCE_REQUEST:
            message = new AllianceRequestMessage(socket.client, messageInfo);
            break;
        case MessageConst.MESSAGE_TYPE_PAYMENT_DOPPLER:
            message = new DoubleRubiesMessage(socket.client, messageInfo);
            break;
        default:
            if (socket["mailMessages"].find(m => m.messageId === message.messageId) != null) break;
            console.warn(`Current MailMessage (messageType ${type}) isn't fully supported!`);
            console.log(messageInfo);
            break;
    }
    await message.init();
    return message;
}