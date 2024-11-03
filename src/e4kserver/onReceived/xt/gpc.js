module.exports.name = "gpc";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    //todo: gpc data has to move to CastleUnlockedInfoData
    /** @type {{ UH:[], U:[], AID:number, KID:number }[]}*/
    const castleData = params.A;
    //console.log(params);
    for (let item of castleData) {
        //const parsedCastleData = parseCastleData(item);
        //model.addCastle(parsedCastleData);
    }
}