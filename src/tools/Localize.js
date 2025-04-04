const languages = require('e4k-data').languages;

/** @type {{text(client:Client, textId:string, ...args:string): string}} */
const Localize = {
    text(client, textId, ...args) {
        if (client == null) return textId;
        if (typeof client === 'string') {
            console.error('expected client, received: ' + client);
            return client;
        }
        let val = _getValue(client, textId);
        let i = 0;
        for (let a of args) {
            val = val.replaceAll(`{${i}}`, a);
            i++;
        }
        return val;
    }
}

/**
 * @param {Client} client
 * @param {string} textId
 * @return {string}
 * @private
 */
function _getValue(client, textId) {
    const language = client._language;
    if (languages[language] == null) return "";
    for (let type in languages[language]) {
        if (type === 'generic_flash') {
            for (let subType in languages[language][type]) {
                let translations = languages[language][type][subType];
                if (translations[textId] != null) return translations[textId];
            }
        } else {
            let translations = languages[language][type];
            if (translations[textId] != null) return translations[textId];
        }
    }
    return textId;
}

module.exports = Localize;