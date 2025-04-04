const ArmyAttackMovement = require('../../../structures/movements/ArmyAttackMovement');
const ArmyTravelMovement = require('../../../structures/movements/ArmyTravelMovement');
const SiegeMovement = require('../../../structures/movements/SiegeMovement');
const MarketMovement = require('../../../structures/movements/MarketMovement');
const SpyMovement = require('../../../structures/movements/SpyMovement');
const BasicMovement = require('../../../structures/movements/BasicMovement');
const CollectorAttackMovement = require('../../../structures/movements/CollectorAttackMovement');
const SupportDefenceMovement = require("../../../structures/movements/SupportDefenceMovement");
const TreasureMapMovement = require("../../../structures/movements/TreasureMapMovement");

module.exports.name = "gam";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params.M) return;
    socket.client.worldMaps._ownerInfoData.parseOwnerInfoArray(params.O);

    /** @type {Movement[]} */
    const movements = [];
    const movementObjects = params.M.sort((m1, m2) => m1.M.MID - m2.M.MID);
    for (const _movObj of movementObjects) {
        if (!_movObj) continue;
        let _movement;
        switch (_movObj.M.T) {
            case 0:
                _movement = new ArmyAttackMovement(socket.client, _movObj);
                break;
            case 1:
                _movement = new SupportDefenceMovement(socket.client, _movObj);
                break;
            case 2:
                _movement = new ArmyTravelMovement(socket.client, _movObj);
                break;
            case 3:
                _movement = new SpyMovement(socket.client, _movObj);
                break;
            case 4:
                _movement = new MarketMovement(socket.client, _movObj);
                break;
            case 5:
                _movement = new SiegeMovement(socket.client, _movObj);
                break;
            case 6:
                _movement = new TreasureMapMovement(socket.client, _movObj);
                break;
            case 11: //MOVEMENTTYPE_NPC_ATTACK
                _movement = new ArmyAttackMovement(socket.client, _movObj);
                break;
            case 18: //MOVEMENTTYPE_FACTION_ATTACK
                _movement = new ArmyAttackMovement(socket.client, _movObj);
                break;
            case 20: //MOVEMENTTYPE_ALLIANCE_CAMP_TAUNT_ATTACK
                _movement = new ArmyAttackMovement(socket.client, _movObj);
                break;
            case 21: //MOVEMENTTYPE_ALLIANCE_CAMP_ATTACK
                _movement = new ArmyAttackMovement(socket.client, _movObj);
                break;
            case 23:
                _movement = new CollectorAttackMovement(socket.client, _movObj);
                break;
            case 24: //MOVEMENTTYPE_TEMP_SERVER_COLLECTOR_ATTACK
                _movement = new ArmyAttackMovement(socket.client, _movObj);
                break;
            case 25: //MOVEMENTTYPE_TEMP_SERVER_RANKSWAP_ATTACK
                // TODO: TempServerRankSwapattackMapmovementVO // RankSwapattackMapmovementVO
                _movement = new ArmyAttackMovement(socket.client, _movObj);
                break;
            case 28:
                // TODO: DaimyoCastleAttackMapmovementVO
                _movement = new ArmyAttackMovement(socket.client, _movObj);
                break;
            case 29: //MOVEMENTTYPE_ALLIANCE_BATTLE_GROUND_COLLECTOR_ATTACK
                _movement = new ArmyAttackMovement(socket.client, _movObj);
                break;
            //TODO: case ??: DaimyoTownshipDefenseMapmovementVO
            //TODO: case ??: DaimyoTauntAttackMapmovementVO
                //TODO:
            default: {
                console.warn(`Current movement (movementType ${_movObj.M.T}) isn't fully supported!`);
                if (socket.debug) {
                    console.log(_movObj);
                    console.log(_movObj.A);
                }
                _movement = new BasicMovement(socket.client, _movObj);
            }
        }
        if (_movement.sourceArea !== null || _movement.movementType === 6) movements.push(_movement);
    }
    socket.client.movements._add_or_update(movements);
}