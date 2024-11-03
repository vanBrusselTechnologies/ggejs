const {generals} = require('e4k-data').data;

class General {
    /**
     *
     * @param {Client} client
     * @param {Object} data
     * @returns
     */
    constructor(client, data) {
        this.generalId = data["GID"];
        this.rawData = generals.find(g => g.generalID === data["GID"]);
        this.level = data["L"];
        this.xp = data["XP"] ? data["XP"] : 0;
        this.xpBeforeBattle = data["OXP"] ? data["OXP"] : 0;
        this.starTier = data["ST"];
        this.isNew = data["IN"];
        this.leveledUp = data["LU"];
        if (this.rawData && data["GASAIDS"]) {
            this.attackAbilities = parseAssignedAbilities(this.rawData.attackSlots.split(',').map(slot => parseInt(slot)), data["GASAIDS"]);
            this.defenseAbilities = parseAssignedAbilities(this.rawData.defenseSlots.split(',').map(slot => parseInt(slot)), data["GASAIDS"]);
        }
        this.activatedSkillIds = data["SIDS"];
        this.wins = data["W"];
        this.defeats = data["D"];
    }
}

/**
 *
 * @param {Array<number>} slotIds
 * @param {Array<number[]>} slotAbilitiesArray
 * @return {{slotId: number, abilityId: number}[]}
 */
function parseAssignedAbilities(slotIds, slotAbilitiesArray) {
    if (slotIds == null) return [];
    let abilities = [];
    for (let sId of slotIds) {
        let ability = {slotId: sId, abilityId: -1};
        ability.abilityId = slotAbilitiesArray.find(s => s[0] === sId)?.[1] ?? -1;
        abilities.push(ability)
    }
    return abilities;
}

module.exports = General;