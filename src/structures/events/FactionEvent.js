const PointEvent = require("./PointEvent");
const {execute: afd} = require("../../commands/onReceived/afd")

class FactionEvent extends PointEvent {
    eventBuildingWodId = 267

    /** @type {boolean} */
    unlocked;
    /** @type {boolean} */
    isFinished;
    /** @type {number} */
    mapSeed;
    /** @type {boolean} */
    isSpectator;
    /** @type {boolean} */
    isSeasonLeagueModeEnabled;

    /**
     * @param {BaseClient} client
     * @param {{EID: number, RS: number, OP: number[], OR: number[], FN: { MC: number, FID: number, TID: number, NS: number, PMS: number, PMT: number, SPC: number}, UL: number, MS: number, LID: number, RSID: number, AC: number[], KL: number, KLAP: number}} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);
        if (data.FN) this.isSpectator = data.FN.SPC === 1;
        this.isSeasonLeagueModeEnabled = data.KL === 1;

        this.parseBasicParams(data);
        if (data.UL) this.unlocked = data.UL === 1;
        this.mapSeed = data.MS;
        this.isFinished = data["F"] === 1;
        if (data.FN) {
            const ownInfo = client.worldMaps._ownerInfoData.ownInfo
            const isSpectator = client.worldMaps._ownerInfoData.ownInfo.factionIsSpectator;
            ownInfo.fillFromFactionParamObject(data.FN);
            if (ownInfo.factionIsSpectator && !isSpectator) {
                //spectatorModeActivatedSignal.dispatch();
            }
        }
        if (data.AC) afd(client, 0, data)
        // TODO: this.subType = factionData.ownFactionID;
        // TODO: factionData.activeEvent = _loc2_;
    }

    get isPaid() {
        return this.unlocked;
    }

    /** @return {boolean} */
    get isActive() {
        return this.unlocked ? super.isActive || !this.isFinished : super.isActive;
    }

    get mailStarterDialogName() {
        return "FactionMailStarterDialog";
    }

    get starterDialogName() {
        return "FactionEventStartedDialog";
    }

    get mainDialogName() {
        return "FactionOverviewDialog";
    }

    get eventTitleTextId() {
        return "kingdomName_Faction"
    }

    get eventStarterDescTextId() {
        return "questID_3000_info"
    }
}

module.exports = FactionEvent;