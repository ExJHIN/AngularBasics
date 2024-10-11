import { Pipe, PipeTransform } from "@angular/core";
import { TransactionType } from "../types/transaction.types";
import { TRANSACTION_TYPES } from "../constants/transaction.constants";

@Pipe({
  name: "currencySymbol",
  standalone: true,
})
export class TransactionSignPipe implements PipeTransform {
  private readonly symbolMap = new Map<TransactionType, string>([
    [TRANSACTION_TYPES.INCOME, "+"],
    [TRANSACTION_TYPES.EXPENSE, "-"],
  ]);

  transform(value: number, transactionType: TransactionType): string {
    const symbol = this.symbolMap.get(transactionType) || "";
    return `${symbol} ${value.toLocaleString("ru-RU")} ₽`;
  }
}
