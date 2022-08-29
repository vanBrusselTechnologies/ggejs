const units = require("./../data/ingame_data/units.json");

class Unit{
    constructor(client, wodId){
        this.wodId = wodId;
        this.isSoldier = isSoldier(wodId);
    }
}

function isSoldier(wodId) {
    for (i in units) {
        if (wodId === parseInt(units[i].wodID)) {
            if (units[i].rangeDefence !== undefined)
                return true;
            else
                return false;
        }
    }
}

module.exports = Unit;