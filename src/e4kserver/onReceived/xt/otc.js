module.exports.name = "otc";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{H:number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    // TODO:
    //  closeRingMenuSignal.dispatch();
    //  worldMapOwnerInfoData.parseOwnerInfoArray([paramObj]);
    //  if (worldMapData.isInitialized)
    //  {
    //      const _loc2_:InteractiveMapobjectVO = worldMapData.getMapobjectVO(paramObj.X,paramObj.Y);
    //      _loc2_.ownerId = paramObj.OID;
    //      _loc2_.occupierID = paramObj.OCID;
    //  }
    //  worldmapLoadedSignal.dispatch();
}