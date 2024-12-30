const ColossusEvent = require("./ColossusEvent");

class ColossusVanillaEvent extends ColossusEvent {
    get eventStarterDescTextId() {
        return "dialog_eventColossus_copytext";
    }
}

module.exports = ColossusVanillaEvent;