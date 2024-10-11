import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { TuiDay } from "@taiga-ui/cdk";
import { v4 as uuidv4 } from "uuid";
import {
  JsonTransaction,
  Transaction,
} from "../interfaces/transaction.interfaces";
import { TransactionType } from "../types/transaction.types";
import { StorageService } from "./storage.service";
import { TRANSACTION_TYPES } from "../constants/transaction.constants";

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  private readonly transactionsSubject: BehaviorSubject<Transaction[]>;

  transactions$: Observable<Transaction[]> = new Observable<Transaction[]>();

  private readonly incomeItemsList = [
    "Зарплата",
    "Фриланс",
    "Инвестиции",
    "Аренда",
    "Прибыль от бизнеса",
    "Подарок",
    "Другое",
  ];

  private readonly expenseItemsList = [
    "Аренда жилья",
    "Продукты",
    "Коммунальные услуги",
    "Транспорт",
    "Развлечения",
    "Здоровье",
    "Образование",
    "Страховка",
    "Покупки",
    "Путешествия",
    "Рестораны",
    "Другое",
  ];

  constructor(private readonly storageService: StorageService) {
    this.transactionsSubject = new BehaviorSubject<Transaction[]>(
      this.loadFromLocalStorage(),
    );
    this.transactions$ = this.transactionsSubject.asObservable();
  }

  addTransaction(transaction: Omit<Transaction, "id">) {
    const transactions = this.transactionsSubject.getValue();

    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
    };

    transactions.push(newTransaction);
    this.transactionsSubject.next(transactions);
    this.saveToLocalStorage(transactions);
  }

  deleteTransaction(transactionId: string): void {
    const transactions = this.transactionsSubject.getValue();
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== transactionId,
    );
    this.transactionsSubject.next(updatedTransactions);
    this.saveToLocalStorage(updatedTransactions);
  }

  private loadFromLocalStorage(): Transaction[] {
    const storedTransactions = this.storageService.loadFromLocalStorage<
      JsonTransaction[]
    >("transactions", []);

    return storedTransactions.map((transaction) => ({
      ...transaction,
      date: TuiDay.fromLocalNativeDate(new Date(transaction.date)),
    }));
  }

  private saveToLocalStorage(transactions: Transaction[]) {
    this.storageService.saveToLocalStorage("transactions", transactions);
  }

  get incomeItems(): string[] {
    return this.incomeItemsList;
  }

  get expenseItems(): string[] {
    return this.expenseItemsList;
  }

  getItems(transactionType: TransactionType): string[] {
    let returnValue: string[];
    if (transactionType === TRANSACTION_TYPES.INCOME) {
      returnValue = this.incomeItems;
    } else if (transactionType === TRANSACTION_TYPES.EXPENSE) {
      returnValue = this.expenseItems;
    } else {
      returnValue = [];
    }
    return returnValue;
  }
}
