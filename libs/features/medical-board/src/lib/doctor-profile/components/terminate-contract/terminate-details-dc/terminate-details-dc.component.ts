import { Component, EventEmitter, OnInit, Output, Input, SimpleChanges,OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, LookupService, startOfDay, LovList, BilingualText } from '@gosi-ui/core';
import { DoctorService, MbProfile, TerminateData, Contracts } from '../../../../shared';
import moment from 'moment';
import { Observable } from 'rxjs';



@Component({
  selector: 'mb-terminate-details-dc',
  templateUrl: './terminate-details-dc.component.html',
  styleUrls: ['./terminate-details-dc.component.scss']
})
export class TerminateDetailsDcComponent implements OnInit,OnChanges {
  terminateContractForm: FormGroup;
  currentDate: Date = new Date();
  terminateData: TerminateData = new TerminateData();
  terminationDate: string;
  comments: string;
  terminateReason: BilingualText;

  // @Input() terminateReasonList: LovList;
  @Input() terminateReasonList: Observable<LovList>;
  @Input() terminat
  @Input() members: MbProfile;
  @Input() contract: Contracts = new Contracts();

  @Output() submit: EventEmitter<Object> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() invalidForm: EventEmitter<null> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    readonly alertService: AlertService,
    readonly doctorService: DoctorService,
    readonly lookUpService: LookupService
  ) { }

  ngOnInit() {
    this.terminateContractForm = this.createTerminateContractForm();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.contract && changes.contract.currentValue) {
      this.contract = changes.contract?.currentValue;
      this.bindToForm();
    }
  }
  /**Method to bind data */
  bindToForm(): void {
    if (this.terminateContractForm && this.contract) {
      if (this.contract?.terminateReason) {
        this.terminateContractForm.get('reason').get('english').setValue(this.contract?.terminateReason?.english);
        this.terminateContractForm.get('reason').updateValueAndValidity();
      }
      if (this.contract?.terminationDate) {
        this.terminateContractForm.get('terminateDate').get('gregorian').setValue(moment(this.contract?.terminationDate?.gregorian).toDate());
        this.terminateContractForm.get('terminateDate').updateValueAndValidity();
      }
      if (this.contract?.comments) {
        this.terminateContractForm.get('comments').setValue(this.contract?.comments);
        this.terminateContractForm.get('comments').updateValueAndValidity();
      }
    }
  }
  selectType(reason) {
    if (reason === 'Other') {
      this.terminateContractForm.get('comments').setValidators(Validators.required);
      this.terminateContractForm.get('comments').updateValueAndValidity();
    } else {
      this.terminateContractForm.get('comments').clearValidators();
      this.terminateContractForm.get('comments').updateValueAndValidity();
    }
  }

  saveDetails() {
    this.terminateContractForm.markAllAsTouched();
    if (!this.terminateContractForm.invalid) {
      this.terminateData.dateOfTermination.gregorian = startOfDay(
        this.terminateContractForm.get('terminateDate').get('gregorian').value
      );
      this.terminateData.reasonForTermination = this.terminateContractForm.get('reason').value;
      this.terminateData.comments = this.terminateContractForm.get('comments').value;
      this.submit.emit(this.terminateData);
    } else {
      this.invalidForm.emit();
    }
  }

  createTerminateContractForm() {
    return this.fb.group({
      terminateDate: this.fb.group({
        gregorian: [null, { validators: Validators.required, updateOn: 'blur' }],
        hijiri: ['']
      }),
      reason: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: []
      }),
      comments: ''
    });
  }
}
