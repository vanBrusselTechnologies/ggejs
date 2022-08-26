class ChatMessage {
    constructor(client, data) {
        this.message = parseChatJSONMessage(data.MT);
        this.sendDate = new Date(Date.now() - data.MA * 1000);
        this.senderPlayerId = data.PID;
        this.senderPlayerName = data.PN;
    }
}

function parseChatJSONMessage(msgText)
{
    if(!msgText) return "";
    return msgText.replace(/&percnt;/g,"%").replace(/&quot;/g,"\"").replace(/&#145;/g,"\'").replace(/<br \/>/g,"\n").replace(/&lt;/g,"<");
}

module.exports = ChatMessage;