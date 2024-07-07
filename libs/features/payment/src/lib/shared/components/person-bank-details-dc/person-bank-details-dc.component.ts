/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Inject, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MiscellaneousPaymentRequest, PersonBankDetails } from '../../models';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BenefitValues } from '../../enums/benefit-values';

@Component({
  selector: 'pmt-validator-bank-details-dc',
  templateUrl: './person-bank-details-dc.component.html',
  styleUrls: ['./person-bank-details-dc.component.scss']
})
export class PersonBankDetailsDcComponent implements OnChanges, OnInit {
  lang: string;

  bankStatusMap = new Map([
    ['Sama Verified', { arabic: 'تم التحقق', english: 'Verified' }],
    ['Sama Verification Pending', { arabic: 'في انتظار التحقق', english: 'Waiting for verification' }],
    ['Sama Verification Failed', { arabic: 'مرفوض', english: 'Sama Verification Failed' }]
  ]);

  //Input Variables
  @Input() bankDetails: PersonBankDetails;
  @Input() validDetails: MiscellaneousPaymentRequest;
  @Input() isIbanVerified = false;
  @Input() isCsr = false;
  @Input() bankName;

  @Output() onBankSave = new EventEmitter();
  @Output() OnIbanChange = new EventEmitter();

  bankEditForm: FormGroup;
  bankInfo;
  BenefitValues = BenefitValues;
  /**
   * Creates an instance of PersonBankDetailsDcComponent
   * @memberof  PersonBankDetailsDcComponent
   *
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>, readonly fb: FormBuilder) {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.bankName && changes.bankName.currentValue) {
      this.bankEditForm.patchValue({ bankName: this.bankName });
    }
    if (changes?.bankDetails?.currentValue) {
      this.bankDetails = changes?.bankDetails?.currentValue;
      this.setBankStatus();
    }
  }
  /**
   * This method handles the initialization tasks.
   *
   */
  ngOnInit() {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
    this.bankEditForm = this.fb.group({
      ibanBankAccountNo: [null, Validators.required],
      bankName: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
    if (this.bankDetails) {
      this.bankEditForm.patchValue({
        ibanBankAccountNo: this.bankDetails?.ibanBankAccountNo,
        bankName: this.bankDetails?.bankName
      });
    }
  }

  setBankStatus() {
    this.bankDetails.status = this.bankStatusMap.get(this.bankDetails.verificationStatus);
  }
}
