class AllianceDonations {
    constructor(client, data) {
        this.coins = data[1];
        this.rubies = data[2];
        this.res = data[3];
    };
}

module.exports = AllianceDonations;