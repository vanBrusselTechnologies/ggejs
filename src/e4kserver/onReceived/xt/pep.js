module.exports.name = "pep";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{EID: number, OP: number[], OR:number[]}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    /** @type {SkinnableAlienAllianceEvent} */
    const pointEvent = socket["activeSpecialEvents"].find(e => e.eventId === params.EID)
    if (pointEvent) {
        if ("OP" in params) {
            pointEvent.currentPoints = params["OP"];
            if (pointEvent.singlePlayerPointEvent) pointEvent.singlePlayerPointEvent.currentPoints = params["OP"];
        }
        if (params["OR"]) {
            pointEvent.currentRank = params["OR"];
            if (pointEvent.singlePlayerPointEvent) pointEvent.singlePlayerPointEvent.currentRank = params["OR"];
        }
    }
}