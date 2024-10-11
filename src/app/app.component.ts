import { TuiRootModule, TuiAlertModule, TuiDialogModule } from "@taiga-ui/core";
import { Component } from "@angular/core";
import { TransactionFormComponent } from "./components/transaction-form/transaction-form.component";
import { TransactionHistoryComponent } from "./components/transaction-history/transaction-history.component";
import { TransactionStatisticsComponent } from "./components/transaction-statistics/transaction-statistics.component";

@Component({
  standalone: true,
  imports: [
    TransactionFormComponent,
    TransactionHistoryComponent,
    TransactionStatisticsComponent,
    TuiRootModule,
    TuiAlertModule,
    TuiDialogModule,
  ],
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.less",
})
export class AppComponent {}
