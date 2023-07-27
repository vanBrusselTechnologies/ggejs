const ArmyAttackMovement = require('../../../structures/movements/ArmyAttackMovement');
const ArmyTravelMovement = require('../../../structures/movements/ArmyTravelMovement');
const ConquerMovement = require('../../../structures/movements/ConquerMovement');
const MarketMapmovement = require('../../../structures/movements/MarketMovement');
const SpyMovement = require('../../../structures/movements/SpyMovement');
const BasicMovement = require('../../../structures/movements/BasicMovement');
const NpcAttackMovement = require('../../../structures/movements/NpcAttackMovement');
const CollectorAttackMovement = require('../../../structures/movements/CollectorAttackMovement');

module.exports.name = "gam";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params.M) return;
    let i = 0;
    /** @type {Movement[]} */
    let movements = [];
    for (i in params.M) {
        if (!params.M[i]) continue;
        let _movement;
        let _movObj = params.M[i];
        switch (_movObj.M.T) {
            case 0:
                _movement = new ArmyAttackMovement(socket.client, _movObj);
                break;
            case 2:
                _movement = new ArmyTravelMovement(socket.client, _movObj);
                break;
            case 3:
                _movement = new SpyMovement(socket.client, _movObj);
                break;
            case 4:
                _movement = new MarketMapmovement(socket.client, _movObj);
                break;
            case 5:
                _movement = new ConquerMovement(socket.client, _movObj);
                break;
            case 11:
                _movement = new NpcAttackMovement(socket.client, _movObj);
                break;
            case 23:
                _movement = new CollectorAttackMovement(socket.client, _movObj);
                break;
            default: {
                console.log(`Current movement (movementType ${_movObj.M.T}) isn't fully supported!`);
                if (socket.debug) {
                    console.log(_movObj);
                    console.log(_movObj.A);
                }
                _movement = new BasicMovement(socket.client, _movObj);
            }
        }
        if (_movement.sourceArea !== null || _movement.movementType === 6) movements.push(_movement);
        i++;
    }
    /**
     * @type {Client}
     */
    const client = socket.client;
    client.movements._add_or_update(movements);
}