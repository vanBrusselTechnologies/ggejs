const Constants = require('./../../../utils/Constants');
const BasicMessage = require("../../../structures/BasicMessage");
const UserMessage = require("../../../structures/UserMessage");
const AllianceNewsMessage = require("../../../structures/AllianceNewsMessage");
const PrivateOfferWhaleChestMessage = require("../../../structures/PrivateOfferWhaleChestMessage");
const HighScoreBonusMessage = require("../../../structures/HighScoreBonusMessage");
const BattleLogNormalAttackMessage = require("../../../structures/BattleLogNormalAttackMessage");
const ShadowAttackMessage = require("../../../structures/ShadowAttackMessage");
const BattleLogOccupyMessage = require("../../../structures/BattleLogOccupyMessage");
const BattleLogNPCAttackMessage = require("../../../structures/BattleLogNPCAttackMessage");
const BattleLogConquerMessage = require("../../../structures/BattleLogConquerMessage");
const SpyPlayerSabotageSuccessfulMessage = require("../../../structures/SpyPlayerSabotageSuccessfulMessage");
const SpyPlayerSabotageFailedMessage = require("../../../structures/SpyPlayerSabotageFailedMessage");
const SpyPlayerDefenceMessage = require("../../../structures/SpyPlayerDefenceMessage");
const SpyPlayerEconomicMessage = require("../../../structures/SpyPlayerEconomicMessage");
const SpyNPCMessage = require("../../../structures/SpyNPCMessage");
const {execute: deleteMessage} = require("../../commands/deleteMessageCommand");
const MarketCarriageArrivedMessage = require("../../../structures/MarketCarriageArrivedMessage");
const PrivateOfferTippMessage = require("../../../structures/PrivateOfferTippMessage");
const PrivateOfferDungeonChestMessage = require("../../../structures/PrivateOfferDungeonChestMessage");
const PrivateOfferTimeChallengeMessage = require("../../../structures/PrivateOfferTimeChallengeMessage");
const PrivateOfferBestsellerShopMessage = require("../../../structures/PrivateOfferBestsellerShopMessage");
const StarveInfoMessage = require("../../../structures/StarveInfoMessage");
const AttackCancelledAbortedMessage = require("../../../structures/AttackCancelledAbortedMessage");
const AttackCancelledAutoRetreatMessage = require("../../../structures/AttackCancelledAutoRetreatMessage");
const AttackCancelledAutoRetreatEnemyMessage = require("../../../structures/AttackCancelledAutoRetreatEnemyMessage");
const SpyCancelledAbortedMessage = require("../../../structures/SpyCancelledAbortedMessage");
const ProductionDowntimeMessage = require("../../../structures/ProductionDowntimeMessage");
const PlayerGiftMessage = require('../../../structures/PlayerGiftMessage');
const SpecialEventStartMessage = require("../../../structures/SpecialEventStartMessage");
const SpecialEventVIPInfoMessage = require("../../../structures/SpecialEventVIPInfoMessage");
const SpecialEventMonumentResetMessage = require("../../../structures/SpecialEventMonumentResetMessage");
const AllianceWarEnemyAttackMessage = require("../../../structures/AllianceWarEnemyAttackMessage");
const AllianceWarEnemyDeclarationMessage = require("../../../structures/AllianceWarEnemyDeclarationMessage");
const AllianceWarOwnDeclarationMessage = require("../../../structures/AllianceWarOwnDeclarationMessage");
const AllianceWarOwnSabotageMessage = require("../../../structures/AllianceWarOwnSabotageMessage");
const AllianceWarOwnAttackMessage = require("../../../structures/AllianceWarOwnAttackMessage");
const AllianceWarEnemyEndMessage = require("../../../structures/AllianceWarEnemyEndMessage");
const AllianceWarEnemySabotageMessage = require("../../../structures/AllianceWarEnemySabotageMessage");
const SpecialEventUpdateMessage = require("../../../structures/SpecialEventUpdateMessage");
const UserSurveyMessage = require("../../../structures/UserSurveyMessage");
const ConquerableSiegeCancelledMessage = require("../../../structures/ConquerableSiegeCancelledMessage");
const ConquerableNewSiegeMessage = require("../../../structures/ConquerableNewSiegeMessage");
const ConquerableAreaConqueredMessage = require("../../../structures/ConquerableAreaConqueredMessage");
const ConquerableAreaLostMessage = require("../../../structures/ConquerableAreaLostMessage");
const RebuyMessage = require("../../../structures/RebuyMessage");

module.exports = {
    name: "sne", /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {{MSG:Array}} params
     */
    async execute(socket, errorCode, params) {
        try {
            if (params?.MSG) await handleSNE(socket, params.MSG);
            socket['isWaitingForSNE'] = false;
        }
        catch (e) {
            console.log(e)
        }
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
                if (!m.isSuccessful) {
                    deleteMessage(socket, m.messageId); //auto delete failed spies
                    continue;
                } else if (m.spyLog == null) {
                    deleteMessage(socket, m.messageId); //auto delete spies without log: outdated or NPC spy
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
        }
        catch (e) {

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
                case 0:
                    const successType = parseInt(message.metadata.split("+")[1]);
                    const isSuccessful = successType === 0 || successType === 3;
                    message = isSuccessful ? new SpyPlayerSabotageSuccessfulMessage(socket.client, messageInfo) : new SpyPlayerSabotageFailedMessage(socket.client, messageInfo);
                    break;
                case 1:
                    message = new SpyPlayerDefenceMessage(socket.client, messageInfo);
                    break;
                case 2:
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
                case 0:
                    message = new BattleLogNormalAttackMessage(socket.client, messageInfo);
                    break;
                case 1:
                    message = new BattleLogConquerMessage(socket.client, messageInfo);
                    break;
                case 2:
                    message = new BattleLogNPCAttackMessage(socket.client, messageInfo);
                    break;
                case 3:
                    message = new BattleLogOccupyMessage(socket.client, messageInfo);
                    break;
                case 4:
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
                case 1:
                    message = new PrivateOfferTippMessage(socket.client, messageInfo);
                    break;
                case 5:
                    message = new PrivateOfferDungeonChestMessage(socket.client, messageInfo);
                    break;
                case 6:
                    message = new PrivateOfferWhaleChestMessage(socket.client, messageInfo);
                    break;
                case 12:
                    message = new PrivateOfferTimeChallengeMessage(socket.client, messageInfo);
                    break;
                case 14:
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
                case 0:
                    message = new AttackCancelledAbortedMessage(socket.client, messageInfo);
                    break;
                case 1:
                    message = new AttackCancelledAutoRetreatMessage(socket.client, messageInfo);
                    break;
                case 2:
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
                case 0:
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
                case 12:
                    message = new SpecialEventStartMessage(socket.client, messageInfo);
                    break;
                case 16:
                    message = new SpecialEventVIPInfoMessage(socket.client, messageInfo);
                    break;
                case 32:
                    message = new SpecialEventUpdateMessage(socket.client, messageInfo);
                    break;
                case 66:
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
                case 0:
                    message = new AllianceWarEnemyAttackMessage(socket.client, messageInfo);
                    break;
                case 1:
                    message = new AllianceWarEnemyDeclarationMessage(socket.client, messageInfo);
                    break;
                case 2:
                    message = new AllianceWarOwnDeclarationMessage(socket.client, messageInfo);
                    break;
                case 3:
                    message = new AllianceWarOwnAttackMessage(socket.client, messageInfo);
                    break;
                case 4:
                    message = new AllianceWarOwnSabotageMessage(socket.client, messageInfo);
                    break;
                case 5:
                    message = new AllianceWarEnemyEndMessage(socket.client, messageInfo);
                    break;
                case 6:
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
                case 0:
                    message = new ConquerableSiegeCancelledMessage(socket.client, messageInfo);
                    break;
                case 1:
                    message = new ConquerableNewSiegeMessage(socket.client, messageInfo);
                    break;
                case 2:
                    message = new ConquerableAreaConqueredMessage(socket.client, messageInfo);
                    break;
                case 3:
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