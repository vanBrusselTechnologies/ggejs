module.exports.name = "fbe";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    /*todo
     * var _loc2_:BuildingConstructionFinishedSignalVO = new BuildingConstructionFinishedSignalVO();
     * _loc2_.objectId = paramObj["OID"];
     * _loc2_.gainedXP = paramObj["XP"];
     * buildingConstructionFinishedSignal.dispatch(_loc2_);
     *
     * TODO: Send ClientEvent 'finishedBuilding' => Use info received in 'ego'
     */
}