/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {
  BaseComponent,
  DocumentItem,
  iBanValidator,
  lengthValidator,
  Lov,
  LovList,
  AddressDetails,
  AddressTypeEnum
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ManagePersonConstants, PersonBankDetails } from '../../../../shared';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';
//This component is to set the bank hold of the person
@Component({
  selector: 'cim-bank-form-dc',
  templateUrl: './bank-form-dc.component.html',
  styleUrls: ['./bank-form-dc.component.scss']
})
export class BankFormDcComponent extends BaseComponent implements OnInit, OnChanges {
  //Local Variables
  modalRef: BsModalRef;
  bankDetailsForm: FormGroup;
  minMaxLengthAccountNo = 24;
  warningMessage: string =
    'The bank account number (IBAN) will be verified. Please ensure that the bank account is active and associated with the account holder to avoid rejection.';
  bankList: LovList = new LovList([
    { value: ManagePersonConstants.SAUDI_BANK, sequence: 1 }
    // { value: ManagePersonConstants.NON_SAUDI_BANK, sequence: 2 }
  ]);
  showNonSaudi: boolean = false;
  selectedAddresses = [];
  readonly foreignType = AddressTypeEnum.OVERSEAS;
  overSeasAddress = new AddressDetails();
  onlyAddressType: string; //If only one address is required
  toggleMailingAddress: FormControl;
  commonModalRef: BsModalRef;

  //Input Variables
  @Input() bankDetails: PersonBankDetails = new PersonBankDetails();
  @Input() documents: DocumentItem[] = [];
  @Input() param: number;
  @Input() bankNameList: Lov = new Lov();
  @Input() countryList: Observable<LovList>;
  @Input() parentForm: FormGroup;
  @Input() countryReadOnly = false;
  @Input() mandatoryOverseasAddress = false;
  @Input() readOnlyAll = false;
  @Input() idValue: '';

  //Output Variables
  @Output() emitForm: EventEmitter<FormGroup> = new EventEmitter();
  @Output() ibanCodeEmit: EventEmitter<string> = new EventEmitter();
  @Output() uploadedEvent: EventEmitter<void> = new EventEmitter();
  @Output() changeBankTypeEvent: EventEmitter<void> = new EventEmitter();
  @Output() newBankSave: EventEmitter<PersonBankDetails> = new EventEmitter();
  @Output() showAlert: EventEmitter<boolean> = new EventEmitter();
  list: LovList = new LovList([]);
  sin: number;
  ibanNumber: any = '';

  /**
   * Creates an instance of BankFormDcComponent
   * @memberof  BankFormDcComponent
   *
   */
  constructor(
    private fb: FormBuilder,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly modalService: BsModalService
  ) {
    super();
  }
  /**
   * This method handles the initialization tasks.
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sin = params['identifier'];
    });
    this.bankDetailsForm = this.createBankForm();
    this.bindInputToForm();
    this.emitForm.emit(this.bankDetailsForm);
    //this.setDocumentsNull();
  }

  /**
   * This method handles the changes made in the tasks.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.bankNameList && changes.bankNameList.currentValue && this.bankDetailsForm) {
      this.list = new LovList([changes.bankNameList.currentValue]);
      setTimeout(() => {
        if (this.bankDetailsForm.get('isNonSaudiIBAN').value === false) {
          this.bankDetailsForm.get('bankName').setValue(this.bankNameList.value);
          this.bankDetailsForm.get('bankName').updateValueAndValidity();
        }
      }, 100);
    }
    if (changes && changes.documents) {
      this.setDocumentsNull();
    }
  }

  /**
   * Method to emit person details form data to parent component
   */
  saveAndNext() {
    this.bankDetails = this.bankDetailsForm.getRawValue();
    if (this.bankDetailsForm.valid) {
      this.showAlert.emit(false);
      if (this.showNonSaudi == true) {
        this.bankDetails.isNonSaudiIBAN = true;
        this.newBankSave.emit(this.bankDetails);
      } else if (this.showNonSaudi == false) {
        this.newBankSave.emit(this.bankDetails);
      } else {
        this.bankDetailsForm.get('ibanBankAccountNo').markAllAsTouched();
        this.bankDetailsForm.get('ibanBankAccountNo').updateValueAndValidity();
        this.bankDetailsForm.get('bankName').markAllAsTouched();
        this.bankDetailsForm.get('bankName').updateValueAndValidity();
        this.newBankSave.emit(null);
      }
    } else {
      this.bankDetailsForm.get('ibanBankAccountNo').markAllAsTouched();
      this.bankDetailsForm.get('ibanBankAccountNo').updateValueAndValidity();
      this.bankDetailsForm.get('bankName').markAllAsTouched();
      this.bankDetailsForm.get('bankName').updateValueAndValidity();
      this.newBankSave.emit(null);
      this.showAlert.emit(true);
    }
  }

  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  onCancel(template: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(template);
  }

  /** Method to confirm cancellation of the form. */
  confirm() {
    this.commonModalRef.hide();
    this.router.navigate([`/home/profile/individual/internal/${this.param}/financial-details`]);
  }

  //This method is to decline cancellation of transaction
  decline() {
    this.commonModalRef.hide();
  }

  // Method to create form to get the bank details
  createBankForm(): FormGroup {
    return this.fb.group({
      isNonSaudiIBAN: [false, { validators: Validators.required, updateOn: 'blur' }],
      ibanBankAccountNo: [
        null,
        {
          validators: Validators.compose([
            Validators.required,
            iBanValidator,
            lengthValidator(this.minMaxLengthAccountNo)
          ]),
          updateOn: 'blur'
        }
      ],
      banklocation: this.fb.group({
        english: ['Saudi Arabia', { validators: Validators.required }],
        arabic: ['السعودية']
      }),
      bankName: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [null]
      }),
      bankAddress: [null, { validators: Validators.required, updateOn: 'blur' }],
      swiftCode: [
        null,
        {
          validators: Validators.pattern('[a-zA-Z0-9]+'),
          updateOn: 'blur'
        }
      ],
      bankCode: [null]
    });
  }

  /**
   *This method is used to fetch Branch look up values for selected bank
   * @param bankName
   * @memberof BankDetailsDcComponent
   */
  getBank() {
    if (this.bankDetailsForm.get('isNonSaudiIBAN').value === false) {
      this.bankDetailsForm.get('ibanBankAccountNo').markAllAsTouched();
      this.bankDetailsForm.get('ibanBankAccountNo').updateValueAndValidity();
      if (this.bankDetailsForm.get('ibanBankAccountNo').value && this.bankDetailsForm.get('ibanBankAccountNo').valid) {
        this.emitBankCode();
      }
    }
  }

  capitalize() {
    this.bankDetailsForm
      .get('ibanBankAccountNo')
      .valueChanges.pipe(
        distinctUntilChanged() //it is needed because patchValue emits execution again
      )
      .subscribe((value: string) => {
        this.bankDetailsForm.get('ibanBankAccountNo').patchValue(value.toUpperCase());
      });
  }

  /**
   * Method to emit the bank Code
   */
  emitBankCode() {
    const iBanCode = String(this.bankDetailsForm.get('ibanBankAccountNo').value).slice(4, 6);
    this.ibanCodeEmit.emit(iBanCode);
    this.bankDetailsForm.get('bankCode').setValue(iBanCode);
  }

  selectedLocation(evnt) {
    if (evnt == 'Outside Saudi Arabia') {
      this.showNonSaudi = true;
      this.bankDetailsForm.get('ibanBankAccountNo').reset();
      this.bankDetailsForm.get('bankName').reset();
      this.bankDetailsForm.get('swiftCode').reset();
      this.bankDetailsForm.get('bankAddress').reset();
    } else {
      this.showNonSaudi = false;
      this.bankDetailsForm.get('ibanBankAccountNo').reset();
      this.bankDetailsForm.get('bankName').reset();
    }
  }
  /**
   * Method to present the input data in the form
   */
  bindInputToForm() {
    if (this.bankDetailsForm) {
      Object.keys(this.bankDetails).forEach(name => {
        if (name in this.bankDetailsForm.controls) {
          this.bankDetailsForm.get(name).setValue(this.bankDetails[name]);
          this.bankDetailsForm.get(name).updateValueAndValidity();
        }
        if (name === 'isNonSaudiIBAN') {
          this.setIbanValidators(this.bankDetailsForm.get(name).value);
        }
        if (name === 'ibanBankAccountNo' && this.bankDetails[name]) {
          this.getBank();
        }
      });
    }
  }

  /**
   * Toggle event to select bank type
   * @param isNonSaudi
   */
  changeBankType(isNonSaudi: boolean) {
    this.setDocumentsNull();
    this.changeBankTypeEvent.emit();
    /* this.bankDetailsForm = this.createBankForm(); */
    this.setIbanValidators(isNonSaudi);
    this.bankDetailsForm.get('isNonSaudiIBAN').setValue(isNonSaudi);
    this.bankDetailsForm.get('isNonSaudiIBAN').updateValueAndValidity();
    this.checkBankTypeAndBindData(isNonSaudi);
    this.bankDetailsForm.markAsUntouched();
    this.bankDetailsForm.markAsPristine();
    this.bankDetailsForm.updateValueAndValidity();
    /* this.emitForm.emit(this.bankDetailsForm); */
  }

  /**
   * Method to check bank type and bind data
   * @param bankType
   */
  checkBankTypeAndBindData(bankType: boolean) {
    if (this.bankDetails.isNonSaudiIBAN === bankType) {
      this.bankDetailsForm.get('ibanBankAccountNo').setValue(this.bankDetails.ibanBankAccountNo);
      this.bankDetailsForm.get('bankName').setValue(this.bankDetails.bankName);
    } else {
      this.bankDetailsForm.get('ibanBankAccountNo').reset();
      this.bankDetailsForm.get('bankName').reset();
    }
  }

  /**
   * Method to set document to null on checking the banktype
   *
   */
  setDocumentsNull() {
    if (this.bankDetails && this.bankDetails.isNonSaudiIBAN === false) {
      this.documents.forEach(document => {
        document.documentContent = null;
        document.icon = null;
        document.fileName = null;
      });
    }
  }

  /**
   * Method to set the form controls validators for Saudi Bank or Non Saudi
   * @param isNonSaudi
   */
  setIbanValidators(isNonSaudi) {
    if (isNonSaudi === true) {
      this.bankDetailsForm.get('ibanBankAccountNo').setValidators(Validators.required);
      this.bankDetailsForm.get('ibanBankAccountNo').updateValueAndValidity();
      this.bankDetailsForm.get('bankAddress').setValidators([Validators.required]);
      this.bankDetailsForm.get('swiftCode').setValidators([Validators.required]);
      this.bankDetailsForm.get('ibanBankAccountNo').updateValueAndValidity();
      this.bankDetailsForm.get('bankAddress').updateValueAndValidity();
      this.bankDetailsForm.get('swiftCode').updateValueAndValidity();
    } else {
      this.bankDetailsForm
        .get('ibanBankAccountNo')
        .setValidators([Validators.required, iBanValidator, lengthValidator(this.minMaxLengthAccountNo)]);

      this.bankDetailsForm.get('bankAddress').clearValidators();
      this.bankDetailsForm.get('swiftCode').setValidators([Validators.pattern('[a-zA-Z0-9]+')]);
      this.bankDetailsForm.get('ibanBankAccountNo').updateValueAndValidity();
      this.bankDetailsForm.get('bankAddress').updateValueAndValidity();
      this.bankDetailsForm.get('swiftCode').updateValueAndValidity();

      this.bankDetailsForm.updateValueAndValidity();
    }
  }
  // Method to emit file uploaded details

  fileUploaded() {
    this.uploadedEvent.emit();
  }
}
