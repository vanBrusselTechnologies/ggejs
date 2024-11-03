module.exports.name = "fbe";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    /*todo
     * var _loc2_:BuildingConstructionFinishedSignalVO = new BuildingConstructionFinishedSignalVO();
     * _loc2_.objectId = paramObj["OID"];
     * _loc2_.gainedXP = paramObj["XP"];
     * buildingConstructionFinishedSignal.dispatch(_loc2_);
     *
     * todo: Send ClientEvent 'finishedBuilding' => Use info received in 'ego'
     */
}