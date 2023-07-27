const InteractiveMapobject = require("./InteractiveMapobject");

class FactionInteractiveMapobject extends InteractiveMapobject {
    isDestroyed = false;
    aliveProtectorPositions = [];

    get titleText()
    {
        return "";
    }

    get levelText()
    {
        return "";
    }

    get specialCampId() {
        return this.objectId;
    }


}

module.exports = FactionInteractiveMapobject;