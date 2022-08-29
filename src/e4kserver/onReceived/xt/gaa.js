module.exports = {
    name: "gaa",
    /**
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if(params === undefined) return;
        console.log(JSON.stringify(params).length);
        console.log(JSON.stringify(params));
    }
}