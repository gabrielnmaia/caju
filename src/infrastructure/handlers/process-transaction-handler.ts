import { singleton } from 'tsyringe';
import { Response, Request } from 'express';
import { ProcessTransactionCollaboration } from '../../application/collaborations/process-transaction-collaboration';
@singleton()
export class ProcessTransactionHandler {
  constructor(
    private processTransactionCollaboration: ProcessTransactionCollaboration
  ) {}

  async run(req: Request, res: Response) {
    const collabResult = await this.processTransactionCollaboration.run(
      req.body
    );

    res.status(200).json(collabResult);
  }
}
