const Unit = require("./Unit");
const BasicMovement = require("./BasicMovement");

class ConquerMovement extends BasicMovement {
    constructor(client, data) {
        super(client, data);
        this.army = parse(client, data.A);
    }
}
function parse(client, obj) {
    let output = [];
    for (i in obj) {
        output.push({
            unit: new Unit(client, obj[i][0]),
            count: obj[i][1],
        });
    }
    return output;
}

module.exports = ConquerMovement;