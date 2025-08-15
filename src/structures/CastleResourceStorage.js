const Good = require("./Good");

class CastleResourceStorage {
    wood = new Good(["W", 0]);
    stone = new Good(["S", 0]);
    food = new Good(["F", 0]);
    coal = new Good(["C", 0]);
    oil = new Good(["O", 0]);
    glass = new Good(["G", 0]);
    aquamarine = new Good(["A", 0]);
    iron = new Good(["I", 0]);
    honey = new Good(["HONEY", 0]);
    mead = new Good(["MEAD", 0]);

    /**
     * @param {BaseClient} client
     * @param {{AID:number,W:number,S:number,F:number,C:number,O:number,G:number,A:number,I:number,HONEY:number,MEAD:number,KID:number}} data
     */
    constructor(client, data) {
        if (!data) return;
        this.wood = new Good(["W", data.W]);
        this.stone = new Good(["S", data.S]);
        this.food = new Good(["F", data.F]);
        this.coal = new Good(["C", data.C]);
        this.oil = new Good(["O", data.O]);
        this.glass = new Good(["G", data.G]);
        this.aquamarine = new Good(["A", data.A]);
        this.iron = new Good(["I", data.I]);
        this.honey = new Good(["HONEY", data.HONEY]);
        this.mead = new Good(["MEAD", data.MEAD]);
    }
}

module.exports = CastleResourceStorage;