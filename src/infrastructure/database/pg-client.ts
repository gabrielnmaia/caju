import { Pool, PoolClient } from 'pg';

export type PrimitiveValue = number | string | boolean | null;

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
} = process.env;

const PgPool = new Pool({
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  host: POSTGRES_HOST,
  port: parseInt(POSTGRES_PORT || '5432', 10),
  database: POSTGRES_DB,
});

type PgClientInterface = Pool | PoolClient;

class PgClient {
  private client: PgClientInterface;

  constructor(client: PgClientInterface = PgPool) {
    this.client = client;
  }

  async query(
    sqlQuery: string,
    parameters?: PrimitiveValue[]
  ): Promise<unknown[]> {
    const { rows } = await this.client.query(sqlQuery, parameters);
    return rows;
  }

  async close(): Promise<void> {
    if (this.client instanceof Pool) {
      return this.client.end();
    }

    return this.client.release();
  }

  async getClient(): Promise<PgClient> {
    const client = await PgPool.connect();

    return new PgClient(client);
  }
}

const client = new PgClient();

export { client as PgClient, PgClient as IPgClient };
