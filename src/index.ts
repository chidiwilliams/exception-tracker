import ejs from 'ejs';
import {
  ExceptionGetQueryOpts,
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

      const queryOpts: ExceptionGetQueryOpts = {
        timestampOrder: 'desc',
        page: 1,
        limit: 100,
      };
      if (req.query.timestampOrder === 'asc') {
        queryOpts.timestampOrder = req.query.timestampOrder;
      }
      if (req.query.page) {
        queryOpts.page = Number(req.query.page);
      }

      const exceptions = await this.exceptionStore.get(queryOpts);
      const countExceptions = await this.exceptionStore.count();

      const hasNextPage =
        (queryOpts.page! - 1) * queryOpts.limit! + exceptions.length <
        countExceptions;
      const hasPreviousPage = queryOpts.page !== 1;
      const template = await ejs.renderFile('templates/trackerr.html', {
        exceptions,
        timestampOrder: queryOpts.timestampOrder,
        page: queryOpts.page,
        limit: queryOpts.limit,
        totalCount: countExceptions,
        hasNextPage,
        hasPreviousPage,
      });

      return res.send(template);
    };
  }
}
