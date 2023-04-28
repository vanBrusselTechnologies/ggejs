const InvasionMapobject = require("./InvasionMapobject");

class NomadInvasionMapobject extends InvasionMapobject {
    eventId = 72;
    travelDistance = 2;

    parseAreaInfoBattleLog(data) {
        super.parseAreaInfoBattleLog(data);
        return this;
    }
}

module.exports = NomadInvasionMapobject;