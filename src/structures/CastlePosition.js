const Coordinate = require("./Coordinate");

class CastlePosition {
    /** @type {number} */
    kingdomId;
    /** @type {number} */
    objectId;
    /** @type {number} */
    xPos;
    /** @type {number} */
    yPos;
    /** @type {number} */
    areaType;

    get position(){
        return new Coordinate(null, [this.xPos, this.yPos])
    }
}

module.exports = CastlePosition;