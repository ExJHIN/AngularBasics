import type { TRANSACTION_TYPES } from "../constants/transaction.constants";
import type { TRANSACTION_KEY_TYPES } from "../constants/transaction.constants";

export type TransactionType =
  (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];

export type TransactionKeyType =
  (typeof TRANSACTION_KEY_TYPES)[keyof typeof TRANSACTION_KEY_TYPES];
