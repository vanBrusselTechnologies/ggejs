const SkinnableAlienAllianceEvent = require("./SkinnableAlienAllianceEvent");

class AlienAllianceInvasionEvent extends SkinnableAlienAllianceEvent {
    get mainDialogName() {
        return "SkinnableAlienContestDialog";
    }
}

module.exports = AlienAllianceInvasionEvent;