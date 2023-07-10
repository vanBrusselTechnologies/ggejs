const Good = require("./Good");


class CastleProductionData {
    production = [];
    consumption = [];
    consumptionReduction = [];
    maxCapacity = [];
    safeStorage = [];
    productionBoost = [];
    buildingProductionSpeed = {
        barracks: 0, workshop: 0, defenceWorkshop: 0, hospital: 0,
    };
    population = 0;
    neutralDecoPoints = 0;
    riot = 0;
    sickness = 0;
    buildDurationBoost = 0;
    metropolisBoost = 0;
    guardCount = 0;
    unitStorage = 0;
    redFactionRatio = 0;
    morality = 0;
    maxAuxiliaryCap = 0

    /**
     *
     * @param {Client} client
     * @param {{}} data
     */
    constructor(client, data) {
        if (!data) return;
        for (let i in data) {
            let count = data[i];
            if (i.startsWith("D")) {
                if (i.length >= 3 && i.endsWith("C")) {
                    this.consumption.push(new Good(client, [i.substring(1, i.length - 1), count / 10]));
                } else {
                    this.production.push(new Good(client, [i.substring(1), count / 10]));
                }
            } else if (i.endsWith("CR")) {
                this.consumptionReduction.push(new Good(client, [i.substring(0, i.length - 2), (100 - count) / 100]));
            } else if (i.startsWith("MR")) {
                this.maxCapacity.push(new Good(client, [i.substring(2), count]));
            } else if (i.startsWith("SAFE_")) {
                this.safeStorage.push(new Good(client, [i.substring(5), count]));
            } else if (i.endsWith("M") && i !== "M") {
                this.productionBoost.push(new Good(client, [i.substring(0, i.length - 1), count / 100]));
            }
        }

        this.buildingProductionSpeed.barracks = data["RS1"] / 100;
        this.buildingProductionSpeed.workshop = data["RS2"] / 100;
        this.buildingProductionSpeed.defenceWorkshop = data["RS3"] / 100;
        this.buildingProductionSpeed.hospital = data["RSH"] / 100;
        this.population = data["P"];
        this.neutralDecoPoints = data["NDP"];
        this.riot = data["R"];
        this.sickness = data["S"];
        this.buildDurationBoost = data["BDB"] / 100;
        this.metropolisBoost = data["MP"];
        this.guardCount = data["GRD"];
        this.unitStorage = data["US"];
        this.redFactionRatio = data["RFPPA"]
        this.morality = data["M"];
        this.maxAuxiliaryCap = data["AUS"]
    }
}

module.exports = CastleProductionData;