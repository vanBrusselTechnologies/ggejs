const ArmyAttackMovement = require('./../../../structures/ArmyAttackMovement');
const ArmyTravelMovement = require('./../../../structures/ArmyTravelMovement');
const ConquerMovement = require('./../../../structures/ConquerMovement');
const MarketMapmovement = require('./../../../structures/MarketMovement');
const SpyMovement = require('./../../../structures/SpyMovement');
const BasicMovement = require('./../../../structures/BasicMovement');
const NpcAttackMovement = require('./../../../structures/NpcAttackMovement');
const CollectorAttackMovement = require('./../../../structures/CollectorAttackMovement');

module.exports = {
    name: "gam",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if (!params.M) {
            return;
        }
        let i = 0;
        let _movementsArray = [];
        for (i in params.M) {
            if (!params.M[i]) continue;
            let _movement;
            let _movObj = params.M[i];
            switch (_movObj.M.T) {
                case 0: _movement = new ArmyAttackMovement(socket.client, _movObj); break;
                case 2: _movement = new ArmyTravelMovement(socket.client, _movObj); break;
                case 3: _movement = new SpyMovement(socket.client, _movObj); break;
                case 4: _movement = new MarketMapmovement(socket.client, _movObj); break;
                case 5: _movement = new ConquerMovement(socket.client, _movObj); break;
                case 11: _movement = new NpcAttackMovement(socket.client, _movObj); break;
                case 23: _movement = new CollectorAttackMovement(socket.client, _movObj); break;
                default: {
                    console.log(`Current movement (movementType ${_movObj.M.T}) isn't fully supported!`);
                    if (socket["debug"]){
                        console.log(_movObj);
                        console.log(_movObj.A);
                    }
                    _movement = new BasicMovement(socket.client, _movObj);
                }
            }
            if (_movement.sourceArea !== null || _movement.movementType === 6)
                _movementsArray.push(_movement);
            i++;
        }
        /**
         * @type {Client}
         */
        const client = socket.client;
        client.movements._add_or_update(_movementsArray);
    }
}