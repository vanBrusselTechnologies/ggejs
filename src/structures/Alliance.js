const AllianceMember = require("./AllianceMember");
const {parseChatJSONMessage} = require("../tools/TextValide");

class Alliance {
    #landmarks = [];

    constructor(client, data) {
        /** @type {number} */
        this.allianceId = data.AID;
        /** @type {string} */
        this.allianceName = data.N;
        /** @type {string} */
        this.allianceDescription = parseChatJSONMessage(data.D);
        /** @type {string} */
        this.languageId = data.ALL;
        /** @type {number} */
        this.memberLevel = data.ML;
        /** @type {AllianceMember[]} */
        this.memberList = parseMembers(client, data.M, this);
        if (data.DOA) /** @type {number} */ this.allianceStatusToOwnAlliance = data.DOA;
        /** @type {number} */
        this.allianceFamePoints = data.CF;
        /** @type {number} */
        this.allianceFamePointsHighestReached = -1;
        /** @type {boolean} */
        this.canInvitedForHardPact = data.HP === 1;
        /** @type {boolean} */
        this.canInvitedForSoftPact = data.SP === 1;
        if (data.IS) /** @type {boolean} */ this.isSearchingMembers = data.IS === 1;
        /** @type {boolean} */
        this.isOpenAlliance = data.IA !== 0;
        if (data.FR) /** @type {number} */ this.freeRenames = data.FR;
        /** @type {number} */
        this.might = parseInt(data.MP);
    }

    /** @returns {Promise<(CapitalMapobject | KingstowerMapobject | MetropolMapobject | MonumentMapobject)[]>} */
    get landmarks() {
        return new Promise((resolve, reject) => {
            if (this.#landmarks.length !== 0) resolve(this.#landmarks);
            console.error("get landmarks() Not Implememented");
            //Door de leden heen gaan en de landmarks zo verzamelen(?);
            reject(this.#landmarks);
        })
    }

    /**
     * @private
     * @param {(CapitalMapobject | MetropolMapobject | MonumentMapobject | KingstowerMapobject)[]} value
     */
    set _landmarks(value) {
        this.#landmarks = value;
    }

    _add_or_update_landmarks(landmarks) {
        console.error("_add_or_update_landmarks Not Implememented");
    }
}

module.exports = Alliance;

/**
 * @param {Client} client
 * @param {Object[]} members
 * @param {Alliance} _alliance
 * @returns {AllianceMember[]}
 */
function parseMembers(client, members, _alliance) {
    client.worldmaps._ownerInfoData.parseOwnerInfoArray(members);
    /**@type {AllianceMember[]} */
    let allianceMembers = [];
    for (let memberData of members) {
        let _member = new AllianceMember(client, memberData, _alliance);
        allianceMembers.push(_member);
    }
    allianceMembers.sort((a, b) => {
        if (a.allianceRank < b.allianceRank) {
            return -1;
        }
        if (a.allianceRank > b.allianceRank) {
            return 1;
        }
        return 0;
    })
    return allianceMembers;
}