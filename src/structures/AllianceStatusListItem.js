class AllianceStatusListItem {
    constructor(client, data) {
        this.allianceId = data.AID;
        this.allianceName = data.AN;
        this.allianceStatus = data.AS;
        this.allianceStatusConfirmed = data.AC === 1;
    };
}

module.exports = AllianceStatusListItem;