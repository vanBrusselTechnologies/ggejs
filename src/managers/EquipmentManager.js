'use strict'

const BaseManager = require('./BaseManager');
const {execute: sellEquipment} = require('./../e4kserver/commands/sellEquipmentCommand');
const Constants = require("../utils/Constants");
const {WaitUntil} = require("../tools/wait");

class EquipmentManager extends BaseManager {
    /** @type {Lord[]} */
    #barons = [];
    /** @type {Lord[]} */
    #commandants = [];
    /** @type {General[]} */
    #generals = [];
    /** @type {(Equipment|RelicEquipment)[]} */
    #equipmentInventory = [];
    /** @type {number} */
    #atOrBelowDeleteRarity = -1;
    /** @type {number} */
    #equipmentSpaceLeft = -1;
    /** @type {number} */
    #equipmentTotalInventorySpace = -1;
    /** @type {number} */
    #gemSpaceLeft = -1;
    /** @type {number} */
    #gemTotalInventorySpace = -1;

    /** @param {number} rarity */
    set autoDeleteAtOrBelowRarity(rarity) {
        this.#atOrBelowDeleteRarity = rarity % 10;
    }

    get equipmentSpaceLeft(){
        return this.#equipmentSpaceLeft;
    }

    /** @param {number} val */
    set equipmentSpaceLeft(val){
        this.#equipmentSpaceLeft = val;
    }

    get equipmentTotalInventorySpace(){
        return this.#equipmentTotalInventorySpace;
    }

    /** @param {number} val */
    set equipmentTotalInventorySpace(val){
        this.#equipmentTotalInventorySpace = val;
    }

    get gemSpaceLeft(){
        return this.#gemSpaceLeft;
    }

    /** @param {number} val */
    set gemSpaceLeft(val){
        this.#gemSpaceLeft = val;
    }

    get gemTotalInventorySpace(){
        return this.#gemTotalInventorySpace;
    }

    /** @param {number} val */
    set gemTotalInventorySpace(val){
        this.#gemTotalInventorySpace = val;
    }

    /**
     *
     * @param {Lord[]} barons
     * @param {Lord[]} commandants
     */
    _setCommandantsAndBarons(barons, commandants) {
        this.#barons = barons;
        this.#commandants = commandants;
    }

    /**
     *
     * @param {General[]} generals
     */
    _setGenerals(generals) {
        this.#generals = generals;
    }

    /**
     * @param {Equipment[]} equipments
     */
    _setEquipmentInventory(equipments) {
        this.#equipmentInventory = equipments
    }

    /** @returns {Lord[]} */
    getCommandants = () => [...this.#commandants];

    /** @returns {Lord[]} All idle commandants */
    getAvailableCommandants() {
        const thisPlayerId = this._client.clientUserData.playerId;
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

    /** @returns {General[]} */
    getGenerals = () => [...this.#generals];

    /** @returns {(Equipment|RelicEquipment)[]} */
    getEquipmentInventory = () => [...this.#equipmentInventory];

    /** @param {Equipment | RelicEquipment} equipment */
    sellEquipment(equipment) {
        return new Promise(async (resolve) => {
            try {
                sellEquipment(this._socket, equipment.id, equipment.equippedLord?.id ?? -1);
                await WaitUntil(this._socket, "seq -> sold", 'seq -> errorCode', 10000);
                let i = 0;
                for (let eq of this.#equipmentInventory) {
                    if (eq.id === equipment.id) {
                        this.#equipmentInventory.splice(i, 1);
                    }
                    i++
                }
                this._socket["seq -> sold"] = false;
                resolve();
            } catch (e) {
                resolve()
            }
        })
    }

    /** @param {number} rarity */
    sellAllEquipmentsAtOrBelowRarity(rarity) {
        return new Promise(async (resolve, reject) => {
            try {
                rarity %= 10; //hero starts with 10 instead of 0
                if (rarity > Constants.EquipmentRarity.Relic) return;
                const socket = this._socket;
                if (rarity === Constants.EquipmentRarity.Unique) {
                    for (let i = this.#equipmentInventory.length - 1; i >= 0; i--) {
                        const e = this.#equipmentInventory[i];
                        if ((e.rarityId % 10) <= Constants.EquipmentRarity.Legendary) {
                            sellEquipment(socket, e.id, -1);
                            await WaitUntil(socket, "seq -> sold");
                            this.#equipmentInventory.splice(i, 1);
                            socket["seq -> sold"] = false;
                        }
                    }
                } else if (rarity <= Constants.EquipmentRarity.Legendary) {
                    for (let i = this.#equipmentInventory.length - 1; i >= 0; i--) {
                        const e = this.#equipmentInventory[i];
                        if ((e.rarityId % 10) <= rarity && (e.rarityId % 10) !== Constants.EquipmentRarity.Unique) {
                            sellEquipment(socket, e.id, -1);
                            await WaitUntil(socket, "seq -> sold");
                            this.#equipmentInventory.splice(i, 1);
                            socket["seq -> sold"] = false;
                        }
                    }
                } else {
                    for (let i = this.#equipmentInventory.length - 1; i >= 0; i--) {
                        const e = this.#equipmentInventory[i];
                        if ((e.rarityId % 10) <= rarity) {
                            sellEquipment(socket, e.id, -1);
                            await WaitUntil(socket, "seq -> sold");
                            this.#equipmentInventory.splice(i, 1);
                            socket["seq -> sold"] = false;
                        }
                    }
                }
                resolve();
            }
            catch (e) {
                reject(e);
            }
        })
    }

    /**
     *
     * @param {Equipment | RelicEquipment} e
     * @return {Promise<void>}
     * @private
     */
    _autoSellEquipment(e) {
        return new Promise(async (resolve, reject) => {
            const rarity = this.#atOrBelowDeleteRarity;
            if (rarity > Constants.EquipmentRarity.Relic) return;
            try {
                const socket = this._socket;
                if (rarity === Constants.EquipmentRarity.Unique) {
                    if ((e.rarityId % 10) <= Constants.EquipmentRarity.Legendary) {
                        sellEquipment(socket, e.id, -1);
                        await WaitUntil(socket, "seq -> sold", 'seq -> errorCode', 1000);
                        socket["seq -> sold"] = false;
                    }
                } else if (rarity <= Constants.EquipmentRarity.Legendary) {
                    if ((e.rarityId % 10) <= rarity && (e.rarityId % 10) !== Constants.EquipmentRarity.Unique) {
                        sellEquipment(socket, e.id, -1);
                        await WaitUntil(socket, "seq -> sold", 'seq -> errorCode', 1000);
                        socket["seq -> sold"] = false;
                    }
                } else {
                    if ((e.rarityId % 10) <= rarity) {
                        sellEquipment(socket, e.id, -1);
                        await WaitUntil(socket, "seq -> sold", 'seq -> errorCode', 1000);
                        socket["seq -> sold"] = false;
                    }
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        })
    }
}

module.exports = EquipmentManager;