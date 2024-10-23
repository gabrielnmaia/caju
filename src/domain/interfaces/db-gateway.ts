import { IClientDbGateway } from '../repositories/client-repository';

export type ITransactionDbGateway = {
  startTransaction(): Promise<IDbGateway>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
};

export type IDbGateway = ITransactionDbGateway & IClientDbGateway;
