import type { TuiDay } from "@taiga-ui/cdk";
import type { TransactionType } from "../types/transaction.types";

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: TuiDay;
  comment: string | null;
}

export interface JsonTransaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  comment: string | null;
}
