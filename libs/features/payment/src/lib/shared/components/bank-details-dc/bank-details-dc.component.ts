import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, Lov, LovList, BilingualText, iBanValidator, lengthValidator } from '@gosi-ui/core';
import { BankAccountList, PatchPersonBankDetails, BilingualMessageWrapper } from '../../../shared/models';

@Component({
  selector: 'pmt-bank-details-dc',
  templateUrl: './bank-details-dc.component.html',
  styleUrls: ['./bank-details-dc.component.scss']
})
export class BankDetailsDcComponent implements OnInit {
  /** Input variables */
  @Input() bankAccountList: BankAccountList[];
  @Input() parentForm: FormGroup;
  @Input() bankResponse: BilingualMessageWrapper;
  @Input() bankName: BilingualText;
  @Input() fromValidator: Boolean = false;

  @Output() editEvent = new EventEmitter();
  @Output() onSelectIBAN = new EventEmitter();
  @Output() onIbanTypeChange = new EventEmitter();

  bankCode: number;
  bankType: string;
  selectIbanModeForm: FormGroup;
  bankEditForm: FormGroup;
  modalRef;
  modalService;
  existingIbanList: Lov[] = [];
  existingIbanLovList: LovList;
  newIban: Boolean = true;
  bankAccountId;
  ibanBankAccountNo;

  constructor(readonly fb: FormBuilder, readonly alertService: AlertService) {}

  ngOnInit(): void {
    //if user have bank details saved
    if (this.bankAccountList.filter(list => list.isSamaVerified).length > 0) {
      const samaVerifiedBanks = this.bankAccountList.filter(list => list.isSamaVerified);
      this.bankType = 'selectIban';
      this.newIban = false;
      this.generateIbanLovList(samaVerifiedBanks);
      this.selectIbanModeForm = this.createPickIbanForm();
      this.parentForm.addControl('selectIbanMode', this.selectIbanModeForm);
      if (this.fromValidator) {
        this.selectIbanModeForm
          ?.get('selectIbanMode')
          ?.get('english')
          ?.setValue(samaVerifiedBanks[0].ibanBankAccountNo);
        this.selectIbanModeForm.get('bankName').setValue(samaVerifiedBanks[0]?.bankName);
      }
    } else {
      this.bankType = 'addNewIban';
      this.alertService.clearAlerts();
      this.alertService.showWarningByKey('PAYMENT.NO-IBAN-FOR-USER-WARNING-MSG');
      this.bankEditForm = this.createEditBankDetailsForm();
      this.parentForm.addControl('ibanBankAccountNo', this.bankEditForm);
    }
    if (
      this.fromValidator &&
      (this.bankAccountList.filter(list => list.isSamaVerified).length <= 0 || !this.bankAccountList[0].isSamaVerified)
    ) {
      this.bankType = 'addNewIban';
      this.newIban = true;
      this.alertService.clearAlerts();
      this.alertService.showWarningByKey('PAYMENT.NO-IBAN-FOR-USER-WARNING-MSG');
      this.bankEditForm = this.createEditBankDetailsForm();
      this.parentForm.addControl('ibanBankAccountNo', this.bankEditForm);
      this.bankEditForm.get('ibanBankAccountNo').setValue(this.bankAccountList[0].ibanBankAccountNo);
      this.getName();
    }
  }

  /** this function is used to create form for selectIbanModeForm */
  createPickIbanForm() {
    return this.fb.group({
      selectIbanMode: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      bankName: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  // Method to create edit bank details form
  createEditBankDetailsForm() {
    return this.fb.group({
      ibanBankAccountNo: [
        '',
        {
          validators: Validators.compose([Validators.required, iBanValidator, lengthValidator(24)])
        }
      ]
    });
  }
  /**this method will toggle the IBAN method */
  bankTypeChange(bankType) {
    //Select IBAN Tab is selected
    if (bankType === 'selectIban') {
      this.bankType = 'selectIban';
      this.newIban = false;
      this.bankName = null;
      this.selectIbanModeForm = this.createPickIbanForm();
      if (this.parentForm.get('selectIbanMode')) {
        this.parentForm.removeControl('selectIbanMode');
      }
      this.parentForm.addControl('selectIbanMode', this.selectIbanModeForm);
    }
    // Add New IBAN tab is selected
    else if (bankType === 'addNewIban') {
      this.bankType = 'addNewIban';
      this.newIban = true;
      if (this.bankEditForm === undefined) {
        this.bankEditForm = this.createEditBankDetailsForm();
        if (this.parentForm.get('ibanBankAccountNo')) {
          this.parentForm.removeControl('ibanBankAccountNo');
        }
        this.parentForm.addControl('ibanBankAccountNo', this.bankEditForm);
      }
      if (this.bankEditForm && this.bankEditForm.get('ibanBankAccountNo').valid) {
        this.getName();
      }
    }
    this.onIbanTypeChange.emit(true);
  }
  /*** this function will fetch the Lov list required for the other payment method */
  getLookupValues() {}

  /*** this function generate lov list for the saved IBAN values */
  generateIbanLovList(bankAccountList: BankAccountList[]) {
    bankAccountList.forEach((bank, index) => {
      const lov = new Lov();
      lov.sequence = index;
      lov.value.english = bank.ibanBankAccountNo;
      lov.value.arabic = bank.ibanBankAccountNo;
      lov.code = bank.bankAccountId;
      this.existingIbanList.push(lov);
    });
    this.existingIbanLovList = new LovList(this.existingIbanList);
  }

  /** this method is triggered when user select one IBAN from the dropdown */
  IBANSelcted(lovValue: Lov) {
    if (lovValue && lovValue.code !== null) {
      this.bankAccountList.forEach(bank => {
        if (bank.bankAccountId === lovValue.code) {
          this.bankAccountId = bank?.bankAccountId;
          this.ibanBankAccountNo = bank?.ibanBankAccountNo;
          this.selectIbanModeForm.get('bankName').setValue(bank.bankName);
          this.selectIbanModeForm.updateValueAndValidity();
          this.onIbanTypeChange.emit(false);
        }
      });
      this.onSelectIBAN.emit({
        bankAccountId: this.bankAccountId,
        newIban: this.newIban,
        ibanBankAccountNo: this.ibanBankAccountNo
      });
    } else {
      this.onIbanTypeChange.emit(true);
    }
  }

  getName() {
    const ibanValue = this.bankEditForm.get('ibanBankAccountNo').value;
    if (ibanValue !== '' && this.newIban && this.bankEditForm.get('ibanBankAccountNo').valid) {
      this.bankCode = parseInt(ibanValue.slice(4, 6), 10);
      const requestData = new PatchPersonBankDetails();
      requestData.bankCode = this.bankCode > 9 ? this.bankCode.toString() : '0' + this.bankCode;
      requestData.bankName = this.bankName;
      requestData.ibanBankAccountNo = ibanValue;
      requestData.isNewlyAdded = true;
      this.editEvent.emit({ newBankAccount: requestData, newIban: this.newIban });
    } else {
      this.bankName = null;
      this.onIbanTypeChange.emit(true);
    }
  }
  get banknameadd() {
    return this.bankEditForm.get('bankName').value;
  }

  get bankname() {
    return this.selectIbanModeForm.get('bankName').value;
  }
}
