interface ExceptionStore {
  Store(exceptionInfo: ExceptionInfo): Promise<void>;
}

type ExceptionInfo = {
  stack: string;
  timestamp: Date;
};

class Client {
  constructor(private store: ExceptionStore) {
    process.on('uncaughtException', async (err) => {
      await this.storeException(err);

      console.error('Uncaught exception:', err);
      process.exit(1);
    });
  }

  async storeException(err: Error) {
    return this.store.Store({
      stack: err.stack!,
      timestamp: new Date(),
    });
  }
}

class NullExceptionStore implements ExceptionStore {
  constructor() {}

  Store(exceptionInfo: ExceptionInfo): Promise<void> {
    console.log(JSON.stringify(exceptionInfo));
    return Promise.resolve();
  }
}

setInterval(() => {}, 50000);

new Client(new NullExceptionStore());

throw Error('Hello');
