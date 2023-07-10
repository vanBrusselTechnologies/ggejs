const Good = require("./Good");

class CastleResourceStorage {
    wood = 0;
    stone = 0;
    food = 0;
    coal = 0;
    oil = 0;
    glass = 0;
    aquamarine = 0;
    iron = 0;
    honey = 0;
    mead = 0;

    /**
     *
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