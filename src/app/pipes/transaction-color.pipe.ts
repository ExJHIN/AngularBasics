import { Pipe, PipeTransform } from "@angular/core";
import { TransactionType } from "../types/transaction.types";
import { TRANSACTION_TYPES } from "../constants/transaction.constants";

@Pipe({
  name: "TransactionColor",
  standalone: true,
})
export class TransactionColorPipe implements PipeTransform {
  private readonly colorMap = new Map<TransactionType, string>([
    [TRANSACTION_TYPES.INCOME, "green"],
    [TRANSACTION_TYPES.EXPENSE, "red"],
  ]);

  transform(type: TransactionType): string {
    return this.colorMap.get(type) || "black";
  }
}
