# ggejs
A powerful [Node.js](https://nodejs.org) module for interacting with the server of [Goodgame Empire: Four Kingdoms](https://play.google.com/store/apps/details?id=air.com.goodgamestudios.empirefourkingdoms)

## Installation
```sh-session
npm install ggejs
```

## Example usage
```js
const { Client, Constants } = require('empirejs');

const client = new Client('username', 'password');

client.on('connected', () => {
    console.log("Client connected!");
});

client.connect();
```