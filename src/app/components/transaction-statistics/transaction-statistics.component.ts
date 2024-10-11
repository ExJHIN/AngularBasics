import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  inject,
  ViewEncapsulation,
  ChangeDetectorRef,
} from "@angular/core";
import {
  TuiLegendItemModule,
  TuiRingChartModule,
} from "@taiga-ui/addon-charts";
import { AsyncPipe } from "@angular/common";
import { TuiHoveredModule } from "@taiga-ui/cdk";
import {
  TuiAlertService,
  tuiFormatNumber,
  TuiPrimitiveCheckboxModule,
  TuiSvgModule,
} from "@taiga-ui/core";
import { TuiMoneyModule } from "@taiga-ui/addon-commerce";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TuiCardModule, TuiSurfaceModule } from "@taiga-ui/experimental";
import { TransactionService } from "../../services/transaction.service";
import {
  TransactionKeyType,
  TransactionType,
} from "../../types/transaction.types";
import { Transaction } from "../../interfaces/transaction.interfaces";
import {
  TRANSACTION_KEY_TYPES,
  TRANSACTION_TYPES,
} from "../../constants/transaction.constants";

@Component({
  selector: "app-statistics",
  standalone: true,
  templateUrl: "transaction-statistics.component.html",
  styleUrls: ["transaction-statistics.component.less"],
  imports: [
    TuiRingChartModule,
    AsyncPipe,
    TuiLegendItemModule,
    TuiHoveredModule,
    TuiPrimitiveCheckboxModule,
    TuiMoneyModule,
    TuiSvgModule,
    TuiCardModule,
    TuiSurfaceModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class TransactionStatisticsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  protected activeItemIndex: Record<TransactionKeyType, number> = {
    income: NaN,
    expense: NaN,
  };

  protected enabledItems: Record<TransactionKeyType, boolean[]> = {
    income: [],
    expense: [],
  };

  protected labels: Record<TransactionKeyType, string[]> = {
    income: [],
    expense: [],
  };

  protected values: Record<TransactionKeyType, number[]> = {
    income: [],
    expense: [],
  };

  protected transactionService = inject(TransactionService);
  private readonly alerts = inject(TuiAlertService);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  protected readonly TRANSACTION_KEY_TYPES = TRANSACTION_KEY_TYPES;
  constructor(private readonly cdr: ChangeDetectorRef) {}

  protected onHover(
    key: TransactionKeyType,
    index: number,
    hovered: boolean,
  ): void {
    this.activeItemIndex[key] = hovered ? index : 0;
  }

  onToggleClick(event: Event, key: TransactionKeyType, index: number): void {
    event.stopPropagation();
    this.toggleItem(key, index);
  }

  onClick(key: TransactionKeyType, index: number): void {
    if (this.isEnabled(key, index)) {
      this.alerts
        .open(
          `Расход по категории: ${tuiFormatNumber(this.values[key][index])} ₽`,
          {
            label: this.labels[key][index],
          },
        )
        .subscribe();
    } else {
      this.toggleItem(key, index);
    }
  }

  ngOnInit(): void {
    this.transactionService.transactions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((transactions) => {
        this.initializeData(
          transactions,
          TRANSACTION_TYPES.INCOME,
          TRANSACTION_KEY_TYPES.INCOME,
        );
        this.initializeData(
          transactions,
          TRANSACTION_TYPES.EXPENSE,
          TRANSACTION_KEY_TYPES.EXPENSE,
        );
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeData(
    transactions: Transaction[],
    type: TransactionType,
    key: TransactionKeyType,
  ) {
    const categoryTotals = this.calculateCategoryTotals(transactions, type);

    this.labels[key] = Array.from(categoryTotals.keys());
    this.values[key] = Array.from(categoryTotals.values());

    if (this.enabledItems[key].length !== this.labels[key].length) {
      this.enabledItems[key] = new Array<boolean>(this.labels[key].length).fill(
        true,
      );
    }
  }

  private calculateCategoryTotals(
    transactions: Transaction[],
    type: TransactionType,
  ): Map<string, number> {
    return transactions.reduce((totals: Map<string, number>, transaction) => {
      if (transaction.type === type) {
        totals.set(
          transaction.category,
          (totals.get(transaction.category) || 0) + transaction.amount,
        );
      }
      return totals;
    }, new Map<string, number>());
  }

  protected sumArray(key: TransactionKeyType): number {
    const numbers = this.getValue(key);
    return Number.isNaN(this.activeItemIndex[key]) ||
      !this.isEnabled(key, this.activeItemIndex[key])
      ? numbers.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0,
        )
      : numbers[this.activeItemIndex[key]];
  }

  protected label(key: TransactionKeyType): string {
    return Number.isNaN(this.activeItemIndex[key]) ||
      !this.isEnabled(key, this.activeItemIndex[key])
      ? "Общая сумма"
      : this.labels[key][this.activeItemIndex[key]];
  }

  protected isItemActive(key: TransactionKeyType, index: number): boolean {
    return this.activeItemIndex[key] === index;
  }

  protected getColor(index: number): string {
    return `var(--tui-chart-${index})`;
  }

  getValue(key: TransactionKeyType): readonly number[] {
    return this.values[key].map((value, index) =>
      this.enabledItems[key][index] ? value : 0,
    );
  }

  isEnabled(key: TransactionKeyType, index: number): boolean {
    return this.enabledItems[key][index];
  }

  toggleItem(key: TransactionKeyType, index: number): void {
    this.enabledItems[key] = this.enabledItems[key].map((value, i) =>
      i === index ? !value : value,
    );
  }
}
