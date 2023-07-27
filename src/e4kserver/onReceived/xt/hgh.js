module.exports.name = "hgh";

/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{LT:number, LID: number, L: Array<[number, number, {OID:number} | []]>, LR:number, SV:string, FR: number, IGH: number}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (errorCode === 114 || errorCode === 21) return;
    if (!params || !params.L || params.L[0]?.[2] == null) return;
    let leaderbord = params.L;
    const position = Math.min(Math.max(1, params.FR), params.LR);
    const name = params.SV.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (leaderbord[0][2].OID) {
        /** @type {{OID:number}} */
        let player = leaderbord.find(l => l[0] === position)[2];
        socket[`__player_${name}_id`] = player.OID;
    } else if (Array.isArray(leaderbord[0][2])) {
        /** @type {[number, string, number, number]} */
        let alliance = leaderbord.find(l => l[0] === position)[2];
        socket[`__alliance_${name}_id`] = alliance[0];
    }
}