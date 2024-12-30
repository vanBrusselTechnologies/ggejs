const ColossusEvent = require("./ColossusEvent");

class ColossusRiderEvent extends ColossusEvent {
    get eventStarterDescTextId() {
        return "dialog_eventColossusrider_copytext";
    }
}

module.exports = ColossusRiderEvent;