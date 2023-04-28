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
const SpecialEventStartMessage = require("../../../structures/SpecialEventStartMessage");

module.exports = {
    name: "sne", /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {{MSG:Array}} params
     */
    async execute(socket, errorCode, params) {
        if (!params?.MSG) return;
        const msgs = params.MSG;
        /** @type {Message[]} */
        const messages = [];
        for (let msg of msgs) {
            messages.push(await parseMessageInfo(socket, msg));
        }
        for (let m of messages) {
            if (m.messageType === Constants.MessageType.BattleLog) {
                const eq = m.battleLog?.rewardEquipment;
                if (eq) {
                    try {
                        await socket.client.equipments._autoSellEquipment(eq);
                    } catch (e) {
                    }
                }
                if (m.battleLog?.defender?.playerId < 0 && m.battleLog?.mapobject?.areaType === Constants.WorldmapArea.Dungeon) {
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
        socket['isWaitingForSNE'] = false;
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
    if (socket["sneRequestCount"] % 60 !== 0) {
        let savedMessage = socket['mailMessages'].find(mm => mm.messageId === message.messageId);
        if (savedMessage != null) return savedMessage;
    }
    switch (type) {
        case Constants.MessageType.UserIn:
        case Constants.MessageType.UserOut:
            message = new UserMessage(socket.client, messageInfo);
            await message.init();
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
                    if (socket["mailMessages"].find(m => m.messageId === message.messageId) != null) break;
                    console.log(`Current Message (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            await message.init();
            break;
        case Constants.MessageType.SpyNPC:
            message = new SpyNPCMessage(socket.client, messageInfo);
            await message.init();
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
                    if (socket["mailMessages"].find(m => m.messageId === message.messageId) != null) break;
                    console.log(`Current Message (messageType ${type}, subType ${subType}) isn't fully supported!`);
                    console.log(messageInfo);
                    break;
            }
            await message.init();
            break;
        case Constants.MessageType.MarketCarriageArrived:
            message = new MarketCarriageArrivedMessage(socket.client, messageInfo);
            await message.init();
            break;
        case Constants.MessageType.AllianceNewsletter:
            message = new AllianceNewsMessage(socket.client, messageInfo);
            await message.init();
            break;
        case Constants.MessageType.StarveInfo:
            message = new StarveInfoMessage(socket.client, messageInfo);
            await message.init();
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
                    if (socket["mailMessages"].find(m => m.messageId === message.messageId) != null) break;
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
                    if (socket["mailMessages"].find(m => m.messageId === message.messageId) != null) break;
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
                    if (socket["mailMessages"].find(m => m.messageId === message.messageId) != null) break;
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
                default:
                    if (socket["mailMessages"].find(m => m.messageId === message.messageId) != null) break;
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
            await message.init();
            break;
        default:
            if (socket["mailMessages"].find(m => m.messageId === message.messageId) != null) break;
            console.log(`Current Message (messageType ${type}) isn't fully supported!`);
            console.log(messageInfo);
            break;
    }

    return message;
}