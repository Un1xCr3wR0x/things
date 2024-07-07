/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BaseComponent,
  Establishment,
  EstablishmentPaymentDetails,
  LovList,
  markFormGroupTouched,
  scrollToTop,
  startOfDay
} from '@gosi-ui/core';
import { BankDetailsDcComponent } from '@gosi-ui/foundation/form-fragments';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BankAccount } from '../../models';
import { isGovOrSemiGov } from '../../utils';
import {
  EstablishmentIbanValidationResponse
} from "@gosi-ui/features/establishment/lib/shared/models/establishment-iban-validation";
import {AccountStatusEnum} from "@gosi-ui/features/establishment/lib/shared/enums/sama-response-enum";


/**
 * This component is used to handle the payment details
 * @export
 * @class PaymentDetailsDcComponent
 * @extends {BaseComponent}
 *
 */
@Component({
  selector: 'est-payment-details-dc',
  templateUrl: './payment-details-dc.component.html',
  styleUrls: ['./payment-details-dc.component.scss']
})
export class PaymentDetailsDcComponent extends BaseComponent implements OnInit, OnChanges, AfterViewInit {
  /** Input Variables */
  @Input() establishment: Establishment;
  @Input() bankNameList$: Observable<LovList>;
  @Input() isAccountSaved: boolean;
  @Input() yesOrNoList: LovList;
  @Input() isInternational = false;
  @Input() showLateFeeIndicator = false;
  @Input() disableLateFee = false;
  @Input() isGcc = false;
  @Input() isIbanMapped = true;
  @Input() isActive = false;
  /** Output Variables */
  @Output() next: EventEmitter<Object> = new EventEmitter();
  @Output() IBAN: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() progress: EventEmitter<null> = new EventEmitter();
  @Output() keepDraft: EventEmitter<null> = new EventEmitter();
  @Output() samaResponseEmitter: EventEmitter<EstablishmentIbanValidationResponse> = new EventEmitter()
  @Output() samaFailureEmitter: EventEmitter<boolean> = new EventEmitter();

  /* Viewing child component */
  @ViewChild('BankDetailsDcComponent', { static: false })
  bankDetailsDcComponent: BankDetailsDcComponent;

  /** Local Variables */
  paymentDetailsForm: FormGroup;
  submitted = false;
  modalRef: BsModalRef;
  bankAccount: BankAccount = new BankAccount();
  showMOF = true;
  samaResponse: EstablishmentIbanValidationResponse = undefined;
  enableNextButton = true;

  /**
   * This method is used to initialise the component
   * @param fb
   * @memberof PaymentDetailsDcComponent
   */
  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
  }

  /**
   * This method handles the initialization tasks.
   * @memberof PaymentDetailsDcComponent
   */
  ngOnInit() {
    this.paymentDetailsForm = this.createPaymentDetailsForm();
    this.setComponentState(this.establishment, this.paymentDetailsForm);
  }

  /**
   * Method to set component state
   * @param establishment
   * @param form
   */
  setComponentState(establishment: Establishment, form: FormGroup) {
    if (this.paymentDetailsForm) {
      this.paymentDetailsForm.get('paymentType').get('english').setValue(null);
      this.setStartDate(this.paymentDetailsForm.get('startDate').get('gregorian') as FormControl, false);
    }
    if (establishment?.establishmentAccount && form) {
      this.selectPaymentType(establishment.establishmentAccount?.paymentType?.english);
      this.bankAccount = establishment.establishmentAccount.bankAccount;
      this.paymentDetailsForm.get('lateFeeIndicator').patchValue({
        english: establishment.establishmentAccount?.lateFeeIndicator?.english,
        arabic: establishment.establishmentAccount?.lateFeeIndicator?.arabic
      });
    }
    if (establishment?.proactive === true) {
      if (isGovOrSemiGov(establishment.legalEntity?.english)) {
        this.showMOF = true;
        this.paymentDetailsForm.get('lateFeeIndicator').get('english').setValue('Yes');
      } else {
        this.showMOF = false;
        this.paymentDetailsForm.get('lateFeeIndicator').get('english').setValue(null);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.establishment && changes.establishment.currentValue) {
      this.setComponentState(this.establishment, this.paymentDetailsForm);
    }
    if (changes.isInternational && changes.isInternational.currentValue) {
      if (this.isInternational === true) {
        this.showMOF = false;
      } else {
        this.showMOF = true;
      }
    }
  }

  ngAfterViewInit() {
    this.checkForValueChanges();
  }

  /*
   *This method is used to check value change in form
   */
  checkForValueChanges() {
    if (this.paymentDetailsForm) {
      this.paymentDetailsForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        if (this.isAccountSaved) {
          this.progress.emit();
        }
      });
    }
    if (this.bankDetailsDcComponent && this.bankDetailsDcComponent.bankAccountDetailsForm) {
      this.bankDetailsDcComponent.bankAccountDetailsForm
        .get('ibanAccountNo')
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          if (this.isAccountSaved) {
            this.progress.emit();
          }
        });
    }
  }

  /**
   * This method is used to initialise the form template
   */
  createPaymentDetailsForm() {
    const form = this.fb.group({
      paymentType: this.fb.group({
        arabic: [],
        english: [
          null,
          {
            validators: Validators.compose([Validators.required]),
            updateOn: 'blur'
          }
        ]
      }),
      startDate: this.fb.group({
        gregorian: [
          null,
          {
            validators: Validators.compose([Validators.required]),
            updateOn: 'blur'
          }
        ],
        hijiri: null
      }),
      lateFeeIndicator: this.fb.group({
        english: [null, { validators: Validators.compose([Validators.required]), updateOn: 'blur' }],
        arabic: [null, { updateOn: 'blur' }]
      }),
      registrationNo: [0]
    });
    return form;
  }

  /**
   * This method is used to reset payment details form
   */
  resetPaymentDetailsForm() {
    scrollToTop();
    this.showMOF = true;
    this.submitted = true;
    this.paymentDetailsForm.reset(this.createPaymentDetailsForm().getRawValue());
    this.bankDetailsDcComponent.resetBankDetailsForm();
    this.bankDetailsDcComponent.createBankDetailsForm();
    this.bankDetailsDcComponent.bankAccountDetailsForm.updateValueAndValidity();
    this.bankDetailsDcComponent.bankAccountDetailsForm.markAsPristine();
    this.bankDetailsDcComponent.bankAccountDetailsForm.markAsUntouched();
    this.paymentDetailsForm.updateValueAndValidity();
    this.paymentDetailsForm.markAsPristine();
    this.paymentDetailsForm.markAsUntouched();
  }

  /**
   * Set licence issue date as start date when payment type is 1002
   * @param type
   * @memberof PaymentDetailsDcComponent
   */
  selectPaymentType(type: string) {
    this.paymentDetailsForm.get('paymentType').get('english').setValue(type);
    this.paymentDetailsForm.get('paymentType').get('english').updateValueAndValidity();
    if (type === 'Yes') {
      this.setStartDate(
        this.paymentDetailsForm.get('startDate').get('gregorian') as FormControl,
        true,
        this.establishment.startDate.gregorian
      );
    } else {
      this.setStartDate(this.paymentDetailsForm.get('startDate').get('gregorian') as FormControl, false);
    }
  }

  /**
   * Method to set value and validitiy
   * @param formControl
   * @param value
   */
  setStartDate(formControl: FormControl, isMandatory: boolean, value?: Date) {
    if (isMandatory === true) {
      formControl.setValidators([Validators.required]);
      if (value !== null) {
        formControl.setValue(startOfDay(new Date(value)));
      }
    } else {
      formControl.setValue(null);
      formControl.clearValidators();
    }
    formControl.updateValueAndValidity();
  }
  /**
   * This method is to call branch list lookup service
   * @memberof PaymentDetailsDcComponent
   */
  getBranchList(iban) {
    this.IBAN.emit(iban);
  }

  /**
   * This method is save the payment form details
   * @memberof PaymentDetailsDcComponent
   */
  savePaymentDetails() {
    this.paymentDetailsForm.get('registrationNo').setValue(this.establishment.registrationNo);
    this.submitted = true;
    markFormGroupTouched(this.paymentDetailsForm);
    markFormGroupTouched(this.bankDetailsDcComponent.bankAccountDetailsForm);
    let paymentDetails: EstablishmentPaymentDetails;
    paymentDetails = this.paymentDetailsForm.getRawValue();
    if (
      this.establishment.proactive
      && this.bankDetailsDcComponent.bankAccountDetailsForm.get('ibanAccountNo').value
      && this.samaResponse
      && this.samaResponse.accountStatus === AccountStatusEnum.ACCOUNT_ACTIVE
    ) {
      paymentDetails.accountStatus = this.samaResponse.accountStatus;
      paymentDetails.matchStatus = this.samaResponse.matchStatus;
      paymentDetails.creditStatus = this.samaResponse.creditStatus;
    } else if (this.establishment.proactive && this.bankDetailsDcComponent.bankAccountDetailsForm.get('ibanAccountNo').value){
      return;
    }
    this.next.emit({
      paymentDetails: paymentDetails,
      bankAccount: this.bankDetailsDcComponent.bankAccountDetailsForm.getRawValue()
    });
  }
  /**
   * This method is to show a confirmation popup for cancelling the form
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  /**
   * This method is to confirm cancelation the form
   */
  confirmCancel() {
    this.modalRef.hide();
    this.cancel.emit();
  }

  /**
   * This method is to navigate to the previous section of the form
   */
  previousSection() {
    this.previous.emit();
  }

  /**
   * This method is to decline cancelation the form   *
   */
  decline() {
    this.modalRef.hide();
  }

  //This method is used to reset the entire form
  confirmReset() {
    this.modalRef.hide();
    this.resetPaymentDetailsForm();
  }

  /**
   * This method is to check whether the form is valid or not
   * @memberof PaymentDetailsDcComponent
   */
  isFormsValid() {
    markFormGroupTouched(this.bankDetailsDcComponent.bankAccountDetailsForm);
    if (this.paymentDetailsForm.valid && this.bankDetailsDcComponent.bankAccountDetailsForm.valid) {
      return true;
    } else if (!this.showMOF && this.bankDetailsDcComponent.bankAccountDetailsForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * This method is to keep transactions in draft
   */
  onKeepDraft() {
    this.modalRef.hide();
    this.keepDraft.emit();
  }

  validateSamaResponse(samaResponse: EstablishmentIbanValidationResponse) {
    this.samaResponse = samaResponse;
    this.samaResponseEmitter.emit(samaResponse);
  }

  updateNextButton(enableNextButton: boolean) {
    this.enableNextButton = enableNextButton;
  }

  checkSamaFailure(samaFailure: boolean) {
    this.samaFailureEmitter.emit(samaFailure);
  }
}
