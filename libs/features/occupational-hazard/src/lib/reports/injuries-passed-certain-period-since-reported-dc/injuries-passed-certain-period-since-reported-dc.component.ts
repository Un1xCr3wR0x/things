import { EventEmitter } from '@angular/core';
import { Output, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BilingualText, LovList } from '@gosi-ui/core';

@Component({
  selector: 'oh-injuries-passed-certain-period-since-reported-dc',
  templateUrl: './injuries-passed-certain-period-since-reported-dc.component.html',
  styleUrls: ['./injuries-passed-certain-period-since-reported-dc.component.scss']
})
export class InjuriesPassedCertainPeriodSinceReportedDcComponent implements OnInit {
  maxlengthData = 250;  
  injuryStatusForm: FormGroup;
  isPassedClicked = false;
  statusEng: string[];
  statusArray = new Array<string>(7);
  status = [
    {
      label: 'REPORTS.INPROGRESS-SMALL',
      control: 'pending',
      index: 0
    },
    {
      label: 'REPORTS.APPROVED',
      control: 'approved',
      index: 1
    },
    {
      label: 'REPORTS.REJECTED',
      control: 'rejected',
      index: 2
    },
    {
      label: 'REPORTS.CURED-WITH-DISABILITY',
      control: 'curedDisability',
      index: 2
    },
    {
      label: 'REPORTS.CURED-WITHOUT-DISABILITY',
      control: 'curedWithoutDisability',
      index: 2
    },
    {
      label: 'REPORTS.CLOSED-WITHOUT-CONTINUING-TREATMENT',
      control: 'closedWithoutContinuingTreatment',
      index: 2
    },
    {
      label: 'REPORTS.RESULTED-IN-DEATH',
      control: 'resultedInDeath',
      index: 2
    }
  ];

  @Input() showErrorMessage = false;
  @Input() showMandatoryMessage = false;
  @Input() isThirtyDays = false;
  @Input() claimsDateForm = new FormControl();
  @Input() injuriesPassedForm: FormGroup; 
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
  @Output() onGenerateInjuryPassed: EventEmitter<string[]> = new EventEmitter();

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.isPassedClicked = false;
    this.injuryStatusForm = this.createInjuryStatusForm();
  }
  createInjuryStatusForm(): FormGroup {
    return this.fb?.group({
      status: this.fb.group({
        pending: [null, { validators: Validators.required }],
        approved: [null, { validators: Validators.required }],
        rejected: [null, { validators: Validators.required }],
        curedDisability: [null, { validators: Validators.required }],
        curedWithoutDisability: [null, { validators: Validators.required }],
        closedWithoutContinuingTreatment: [null, { validators: Validators.required }],
        resultedInDeath: [null, { validators: Validators.required }]
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
    this.isPassedClicked = true;
    let values: BilingualText[] = [];

    if (this.injuryStatusForm.get('status').get('pending')?.value) {
      values = [{ english: 'Pending', arabic: 'معـلّـق' }];
    }
    if (this.injuryStatusForm.get('status').get('approved')?.value) {
      values = values?.concat({ english: 'Approved', arabic: 'إعتماد' });
    }
    if (this.injuryStatusForm.get('status').get('rejected')?.value) {
      values = values?.concat({ english: 'Rejected', arabic: 'رفض' });
    }
    if (this.injuryStatusForm.get('status').get('curedDisability')?.value) {
      values = values?.concat({ english: 'Cured With Disability', arabic: 'شفاء بعجز' });
    }
    if (this.injuryStatusForm.get('status').get('curedWithoutDisability')?.value) {
      values = values?.concat({ english: 'Cured Without Disability', arabic: 'شفاء بدون عجز' });
    }
    if (this.injuryStatusForm.get('status').get('resultedInDeath')?.value) {
      values = values?.concat({ english: 'Resulted in Death', arabic: 'النتيجة وفاة' });
    }
    if (this.injuryStatusForm.get('status').get('closedWithoutContinuingTreatment')?.value) {
      values = values?.concat({
        english: 'Closed without continuing treatment',
        arabic: 'مغلقة لعدم استكمال العلاج'
      });
    }
    this.setStatus(values);
    this.injuryStatusForm.get('status').markAllAsTouched();
    this.injuryStatusForm.updateValueAndValidity();
    this.onGenerateInjuryPassed.emit(this.statusEng);
  }
  hideModal() {
    this.hide.emit();
  }
  checkDays(event, index) {
    this.statusArray[index] = event;
    let statusSelected = 0;
    this.statusArray?.forEach(val => {
      if (val === 'true') statusSelected++;
    });
    const dayitem = this.injuryStatusForm?.get('status')?.value;
    if (statusSelected > 0) {
      Object.keys(dayitem).forEach(element => {
        this.injuryStatusForm?.get('status')?.get(element).clearValidators();
        this.injuryStatusForm?.get('status')?.get(element).updateValueAndValidity();
      });
    } else {
      Object.keys(dayitem).forEach(element => {
        this.injuryStatusForm?.get('status')?.get(element).reset();
        this.injuryStatusForm?.get('status')?.get(element).setValidators(Validators.required);
        this.injuryStatusForm?.get('status')?.get(element).markAsPristine();
        this.injuryStatusForm?.get('status')?.get(element).updateValueAndValidity();
      });
    }
  }
  setStatus(statusFilter: BilingualText[]) {
    if (statusFilter) {
      this.statusEng = statusFilter.map(items => items.english);
    } else {
      this.statusEng = null;
    }
  }
}
