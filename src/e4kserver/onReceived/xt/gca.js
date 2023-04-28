const BasicBuilding = require("./../../../structures/BasicBuilding");

module.exports = {
    name: "gca", /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        let castle = {};
        if (params === undefined) return castle;
        const defenceBuildings = [];
        for (let x in params) {
            switch (x) {
                case "BD":
                    castle["buildings"] = parseBuildings(socket.client, params[x]);
                    break;
                case "FP":
                    console.log(x);
                    console.log(params[x]);
                    break;
                case "T":
                case "G":
                case "D":
                    defenceBuildings.push(...parseBuildings(socket.client, params[x]))
                    castle["defenceBuildings"] = [...defenceBuildings];
                    break;
                default:
                    if (socket.debug) console.log("Unknown part in gca command: " + x);
            }
        }
        return castle;
    }
}

function parseBuildings(client, data) {
    let buildings = [];
    for (let i in data) {
        let buildingData = data[i];
        buildings.push(new BasicBuilding(client, buildingData));
    }
    return buildings;
}