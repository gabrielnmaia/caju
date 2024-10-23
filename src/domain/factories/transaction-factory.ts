import { Transaction } from '../entities/transaction';

export interface TransactionCreationDto {
  id: string;
  amount: number;
  merchant: string;
  mcc: string;
}

export class TransactionFactory {
  static create({
    id,
    amount,
    merchant,
    mcc,
  }: TransactionCreationDto): Transaction {
    return new Transaction({
      id,
      amount,
      merchant,
      mcc,
    });
  }
}
