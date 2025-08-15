module.exports.name = "ahd";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{LID:number, }} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    /* todo
        let i = 0;
        const listId = params.LID;
        const allianceHelpRequests = allianceHelpData.allianceHelpRequests;
        while (i < allianceHelpRequests.length) {
           if (allianceHelpRequests[i].listID == listId) {
              allianceHelpRequests.removeAt(i);
           }
           i++;
        }
     */
}