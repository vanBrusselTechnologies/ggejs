class AllianceStatusListItem {
    constructor(client, data) {
        /** @type {number} */
        this.allianceId = data.AID;
        /** @type {string} */
        this.allianceName = data.AN;
        /** @type {number} */
        this.allianceStatus = data.AS;
        /** @type {boolean} */
        this.allianceStatusConfirmed = data.AC === 1;
    };
}

module.exports = AllianceStatusListItem;