const Good = require("./../../../structures/Good");

module.exports = {
    name: "gpa",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        let production = {
            consumption: [],
            goods: [],
            consumptionReduction: [],
            maxCapacity: [],
            safeStorage: [],
            productionBoost: [],
            buildingProductionSpeed: {
                barracks: 0,
                workshop: 0,
                defenceWorkshop: 0,
                hospital: 0,
            },
            population: 0,
            neutralDecoPoints: 0,
            riot: 0,
            sickness: 0,
            buildDurationBoost: 0,
            metropolisBoost: 0,
            guardCount: 0,
        };
        if (params === undefined) return production;
        let client = socket.client;
        for (let i in params) {
            let count = params[i];
            if (i.length >= 3 && i.startsWith("D") && i.endsWith("C")) {
                production.consumption.push(new Good(client, [i.substring(1, i.length - 1), count / 10]));
            }
            else if (i.startsWith("D")) {
                production.goods.push(new Good(client, [i.substring(1), count / 10]));
            }
            else if (i.endsWith("CR")) {
                production.consumptionReduction.push(new Good(client, [i.substring(0, i.length - 2), (100 - count) / 100]));
            }
            else if (i.startsWith("MR")) {
                production.maxCapacity.push(new Good(client, [i.substring(2), count]));
            }
            else if (i.startsWith("SAFE_")) {
                production.safeStorage.push(new Good(client, [i.substring(5), count]));
            }
            else if (i.endsWith("M")) {
                production.productionBoost.push(new Good(client, [i.substring(0, i.length - 1), count / 100]));
            }
            else if (i.startsWith("RS")) {
                if (i.endsWith("1")) production.buildingProductionSpeed.barracks = count / 100;
                if (i.endsWith("2")) production.buildingProductionSpeed.workshop = count / 100;
                if (i.endsWith("3")) production.buildingProductionSpeed.defenceWorkshop = count / 100;
                if (i.endsWith("H")) production.buildingProductionSpeed.hospital = count / 100;
            }
            else if (i === "P") {
                production.population = count;
            }
            else if (i === "NDP") {
                production.neutralDecoPoints = count;
            }
            else if (i === "R") {
                production.riot = count;
            }
            else if (i === "S") {
                production.sickness = count;
            }
            else if (i === "BDB") {
                production.buildDurationBoost = count / 100;
            }
            else if (i === "MP") {
                production.metropolisBoost = count;
            }
            else if (i === "GRD") {
                production.guardCount = count;
            }
            else if(socket.debug && params[i] !== 0) console.log("Missing in GPA: " + i + ": " + params[i]);
        }
        return production;
    }
}