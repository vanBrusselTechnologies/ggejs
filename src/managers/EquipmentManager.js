'use strict'

const BaseManager = require('./BaseManager');

class EquipmentManager extends BaseManager {
    /**
     *
     * @type {Lord[]}
     */
    #barons = [];
    /**
     *
     * @type {Lord[]}
     */
    #commandants = []
    /**
     *
     * @type {[]}
     */
    #generals = []

    /**
     *
     * @param {Lord[]} barons
     * @param {Lord[]} commandants
     */
    _setCommandantsAndBarons(barons, commandants) {
        this.#barons = barons;
        this.#commandants = commandants;
    }

    /** @returns {Lord[]} */
    getCommandants = () => [...this.#commandants];

    /** @returns {Lord[]} All idle commandants */
    getAvailableCommandants() {
        const thisPlayerId = this._client.players._thisPlayerId;
        const myMovements = this._client.movements.get().filter(m => (m.direction === 0 && m.sourceArea.ownerId === thisPlayerId) || (m.direction === 1 && m.targetArea.ownerId === thisPlayerId));
        if (myMovements.length === 0) return this.#commandants;
        return this.#commandants.filter(l => {
            let found = false;
            myMovements.every(m => {
                if (m.lord?.id === l.id) {
                    found = true;
                    return false;
                }
                return true;
            })
            return !found;
        })
    }

    /** @returns {Lord[]} */
    getBarons = () => [...this.#barons];
    getGenerals = () => [...this.#generals];
}

module.exports = EquipmentManager;