const { execute: gam } = require('./gam');

module.exports = {
    name: "cra",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {{AAM:object}} params
     */
    execute(socket, errorCode, params) {
        if(errorCode === 90) return; // Can't start armies
        if(!params) return;
        gam(socket, 0, {M:[params.AAM]} );
    }
}