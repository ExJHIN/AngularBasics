import { Pipe, PipeTransform } from "@angular/core";
import { TuiDay } from "@taiga-ui/cdk";

@Pipe({
  name: "dayShortFormatPipe",
  standalone: true,
})
export class DayShortFormatPipePipe implements PipeTransform {
  private readonly monthNamesShort = [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
  ];

  transform(value: TuiDay): string {
    if (!value) {
      return "";
    }

    const day = value.day;
    const month = this.monthNamesShort[value.month - 1];
    const year = value.year;

    return `${day} ${month} ${year}`;
  }
}
