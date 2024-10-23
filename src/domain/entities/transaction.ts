interface TransactionConstructorParams {
  id: string;
  amount: number;
  merchant: string;
  mcc: string;
}

export interface TransactionDto {
  id: string;
  amount: number;
  merchant: string;
  mcc: string;
}

export class Transaction {
  private _id: string;
  private _amount: number;
  private _merchant: string;
  private _mcc: string;

  constructor({ id, amount, merchant, mcc }: TransactionConstructorParams) {
    this._id = id;
    this._amount = amount;
    this._merchant = merchant;
    this._mcc = mcc;
  }

  get amount(): number {
    return this._amount;
  }

  get merchant(): string {
    return this._merchant;
  }

  get mcc(): string {
    return this._mcc;
  }

  public toDto(): TransactionDto {
    return {
      id: this._id,
      amount: this._amount,
      merchant: this._merchant,
      mcc: this._mcc,
    };
  }
}
