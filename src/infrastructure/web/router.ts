import { Application } from 'express';
import { singleton } from 'tsyringe';
import { ProcessTransactionHandler } from '../handlers/process-transaction-handler';

@singleton()
export class MicroserviceRouter {
  constructor(private processTransactionHandler: ProcessTransactionHandler) {}

  registerRoutes(app: Application): void {
    app.post('/transaction', (req, resp) =>
      this.processTransactionHandler.run(req, resp)
    );
  }
}
