const {execute: gliParser} = require('./gli');
const {execute: gcuParser} = require('./gcu');
//const {execute: eslParser} = require('./esl');

module.exports = {
    name: "seq",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {{gli:{},gcu:{},esl:{}}} params
     */
    execute(socket, errorCode, params) {
        if(errorCode !== 0) socket["seq -> errorCode"] = errorCode;
        if(!params) return;
        socket["seq -> sold"] = true;
        if(params?.gli) gliParser(socket, errorCode, params.gli);
        if(params?.gcu) gcuParser(socket, errorCode, params.gcu);
        //if(params?.esl) eslParser(socket, errorCode, params.esl); equipmentSpaceLeft
    }
}