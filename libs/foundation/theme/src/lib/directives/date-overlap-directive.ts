import { Directive, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { BaseComponent } from '@gosi-ui/core';
import moment from 'moment';
import { takeUntil, tap } from 'rxjs/operators';
import { InputDateDcComponent, InputMonthDcComponent } from '../components';

@Directive({
  selector: '[gosiDateOverlap]'
})
export class DateOverlapDirective extends BaseComponent implements OnInit, OnDestroy {
  @Input('gosiDateOverlap') startDateControl: FormControl;
  @Input() canBeSame = false;

  endDateControl: FormControl;
  component: InputDateDcComponent | InputMonthDcComponent;

  constructor(
    @Optional()
    private endDateComponent: InputDateDcComponent,
    @Optional()
    private endMonthComponent: InputMonthDcComponent
  ) {
    super();
  }

  ngOnInit() {
    this.component = this.endDateComponent || this.endMonthComponent;
    this.endDateControl = this.component.control;
    this.startDateControl?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.handleValidation())
      )
      .subscribe();
    this.endDateControl?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.handleValidation())
      )
      .subscribe();
  }

  handleValidation() {
    const startDate = new Date(this.startDateControl?.value ? this.startDateControl?.value : undefined);
    const endDate = new Date(this.endDateControl?.value ? this.endDateControl?.value : undefined);
    if (moment(endDate).isBefore(startDate, 'day')) {
      this.endDateControl.setErrors(this.getEndDateError(endDate, startDate), { emitEvent: false });
    } else if (moment(endDate).isSame(startDate, 'day') && !this.canBeSame) {
      this.endDateControl.setErrors(this.getEndDateError(endDate, startDate), { emitEvent: false });
    } else {
      const errorKeys = this.endDateControl?.errors ? Object.keys(this.endDateControl.errors) : [];
      const validFilters: ValidationErrors =
        errorKeys?.length > 0
          ? errorKeys
              .filter(key => key !== 'minDate')
              .reduce((agg, key) => {
                return { ...agg, [key]: this.endDateControl?.errors[key] };
              }, {})
          : null;
      this.endDateControl.setErrors(validFilters, { emitEvent: false });
    }
    this.endDateControl.markAsTouched();
    this.component.setErrorMsgs(this.endDateControl);
  }

  getEndDateError(endDate, startDate: Date): ValidationErrors {
    return {
      minDate: {
        controlValue: endDate,
        minDateValue: moment(startDate)
          .add(this.canBeSame ? 0 : 1, 'days')
          .toString()
      }
    };
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
