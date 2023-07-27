const Constants = require('./../../../utils/Constants');
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
const {execute: deleteMessage} = require("../../commands/deleteMessageCommand");

module.exports.name = "sne";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{MSG:Array}} params
 */
module.exports.execute = async function (socket, errorCode, params) {
    try {
        if (params?.MSG) await handleSNE(socket, params.MSG);
        socket['isWaitingForSNE'] = false;
    } catch (e) {
        if (socket.debug) console.log(e)
    }
}

/**
 *
 * @param {Socket} socket
 * @param {Array<Array>} msgs
 * @return {Promise<void>}
 */
async function handleSNE(socket, msgs) {
    for (let msg of msgs) {
        try {
            const m = await parseMessageInfo(socket, msg);
            if (m.messageType === Constants.MessageType.BattleLog) {
                if (m.battleLog == null) continue;
                const eq = m.battleLog.rewardEquipment;
                if (eq) {
                    try {
                        await socket.client.equipments._autoSellEquipment(eq);
                    } catch (e) {
                    }
                }
                if (m.battleLog.defender?.playerId < 0 && m.battleLog.mapobject?.areaType === Constants.WorldmapArea.Dungeon) {
                    deleteMessage(socket, m.messageId); //auto delete attacks on dungeons.
                    continue;
                }
            } else if (m.messageType === Constants.MessageType.SpyNPC || m.messageType === Constants.MessageType.SpyPlayer) {
                if (m.subType === Constants.MessageSubType.SpyPlayer.Sabotage && m.spyLog.targetOwner.playerId === socket["___this_player_id"]) {
                    //When receiving sabotage, do not delete;
                } else if (!m.isSuccessful) {
                    deleteMessage(socket, m.messageId); //auto delete failed spies
                    continue;
                } else if (m.spyLog == null) {
                    deleteMessage(socket, m.messageId); //auto delete spies without spylog: outdated or NPC spy
                    continue;
                }
            } else if (m.messageType === Constants.MessageType.SpyCancelled || m.messageType === Constants.MessageType.AttackCancelled) {
                deleteMessage(socket, m.messageId); //auto delete Cancelled/No-Fight Messages
                continue;
            }
            if (socket['mailMessages'].find(mm => mm.messageId === m.messageId) == null) {
                socket.client.emit('mailMessageAdd', m);
                socket['mailMessages'].unshift(m);
            }
        } catch (e) {
            if (socket.debug) console.log(e);
        }
    }
}

/**
 *
 * @param {Socket} socket
 * @param {Array} messageInfo
 * @return {Message}
 */
async function parseMessageInfo(socket, messageInfo) {
    //scripts/EmpireFourKingdoms/com/goodgamestudios/castle/gameplay/messages/controllers/InitMessageFactoryCommand.as

    /** @type {number} */
    const type = messageInfo[1];
    let subType = 0;
    /** @type {Message} */
    let message = new BasicMessage(socket.client, messageInfo);
    let savedMessage = socket['mailMessages'].find(mm => mm.messageId === message.messageId);
    if (savedMessage != null) return savedMessage;
    switch (type) {
        case Constants.MessageType.UserIn:
        case Constants.MessageType.UserOut:
            message = new UserMessage(socket.client, messageInfo);
            try {
                await message.init();
            } catch (e) {
            }
            break;
        case Constants.MessageType.SpyPlayer:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case Constants.MessageSubType.SpyPlayer.Sabotage:
                    const successType = parseInt(message.metadata.split("+")[1]);
                    const isSuccessful = successType === 0 || successType === 3;
                    message = isSuccessful ? new SpyPlayerSabotageSuccessfulMessage(socket.client, messageInfo) : new SpyPlayerSabotageFailedMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.SpyPlayer.Defence:
                    message = new SpyPlayerDefenceMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.SpyPlayer.Economic:
                    message = new SpyPlayerEconomicMessage(socket.client, messageInfo);
                    break;
                default:
                    console.log(`Current Message (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            try {
                await message.init();
            } catch (e) {
            }
            break;
        case Constants.MessageType.SpyNPC:
            message = new SpyNPCMessage(socket.client, messageInfo);
            try {
                await message.init();
            } catch (e) {
            }
            break;
        case Constants.MessageType.BattleLog:
            subType = message.metadata.split('#')[0].split('+')[1];
            switch (parseInt(subType)) {
                case Constants.MessageSubType.BattleLog.NormalAttack:
                    message = new BattleLogNormalAttackMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.BattleLog.Conquer:
                    message = new BattleLogConquerMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.BattleLog.NPCAttack:
                    message = new BattleLogNPCAttackMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.BattleLog.Occupy:
                    message = new BattleLogOccupyMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.BattleLog.ShadowAttack:
                    message = new ShadowAttackMessage(socket.client, messageInfo);
                    break;
                default:
                    console.log(`Current Message (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            try {
                await message.init();
            } catch (e) {
            }
            break;
        case Constants.MessageType.MarketCarriageArrived:
            message = new MarketCarriageArrivedMessage(socket.client, messageInfo);
            try {
                await message.init();
            } catch (e) {
            }
            break;
        case Constants.MessageType.AllianceNewsletter:
            message = new AllianceNewsMessage(socket.client, messageInfo);
            try {
                await message.init();
            } catch (e) {
            }
            break;
        case Constants.MessageType.StarveInfo:
            message = new StarveInfoMessage(socket.client, messageInfo);
            try {
                await message.init();
            } catch (e) {
            }
            break;
        case Constants.MessageType.PrivateOffer:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case Constants.MessageSubType.PrivateOffer.Tipp:
                    message = new PrivateOfferTippMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.PrivateOffer.DungeonChest:
                    message = new PrivateOfferDungeonChestMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.PrivateOffer.WhaleChest:
                    message = new PrivateOfferWhaleChestMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.PrivateOffer.TimeChallenge:
                    message = new PrivateOfferTimeChallengeMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.PrivateOffer.BestsellerShop:
                    message = new PrivateOfferBestsellerShopMessage(socket.client, messageInfo);
                    break;
                default:
                    console.log(`Current Message (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            break;
        case Constants.MessageType.AttackCancelled:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case Constants.MessageSubType.AttackCancelled.Aborted:
                    message = new AttackCancelledAbortedMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.AttackCancelled.AutoRetreat:
                    message = new AttackCancelledAutoRetreatMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.AttackCancelled.AutoRetreatEnemy:
                    message = new AttackCancelledAutoRetreatEnemyMessage(socket.client, messageInfo);
                    break;
                default:
                    console.log(`Current Message (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            break;
        case Constants.MessageType.SpyCancelled:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case Constants.MessageSubType.SpyCancelled.Aborted:
                    message = new SpyCancelledAbortedMessage(socket.client, messageInfo);
                    break;
                default:
                    console.log(`Current Message (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            break;
        case Constants.MessageType.SpecialEvent:
            subType = message.metadata.split('+')[0];
            switch (parseInt(subType)) {
                case Constants.MessageSubType.SpecialEvent.Start:
                    message = new SpecialEventStartMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.SpecialEvent.VIPInfo:
                    message = new SpecialEventVIPInfoMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.SpecialEvent.Update:
                    message = new SpecialEventUpdateMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.SpecialEvent.MonumentReset:
                    message = new SpecialEventMonumentResetMessage(socket.client, messageInfo);
                    break;
                default:
                    console.log(`Current Message (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            break;
        case Constants.MessageType.AllianceWar:
            subType = message.metadata.split('*')[0];
            switch (parseInt(subType)) {
                case Constants.MessageSubType.AllianceWar.EnemyAttack:
                    message = new AllianceWarEnemyAttackMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.AllianceWar.EnemyDeclaration:
                    message = new AllianceWarEnemyDeclarationMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.AllianceWar.OwnDeclaration:
                    message = new AllianceWarOwnDeclarationMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.AllianceWar.OwnAttack:
                    message = new AllianceWarOwnAttackMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.AllianceWar.OwnSabotage:
                    message = new AllianceWarOwnSabotageMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.AllianceWar.EnemyEnd:
                    message = new AllianceWarEnemyEndMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.AllianceWar.EnemySabotage:
                    message = new AllianceWarEnemySabotageMessage(socket.client, messageInfo);
                    break;
                default:
                    console.log(`Current Message (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            break;
        case Constants.MessageType.ConquerableArea:
            subType = message.metadata.split('+')[1];
            switch (parseInt(subType)) {
                case Constants.MessageSubType.ConquerableArea.SiegeCancelled:
                    message = new ConquerableSiegeCancelledMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.ConquerableArea.NewSiege:
                    message = new ConquerableNewSiegeMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.ConquerableArea.AreaConquered:
                    message = new ConquerableAreaConqueredMessage(socket.client, messageInfo);
                    break;
                case Constants.MessageSubType.ConquerableArea.AreaLost:
                    message = new ConquerableAreaLostMessage(socket.client, messageInfo);
                    break;
                default:
                    console.log(`Current Message (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            break;
        case Constants.MessageType.HighscoreBonus:
            message = new HighScoreBonusMessage(socket.client, messageInfo);
            break;
        case Constants.MessageType.DowntimeStatus:
            message = new ProductionDowntimeMessage(socket.client, messageInfo);
            try {
                await message.init();
            } catch (e) {
            }
            break;
        case Constants.MessageType.PlayerGift:
            message = new PlayerGiftMessage(socket.client, messageInfo);
            break;
        case Constants.MessageType.UserSurvey:
            message = new UserSurveyMessage(socket.client, messageInfo);
            break;
        case Constants.MessageType.Rebuy:
            message = new RebuyMessage(socket.client, messageInfo);
            break;
        default:
            if (socket["mailMessages"].find(m => m.messageId === message.messageId) != null) break;
            console.log(`Current Message (messageType ${type}) isn't fully supported!`);
            console.log(messageInfo);
            break;
    }

    return message;
}