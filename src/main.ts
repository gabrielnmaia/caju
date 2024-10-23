import 'reflect-metadata';
import express from 'express';
import { container } from 'tsyringe';
import { WebServer } from './infrastructure/web/web-server';
import { DbGateway } from './infrastructure/database/db-gateway';

(async function () {
  let webServer: WebServer;

  Promise.all([container.register('IDbGateway', { useClass: DbGateway })]).then(
    async () => {
      webServer = new WebServer(express());
      await webServer.listen(
        process.env.PORT ? Number(process.env.PORT) : undefined
      );
    }
  );
  process.on('SIGINT', () => webServer.close());
  process.on('SIGTERM', () => webServer.close());
})();
