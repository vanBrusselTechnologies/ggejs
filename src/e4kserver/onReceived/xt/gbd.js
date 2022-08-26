module.exports = {
    name: "gbd",
    /**
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        console.log(params);
        require('./gpi').execute(socket, errorCode, params.gpi);
    }
}