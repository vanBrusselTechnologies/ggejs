const Good = require("../../../structures/Good");

module.exports = {
    name: "sce",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if(!params) return;
        //console.log(params);
        let goods = [];
        for(let g of params){
            goods.push(new Good(socket.client, g));
        }
        if(socket.debug) console.log("sce: 'client currency storage' is not used yet")
        //console.log(goods);
    }
}