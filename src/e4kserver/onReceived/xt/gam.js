const Client = require('./../../../Client');
const Movement = require("./../../../structures/BasicMovement");
const ArmyAttackMovement = require('./../../../structures/ArmyAttackMovement');
const ArmyTravelMovement = require('./../../../structures/ArmyTravelMovement');
const ConquerMovement = require('./../../../structures/ConquerMovement');

module.exports = {
    name: "gam",
    /**
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
                case 5: _movement = new ConquerMovement(socket.client, _movObj); break;
                default: {
                    console.log(`Current movement (movementType ${_movObj.M.T}) isn't fully supported!`);
                    if (socket["debug"]){
                        console.log(_movObj);
                        console.log(_movObj.A);
                    }
                    _movement = new Movement(socket.client, _movObj);
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