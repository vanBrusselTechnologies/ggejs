'use strict'

const BaseManager = require('./BaseManager');
const {createArmyAttackMovement} = require("../commands/cra");
const {createMarketMovement} = require("../commands/crm");
const {createSpyMovement} = require("../commands/csm");
const {SpyType, Events} = require("../utils/Constants");
const EmpireError = require("../tools/EmpireError");

class MovementManager extends BaseManager {
    /** @type {Movement[]} */
    #movements = [];

    /**
     * @param {BasicMapobject | CastlePosition} castle1
     * @param {BasicMapobject | CastlePosition} castle2
     */
    static getDistance(castle1, castle2) {
        return Math.sqrt(Math.pow(castle1.position.X - castle2.position.X, 2) + Math.pow(castle1.position.Y - castle2.position.Y, 2));
    }

    /**
     * @param {BasicMapobject | CastlePosition} castle1
     * @param {BasicMapobject | CastlePosition} castle2
     */
    getDistance(castle1, castle2) {
        return MovementManager.getDistance(castle1, castle2);
    }

    /** @returns {Movement[]} */
    get() {
        this.#removeOldMovements(this.#movements);
        return [...this.#movements];
    }

    /**
     * @param {InteractiveMapobject} castleFrom
     * @param {Mapobject | CastlePosition} castleTo
     * @param {ArmyWave[]} army
     * @param {Lord} lord
     * @param {Horse} horse
     */
    async createAttackMovement(castleFrom, castleTo, army, lord, horse = null) {
        try {
            /** @type {{L: {T: [number, number][], U: [number, number][]}, M: {T: [number, number][], U: [number, number][]}, R: {T: [number, number][], U: [number, number][]}}[]} */
            const armyWaves = [];
            for (let i in army) {
                armyWaves.push({L: {U: [], T: []}, M: {U: [], T: []}, R: {U: [], T: []}});
                const wave = army[i];
                for (let unit of (wave.left?.units ?? [])) {
                    armyWaves[i].L.U.push([unit.item.wodId, unit.count]);
                }
                for (let tool of (wave.left?.tools ?? [])) {
                    armyWaves[i].L.T.push([tool.item.wodId, tool.count]);
                }
                for (let unit of (wave.middle?.units ?? [])) {
                    armyWaves[i].M.U.push([unit.item.wodId, unit.count]);
                }
                for (let tool of (wave.middle?.tools ?? [])) {
                    armyWaves[i].M.T.push([tool.item.wodId, tool.count]);
                }
                for (let unit of (wave.right?.units ?? [])) {
                    armyWaves[i].R.U.push([unit.item.wodId, unit.count]);
                }
                for (let tool of (wave.right?.tools ?? [])) {
                    armyWaves[i].R.T.push([tool.item.wodId, tool.count]);
                }
            }
            return await createArmyAttackMovement(this._client, castleFrom, castleTo, armyWaves, lord, horse);
        } catch (errorCode) {
            /* TODO
             *  registerErrorHandler(194,null,"generic_alert_warning","alreadyConquerCapitalMovement");
             *  registerErrorHandler(252,null,"generic_alert_warning","alreadyConquerMetropolMovement");
             *  registerCustomHandler(95,handleCoolingDown);
             *  registerCustomHandler(197,handleIsRelocating);
             *  registerCustomHandler(100,handleHasNoUnits);
             *  registerCustomHandler(291,handleNoPlayerSpawnedYet);
             *  registerCustomHandler(234,handleAttackInProgress);
             */
            const overrideTextId = undefined
            throw new EmpireError(this._client, errorCode, overrideTextId);
        }
    }

    /**
     * @param {InteractiveMapobject} castleFrom
     * @param {Mapobject | CastlePosition} castleTo
     * @param {number} spyCount
     * @param {number} spyType
     * @param {number} spyEffect
     * @param {Horse} horse
     */
    async createSpyMovement(castleFrom, castleTo, spyCount, spyType, spyEffect, horse = null) {
        try {
            spyEffect = spyType === SpyType.Sabotage ? Math.min(Math.max(spyEffect, 10), 50) : Math.min(Math.max(spyEffect, 50), 100);
            return await createSpyMovement(this._client, castleFrom, castleTo, spyCount, spyType, spyEffect, horse);
        } catch (errorCode) {
            throw new EmpireError(this._client, errorCode);
        }
    }

    /**
     * @param {InteractiveMapobject} castleFrom
     * @param {Mapobject | CastlePosition} castleTo
     * @param {Good[]} goods
     * @param {Horse} horse
     */
    async createMarketMovement(castleFrom, castleTo, goods, horse = null) {
        try {
            return await createMarketMovement(this._client, castleFrom, castleTo, goods.map(g => [g.item, g.count]), horse);
        } catch (errorCode) {
            throw new EmpireError(this._client, errorCode);
        }
    }

    /** @param {Movement[]} movements */
    _add_or_update(movements) {
        this.#removeOldMovements(movements);
        for (const newMovement of movements) {
            const index = this.#movements.findIndex(m => m.movementId === newMovement.movementId);
            if (index === -1) {
                this.#movements.push(newMovement);
                this.emit(Events.MOVEMENT_ADD, newMovement);
            } else {
                const oldMovement = this.#movements[index];
                this.#movements[index] = newMovement;
                this.emit(Events.MOVEMENT_UPDATE, oldMovement, newMovement);
            }
        }
    }

    /** @param {number} _movementId */
    _remove(_movementId) {
        for (let i = this.#movements.length - 1; i >= 0; i--) {
            const movement = this.#movements[i];
            if (movement.movementId === _movementId) {
                this.emit(Events.MOVEMENT_CANCEL, movement);
                this.#movements.splice(i, 1);
            }
        }
    }

    #removeOldMovements() {
        const now = Date.now();
        for (let i = this.#movements.length - 1; i >= 0; i--) {
            const movement = this.#movements[i];
            const finalTime = Math.max(movement.arrivalTime?.getTime() ?? 0, movement.endWaitTime?.getTime() ?? 0);
            if (finalTime < now) this.#movements.splice(i, 1);
        }
    }
}

module.exports = MovementManager