const Localize = require("./Localize");
const {getErrorText} = require("../utils/ErrorConst");

class EmpireError extends Error {
    errorCode = -1;

    constructor(client, errorCode, errorTextId = '') {
        const errorText = getErrorText(errorCode) ?? errorCode;
        super(getLocalizedError(client, errorTextId, errorCode, errorText));
        this.errorCode = typeof errorCode === 'number' ? errorCode : -1;
        this.cause = errorText;
    }
}

function getLocalizedError(client, errorTextId, errorCode, errorText) {
    if (errorTextId !== '') return Localize.text(client, errorTextId);
    const textId = `errorCode_${errorCode}`;
    const localizedError = Localize.text(client, textId);
    if (localizedError === textId) return errorText;
    return localizedError;
}

module.exports = EmpireError;