const _maxMS = 3600000;

module.exports = {
    /**
     * Resolves when socket[field] is true. Rejects when socket[errorField] !== ""
     * @param {Socket} socket
     * @param {string} field
     * @param {string} errorField
     * @param {number} maxMs
     * @returns Promise<void>
     */
    WaitUntil(socket, field, errorField = "", maxMs = _maxMS) {
        return _WaitUntil(socket, field, errorField, new Date(Date.now() + maxMs).getTime());
    },
}

/**
 *
 * @param {Socket} socket
 * @param {string} field
 * @param {string} errorField
 * @param {number} endDateTimestamp
 * @returns {Promise<void>}
 * @private
 */
function _WaitUntil(socket, field, errorField = "", endDateTimestamp) {
    return new Promise(async (resolve, reject) => {
        if (socket[field])
            resolve();
        else if (errorField !== "" && socket[errorField] && socket[errorField] !== "") {
            reject(socket[errorField]);
        } else if (endDateTimestamp < Date.now()) {
            reject("Exceeded max time");
        } else {
            try {
                await new Promise(resolve => {
                    setTimeout(() => resolve(), 1);
                });
                await _WaitUntil(socket, field, errorField, endDateTimestamp);
                resolve();
            } catch (e) {
                reject(e);
            }
        }
    })
}