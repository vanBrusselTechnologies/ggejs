const _maxMS = 3600000;
const timeout = 1;

/**
 * Resolves when socket[field] is true.
 * Rejects when socket[errorField] !== ""
 * @param {Socket} socket
 * @param {string} field
 * @param {string} errorField
 * @param {number} maxMs
 * @returns {Promise<any>} Value of socket[field]
 */
module.exports.WaitUntil = function (socket, field, errorField = "", maxMs = _maxMS) {
    return _WaitUntil(socket, field, errorField, new Date(Date.now() + maxMs).getTime());
}

/**
 * Resolves when socket[field] is true. Rejects when socket[errorField] !== ""
 * @param {Socket} socket
 * @param {string} field
 * @param {string} errorField
 * @param {number} endDateTimestamp
 * @returns {Promise<any>}
 * @private
 */
function _WaitUntil(socket, field, errorField = "", endDateTimestamp) {
    return new Promise(async (resolve, reject) => {
        if (socket?._host == null) {
            reject(`WaitUntil: Socket missing! field: ${field}, errorField: ${errorField}`);
        } else if (socket[field]) {
            resolve(socket[field]);
        } else if (errorField !== "" && socket[errorField] && socket[errorField] !== "") {
            reject(socket[errorField]);
        } else if ((socket["__disconnecting"] && field !== "__disconnect") || socket.closed) {
            if (socket.debug) console.warn(`Socket was disconnecting or disconnected while requesting field: '${field}'`);
            reject("Socket disconnected!")
        } else if (endDateTimestamp < Date.now()) {
            reject("Exceeded max time!");
        } else {
            try {
                await new Promise(resolve => setTimeout(resolve, timeout));
                resolve(await _WaitUntil(socket, field, errorField, endDateTimestamp));
            } catch (e) {
                reject(e);
            }
        }
    })
}