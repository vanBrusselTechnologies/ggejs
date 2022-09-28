class AllianceMember {
    /**
     * 
     * @param {Client} client 
     * @param {*} data 
     * @param {Alliance} alliance 
     */
    constructor(client, data, alliance) {
        /** @type {number} */
        this.playerId = data.OID;
        /** @type {string} */
        this.playerName = data.N;
        /** @type {number} */
        this.playerLevel = data.L;
        /** @type {number} */
        this.paragonLevel = data.LL;
        /** @type {Alliance} */
        this.alliance = alliance;
        /** @type {number} */
        this.allianceRank = data.AR;
    };
}

module.exports = AllianceMember;