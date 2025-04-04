const TextValide = {
    /** @param {string} msgText */
    parseChatJSONMessage(msgText) {
        if (!msgText) return "";
        return msgText.replace(/&percnt;/g, "%").replace(/&quot;/g, "\"").replace(/&#145;/g, "\'").replace(/<br \/>/g, "\n").replace(/&lt;/g, "<");
    }
}

module.exports = TextValide;