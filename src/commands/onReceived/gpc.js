module.exports.name = "gpc";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    // TODO: gpc data has to move to CastleUnlockedInfoData
    /** @type {{ UH:[], U:[], AID:number, KID:number }[]}*/
    const castleData = params.A;
    //client.logger.d("[GPC]", params);
    for (let item of castleData) {
        //const parsedCastleData = parseCastleData(item);
        //model.addCastle(parsedCastleData);
    }
}