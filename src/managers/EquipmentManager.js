'use strict'

const {equipment_slots} = require('e4k-data').data;
const BaseManager = require('./BaseManager');
const {sellEquipment} = require('../commands/seq');
const {sellGem} = require('../commands/sge');
const Constants = require("../utils/Constants");

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
    /** @type {{gem:Gem, amount: number}[]} */
    #regularGemInventory = [];
    /** @type {RelicGem[]} */
    #relicGemInventory = [];
    /** @type {number} */
    #atOrBelowDeleteGemLevel = -1;
    /** @type {number} */
    #gemSpaceLeft = -1;
    /** @type {number} */
    #gemTotalInventorySpace = -1;

    /** @param {number} rarity */
    set autoDeleteAtOrBelowRarity(rarity) {
        this.#atOrBelowDeleteRarity = rarity % 10;
    }

    /** @param level */
    set autoDeleteAtOrBelowGemLevel(level) {
        this.#atOrBelowDeleteGemLevel = level;
    }

    get equipmentSpaceLeft() {
        return this.#equipmentSpaceLeft;
    }

    /** @param {number} val */
    set equipmentSpaceLeft(val) {
        this.#equipmentSpaceLeft = val;
    }

    get equipmentTotalInventorySpace() {
        return this.#equipmentTotalInventorySpace;
    }

    /** @param {number} val */
    set equipmentTotalInventorySpace(val) {
        this.#equipmentTotalInventorySpace = val;
    }

    get gemSpaceLeft() {
        return this.#gemSpaceLeft;
    }

    /** @param {number} val */
    set gemSpaceLeft(val) {
        this.#gemSpaceLeft = val;
    }

    get gemTotalInventorySpace() {
        return this.#gemTotalInventorySpace;
    }

    /** @param {number} val */
    set gemTotalInventorySpace(val) {
        this.#gemTotalInventorySpace = val;
    }

    /**
     * @param {Lord[]} barons
     * @param {Lord[]} commandants
     */
    _setCommandantsAndBarons(barons, commandants) {
        this.#barons = barons;
        this.#commandants = commandants;
    }

    /** @param {General[]} generals */
    _setGenerals(generals) {
        this.#generals = generals;
    }

    /** @param {Equipment[]} equipments */
    _setEquipmentInventory(equipments) {
        this.#equipmentInventory = equipments;
    }

    /** @param {{gem: Gem, amount: number}[]} gems */
    _setRegularGemInventory(gems) {
        this.#regularGemInventory = gems;
    }

    /** @param {RelicGem[]} gems */
    _setRelicGemInventory(gems) {
        this.#relicGemInventory = gems;
    }

    /** @returns {Lord[]} */
    getCommandants = () => [...this.#commandants];

    /** Returns all idle commandants */
    getAvailableCommandants() {
        const thisPlayerId = this._client.clientUserData.playerId;
        const myMovements = this._client.movements.get().filter(m => (m.direction === 0 && m.sourceArea?.ownerId === thisPlayerId) || (m.direction === 1 && m.targetArea?.ownerId === thisPlayerId));
        if (myMovements.length === 0) return this.#commandants;
        return this.#commandants.filter(l => myMovements.every(m => m.lord?.id !== l.id));
    }

    /** @returns {Lord[]} */
    getBarons = () => [...this.#barons];

    /** @returns {General[]} */
    getGenerals = () => [...this.#generals];

    /** @returns {(Equipment|RelicEquipment)[]} */
    getEquipmentInventory = () => [...this.#equipmentInventory];

    /** @param {Equipment | RelicEquipment} equipment */
    async sellEquipment(equipment) {
        await sellEquipment(this._client, equipment.id, equipment.equippedLord?.id ?? -1);
        let i = 0;
        for (const eq of this.#equipmentInventory) {
            if (eq.id === equipment.id) this.#equipmentInventory.splice(i, 1);
            i++;
        }
    }

    /** @param {number} rarity */
    async sellAllEquipmentsAtOrBelowRarity(rarity) {
        if (rarity === -1) rarity = this.#atOrBelowDeleteRarity;
        rarity %= 10; //hero starts with 10 instead of 0
        const inventory = this.getEquipmentInventory();
        for (let i = inventory.length - 1; i >= 0; i--) {
            await this._autoSellEquipment(inventory[i], rarity);
        }
    }

    /**
     * @param {Equipment | RelicEquipment} e
     * @param {number} rarity
     * @return {Promise<void>}
     * @private
     */
    async _autoSellEquipment(e, rarity = this.#atOrBelowDeleteRarity) {
        if (e.slotId === equipment_slots.find(s => s.name === "skin").slotID) return;
        if (rarity > Constants.EquipmentRarity.Relic) return;
        if (rarity === Constants.EquipmentRarity.Unique && (e.rarityId % 10 > Constants.EquipmentRarity.Legendary)) return;
        if (rarity !== Constants.EquipmentRarity.Unique && rarity < e.rarityId % 10) return;
        if (rarity <= Constants.EquipmentRarity.Legendary && rarity === Constants.EquipmentRarity.Unique) return;

        if (this.#equipmentInventory.findIndex(eq => e.id === eq.id) === -1) return;
        await this.sellEquipment(e);
    }

    /** @return {{gem: Gem, amount: number}[]} */
    getRegularGemInventory = () => [...this.#regularGemInventory];
    /** @return {RelicGem[]} */
    getRelicGemInventory = () => [...this.#relicGemInventory];

    /** @param {Gem | RelicGem} gem */
    async sellGem(gem) {
        const isRelic = gem.relicTypeId != null;
        await sellGem(this._client, gem.id, isRelic);
        let i = 0;
        if (isRelic) {
            for (const relicGem of this.#relicGemInventory) {
                if (relicGem.id === gem.id) this.#relicGemInventory.splice(i, 1);
                i++;
            }
        } else {
            for (const gem_amount of this.#regularGemInventory) {
                if (gem_amount.gem.id === gem.id) {
                    if (gem_amount.amount === 1) this.#regularGemInventory.splice(i, 1); else gem_amount.amount -= 1;
                }
                i++;
            }
        }
    }

    /** @param {number} level */
    async sellAllGemsAtOrBelowLevel(level) {
        if (level === -1) level = this.#atOrBelowDeleteGemLevel;
        const inventory = this.getRegularGemInventory();
        for (let i = inventory.length - 1; i >= 0; i--) {
            for (let j = 0; j < inventory[i].amount; j++) {
                await this._autoSellGem(inventory[i].gem, level);
            }
        }
    }

    /**
     * @param {Gem} gem
     * @param {number} level
     * @return {Promise<void>}
     * @private
     */
    async _autoSellGem(gem, level = this.#atOrBelowDeleteGemLevel) {
        if (gem.rawData.gemLevelID > level) return;
        if (this.#regularGemInventory.findIndex(gem_amount => gem.id === gem_amount.gem.id) === -1) return;
        await this.sellGem(gem);
    }
}

module.exports = EquipmentManager;