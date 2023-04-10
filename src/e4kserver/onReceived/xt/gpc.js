module.exports = {
    name: "gpc",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if (socket.debug) console.log("gpc data has to move to CastleUnlockedInfoData");
        /** @type {{ UH:[], U:[], AID:number, KID:number }[]}*/
        const castleData = params.A;
        //console.log(params);
        for(let item of castleData){
            //const parsedCastleData = parseCastleData(item);
            //model.addCastle(parsedCastleData);
        }
    }
}