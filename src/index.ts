import ejs from 'ejs';
import {
  ExceptionQueryOpts,
  ExceptionStore,
} from 'trackerr-abstract-exception-store';

type Middleware = (
  req: { path: string; query: { [k: string]: string } },
  res: { send: (...a: any) => any },
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

      const queryOpts: ExceptionQueryOpts = { timestampOrder: 'desc' };
      if (req.query.timestampOrder === 'asc') {
        queryOpts.timestampOrder = req.query.timestampOrder;
      }

      const exceptions = await this.exceptionStore.get(queryOpts);
      const template = await ejs.renderFile('templates/trackerr.html', {
        exceptions,
      });

      return res.send(template);
    };
  }
}
