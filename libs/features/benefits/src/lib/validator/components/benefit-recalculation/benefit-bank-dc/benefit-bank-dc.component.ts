import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BilingualText, iBanValidator, lengthValidator, Lov, LovList } from '@gosi-ui/core';
import { RecalculationBankDetails } from '../../../../shared';

@Component({
  selector: 'bnt-benefit-bank-dc',
  templateUrl: './benefit-bank-dc.component.html',
  styleUrls: ['./benefit-bank-dc.component.scss']
})
export class BenefitBankDcComponent implements OnInit {
  @Input() bankNameList: Lov;
  @Output() onIbanChanged = new EventEmitter();
  bankAccountList: RecalculationBankDetails[] = [];
  bankEditForm: FormGroup;
  bankName: BilingualText = new BilingualText();
  bankType: string;
  existingIbanList: Lov[] = [];
  existingIbanLovList: LovList;

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.bankType = 'selectIban';
    this.bankEditForm = this.fb.group({
      ibanBankAccountNo: [
        '',
        {
          validators: Validators.compose([Validators.required, iBanValidator, lengthValidator(24)])
        }
      ],
      selectIban: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
    if (this.bankAccountList.filter(list => list.isSamaVerified).length > 0) {
      this.generateIbanLovList(this.bankAccountList.filter(list => list.isSamaVerified));
    }
  }
  /** Method to get bank name */
  getName() {
    this.onIbanChanged.emit(this.bankEditForm.get('ibanBankAccountNo'));
  }
  ibanSelected(event) {}
  /** Method to generate lov list for the saved IBAN values */
  generateIbanLovList(bankAccountList: RecalculationBankDetails[]) {
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
}
