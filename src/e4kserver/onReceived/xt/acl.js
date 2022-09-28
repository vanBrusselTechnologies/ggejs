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
        for(let i in msgs){
            const msg = new ChatMessage(socket.client, msgs[i]);
            client.emit("chatMessage", msg);
        }
    }
}