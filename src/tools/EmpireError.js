const Localize = require("./Localize");
const {getErrorText} = require("../utils/ErrorConst");
const {getCoreErrorText} = require("../utils/CoreErrorIdConstants");

class EmpireError extends Error {
    errorCode = -1;

    /**
     * @param {BaseClient} client
     * @param {number | string} errorCode
     * @param {string} errorTextId
     * @param {string} errorArgs
     */
    constructor(client, errorCode, errorTextId = '', ...errorArgs) {
        const errorText = getErrorText(errorCode) ?? getCoreErrorText(errorCode) ?? errorCode;
        super(getLocalizedError(client, errorTextId, errorCode, errorText, ...errorArgs));
        this.errorCode = typeof errorCode === 'number' ? errorCode : -1;
        this.cause = errorText;
    }
}

/**
 * @param {BaseClient} client
 * @param {string} errorTextId
 * @param {number} errorCode
 * @param {string} errorText
 * @param {string} errorArgs
 * @return {string}
 */
function getLocalizedError(client, errorTextId, errorCode, errorText, ...errorArgs) {
    if (errorTextId !== '') return Localize.text(client, errorTextId, ...errorArgs);
    const textId = `errorCode_${errorCode}`;
    const localizedError = Localize.text(client, textId);
    if (localizedError === textId) return errorText;
    return localizedError;
}

module.exports = EmpireError;