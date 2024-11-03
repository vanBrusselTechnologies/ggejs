module.exports.name = "uap";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (!params) return;
    const cud = socket.client.clientUserData;
    cud.setKingdomNoobProtection(params["KID"], params["NS"]);
    if (params["NS"] > 0) {
        cud.noobProtected = true;
        cud.noobProtectionEndTime = new Date(Date.now() + params["NS"] * 1000);
    } else {
        cud.noobProtected = false
    }
    cud.peaceModeStatus = params["PMS"];
    if (params["PMT"] > 0) {
        cud.peaceProtectionStatusEndTime = new Date(Date.now() + params["PMT"] * 1000);
    }
}