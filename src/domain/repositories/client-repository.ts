import { inject, injectable } from 'tsyringe';
import { IDbGateway } from '../interfaces/db-gateway';
import { ClientDto, Client } from '../entities/client';
import { ClientFactory } from '../factories/client-factory';
import { Transaction, TransactionDto } from '../entities/transaction';

export interface IClientDbGateway {
  getClient(id: string): Promise<ClientDto | undefined>;
  addTransaction(transaction: TransactionDto, client: ClientDto): Promise<void>;
}

@injectable()
export class ClientRepository {
  constructor(
    @inject('IDbGateway')
    protected readonly dbGateway: IDbGateway
  ) {}

  async get(id: string): Promise<Client | undefined> {
    const clientDto = await this.dbGateway.getClient(id);

    if (!clientDto) return undefined;

    return ClientFactory.create(clientDto);
  }

  async addTransaction(
    transaction: Transaction,
    client: Client
  ): Promise<void> {
    const transactionGateway = await this.dbGateway.startTransaction();
    try {
      await transactionGateway.addTransaction(
        transaction.toDto(),
        client.toDto()
      );
      await transactionGateway.commitTransaction();
    } catch (e) {
      await transactionGateway.rollbackTransaction();
      throw e;
    }
  }
}
