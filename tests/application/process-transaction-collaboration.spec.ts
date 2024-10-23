import { ProcessTransactionCollaboration } from '../../src/application/collaborations/process-transaction-collaboration';
import { Client } from '../../src/domain/entities/client';
import { ClientRepository } from '../../src/domain/repositories/client-repository';

describe('ProcessTransactionCollaboration', () => {
  describe('run', () => {
    describe('when client is not found', () => {
      it('returns code 07', async () => {
        const clientRepo = new ClientRepository(null as any);

        jest.spyOn(clientRepo, 'get').mockResolvedValue(undefined);

        const collab = new ProcessTransactionCollaboration(clientRepo);

        const res = await collab.run({
          id: '423',
          accountId: '1',
          amount: 80.0,
          merchant: 'UBER EATS                   SAO PAULO BR',
          mcc: '5821',
        });

        expect(res).toEqual({ code: '07' });
      });
    });

    describe('when client has no balance', () => {
      it('returns code 51', async () => {
        const clientRepo = new ClientRepository(null as any);

        jest.spyOn(clientRepo, 'get').mockResolvedValue(
          new Client({
            id: '1',
            foodBalance: 0,
            mealBalance: 0,
            cashBalance: 0,
            transactions: [],
          })
        );

        const collab = new ProcessTransactionCollaboration(clientRepo);

        const res = await collab.run({
          id: '423',
          accountId: '1',
          amount: 80.0,
          merchant: 'UBER EATS                   SAO PAULO BR',
          mcc: '5821',
        });

        expect(res).toEqual({ code: '51' });
      });
    });

    describe('when client has balance', () => {
      it('returns code 00', async () => {
        const clientRepo = new ClientRepository(null as any);

        jest.spyOn(clientRepo, 'get').mockResolvedValue(
          new Client({
            id: '1',
            foodBalance: 100,
            mealBalance: 100,
            cashBalance: 1000,
            transactions: [],
          })
        );
        jest.spyOn(clientRepo, 'addTransaction').mockResolvedValue();

        const collab = new ProcessTransactionCollaboration(clientRepo);

        const res = await collab.run({
          id: '423',
          accountId: '1',
          amount: 80.0,
          merchant: 'UBER EATS                   SAO PAULO BR',
          mcc: '5821',
        });

        expect(res).toEqual({ code: '00' });
      });
    });
  });
});
