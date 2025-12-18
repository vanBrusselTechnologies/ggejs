module.exports.name = "all";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{A:Object, AL: Object[]}} params
 */
module.exports.execute = function (client, errorCode, params) {
    console.log(params.AL.reverse())
}