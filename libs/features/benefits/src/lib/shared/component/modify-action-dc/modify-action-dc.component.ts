/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import moment from 'moment';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GosiCalendar, LookupService, Lov, LovList } from '@gosi-ui/core';
import { AttorneyDetailsWrapper, BenefitPaymentDetails, DependentDetails } from '../../models';
import { HeirModifyStatus } from '../../models/heir-modify-status';
import { BenefitConstants } from '../../constants/benefit-constants';
import { HeirStatus } from '../../enum/heir-status';
import { Observable } from 'rxjs';
import { HeirAddModifyBaseComponent } from '../base/heir-add-modify-base.component';
@Component({
  selector: 'bnt-modify-action-dc',
  templateUrl: './modify-action-dc.component.html',
  styleUrls: ['./modify-action-dc.component.scss']
})
export class ModifyActionDcComponent extends HeirAddModifyBaseComponent implements OnInit, OnChanges {
  reasonForm: FormGroup;
  minDateGregorian: Date;
  heirFormData: HeirModifyStatus;
  notesMaxLength = BenefitConstants.DESCRIPTION_MAX_LENGTH;
  maxDate: Date;
  heirStatusEnums = HeirStatus;
  // reasonList: Lov[] = [];
  // reasonsList$ = new Observable<LovList>();

  /**
   * Input
   */
  @Input() paymentIndex = 0;
  @Input() systemRunDate: GosiCalendar;
  @Input() minDateForCalendar = new GosiCalendar();
  @Input() reasonsList: LovList;
  @Input() heirDetails: DependentDetails[] = [];
  @Input() heirDetail: DependentDetails;
  @Input() heirActionType: string;
  @Input() parentForm: FormGroup;
  @Input() isHeir: boolean;
  @Input() attorneyDetailsWrapper: AttorneyDetailsWrapper[];
  // @Output() HeirStatusData = new EventEmitter();

  // constructor(private fb: FormBuilder, readonly lookUpService: LookupService) {}
  benefitPaymentDetails: BenefitPaymentDetails = {
    payeeType: null,
    paymentMode: null,
    bankAccount: null,
    samaVerification: null
  } as BenefitPaymentDetails;

  ngOnInit(): void {
    this.reasonForm = this.createReasonForm();
    this.maxDate = moment(this.systemRunDate?.gregorian).toDate();
    this.dependentDetails = this.heirDetail;
    if (this.isHeir) {
      this.benefitPaymentDetails = {
        payeeType: this.heirDetail?.currentPayeeType,
        paymentMode: this.heirDetail?.currentPaymentMode,
        bankAccount: this.heirDetail?.currentBankAccount,
        samaVerification: this.heirDetail?.currentBankAccount?.status
      } as BenefitPaymentDetails;
    } else {
      this.benefitPaymentDetails = {
        payeeType: this.annuityResponse?.payeeType,
        paymentMode: this.annuityResponse?.paymentMethod,
        bankAccount: this.annuityResponse?.bankAccount,
        samaVerification: this.annuityResponse?.bankAccount?.status
      } as BenefitPaymentDetails;
    }

    if (this.reasonForm && this.heirDetail && (this.heirDetail?.reasonForModification || this.heirDetail?.notes)) {
      this.reasonForm.patchValue({
        reasonSelect: this.heirDetail?.reasonForModification,
        reasonNotes: this.heirDetail?.notes
      });
    }
    if (this.parentForm) {
      if (this.parentForm.get('statusChange')) {
        this.reasonForm.patchValue((this.parentForm.get('statusChange') as FormGroup).getRawValue());
        this.parentForm.removeControl('statusChange');
        this.parentForm.addControl('statusChange', this.reasonForm);
      } else {
        this.parentForm.addControl('statusChange', this.reasonForm);
      }
      // this.parentForm.get('statusChange').updateValueAndValidity();
    }
    if (this.minDateForCalendar?.gregorian) {
      this.minDateGregorian = moment(this.minDateForCalendar.gregorian).toDate();
    }
    // if (this.heirActionType === this.heirStatusEnums.HOLD) {
    //   if (this.isHeir) {
    //     this.reasonsList$ = this.lookUpService.getHeirHoldReasonList();
    //   } else {
    //     this.reasonsList$ = this.lookUpService.getDepHoldReasonList();
    //   }
    // } else if (this.heirActionType === this.heirStatusEnums.RESTART) {
    //   this.reasonsList$ = this.lookUpService.getRestartReasonList();
    // } else {
    //   this.reasonList = this.heirDetail.reasonForModifyLov;
    // }
    // this.reasonList = this.heirdet
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.systemRunDate && changes.systemRunDate.currentValue && !this.minDateForCalendar?.gregorian) {
      this.minDateGregorian = moment(changes.systemRunDate.currentValue.gregorian).toDate();
    }
    // if (changes.heirDetail && changes.heirDetail.currentValue && changes.heirDetail.currentValue.reasonForModifyLov) {
    //   this.reasonList = changes.heirDetail.currentValue.reasonForModifyLov;
    // }
  }

  createReasonForm() {
    const form = this.fb.group({
      reasonSelect: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      }),
      // statusDate: this.fb.group({
      //   gregorian: [moment(this.systemRunDate?.gregorian), { validators: Validators.required, updateOn: 'blur' }],
      //   hijiri: [null]
      // }),
      reasonNotes: [null, Validators.required]
    });
    if (this.heirActionType === this.heirStatusEnums.STOP) {
      form.addControl(
        'statusDate',
        this.fb.group({
          gregorian: [
            moment(this.systemRunDate?.gregorian).toDate(),
            { validators: Validators.required, updateOn: 'blur' }
          ],
          hijiri: [null]
        })
      );
    }
    return form;
  }
}
