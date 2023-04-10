const Unit = require("./../../../structures/Unit");

module.exports = {
    name: "gui",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        let troops = {};
        if(params === undefined) return troops;
        troops["units"] = parseUnits(socket.client, params.I);
        troops["unitsInHospital"] = parseUnits(socket.client, params.HI);
        troops["unitsTraveling"] = parseUnits(socket.client, params.TU);
        troops["shadowUnits"] = parseUnits(socket.client, params.gsi.SI);
        return troops;
    }
}

function parseUnits(client, data) {
    let units = [];
    for (let i in data) {
        units.push({
            item: new Unit(client, data[i][0]),
            count: data[i][1]
        })
    }
    return units;
}