import { Directive, HostListener, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Validators } from "@angular/forms";

@Directive({
  selector: "[appCommentValidator]",
  standalone: true,
})
export class CommentValidatorDirective {
  @Input() appCommentValidator!: FormControl;

  @HostListener("change", ["$event.target.checked"])
  onCheckboxChange(checked: boolean) {
    const control = this.appCommentValidator;
    if (!control) {
      return;
    }

    if (checked) {
      control.setValidators([Validators.required, Validators.maxLength(100)]);
    } else {
      control.clearValidators();
    }
    control.updateValueAndValidity();
  }
}
