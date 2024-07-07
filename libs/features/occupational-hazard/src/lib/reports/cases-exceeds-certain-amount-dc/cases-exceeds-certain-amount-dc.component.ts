import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LovList } from '@gosi-ui/core';

@Component({
  selector: 'oh-cases-exceeds-certain-amount-dc',
  templateUrl: './cases-exceeds-certain-amount-dc.component.html',
  styleUrls: ['./cases-exceeds-certain-amount-dc.component.scss']
})
export class CasesExceedsCertainAmountDcComponent implements OnInit {
  maxlengthData = 250;
  isClicked = false;

  @Input() showErrorMessage = false;
  @Input() showMandatoryMessage = false;
  @Input() isThirtyDays = false;
  @Input() casesExceedsDateForm = new FormControl();
  @Input() casesExceedsForm: FormGroup;
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

  generateCasesExceeds() {
    this.isClicked = true;
    this.onGenerate.emit();
  }

  showCancelTemplate() {}

  hideModal() {
    this.isClicked = false;
    this.hide.emit();
  }
}
