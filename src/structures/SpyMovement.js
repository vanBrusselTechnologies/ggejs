const BasicMovement = require("./BasicMovement");

class SpyMovement extends BasicMovement {
    constructor(client, data) {
        super(client, data);
        this.spyType = data.S.ST;
        this.spyCount = data.S.SC;
        this.spyRisk = data.S.SR;
        if (this.spyType)
            this.sabotageDamage = data.S.SA;
        else this.spyAccuracy = data.S.SA;
    }
}

module.exports = SpyMovement;