import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
} from "@angular/core";
import {
  TuiButtonModule,
  TuiFormatDatePipeModule,
  TuiHintModule,
  TuiLinkModule,
  TuiScrollbarModule,
} from "@taiga-ui/core";
import { FormsModule } from "@angular/forms";
import { AsyncPipe } from "@angular/common";
import { Subject } from "rxjs";
import { TuiInputModule } from "@taiga-ui/kit";
import { trigger, transition, style, animate } from "@angular/animations";
import {
  TuiCardModule,
  TuiCellModule,
  TuiHeaderModule,
  TuiSurfaceModule,
  TuiTitleModule,
} from "@taiga-ui/experimental";
import { TransactionColorPipe } from "../../pipes/transaction-color.pipe";
import { TransactionService } from "../../services/transaction.service";
import { Transaction } from "../../interfaces/transaction.interfaces";
import { DayShortFormatPipePipe } from "../../pipes/day-short-format.pipe";
import { TransactionSignPipe } from "../../pipes/transaction-sign.pipe";

@Component({
  selector: "app-transaction-history",
  standalone: true,
  templateUrl: "transaction-history.component.html",
  styleUrl: "transaction-history.component.less",
  imports: [
    TuiHintModule,
    TransactionSignPipe,
    FormsModule,
    TuiFormatDatePipeModule,
    AsyncPipe,
    DayShortFormatPipePipe,
    TuiLinkModule,
    TransactionColorPipe,
    TuiButtonModule,
    TuiScrollbarModule,
    TuiInputModule,
    TuiTitleModule,
    TuiHeaderModule,
    TuiCardModule,
    TuiSurfaceModule,
    TuiCellModule,
  ],
  animations: [
    trigger("listAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(-20px)" }),
        animate(
          "500ms ease-in",
          style({ opacity: 1, transform: "translateY(0)" }),
        ),
      ]),
      transition(":leave", [
        animate(
          "1000ms ease-out",
          style({ opacity: 0, transform: "translateY(20px)" }),
        ),
      ]),
    ]),
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TransactionHistoryComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  private readonly transactionService = inject(TransactionService);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.transactionService.transactions$.subscribe((transactions) => {
      this.transactions = transactions.sort((a, b) => {
        const dateA = a.date.toLocalNativeDate();
        const dateB = b.date.toLocalNativeDate();
        return dateB.getTime() - dateA.getTime();
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteTransaction(transactionId: string): void {
    this.transactionService.deleteTransaction(transactionId);
  }
}
