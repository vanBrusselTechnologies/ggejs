const Localize = require("../../tools/Localize");

class BasicMessage {
    subType = 0;
    subject = "";
    #client;

    /**
     *
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        this.#client = client;
        /** @type {number} */
        this.messageId = data[0];
        this.messageType = data[1];
        /** @type {string} */
        this.metadata = data[2];
        this.senderName = data[3];
        this.playerId = data[4];
        this.deliveryTime = new Date(Date.now() - data[5] * 1000);
        this.isRead = data[6] === 1;
        this.isArchived = data[7] === 1;
        this.isForwarded = data[8] === 1;
        this.canBeForwarded = false;
        this.parseMetaData(client, this.metadata.split('+'))
    }

    /** @return {Promise<void>} */
    init() {
        return new Promise((resolve) => {
            resolve();
        })
    }

    /**
     *
     * @param {Client} _
     * @param {Array<string>} __
     */
    parseMetaData(_, __) {
    }

    setSenderToAreaName(areaName, areaType, kingdomId) {
        if (this.isForwarded || this.senderName && this.senderName !== "") return;
        if (areaName) {
            this.senderName = areaName;
        } else {
            this.senderName = Localize.text(this.#client, getNPCMapObjectName(areaType, kingdomId));
        }
    }
}

/**
 *
 * @param {number} areaType
 * @param {number} kingdomId
 * @returns {string}
 */
function getNPCMapObjectName(areaType, kingdomId) {
    switch (areaType) {
        case 10:
            return "village";
        case 24:
            return "kingdom_island_village";
        case 21:
            return "alienInvasion_playerName_short";
        case 33:
            return "samurai_playerName";
        case 27:
            return "nomad_playerName";
        case 35:
            return "nomad_playerName";
        case 29:
            return "samurai_playerName";
        case 13:
            return "kingdom_dungeon_castleName_0";
        case 34:
            return "redAlienInvasion_playerName";
        case 4:
            return "outpost";
        case 1:
            return "castle";
        case 3:
            return "capital";
        case 26:
            return "monument";
        case 17:
            return "factionwatchtower_name";
        case 16:
            return "faction_village";
        case 18:
            return "faction_capital";
        case 23:
            return "kingstower";
        case 22:
            return "metropol";
        case 36:
            return "shapeshifter_PlayerName";
        case 38:
            return "township";
        case 37:
            return "daimyoCastle";
        case 39:
            return "kingdom_charge_castleName";
        case 42:
            return "wolfgard_playerName";
        case 2:
            return `kingdom_dungeon_castleName_${kingdomId}`;
        case 11:
            return `kingdom_bossDungeon_castleName_${kingdomId}`;
        case 25:
            return `kingdom_dungeon_castleName_${kingdomId}`;
    }
}

module.exports = BasicMessage;