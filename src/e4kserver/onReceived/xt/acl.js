const ChatMessage = require("./../../../structures/ChatMessage");

module.exports = {
    name: "acl",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if(!params) return;
        const client = socket.client;
        const msgs = params.CM;
        for(let m of msgs){
            const msg = new ChatMessage(socket.client, m);
            client.emit("chatMessage", msg);
        }
    }
}