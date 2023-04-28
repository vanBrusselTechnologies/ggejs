const AllianceStatusListItem = require("./AllianceStatusListItem");
const Alliance = require("./Alliance");
const Good = require("./Good");
const AllianceDonations = require("./AllianceDonations");
const CapitalMapobject = require("./CapitalMapobject");
const KingstowerMapobject = require("./KingstowerMapobject");
const MonumentMapobject = require("./MonumentMapobject");
const MetropolMapobject = require("./MetropolMapobject");
const {parseChatJSONMessage} = require("../tools/TextValide");

class MyAlliance extends Alliance {
    /**
     * 
     * @param {Client} client 
     * @param {object} data 
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
        /** @type {Good[]} */
        this.storage = parseStorage(client, data.STO);
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
}

/**
 * 
 * @param {Client} client 
 * @param {object} data 
 * @returns {Good[]}
 */
function parseStorage(client, data) {
    let goods = []
    for (let i in data) {
        let _array = [i, data[i]];
        goods.push(new Good(client, _array));
    }
    return goods;
}

/**
 * 
 * @param {Client} client 
 * @param {Array} data 
 * @returns {AllianceStatusListItem[]}
 */
function parseStatusList(client, data) {
    let statusList = [];
    if (!data) return statusList;
    for (let i in data) {
        statusList.push(new AllianceStatusListItem(client, data[i]));
    }
    return statusList;
}

/**
 * 
 * @param {Client} client 
 * @param {Array} data 
 * @param {AllianceMember[]} memberList 
 * @returns {AllianceMember[]}
 */
function parseAdditionalMemberInformation(client, data, memberList) {
    for (let i in data) {
        for (let j in memberList) {
            if (memberList[j].playerId === data[i][0]) {
                memberList[j]["donations"] = new AllianceDonations(client, data[i]);
                memberList[j]["activityStatus"] = data[i][4];
            }
        }
    }
    return memberList;
}

/**
 * 
 * @param {Client} client 
 * @param {Array} data 
 * @returns {CapitalMapobject[]}
 */
function parseCapitals(client, data) {
    let capitals = [];
    for (let i in data) {
        capitals.push(new CapitalMapobject(client, data[i]));
    }
    return capitals;
}

/**
 * 
 * @param {Client} client 
 * @param {Array} data 
 * @returns {MetropolMapobject[]}
 */
function parseMetropols(client, data) {
    let metropols = [];
    for (let i in data) {
        metropols.push(new MetropolMapobject(client, data[i]));
    }
    return metropols;
}

/**
 * 
 * @param {Client} client 
 * @param {Array} data 
 * @returns {KingstowerMapobject[]}
 */
function parseKingstowers(client, data) {
    let kingstowers = [];
    for (let i in data) {
        kingstowers.push(new KingstowerMapobject(client, data[i]));
    }
    return kingstowers;
}

/**
 * 
 * @param {Client} client 
 * @param {Array} data 
 * @returns {MonumentMapobject[]}
 */
function parseMonuments(client, data) {
    let monuments = [];
    for (let i in data) {
        monuments.push(new MonumentMapobject(client, data[i]));
    }
    return monuments;
}

module.exports = MyAlliance;