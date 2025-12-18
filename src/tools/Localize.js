const {languages} = require('e4k-data');

/**
 * @param {BaseClient} client
 * @param {string} textId
 * @param {string} args
 */
module.exports.text = (client, textId, ...args) => {
    if (client == null) return textId;
    if (typeof client === 'string') {
        console.warn('expected client, received: ' + client);
        return /**@type {string}*/client;
    }
    let val = _getValue(client, textId);
    let i = 0;
    for (let a of args) {
        val = val.replaceAll(`{${i}}`, a);
        i++;
    }
    return val;
}

/**
 * @param {BaseClient} client
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