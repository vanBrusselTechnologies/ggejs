'use strict'

const BaseManager = require('./BaseManager');

class ImageManager extends BaseManager {
    /**
     *
     * @param {string} url url from `require('e4k-data').imageData["image_name"].url`
     * @returns {Promise<Buffer>}
     */
    getImage(url) {
        return new Promise(async (resolve, reject)=>{
            if(!url.startsWith('x768/')) reject(new Error('Url is not valid! It should start with x768/'));
            const response = await fetch(this.getFullUrl(url));
            const buffer = Buffer.from(await response.arrayBuffer());
            resolve(buffer);
        })
    }
    /**
     *
     * @param {string} url url from `require('e4k-data').imageData["image_name"].url
     * @returns {string}
     */
    getFullUrl(url){
        return `https://raw.githubusercontent.com/vanBrusselGames/E4K-data/main/images/${url}`;
    }
}

module.exports = ImageManager;