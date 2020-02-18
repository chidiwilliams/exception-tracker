# trackerr

Simple exception tracking for small Express/Koa servers.

## 🌟 Features

- 📜 Log uncaught exceptions to a data store of your choice

- 🌐 View exceptions in the browser with an Express/Koa middleware from your app

- 🔔 Get notified via email when an exception occurs (TODO)

## 🔧 Installation

Install with NPM:

```shell
npm install --save trackerr
```

or Yarn:

```shell
yarn add trackerr
```

## 📖 Usage

Create a new client with a data store:

```js
import { Client } from 'trackerr';
import SQLiteStore from 'trackerr-sqlite';

const client = new Client(new SQLiteStore('db.sql'));
```

trackerr will automatically begin to watch for uncaught exceptions in your app's process.

To use the middleware:

```js
server.use(client.middleware());
```

The middleware will serve the trackerr page at `/__exceptions`.

## 🚧 Roadmap to V1

- [ ] Email notifications
- [ ] Search on exceptions page
