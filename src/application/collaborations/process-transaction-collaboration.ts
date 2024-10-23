import { inject, injectable } from 'tsyringe';
import { ClientRepository } from '../../domain/repositories/client-repository';
import { TransactionFactory } from '../../domain/factories/transaction-factory';

interface TransactionDto {
  id: string;
  accountId: string;
  amount: number;
  merchant: string;
  mcc: string;
}

interface CollaborationResult {
  code: string;
}

enum TransactionResult {
  Approved = '00',
  Denied = '51',
  Error = '07',
}

@injectable()
export class ProcessTransactionCollaboration {
  constructor(private readonly clientRepository: ClientRepository) {}
  async run(transactionDto: TransactionDto): Promise<CollaborationResult> {
    try {
      const client = await this.clientRepository.get(transactionDto.accountId);
      const transaction = TransactionFactory.create(transactionDto);

      const hasBalance = client.hasBalance(transaction);

      if (!hasBalance) return { code: TransactionResult.Denied };

      await this.clientRepository.addTransaction(transaction, client);

      return { code: TransactionResult.Approved };
    } catch (e) {
      console.error(
        `${ProcessTransactionCollaboration.name} - Error on process transaction ${transactionDto.id}`,
        e
      );

      return { code: TransactionResult.Error };
    }
  }
}
