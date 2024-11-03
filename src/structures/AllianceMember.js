const WorldmapOwnerInfo = require("./WorldmapOwnerInfo");

class AllianceMember extends WorldmapOwnerInfo {
    /**
     * 
     * @param {Client} client 
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