import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BilingualText, LovList } from '@gosi-ui/core';

@Component({
  selector: 'oh-injuries-treatment-more-than-certain-period-dc',
  templateUrl: './injuries-treatment-more-than-certain-period-dc.component.html',
  styleUrls: ['./injuries-treatment-more-than-certain-period-dc.component.scss']
})
export class InjuriesTreatmentMoreThanCertainPeriodDcComponent implements OnInit {
  maxlengthData = 250;
  statusForm: FormGroup;
  isTreatmentClicked = false;
  statusArray = new Array<string>(4);
  statusEng: string[];
  status = [
    {
      label: 'REPORTS.IN-PATIENT',
      control: 'inPatient',
      index: 0
    },
    {
      label: 'REPORTS.OUT-PATIENT',
      control: 'outPatient',
      index: 1
    },
    {
      label: 'REPORTS.SICK-LEAVE',
      control: 'sickLeave',
      index: 2
    }
  ];

  @Input() showErrorMessage = false;
  @Input() showMandatoryMessage = false;
  @Input() isThirtyDays = false;
  @Input() claimsDateForm = new FormControl();
  @Input() injuriesMoreForm: FormGroup;
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
  @Output() onGenerateInjuriesMore: EventEmitter<string[]> = new EventEmitter();
  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.isTreatmentClicked = false;
    console.log(this.pdfExcelList.items[0].sequence === 0);
    this.statusForm = this.createStatusForm();
    this.statusForm.get('status').setValidators(Validators.required);
    if (this.checkForm) this.checkForm.addControl('statusForm', this.statusForm);
  }

  createStatusForm(): FormGroup {
    return this.fb?.group({
      status: this.fb.group({
        inPatient: [null, { validators: Validators.required }],
        outPatient: [null, { validators: Validators.required }],
        sickLeave: [null, { validators: Validators.required }]
      })
    });
  }
  selectDateRange() {
    this.showSelectDateRange.emit();
  }

  selectRange() {
    this.showSelectRange.emit();
  }
  generateInjuriesMore() {
    this.isTreatmentClicked = true;
    let values: BilingualText[] = [];

    if (this.statusForm.get('status').get('inPatient')?.value) {
      values = [{ english: 'inPatient', arabic: 'تنويم' }];
    }
    if (this.statusForm.get('status').get('outPatient')?.value) {
      values = values?.concat({ english: 'outPatient', arabic: 'العيادات الخارجية' });
    }
    if (this.statusForm.get('status').get('sickLeave')?.value) {
      values = values?.concat({ english: 'sick leave', arabic: 'راحه مرضية' });
    }
    this.setStatus(values);
    this.statusForm.get('status').markAllAsTouched();
    this.statusForm.updateValueAndValidity();
    this.onGenerateInjuriesMore.emit(this.statusEng);
  }
  hideModal() {
    this.hide.emit();
  }
  checkDays(event, index) {
    this.statusArray[index] = event;
    let daysSelected = 0;
    this.statusArray?.forEach(val => {
      if (val === 'true') daysSelected++;
    });
    const dayitem = this.statusForm?.get('status')?.value;
    if (daysSelected > 0) {
      Object.keys(dayitem).forEach(element => {
        this.statusForm?.get('status')?.get(element).clearValidators();
        this.statusForm?.get('status')?.get(element).updateValueAndValidity();
      });
    } else {
      Object.keys(dayitem).forEach(element => {
        this.statusForm?.get('status')?.get(element).reset();
        this.statusForm?.get('status')?.get(element).setValidators(Validators.required);
        this.statusForm?.get('status')?.get(element).markAsPristine();
        this.statusForm?.get('status')?.get(element).updateValueAndValidity();
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
