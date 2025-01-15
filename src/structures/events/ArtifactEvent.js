const ActiveEvent = require("./ActiveEvent");

class ArtifactEvent extends ActiveEvent {
    /** @type {number} */
    artifactLeagueId;
    /** @type {number} */
    piecesFound;
    /** @type {number} */
    skinId;

    /**
     * @param {Client} client
     * @param {{EID:number, RS: number, SID:number, ALID:number, PF:number}} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);
        if (data["SID"]) this.skinId = data["SID"];
        if (data["ALID"]) this.artifactLeagueId = data["ALID"];
        if (data["PF"]) this.piecesFound = data["PF"];
        //todo: this.eventBuildingWodId = skinCreatorsManager.getSkinCreator(_loc2_.skinId).getSkinSettingsVO(_loc2_.skinId).eventBuildingWodId;
    }

    get starterDialogName() {
        return "ArtifactStarterDialog";
    }

    get mainDialogName() {
        return "ArtifactMainDialog";
    }
}

module.exports = ArtifactEvent;