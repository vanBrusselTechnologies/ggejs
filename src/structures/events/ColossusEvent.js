const ActiveEvent = require("./ActiveEvent");

class ColossusEvent extends ActiveEvent {
    eventBuildingWodId = 276;
    numEntries = 10;
    /** @type {{playerRank:number,playerName:string,allianceName:string,playerPoints:number,playerId:number}[]}*/
    ranking = []; // TODO: ColossusRankingItemVO[]
    /** @type {number} */
    ownPoints;
    /** @type {number} */
    ownRank;
    offsetRank = -1

    constructor() {
        super();
        let i = 0;
        while (i < this.numEntries) {
            this.ranking.push({playerRank: 0, playerName: "", allianceName: "", playerPoints: 0, playerId: 0}) // TODO: new ColossusRankingItemVO()
            i++
        }
    }

    /**
     * @param {number} rankIndex
     * @param {number} playerRank
     * @param {string} playerName
     * @param {string} allianceName
     * @param {number} playerPoints
     * @param {number} playerId
     */
    updateRank(rankIndex, playerRank, playerName, allianceName, playerPoints, playerId) {
        if (rankIndex > 9) {
            //client.logger.d("[ColossusEvent]: tried to set unavailable rank info. Have a nice day debugging.");
            return;
        }
        if (rankIndex === 1) {
            this.offsetRank = playerRank;
        }
        this.ranking[rankIndex] = {playerRank, playerName, allianceName, playerPoints, playerId}//TODO: .updateVO(playerRank,playerName,allianceName,playerPoints,playerId);
    }

    get mainDialogName() {
        return "SpecialEventsColossusDialog";
    }

    get starterDialogName() {
        return "SpecialEventsColossusDialogStarter";
    }

    get eventTitleTextId() {
        return "eventBuilding_Colossus";
    }

    get eventStarterDescTextId() {
        return "dialog_eventColossus_copytext";
    }
}

module.exports = ColossusEvent;