'use strict'

const {equipment_slots} = require('e4k-data').data;
const BaseManager = require('./BaseManager');
const {getEquipmentInventory} = require("../commands/gei");
const {getGemInventory} = require("../commands/ggm");
const {sellEquipment} = require('../commands/seq');
const {sellGem} = require('../commands/sge');
const EmpireError = require("../tools/EmpireError");
const Constants = require("../utils/Constants");

class EquipmentManager extends BaseManager {
    /** @type {Lord[]} */
    #barons = [];
    /** @type {Lord[]} */
    #commanders = [];
    /** @type {General[]} */
    #generals = [];
    /** @type {number} */
    #equipmentSpaceLeft = -1;
    /** @type {number} */
    #equipmentTotalInventorySpace = -1;
    /** @type {{gem:Gem, amount: number}[]} */
    #regularGemInventory = [];
    /** @type {RelicGem[]} */
    #relicGemInventory = [];
    /** @type {number} */
    #gemSpaceLeft = -1;
    /** @type {number} */
    #gemTotalInventorySpace = -1;

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
     * @param {Lord[]} commanders
     */
    _setCommandersAndBarons(barons, commanders) {
        this.#barons = barons;
        this.#commanders = commanders;
    }

    /** @param {General[]} generals */
    _setGenerals(generals) {
        this.#generals = generals;
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
    getCommanders = () => [...this.#commanders];

    /** Returns all idle commanders */
    getAvailableCommanders() {
        const thisPlayerId = this._client.clientUserData.playerId;
        const myMovements = this._client.movements.get().filter(m => (m.direction === 0 && m.sourceArea?.ownerId === thisPlayerId) || (m.direction === 1 && m.targetArea?.ownerId === thisPlayerId));
        if (myMovements.length === 0) return this.#commanders;
        return this.#commanders.filter(l => myMovements.every(m => m.lord?.id !== l.id));
    }

    /** @returns {Lord[]} */
    getBarons = () => [...this.#barons];

    /** @returns {General[]} */
    getGenerals = () => [...this.#generals];

    /** @returns {Promise<(Equipment|RelicEquipment)[]>} */
    async getEquipmentInventory() {
        try {
            return await getEquipmentInventory(this._client);
        } catch (errorCode) {
            throw new EmpireError(this._client, errorCode);
        }
    }

    /** @param {Equipment | RelicEquipment} equipment */
    async sellEquipment(equipment) {
        try {
            await sellEquipment(this._client, equipment.id, equipment.equippedLord?.id ?? -1);
        } catch (errorCode) {
            throw new EmpireError(this._client, errorCode);
        }
    }

    /** @param {number} rarity */
    async sellAllEquipmentsAtOrBelowRarity(rarity) {
        if (rarity === -1) return;
        rarity %= 10; //hero starts with 10 instead of 0
        const inventory = await this.getEquipmentInventory();
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
    async _autoSellEquipment(e, rarity) {
        if (e.slotId === equipment_slots.find(s => s.name === "skin").slotID) return;
        if (rarity > Constants.EquipmentRarity.Relic) return;
        if (rarity === Constants.EquipmentRarity.Unique && (e.rarityId % 10 > Constants.EquipmentRarity.Legendary)) return;
        if (rarity !== Constants.EquipmentRarity.Unique && rarity < e.rarityId % 10) return;
        if (rarity <= Constants.EquipmentRarity.Legendary && rarity === Constants.EquipmentRarity.Unique) return;
        await this.sellEquipment(e);
    }

    /** @return {{gem: Gem, amount: number}[]} */
    getRegularGemInventory = () => [...this.#regularGemInventory];
    /** @return {RelicGem[]} */
    getRelicGemInventory = () => [...this.#relicGemInventory];
    /** @returns {Promise<{regular: {gem: Gem, amount: number}[], relic: RelicGem[]}>} */
    getGemInventory = async () => {
        try {
            await getGemInventory(this._client);
            return {
                regular: this.getRegularGemInventory(), relic: this.getRelicGemInventory()
            }
        } catch (errorCode) {
            throw new EmpireError(this._client, errorCode);
        }
    };

    /** @param {Gem | RelicGem} gem */
    async sellGem(gem) {
        try {
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
        } catch (e) {
            throw new EmpireError(this._client, e);
        }
    }

    /** @param {number} level */
    async sellAllGemsAtOrBelowLevel(level) {
        if (level === -1) return;
        const inventory = await this.getGemInventory();
        const regularInventory = inventory.regular
        for (let i = regularInventory.length - 1; i >= 0; i--) {
            for (let j = 0; j < regularInventory[i].amount; j++) {
                await this._autoSellGem(regularInventory[i].gem, level);
            }
        }
    }

    /**
     * @param {Gem} gem
     * @param {number} level
     * @return {Promise<void>}
     * @private
     */
    async _autoSellGem(gem, level) {
        if (gem.rawData.gemLevelID > level) return;
        if (this.#regularGemInventory.findIndex(gem_amount => gem.id === gem_amount.gem.id) === -1) return;
        await this.sellGem(gem);
    }
}

module.exports = EquipmentManager;