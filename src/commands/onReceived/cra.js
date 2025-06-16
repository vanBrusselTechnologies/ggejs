const {execute: gam} = require('./gam');

module.exports.name = "cra";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{AAM:Object}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (errorCode === 90) return; // Can't start armies
    /*todo
     * registerErrorHandler(194,null,"generic_alert_warning","alreadyConquerCapitalMovement");
     * registerErrorHandler(252,null,"generic_alert_warning","alreadyConquerMetropolMovement");
     * registerCustomHandler(95,handleCoolingDown);
     * registerCustomHandler(197,handleIsRelocating);
     * registerCustomHandler(100,handleHasNoUnits);
     * registerCustomHandler(291,handleNoPlayerSpawnedYet);
     * registerCustomHandler(234,handleAttackInProgress);
     */
    if (!params) return;
    gam(client, 0, {M: [params.AAM]});
}