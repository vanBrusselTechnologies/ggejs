'use strict'

const BaseManager = require('./BaseManager');
const {execute: sendArmyAttackMovement} = require("../e4kserver/commands/sendArmyAttackMovement");
const {execute: sendMarketMovement} = require("../e4kserver/commands/sendMarketMovement");
const {execute: sendSpyMovement} = require("../e4kserver/commands/sendSpyMovement");
const {SpyType} = require("../utils/Constants");
const Constants = require("../utils/Constants");

class MovementManager extends BaseManager {
    /** @type {Movement[]} */
    #movements = [];

    /**
     * @param {BasicMapobject | CastlePosition} castle1
     * @param {BasicMapobject | CastlePosition} castle2
     */
    getDistance(castle1, castle2) {
        return MovementManager.getDistance(castle1, castle2);
    }

    /**
     * @param {BasicMapobject | CastlePosition} castle1
     * @param {BasicMapobject | CastlePosition} castle2
     */
    static getDistance(castle1, castle2) {
        return Math.sqrt(Math.pow(castle1.position.X - castle2.position.X, 2) + Math.pow(castle1.position.Y - castle2.position.Y, 2));
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
    startAttackMovement(castleFrom, castleTo, army, lord, horse = null) {
        if (castleFrom == null || castleTo == null || army == null || army.length === 0 || lord == null) return;
        /** @type {{L: {T: [number, number][], U: [number, number][]}, M: {T: [number, number][], U: [number, number][]}, R: {T: [number, number][], U: [number, number][]}}[]} */
        const armyWaves = [];
        for (let i in army) {
            armyWaves.push({L: {U: [], T: []}, M: {U: [], T: []}, R: {U: [], T: []}});
            const wave = army[i];
            for (let unit of wave.left.units) {
                armyWaves[i].L.U.push([unit.item.wodId, unit.count]);
            }
            for (let tool of wave.left.tools) {
                armyWaves[i].L.T.push([tool.item.wodId, tool.count]);
            }
            for (let unit of wave.middle.units) {
                armyWaves[i].M.U.push([unit.item.wodId, unit.count]);
            }
            for (let tool of wave.middle.tools) {
                armyWaves[i].M.T.push([tool.item.wodId, tool.count]);
            }
            for (let unit of wave.right.units) {
                armyWaves[i].R.U.push([unit.item.wodId, unit.count]);
            }
            for (let tool of wave.right.tools) {
                armyWaves[i].R.T.push([tool.item.wodId, tool.count]);
            }
        }
        sendArmyAttackMovement(this._socket, castleFrom, castleTo, armyWaves, lord, horse);
    }

    /**
     * @param {InteractiveMapobject} castleFrom
     * @param {Mapobject | CastlePosition} castleTo
     * @param {number} spyCount
     * @param {number} spyType
     * @param {number} spyEffect
     * @param {Horse} horse
     */
    startSpyMovement(castleFrom, castleTo, spyCount, spyType, spyEffect, horse = null) {
        spyEffect = spyType === SpyType.Sabotage ? Math.min(Math.max(spyEffect, 10), 50) : Math.min(Math.max(spyEffect, 50), 100);
        sendSpyMovement(this._socket, castleFrom, castleTo, spyCount, spyType, spyEffect, horse);
    }

    /**
     * @param {InteractiveMapobject} castleFrom
     * @param {Mapobject | CastlePosition} castleTo
     * @param {["W" | "S" | "F" | "C" | "O" | "G" | "I" | "A" | "HONEY" | "MEAD", number][]} goods
     * @param {Horse} horse
     */
    startMarketMovement(castleFrom, castleTo, goods, horse = null) {
        sendMarketMovement(this._socket, castleFrom, castleTo, goods, horse);
    }

    /** @param {Movement[]} _movements */
    _add_or_update(_movements) {
        this.#removeOldMovements(_movements);
        for (let i in _movements) {
            let _newMovement = _movements[i];
            let found = false;
            for (let j in this.#movements) {
                let _oldMovement = this.#movements[j];
                if (_oldMovement.movementId === _newMovement.movementId) {
                    this.#movements[j] = _newMovement;
                    this.emit(Constants.Events.MOVEMENT_UPDATE, _oldMovement, _newMovement);
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.#movements.push(_newMovement);
                this.emit(Constants.Events.MOVEMENT_ADD, _newMovement);
            }
        }
    }

    /** @param {number} _movementId */
    _remove(_movementId) {
        for (let i = this.#movements.length - 1; i >= 0; i--) {
            const _movement = this.#movements[i];
            if (_movement.movementId === _movementId) {
                this.emit(Constants.Events.MOVEMENT_CANCEL, _movement);
                this.#movements.splice(i, 1);
            }
        }
    }

    #removeOldMovements() {
        for (let i = this.#movements.length - 1; i >= 0; i--) {
            const _movement = this.#movements[i];
            if (_movement.arrivalTime == null || _movement.arrivalTime.getTime() < Date.now()) this.#movements.splice(i, 1);
        }
    }
}

module.exports = MovementManager