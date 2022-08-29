const AllianceStatusListItem = require("./AllianceStatusListItem");
const Alliance = require("./Alliance");
const Good = require("./Good");
const AllianceDonations = require("./AllianceDonations");
const CapitalMapobject = require("./CapitalMapobject");
const KingstowerMapobject = require("./KingstowerMapobject");
const MonumentMapobject = require("./MonumentMapobject");

class MyAlliance extends Alliance {
    constructor(client, data){
        super(client, data);
        this.isAutoWarOn = data.AW === 1;
        this.applicationAmount = data.AA;
        this.announcement = parseChatJSONMessage(data.A);
        this.aquaPoints = data.AP;
        this.cargoPointsRanking = data.AR;
        this.storage = parseStorage(client, data.STO);
        this.statusList = parseStatusList(client, data.ADL);
        this.memberList = parseAdditionalMemberInformation(client, data.AMI, this.memberList);
        this.capitals = parseCapitals(client, data.ACA);
        this.metropols = parseMetropols(client, data.ATC);
        this.kingstowers = parseKingstowers(client, data.AKT);
        this.monuments = parseMonuments(client, data.AMO);
        this._landmarks = this.capitals.concat(this.metropols).concat(this.kingstowers).concat(this.monuments);
        this.highestMight = data.HAMP;
        this.highestFamePoints = data.HF;
    }
}

function parseChatJSONMessage(msgText)
{
    if(!msgText) return "";
    return msgText.replace(/&percnt;/g,"%").replace(/&quot;/g,"\"").replace(/&#145;/g,"\'").replace(/<br \/>/g,"\n").replace(/&lt;/g,"<");
}

function parseStorage(client, data){
    let goods = []
    for (i in data) {
        let array = [i, data[i]];
        goods.push(new Good(client, array));
    }
    return goods;
}

function parseStatusList(client, data){
    if(!data) return;
    let statusList = [];
    for(i in data){
        statusList.push(new AllianceStatusListItem(client, data[i]));
    }
    return statusList;
}

function parseAdditionalMemberInformation(client, data, memberList){
    for(i in data){
        for(j in memberList){
            if(memberList[j].playerId === data[i][0]){
                memberList[j]["donations"] = new AllianceDonations(client, data[i]);
                memberList[j]["activityStatus"] = data[i][4];
            }
        }
    }
    return memberList;
}

function parseCapitals(client, data){
    let capitals = [];
    for(i in data){

        capitals.push(new CapitalMapobject(client, data[i]));
    }
    return capitals;
}

function parseMetropols(client, data){
    let metropols = [];
    for(i in data){
        metropols.push(new CapitalMapobject(client, data[i]));
    }
    return metropols;
}

function parseKingstowers(client, data){
    let kingstowers = [];
    for(i in data){
        kingstowers.push(new KingstowerMapobject(client, data[i]));
    }
    return kingstowers;
}

function parseMonuments(client, data){
    let monuments = [];
    for(i in data){
        monuments.push(new MonumentMapobject(client, data[i]));
    }
    return monuments;
}

module.exports = MyAlliance;