import { EventEmitter } from '@angular/core';
import { Output, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LovList } from '@gosi-ui/core';

@Component({
  selector: 'oh-claim-amount-vat-recovered-dc',
  templateUrl: './claim-amount-vat-recovered-dc.component.html',
  styleUrls: ['./claim-amount-vat-recovered-dc.component.scss']
})
export class ClaimAmountVATRecoveredDcComponent implements OnInit {
  maxlengthData = 250;
  isClicked = false;

  @Input() showErrorMessage = false;
  @Input() showMandatoryMessage = false;
  @Input() isThirtyDays = false;
  @Input() claimsDateForm = new FormControl();
  @Input() recoveryForm: FormGroup;
  @Input() disabled = false;
  @Input() maxDate: Date;
  @Input() minDate;
  @Input() languageList: LovList;
  @Input() pdfExcelList: LovList;
  @Input() recoveredList: LovList;

  @Output() closeModal: EventEmitter<null> = new EventEmitter();
  @Output() hide: EventEmitter<null> = new EventEmitter();
  @Output() showSelectRange: EventEmitter<null> = new EventEmitter();
  @Output() showSelectDateRange: EventEmitter<null> = new EventEmitter();
  @Output() onGenerateRecovery: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.isClicked = false;
    console.log(this.pdfExcelList.items[0].sequence === 0);

  }
  selectDateRange() {
    this.showSelectDateRange.emit();
  }

  selectRange() {
    this.showSelectRange.emit();
  }
  generateRecoveryForm() {
    this.isClicked = true;
    this.onGenerateRecovery.emit();
  }
  hideModal() {
    this.isClicked = false;
    this.hide.emit();
  }
}
