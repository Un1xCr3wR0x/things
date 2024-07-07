import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText, iBanValidator } from '@gosi-ui/core';
import { EstablishmentDetails } from '../../../../shared/models';

@Component({
  selector: 'blg-bank-details-dc',
  templateUrl: './bank-details-dc.component.html',
  styleUrls: ['./bank-details-dc.component.scss']
})
export class BankDetailsDcComponent implements OnInit, OnChanges {
  // Input Variables
  @Input() bankNameFromApi: BilingualText;
  @Input() establishmentDetails?: EstablishmentDetails;
  @Input() bankName: BilingualText;
  @Input() ibanNumber: string;
  @Input() fromPage: string;
  @Input() lang;
  @Input() isSamaWorkflow: boolean;
  @Input() isAppPrivate: boolean = true;

  // Output Variables
  @Output() bankDetails = new EventEmitter();
  @Output() onIbanBlurred = new EventEmitter();
  // Local Variables
  newBankForm: FormGroup;
  editFlag = false;
  newIban: string;
  newBankName: BilingualText;
  ibanNo: string;
  formAlreadyCreated = false;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.setupForm();
  }
  setupForm() {
    this.newBankForm = this.createNewBankForm();
    this.newBankForm?.get('iban').valueChanges.subscribe(value => {
      this.newIban = value;
    });
    this.newBankForm?.get('bankName').valueChanges.subscribe(name => {
      this.newBankName = name;
    });
  }
  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes?.ibanNumber?.firstChange) {
      this.setupForm();
    }
    if (changes && changes.ibanNumber && changes.ibanNumber.currentValue) {
      this.ibanNumber = changes.ibanNumber.currentValue;
      this.newBankForm?.get('iban').setValue(this.ibanNumber);
    }
    if (changes && changes.bankName && changes.bankName.currentValue) {
      this.bankName = changes.bankName.currentValue;
      this.newBankForm?.get('bankName').setValue(this.bankName);
    }
    if (
      changes &&
      changes.bankNameFromApi &&
      changes.bankNameFromApi.currentValue &&
      this.newBankForm &&
      this.newBankForm.get('bankName')
    ) {
      this.newBankForm.get('bankName').setValue(this.bankNameFromApi);
      this.newBankForm.get('bankName').updateValueAndValidity();
    }
  }

  createNewBankForm(): FormGroup {
    return this.fb.group({
      iban: [this.ibanNumber, { validators: Validators.compose([Validators.required, iBanValidator]) }],
      bankName: this.fb.group({
        english: [this.bankName?.english, { validators: Validators.compose([Validators.required]) }],
        arabic: [this.bankName?.arabic, { validators: Validators.compose([Validators.required]) }]
      })
    });
  }
  getBankName(iban) {
    this.onIbanBlurred.emit(iban);
  }
  saveBankDetails() {
    if (this.newBankForm.get('iban').valid) {
      const bankDet = {
        bankName: this.newBankName,
        iban: this.newIban,
        isEdit: this.editFlag
      };
      this.ibanNumber = this.newIban;
      this.bankName = this.newBankName;
      this.editFlag = false;
      this.bankDetails.emit(bankDet);
    }
  }
  editBankDetails() {
    this.editFlag = !this.editFlag;
  }
  cancelBankDetails() {
    this.newBankForm.reset();
    this.editFlag = false;
  }
}
