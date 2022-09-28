'use strict'

const BaseManager = require('./BaseManager');

class MovementManager extends BaseManager {
    /**
     * @type {Movement[]}
     */
    #movements = [];
    /**
     * 
     * @returns {Movement[]}
     */
    get() {
        _checkMovements(this.#movements);
        return [...this.#movements];
    }
    /**
     * 
     * @param {Movement[]} _movements 
     */
    _add_or_update(_movements) {
        _checkMovements(_movements);
        for (let i in _movements) {
            let _newMovement = _movements[i];
            let found = false;
            for (let j in this.#movements) {
                let _oldMovement = this.#movements[j];
                if (_oldMovement.movementId === _newMovement.movementId) {
                    this.#movements[j] = _newMovement;
                    this.emit('movementUpdate', _oldMovement, _newMovement);
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.#movements.push(_newMovement);
                this.emit("movementAdd", _newMovement);
            }
        }
    }
    /**
     * 
     * @param {number} _movementId 
     */
    _remove(_movementId){
        for(let i in this.#movements){
            if(this.#movements[i].movementId === _movementId){
                this.emit('movementCancelled', this.#movements[i]);
                this.#movements.splice(parseInt(i), 1);
            }
        }
    }
}

/**
 * 
 * @param {Movement[]} movements 
 */
function _checkMovements(movements) {
    let movementCount = movements.length;
    for (let i = movementCount - 1; i >= 0; i--) {
        let _movement = movements[i];
        try {
            if (_movement.arrivalTime.getTime() < Date.now()) {
                movements = movements.splice(i, 1);
            }
        }
        catch (e) {
            movements = movements.splice(i, 1);
        }
    }
    return movements;
}

module.exports = MovementManager