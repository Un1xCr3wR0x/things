import { EventEmitter } from '@angular/core';
import { Output, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LovList } from '@gosi-ui/core';

@Component({
  selector: 'oh-injuries-reported-during-certain-period-dc',
  templateUrl: './injuries-reported-during-certain-period-dc.component.html',
  styleUrls: ['./injuries-reported-during-certain-period-dc.component.scss']
})
export class InjuriesReportedDuringCertainPeriodDcComponent implements OnInit {
  maxlengthData = 250;
  isPeriodClicked = false;
  @Input() showErrorMessage = false;
  @Input() showMandatoryMessage = false;
  @Input() isThirtyDays = false;
  @Input() claimsDateForm = new FormControl();
  @Input() injuryPeriodForm: FormGroup;
  @Input() disabled = false;
  @Input() maxDate: Date;
  @Input() minDate;  
  @Input() languageList: LovList;
  @Input() pdfExcelList: LovList;

  @Output() closeModal: EventEmitter<null> = new EventEmitter();
  @Output() hide: EventEmitter<null> = new EventEmitter();
  @Output() showSelectRange: EventEmitter<null> = new EventEmitter();
  @Output() showSelectDateRange: EventEmitter<null> = new EventEmitter();
  @Output() onGenerateInjuryPeriod: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.isPeriodClicked = false;
    console.log(this.pdfExcelList.items[0].sequence === 0);

  }

  selectDateRange() {
    this.showSelectDateRange.emit();
  }

  selectRange() {
    this.showSelectRange.emit();
  }
  generateInjuryStatus() {
    this.isPeriodClicked = true;
    this.onGenerateInjuryPeriod.emit();
  }
  hideModal() {
    this.hide.emit();
  }
}
