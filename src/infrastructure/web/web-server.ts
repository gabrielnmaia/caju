import cors from 'cors';
import express from 'express';
import http from 'http';
import https from 'https';
import { container } from 'tsyringe';
import { PgClient } from '../database/pg-client';
import { HttpsOptions } from './https-options';
import { MicroserviceRouter } from './router';

export class WebServer {
  protected isInitialized = false;
  private httpServer: https.Server | http.Server;
  constructor(
    private readonly httpAdapter: express.Express,
    private readonly httpServerOption: HttpServerOptions = webServerDefaultOption
  ) {
    this.registerHttpServer();
  }

  public async init(): Promise<this> {
    if (this.isInitialized) {
      return this;
    }
    this.applyOptions();
    this.registerRouters();
    this.registerAnyRoute();

    this.isInitialized = true;
    return this;
  }

  public async listen(port = 3000): Promise<void> {
    new Promise<void>(async (resolve, _reject) => {
      if (!this.isInitialized) {
        await this.init();
      }
      this.httpServer.listen(port, () => {
        console.info(`Server ready and listening on port: ${port}`);
        resolve();
      });
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve) => {
      this.httpServer.close(async () => {
        await Promise.all([PgClient.close()]);
        resolve(null);
      });
    }).then(() => process.exit());
  }

  private registerHttpServer(): void {
    const { httpsOptions } = this.httpServerOption;
    if (httpsOptions) {
      this.httpServer = https.createServer(httpsOptions, this.httpAdapter);
      return;
    }
    this.httpServer = http.createServer(this.httpAdapter);
  }

  private applyOptions() {
    const { cors: corsOption, bodyParser } = this.httpServerOption;
    if (corsOption) {
      this.httpAdapter.use(cors());
    }
    if (bodyParser) {
      this.httpAdapter.use(express.json({ limit: '10mb' }));
      this.httpAdapter.use(
        express.urlencoded({ limit: '10mb', extended: true })
      );
      this.httpAdapter.use(
        (
          err: any,
          _req: express.Request,
          res: express.Response,
          next: express.NextFunction
        ) => {
          if (err) {
            res
              .status(422)
              .json({
                message: err.message,
                identifier: 'UnprocessableEntityError',
              });
            return;
          }
          return next();
        }
      );
    }
  }

  private registerAnyRoute() {
    this.httpAdapter.use((_req, resp, _next) => {
      resp
        .status(404)
        .json({
          message: 'Endpoint not found.',
          identifier: 'EndpointNotFoundError',
        });
    });
  }

  private registerRouters() {
    const router = container.resolve(MicroserviceRouter);
    router.registerRoutes(this.httpAdapter);
  }
}

export interface HttpServerOptions {
  cors?: boolean;
  bodyParser?: boolean;
  httpsOptions?: HttpsOptions;
}

export const webServerDefaultOption: HttpServerOptions = {
  cors: true,
  bodyParser: true,
};
