class Coordinate {
    /**
     * 
     * @param {Client} client 
     * @param {Array<number>} data
     */
    constructor(client, data) {
        this.X = data[0];
        this.Y = data[1];
    }
    toString(){
        return `${this.X}/${this.Y}`;
    }
}

module.exports = Coordinate;