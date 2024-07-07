import { Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LovList } from '@gosi-ui/core';

@Component({
  selector: 'oh-daily-allowances-certain-contributor-dc',
  templateUrl: './daily-allowances-certain-contributor-dc.component.html',
  styleUrls: ['./daily-allowances-certain-contributor-dc.component.scss']
})
export class DailyAllowancesCertainContributorDcComponent implements OnInit {
  maxlengthData = 250;
  isDailyClicked = false;

  @Input() showErrorMessage = false;
  @Input() showMandatoryMessage = false;
  @Input() dailyAllowancesForm: FormGroup;
  @Input() languageList: LovList;
  @Input() pdfExcelList: LovList;
  @Input() idTypeList: LovList;
  @Input() isSinSelected = false;
  @Input() type: string;

  // Output Variables

  @Output() hide: EventEmitter<null> = new EventEmitter();
  @Output() identitySelect: EventEmitter<string> = new EventEmitter();

  @Output() onGenerate: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.isDailyClicked = false;
    console.log(this.pdfExcelList.items[0].sequence === 0);

  }

  generateDailyAllowance() {
    this.isDailyClicked = true;
    this.onGenerate.emit();
  }

  hideModal() {
    this.isDailyClicked = false;
    this.hide.emit();
  }
  selectId(type: string) {
    this.identitySelect.emit(type);
  }
}
