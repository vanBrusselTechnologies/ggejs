module.exports.name = "nfo";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{"XML_E4K":string,"XML_EP":string,"minNameSize":number,"sectorCountY":number,"sectorCountX":number}} params
 */
module.exports.execute = function (client, errorCode, params) {
    client.clientUserData.minUserNameLength = params.minNameSize;
    /*todo
     * ConstantsWorldmap.setStandardWorldmapSize(params.sectorCountX,params.sectorCountY);
     * xmlData.itemsXmlVersionServer = params.XML_E4K;
     */
}