module.exports.name = "afd";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{AC:number[]}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    /* TODO: C2S_GET_ATTACKABLE_FACTION_DATA
        var _loc2_:FactionTowerInfoVO = null;
        var _loc4_:FactionTowerLaneVO = null;
        if (params.AC) factionData.attackableAreas = params.AC;
        for(_loc4_ of factionData.factionsTowerLanes) _loc4_.nextAttackableTowerID = -1;
        let i = 0;
        while(i < factionData.attackableAreas.length) {
            _loc2_ = factionData.getSpecialCampVOByID(factionData.attackableAreas[i]);
            (_loc4_ = factionData.getFactionsTowerLaneByID(_loc2_.laneID)).nextAttackableTowerID = _loc2_.campID;
            i++;
        }
        connectionUpdateService.updateAreaConnections();
     */
}