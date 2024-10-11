import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  TuiDay,
  tuiIsFalsy,
  tuiMarkControlAsTouchedAndValidate,
} from "@taiga-ui/cdk";
import {
  TuiAlertService,
  TuiButtonModule,
  TuiErrorModule,
  TuiGroupModule,
  TuiLabelModule,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import {
  TUI_VALIDATION_ERRORS,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiInputDateModule,
  TuiInputNumberModule,
  TuiRadioBlockModule,
  TuiSelectModule,
  TuiTextareaModule,
  TuiToggleModule,
} from "@taiga-ui/kit";
import {
  TuiCardModule,
  TuiHeaderModule,
  TuiSurfaceModule,
  TuiTitleModule,
} from "@taiga-ui/experimental";
import { interval, map, pairwise, scan, startWith } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { TuiCurrencyPipeModule } from "@taiga-ui/addon-commerce";
import { TransactionService } from "../../services/transaction.service";
import { CommentValidatorDirective } from "../../directives/comment-validator.directive";
import { Transaction } from "../../interfaces/transaction.interfaces";
import { TransactionType } from "../../types/transaction.types";
import { TRANSACTION_TYPES } from "../../constants/transaction.constants";

@Component({
  selector: "app-transaction-form",
  standalone: true,
  templateUrl: "transaction-form.component.html",
  imports: [
    ReactiveFormsModule,
    CommentValidatorDirective,
    TuiButtonModule,
    AsyncPipe,
    TuiCurrencyPipeModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiGroupModule,
    TuiInputNumberModule,
    TuiDataListWrapperModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    TuiRadioBlockModule,
    TuiInputDateModule,
    TuiTextareaModule,
    TuiLabelModule,
    TuiToggleModule,
    TuiCardModule,
    TuiHeaderModule,
    TuiSurfaceModule,
    TuiTitleModule,
  ],
  styleUrl: "transaction-form.component.less",
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        required: "Это поле обязательно для заполнения!",
        maxlength: ({ requiredLength }: { requiredLength: string }) =>
          `Максимальная длина — ${requiredLength} символов`,
        min: interval(2000).pipe(
          scan(tuiIsFalsy, false),
          map((val) =>
            val ? "Исправьте значение" : "Сумма не может быть меньше 0",
          ),
          startWith("Сумма не может быть меньше 0"),
        ),
        max: interval(2000).pipe(
          scan(tuiIsFalsy, false),
          map((val) =>
            val
              ? "Исправьте значение"
              : "Сумма не может быть больше 10 000 000",
          ),
          startWith("Сумма не может быть больше 10 000 000"),
        ),
      },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TransactionFormComponent implements OnInit {
  protected readonly TuiDay = TuiDay;
  private readonly alerts = inject(TuiAlertService);
  readonly loading = signal(false);
  protected transactionService = inject(TransactionService);

  protected readonly form = new FormGroup({
    transactionType: new FormControl<TransactionType>(
      TRANSACTION_TYPES.INCOME,
      {
        nonNullable: true,
        validators: Validators.required,
      },
    ),
    category: new FormControl<string>("", {
      nonNullable: true,
      validators: Validators.required,
    }),
    amount: new FormControl<number>(0, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(0),
        Validators.max(10000000),
      ],
    }),
    date: new FormControl<TuiDay>(TuiDay.currentLocal(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    addComment: new FormControl<boolean>(false),
    comment: new FormControl<string | null>(null),
  });

  ngOnInit() {
    this.form.controls.transactionType.valueChanges
      .pipe(startWith(TRANSACTION_TYPES.INCOME), pairwise())
      .subscribe(([prev, next]) => {
        if (prev !== next) {
          this.form.controls.category.reset();
        }
      });
  }

  submit() {
    tuiMarkControlAsTouchedAndValidate(this.form);

    if (this.form.valid) {
      this.loading.set(true);
      this.form.disable();

      const transaction: Omit<Transaction, "id"> =
        this.buildTransactionFromForm();
      this.transactionService.addTransaction(transaction);
      this.alerts
        .open("Транзакция добавлена", { status: "success" })
        .subscribe();

      this.resetForm();
    } else {
      this.showFormErrorAlert();
    }
  }

  private buildTransactionFromForm(): Omit<Transaction, "id"> {
    return {
      type: this.form.controls.transactionType.value,
      category: this.form.controls.category.value,
      amount: this.form.controls.amount.value,
      date: this.form.controls.date.value,
      comment: this.form.controls.addComment.value
        ? this.form.controls.comment.value
        : null,
    };
  }

  private resetForm(): void {
    this.loading.set(false);
    this.form.enable();
    this.form.reset();
  }

  private showFormErrorAlert(): void {
    this.alerts
      .open("В форме есть ошибки, пожалуйста, исправьте их.", {
        status: "error",
      })
      .subscribe();
  }
}
