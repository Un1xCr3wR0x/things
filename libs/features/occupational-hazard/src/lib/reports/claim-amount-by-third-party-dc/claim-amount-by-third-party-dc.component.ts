import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LovList } from '@gosi-ui/core';

@Component({
  selector: 'oh-claim-amount-by-third-party-dc',
  templateUrl: './claim-amount-by-third-party-dc.component.html',
  styleUrls: ['./claim-amount-by-third-party-dc.component.scss']
})
export class ClaimAmountByThirdPartyDcComponent implements OnInit {
  maxlengthData = 250;
  isClicked = false;

  @Input() showErrorMessage = false;
  @Input() showMandatoryMessage = false;
  @Input() isThirtyDays = false;
  @Input() claimsDateForm = new FormControl();
  @Input() claimsForm: FormGroup;
  @Input() disabled = false;
  @Input() maxDate: Date;
  @Input() minDate;
  @Input() languageList: LovList;
  @Input() pdfExcelList: LovList;

  // Output Variables
  @Output() closeModal: EventEmitter<null> = new EventEmitter();
  @Output() hide: EventEmitter<null> = new EventEmitter();
  @Output() showSelectRange: EventEmitter<null> = new EventEmitter();
  @Output() showSelectDateRange: EventEmitter<null> = new EventEmitter();
  @Output() onGenerate: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.isClicked = false;
    console.log(this.pdfExcelList.items[0].sequence === 0);

  }
  selectRange() {
    this.showSelectRange.emit();
  }
  selectDateRange() {
    this.showSelectDateRange.emit();
  }

  generateClaimsAmount() {
    this.isClicked = true;
    this.onGenerate.emit();
  }

  showCancelTemplate() {}

  hideModal() {
    this.isClicked = false;
    this.hide.emit();
  }
}
