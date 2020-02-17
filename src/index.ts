import { ExceptionStore } from 'trackerr-abstract-exception-store';

type Middleware = (
  req: { path: string },
  res: { json: (...a: any) => any },
  next: Function,
) => Promise<void>;

export class Client {
  private exceptionsPageRoute = '/__exceptions';

  constructor(private exceptionStore: ExceptionStore) {
    process.on('uncaughtException', async (err) => {
      await this.storeException(err);
      console.error('Uncaught exception:', err);
      process.exit(1);
    });
  }

  private async storeException(err: Error) {
    return this.exceptionStore.store({
      stack: err.stack!,
      timestamp: new Date(),
    });
  }

  middleware(): Middleware {
    return async (req, res, next) => {
      if (req.path !== this.exceptionsPageRoute) {
        next();
        return;
      }

      const exceptions = await this.exceptionStore.get();
      return res.json({ exceptions });
    };
  }
}
