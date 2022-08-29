const BasicMovement = require("./BasicMovement");
const Good = require("./Good");

class MarketMovement extends BasicMovement {
    constructor(client, data) {
        super(client, data);
        if(data.MM)
            this.goods = parseGoods(client, data.MM.G);
            this.carriages = data.MM.C;
    }
}
function parseGoods(client, data) {
    if(!data) return [];
    let goods = [];
    for (i in data) {
        goods.push(new Good(client, data[i]));
    }
    return goods;
}

module.exports = MarketMovement;