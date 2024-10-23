import { injectable } from 'tsyringe';
import { IPgClient, PgClient } from './pg-client';
import { IDbGateway } from '../../domain/interfaces/db-gateway';
import { ClientDto } from '../../domain/entities/client';
import { TransactionDto } from '../../domain/entities/transaction';

interface QueryClient {
  id: string;
  foodBalance: number;
  mealBalance: number;
  cashBalance: number;
  transactionId: string;
  transactionAmount: number;
  transactionMerchant: string;
  transactionMcc: string;
}

@injectable()
export class DbGateway implements IDbGateway {
  client: IPgClient;

  constructor(client?: IPgClient) {
    this.client = client || PgClient;
  }

  async startTransaction(): Promise<IDbGateway> {
    const transactionClient = await PgClient.getClient();
    const gateway = new DbGateway(transactionClient);
    await transactionClient.query('BEGIN;');
    return gateway;
  }

  async commitTransaction(): Promise<void> {
    await this.client.query('COMMIT;');
    await this.client.close();
  }

  async rollbackTransaction(): Promise<void> {
    await this.client.query('ROLLBACK;');
    await this.client.close();
  }

  async getClient(id: string): Promise<ClientDto | undefined> {
    const clientResult = (await this.client.query(
      `
      SELECT
        c.id,
        c.food_balance as 'foodBalance',
        c.meal_balance as 'mealBalance',
        c.cash_balance as 'cashBalance',
        t.id as 'transactionId',
        t.amount as 'transactionAmount',
        t.merchant as 'transactionMerchant',
        t.mcc as 'transactionMcc'
      FROM 
        client c
        left join transaction t on c.id = t.client_id
      WHERE
        c.id = $1
      ;
    `,
      [id]
    )) as QueryClient[];

    if (clientResult.length === 0) return undefined;

    return {
      id: clientResult[0].id,
      foodBalance: clientResult[0].foodBalance,
      mealBalance: clientResult[0].mealBalance,
      cashBalance: clientResult[0].cashBalance,
      transactions: clientResult[0].transactionId
        ? clientResult.map((t) => ({
            id: t.transactionId,
            amount: t.transactionAmount,
            merchant: t.transactionMerchant,
            mcc: t.transactionMcc,
          }))
        : [],
    };
  }

  async addTransaction(
    transaction: TransactionDto,
    client: ClientDto
  ): Promise<void> {
    await this.client.query(
      `
      INSERT INTO transaction (id, amount, merchant, mcc, client_id) 
      VALUES ($1, $2, $3, $4, $5) 
      ;
    `,
      [
        transaction.id,
        transaction.amount,
        transaction.merchant,
        transaction.mcc,
        client.id,
      ]
    );

    await this.client.query(
      `
      UPDATE
        client
      SET 
        food_balance = $2,
        meal_balance = $3,
        cash_balance = $4
      WHERE
        id = $1
    `,
      [client.id, client.foodBalance, client.mealBalance, client.cashBalance]
    );
  }
}
