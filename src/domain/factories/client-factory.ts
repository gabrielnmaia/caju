import { Client } from '../entities/client';
import {
  TransactionCreationDto,
  TransactionFactory,
} from './transaction-factory';

export interface ClientCreationDto {
  id: string;
  foodBalance: number;
  mealBalance: number;
  cashBalance: number;
  transactions: TransactionCreationDto[];
}

export class ClientFactory {
  static create({
    id,
    foodBalance,
    mealBalance,
    cashBalance,
    transactions,
  }: ClientCreationDto): Client {
    return new Client({
      id,
      foodBalance,
      mealBalance,
      cashBalance,
      transactions: transactions.map((t) => TransactionFactory.create(t)),
    });
  }
}
