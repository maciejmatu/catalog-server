import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as cors from 'cors';

import apiRouter from './routes/api';
import config from './config';

export class Server {
  public app: express.Application;

  public static bootstrap(): Server {
    return new Server();
  }

  constructor() {
    this.app = express();
    this.configure();
    this.middleware();
    this.api();
  }

  public configure() {
    /* overwrite deprecated mongoose promise library */
    (<any>mongoose).Promise = global.Promise;
    mongoose.connect(config.database);

    this.app.set('port', config.port);
    this.app.listen(config.port, _ => console.log(`API running on  ${ config.serverHost }:${ config.port }`));
  }

  public api() {
    this.app.use('/api', apiRouter);

    this.app.get('*', (req, res) => {
      res.json({ 'message': 'Welcome to Catalog REST Api' });
    });
  }

  public middleware() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors({ origin: config.clientURL }));
  }
}

Server.bootstrap();
