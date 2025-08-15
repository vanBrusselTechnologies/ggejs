const WorldMapOwnerInfo = require("./WorldMapOwnerInfo");

class AllianceMember extends WorldMapOwnerInfo {
    alliance;
    donations;
    activityStatus;

    /**
     * @param {BaseClient} client
     * @param {*} data
     * @param {Alliance} alliance
     */
    constructor(client, data, alliance) {
        super(client);
        super.fillFromParamObject(data);
        this.alliance = alliance;
    };
}

module.exports = AllianceMember;