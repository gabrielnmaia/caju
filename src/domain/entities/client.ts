import { Transaction, TransactionDto } from './transaction';

interface ClientConstructorParams {
  id: string;
  foodBalance: number;
  mealBalance: number;
  cashBalance: number;
  transactions: Transaction[];
}

export interface ClientDto {
  id: string;
  foodBalance: number;
  mealBalance: number;
  cashBalance: number;
  transactions: TransactionDto[];
}

const MERCHANT_MAP = new Map([
  ['UBER EATS', '5811'],
  ['IFOOD', '5811'],
  ['CARREFOUR', '5411'],
  ['PAG*JoseDaSilva', '5812'],
]);

export class Client {
  private _id: string;
  private _foodBalance: number;
  private _mealBalance: number;
  private _cashBalance: number;
  private _transactions: Transaction[];

  constructor({
    id,
    foodBalance,
    mealBalance,
    cashBalance,
    transactions,
  }: ClientConstructorParams) {
    this._id = id;
    this._foodBalance = foodBalance;
    this._mealBalance = mealBalance;
    this._cashBalance = cashBalance;
    this._transactions = transactions;
  }

  public hasBalance(transaction: Transaction): boolean {
    switch (this.getRealMcc(transaction)) {
      case '5411':
      case '5412':
        return this.processTransaction(transaction, '_foodBalance');
      case '5811':
      case '5812':
        return this.processTransaction(transaction, '_mealBalance');
      default:
        return this.processCashTransaction(transaction);
    }
  }

  public toDto(): ClientDto {
    return {
      id: this._id,
      foodBalance: this._foodBalance,
      mealBalance: this._mealBalance,
      cashBalance: this._cashBalance,
      transactions: this._transactions.map((t) => t.toDto()),
    };
  }

  private processTransaction(
    transaction: Transaction,
    benefitBalance: '_foodBalance' | '_mealBalance'
  ): boolean {
    const balanceResult = this[benefitBalance] - transaction.amount;

    if (balanceResult >= 0) {
      this[benefitBalance] = balanceResult;
      this.addTransaction(transaction);
      return true;
    }

    return this.processCashTransaction(transaction);
  }

  private processCashTransaction(transaction: Transaction): boolean {
    const cashBalanceResult = this._cashBalance - transaction.amount;

    if (cashBalanceResult >= 0) {
      this._cashBalance = cashBalanceResult;
      this.addTransaction(transaction);
      return true;
    }

    return false;
  }

  private addTransaction(transaction: Transaction): void {
    this._transactions = [...this._transactions, transaction];
  }

  private getRealMcc(transaction: Transaction): string {
    const merchantName = transaction.merchant.split('  ')[0];

    return MERCHANT_MAP.get(merchantName) || transaction.mcc;
  }
}
