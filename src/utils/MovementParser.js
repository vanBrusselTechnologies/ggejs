const ArmyAttackMovement = require('../structures/movements/ArmyAttackMovement');
const ArmyTravelMovement = require('../structures/movements/ArmyTravelMovement');
const SiegeMovement = require('../structures/movements/SiegeMovement');
const MarketMovement = require('../structures/movements/MarketMovement');
const SpyMovement = require('../structures/movements/SpyMovement');
const BasicMovement = require('../structures/movements/BasicMovement');
const CollectorAttackMovement = require('../structures/movements/CollectorAttackMovement');
const SupportDefenceMovement = require("../structures/movements/SupportDefenceMovement");
const TreasureMapMovement = require("../structures/movements/TreasureMapMovement");

/**
 * @param {BaseClient} client
 * @param {{M:{T:number}}} data
 * @returns {Movement}
 */
module.exports.parseMovement = (client, data) => {
    switch (data.M.T) {
        case 0:
            return new ArmyAttackMovement(client, data);
        case 1:
            return new SupportDefenceMovement(client, data);
        case 2:
            return new ArmyTravelMovement(client, data);
        case 3:
            return new SpyMovement(client, data);
        case 4:
            return new MarketMovement(client, data);
        case 5:
            return new SiegeMovement(client, data);
        case 6:
            return new TreasureMapMovement(client, data);
        case 11: //MOVEMENTTYPE_NPC_ATTACK
            return new ArmyAttackMovement(client, data);
        case 18: //MOVEMENTTYPE_FACTION_ATTACK
            return new ArmyAttackMovement(client, data);
        case 20: //MOVEMENTTYPE_ALLIANCE_CAMP_TAUNT_ATTACK
            return new ArmyAttackMovement(client, data);
        case 21: //MOVEMENTTYPE_ALLIANCE_CAMP_ATTACK
            return new ArmyAttackMovement(client, data);
        case 23:
            return new CollectorAttackMovement(client, data);
        case 24: //MOVEMENTTYPE_TEMP_SERVER_COLLECTOR_ATTACK
            return new ArmyAttackMovement(client, data);
        case 25: //MOVEMENTTYPE_TEMP_SERVER_RANKSWAP_ATTACK
            // TODO: TempServerRankSwapattackMapmovementVO // RankSwapattackMapmovementVO
            return new ArmyAttackMovement(client, data);
        case 26: // TODO: DaimyoTownshipDefenseMapmovementVO
            return new SupportDefenceMovement(client, data);
        case 27: // TODO: DaimyoTauntAttackMapmovementVO
            return new ArmyAttackMovement(client, data);
        case 28:
            // TODO: DaimyoCastleAttackMapmovementVO
            return new ArmyAttackMovement(client, data);
        case 29: //MOVEMENTTYPE_ALLIANCE_BATTLE_GROUND_COLLECTOR_ATTACK
            return new ArmyAttackMovement(client, data);
        // TODO:
        default:
            client.logger.w(`Current movement (movementType ${data.M.T}) isn't fully supported!`);
            client.logger.d(data);
            return new BasicMovement(client, data);
    }
}