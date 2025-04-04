const AllianceStatusListItem = require("./AllianceStatusListItem");
const Alliance = require("./Alliance");
const Good = require("./Good");
const AllianceDonations = require("./AllianceDonations");
const CapitalMapobject = require("./mapobjects/CapitalMapobject");
const KingstowerMapobject = require("./mapobjects/KingstowerMapobject");
const MonumentMapobject = require("./mapobjects/MonumentMapobject");
const MetropolMapobject = require("./mapobjects/MetropolMapobject");
const {parseChatJSONMessage} = require("../tools/TextValide");

class MyAlliance extends Alliance {
    /**
     * @param {Client} client
     * @param {Object} data
     */
    constructor(client, data) {
        super(client, data);
        /** @type {boolean} */
        this.isAutoWarOn = data.AW === 1;
        /** @type {number} */
        this.applicationAmount = data.AA;
        /** @type {string} */
        this.announcement = parseChatJSONMessage(data.A);
        /** @type {number} */
        this.aquaPoints = data.AP;
        /** @type {number} */
        this.cargoPointsRanking = data.AR;
        this.parseStorage(client, data.STO);
        /** @type {AllianceStatusListItem[]} */
        this.statusList = parseStatusList(client, data.ADL);
        /** @type {AllianceMember[]} */
        this.memberList = parseAdditionalMemberInformation(client, data.AMI, this.memberList);
        /** @type {CapitalMapobject[]} */
        this.capitals = parseCapitals(client, data.ACA);
        /** @type {MetropolMapobject[]} */
        this.metropols = parseMetropols(client, data.ATC);
        /** @type {KingstowerMapobject[]} */
        this.kingstowers = parseKingstowers(client, data.AKT);
        /** @type {MonumentMapobject[]} */
        this.monuments = parseMonuments(client, data.AMO);
        /** @type {(CapitalMapobject | MetropolMapobject | MonumentMapobject | KingstowerMapobject)[]} */
        this._landmarks = [].concat(this.capitals).concat(this.metropols).concat(this.kingstowers).concat(this.monuments);
        /** @type {number} */
        this.highestMight = data.HAMP;
        /** @type {number} */
        this.highestFamePoints = data.HF;
    }

    /**
     * @private
     * @param {Client} client
     * @param {Object} data
     */
    parseStorage(client, data) {
        let goods = []
        for (let i in data) {
            let _array = [i, data[i]];
            goods.push(new Good(client, _array));
        }
        this.storage = goods;
    }
}

/**
 * @param {Client} client
 * @param {Array} data
 */
function parseStatusList(client, data) {
    /** @type {AllianceStatusListItem[]} */
    const statusList = [];
    if (!data) return statusList;
    for (const d of data) statusList.push(new AllianceStatusListItem(client, d));
    return statusList;
}

/**
 * @param {Client} client
 * @param {Array<Array>} data
 * @param {AllianceMember[]} memberList
 */
function parseAdditionalMemberInformation(client, data, memberList) {
    for (const d of data) {
        const member = memberList.find(m => m.playerId === d[0])
        if (member === undefined) continue;
        member.donations = new AllianceDonations(client, d);
        member.activityStatus = d[4];
    }
    return memberList;
}

/**
 * @param {Client} client
 * @param {Array} data
 */
function parseCapitals(client, data) {
    return data.map(d => new CapitalMapobject(client, d));
}

/**
 * @param {Client} client
 * @param {Array} data
 */
function parseMetropols(client, data) {
    return data.map(d => new MetropolMapobject(client, d));
}

/**
 * @param {Client} client
 * @param {Array} data
 */
function parseKingstowers(client, data) {
    return data.map(d => new KingstowerMapobject(client, d));
}

/**
 * @param {Client} client
 * @param {Array} data
 */
function parseMonuments(client, data) {
    return data.map(d => new MonumentMapobject(client, d));
}

module.exports = MyAlliance;