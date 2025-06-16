module.exports.name = "abl";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{A:Object}} params
 */
module.exports.execute = function (client, errorCode, params) {
    /* todo: Alliance Buff List
        var _loc7_:Number = NaN;
        var _loc4_:TimeSpan = null;
        var _loc3_:int = 0;
        if (!params.BL) return;
        var _loc2_:Array = params.BC as Array;
        var _loc6_:Array = params.BL as Array;
        var _loc8_:int = int(_loc2_.length);
        var _loc5_:Dictionary = new Dictionary();
        _loc3_ = 0;
        while (_loc3_ < _loc8_) {
           if ((_loc7_ = Number(_loc2_[_loc3_])) > -1) {
              if (_loc7_ == 0) {
                 _loc5_[_loc3_] = null;
              } else {
                 (_loc4_ = new TimeSpan()).timeSec = _loc7_;
                 _loc5_[_loc3_] = _loc4_;
              }
           }
           _loc3_++;
        }
        dynamicBuffData.ggs_savesetter_internal::setTempBuffs(_loc5_);
        dynamicBuffData.allianceBuffs = null;
        dynamicBuffData.allianceBuffs = new Vector.<AllianceBuffStaticVO>(_loc6_.length,true);
        _loc3_ = int(dynamicBuffData.allianceBuffs.length);
        while (_loc3_-- != 0) {
           dynamicBuffData.allianceBuffs[_loc3_] = allianceBuffService.getBuffByLevel(_loc6_[_loc3_],_loc3_);
        }
     */
}