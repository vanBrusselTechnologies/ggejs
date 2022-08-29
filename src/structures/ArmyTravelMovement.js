const BasicMovement = require("./BasicMovement");
const Good = require("./Good");
const Unit = require("./Unit");

class ArmyTravelMovement extends BasicMovement {
    constructor(client, data) {
        super(client, data);
        this.army = parseArmy(client, data.A);
        this.goods = parseGoods(client, data.G);
    }
}

function parseGoods(client, data) {
    let goods = []
    for (i in data) {
        goods.push(new Good(client, data[i]));
    }
    return goods;
}

function parseArmy(client, data){
    let army = [];
    for(i in data){
        let _wodId = data[i][0];
        let _count = data[i][1];
        army.push({
            unit: new Unit(client, _wodId),
            count: _count,
        })
    }
    return army;
}

module.exports = ArmyTravelMovement;