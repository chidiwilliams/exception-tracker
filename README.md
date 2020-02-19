# trackerr

Simple exception tracking for small Express/Koa servers.

## Features

- Log uncaught exceptions to a data store of your choice

- View exceptions in the browser with an Express/Koa middleware from your app

- Get notified via email when an exception occurs (TODO)

## Installation

Install with NPM:

```shell
npm install --save trackerr
```

or Yarn:

```shell
yarn add trackerr
```

## Usage

Create a new client with a data store:

```js
import { Client } from 'trackerr';
import SQLiteStore from 'trackerr-sqlite';

const trackerr = new Client(new SQLiteStore('db.sql'));
```

trackerr will automatically begin to watch for uncaught exceptions in your app's process.

To use the middleware:

```js
server.use(trackerr.middleware());
```

The middleware will serve the trackerr page at `/__exceptions`.

## Data stores

The exception data may be stored in any data store of your choice. You may use one of the following maintained data stores or write your own plugin by implementing the `ExceptionDataStore` interface in [tracker-abstract-datastore](https://github.com/chidiwilliams/trackerr-abstract-exception-store).

- [SQLite](https://github.com/chidiwilliams/trackerr-sqlite)

## Comparison with other exception trackers

trackerr is free and open-source. It provides a simple middleware that mounts on your app, instead of relying on a third-party solution (like Airbrake or Sentry) or managing another server (like Errbit).

## Roadmap to V1

- [ ] Email notifications
- [ ] Search on exceptions page
