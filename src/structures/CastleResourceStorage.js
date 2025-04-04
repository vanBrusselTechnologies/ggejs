const Good = require("./Good");

class CastleResourceStorage {
    wood = new Good(null, ["W", 0]);
    stone = new Good(null, ["S", 0]);
    food = new Good(null, ["F", 0]);
    coal = new Good(null, ["C", 0]);
    oil = new Good(null, ["O", 0]);
    glass = new Good(null, ["G", 0]);
    aquamarine = new Good(null, ["A", 0]);
    iron = new Good(null, ["I", 0]);
    honey = new Good(null, ["HONEY", 0]);
    mead = new Good(null, ["MEAD", 0]);

    /**
     * @param {Client} client
     * @param {{AID:number,W:number,S:number,F:number,C:number,O:number,G:number,A:number,I:number,HONEY:number,MEAD:number,KID:number}} data
     */
    constructor(client, data) {
        if (!data) return;
        this.wood = new Good(client, ["W", data.W]);
        this.stone = new Good(client, ["S", data.S]);
        this.food = new Good(client, ["F", data.F]);
        this.coal = new Good(client, ["C", data.C]);
        this.oil = new Good(client, ["O", data.O]);
        this.glass = new Good(client, ["G", data.G]);
        this.aquamarine = new Good(client, ["A", data.A]);
        this.iron = new Good(client, ["I", data.I]);
        this.honey = new Good(client, ["HONEY", data.HONEY]);
        this.mead = new Good(client, ["MEAD", data.MEAD]);
    }
}

module.exports = CastleResourceStorage;