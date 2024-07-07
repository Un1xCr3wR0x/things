import { EventEmitter } from '@angular/core';
import { Output, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BilingualText, LovList } from '@gosi-ui/core';

@Component({
  selector: 'oh-injuries-closed-certain-period-dc',
  templateUrl: './injuries-closed-certain-period-dc.component.html',
  styleUrls: ['./injuries-closed-certain-period-dc.component.scss']
})
export class InjuriesClosedCertainPeriodDcComponent implements OnInit {
  maxlengthData = 250;
  isClosedClicked = false;
  closedStatusForm: FormGroup;
  statusEng: string[];
  statusArray = new Array<string>(4);
  status = [
    {
      label: 'REPORTS.CURED-WITH-DISABILITY',
      control: 'curedDisability',
      index: 0
    },
    {
      label: 'REPORTS.CURED-WITHOUT-DISABILITY',
      control: 'curedWithoutDisability',
      index: 1
    },
    {
      label: 'REPORTS.RESULTED-IN-DEATH',
      control: 'resultedInDeath',
      index: 2
    },
    {
      label: 'REPORTS.CLOSED-WITHOUT-CONTINUING-TREATMENT',
      control: 'closedWithoutContinuingTreatment',
      index: 2
    }
  ];

  @Input() showErrorMessage = false;
  @Input() showMandatoryMessage = false;
  @Input() isThirtyDays = false;
  @Input() claimsDateForm = new FormControl();
  @Input() injuriesClosedForm: FormGroup;
  @Input() checkForm: FormGroup;
  @Input() disabled = false;
  @Input() maxDate: Date;
  @Input() minDate;
  @Input() languageList: LovList;
  @Input() pdfExcelList: LovList;

  @Output() closeModal: EventEmitter<null> = new EventEmitter();
  @Output() hide: EventEmitter<null> = new EventEmitter();
  @Output() showSelectRange: EventEmitter<null> = new EventEmitter();
  @Output() showSelectDateRange: EventEmitter<null> = new EventEmitter();
  @Output() onGenerateInjuryClosed: EventEmitter<string[]> = new EventEmitter();

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.isClosedClicked = false;
    this.closedStatusForm = this.createClosedInjuryForm();
  }
  createClosedInjuryForm(): FormGroup {
    return this.fb?.group({
      status: this.fb.group({
        curedDisability: [null, { validators: Validators.required }],
        curedWithoutDisability: [null, { validators: Validators.required }],
        resultedInDeath: [null, { validators: Validators.required }],
        closedWithoutContinuingTreatment: [null, { validators: Validators.required }]
      })
    });
  }
  selectDateRange() {
    this.showSelectDateRange.emit();
  }

  selectRange() {
    this.showSelectRange.emit();
  }
  generateClosedPassed() {
   this.isClosedClicked = true;
    let values: BilingualText[] = [];

    if (this.closedStatusForm.get('status').get('curedDisability')?.value) {
      values = values?.concat({ english: 'Cured With Disability', arabic: 'شفاء بعجز' });
    }
    if (this.closedStatusForm.get('status').get('curedWithoutDisability')?.value) {
      values = values?.concat({ english: 'Cured Without Disability', arabic: 'شفاء بدون عجز' });
    }
    if (this.closedStatusForm.get('status').get('resultedInDeath')?.value) {
      values = values?.concat({ english: 'Resulted in Death', arabic: 'النتيجة وفاة' });
    }
    if (this.closedStatusForm.get('status').get('closedWithoutContinuingTreatment')?.value) {
      values = values?.concat({
        english: 'Closed without continuing treatment',
        arabic: 'مغلقة لعدم استكمال العلاج'
      });
    }
    this.setStatus(values);
    this.closedStatusForm.get('status').markAllAsTouched();
    this.closedStatusForm.updateValueAndValidity();
    this.onGenerateInjuryClosed.emit(this.statusEng);
  }
  checkDays(event, index) {
    this.statusArray[index] = event;
    let statusSelected = 0;
    this.statusArray?.forEach(val => {
      if (val === 'true') statusSelected++;
    });
    const dayitem = this.closedStatusForm?.get('status')?.value;
    if (statusSelected > 0) {
      Object.keys(dayitem).forEach(element => {
        this.closedStatusForm?.get('status')?.get(element).clearValidators();
        this.closedStatusForm?.get('status')?.get(element).updateValueAndValidity();
      });
    } else {
      Object.keys(dayitem).forEach(element => {
        this.closedStatusForm?.get('status')?.get(element).reset();
        this.closedStatusForm?.get('status')?.get(element).setValidators(Validators.required);
        this.closedStatusForm?.get('status')?.get(element).markAsPristine();
        this.closedStatusForm?.get('status')?.get(element).updateValueAndValidity();
      });
    }
  }
  hideModal() {
    this.hide.emit();
  }
  setStatus(statusFilter: BilingualText[]) {
    if (statusFilter) {
      this.statusEng = statusFilter.map(items => items.english);
    } else {
      this.statusEng = null;
    }
  }
}
