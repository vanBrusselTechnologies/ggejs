'use strict'

const BaseManager = require('./BaseManager');

class ImageManager extends BaseManager {
    /**
     * @param {string} url url from `require('e4k-data').imageData["image_name"].url`
     * @returns {Promise<Buffer>}
     */
    async getImage(url) {
        if (!url.startsWith('x768/')) throw new Error('Url is not valid! It should start with x768/');
        const response = await fetch(this.getFullUrl(url));
        return Buffer.from(await response.arrayBuffer());
    }

    /**
     * @param {string} url url from `require('e4k-data').imageData["image_name"].url
     * @returns {string}
     */
    getFullUrl(url) {
        return `${require('e4k-data').imageBaseUrl}${url}`;
    }
}

module.exports = ImageManager;