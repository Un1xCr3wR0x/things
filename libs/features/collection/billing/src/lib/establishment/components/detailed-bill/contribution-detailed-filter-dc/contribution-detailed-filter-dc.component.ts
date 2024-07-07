import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { RequestList } from '../../../../shared/models/request-list';
import { BilingualText } from '@gosi-ui/core/lib/models/bilingual-text';
import { LovList } from '@gosi-ui/core';

@Component({
  selector: 'blg-contribution-detailed-filter-dc',
  templateUrl: './contribution-detailed-filter-dc.component.html',
  styleUrls: ['./contribution-detailed-filter-dc.component.scss']
})
export class ContributionDetailedFilterDcComponent implements OnInit {
  /**
   * Component local variables
   */
  ContribtuionFilterForm: FormGroup;
  filterParams: RequestList = new RequestList();
  contributoryWageMin = 0;
  contributoryWageMax = 45000;
  contributorunitMin = 1;
  contributorunitMax = 31;
  totalAmountMin = 0;
  totalAmountMax = 10000;
  contributoryWage = new FormControl([this.contributoryWageMin, this.contributoryWageMax]);
  totalAmount = new FormControl([this.totalAmountMin, this.totalAmountMax]);
  contribtuionUnit = new FormControl([this.contributorunitMin, this.contributorunitMax]);

  constructor(private fb: FormBuilder) {}
  /**
   * Input Variable
   */
  @Input() currencyType: BilingualText;
  @Input() nationality: LovList;
  /**
   * Output Variable
   */
  @Output() filtervalues: EventEmitter<RequestList> = new EventEmitter();
  /**
   * Method to initialise ContributionDetailedFilterDcComponent
   */
  ngOnInit(): void {
    this.ContribtuionFilterForm = this.fb.group({
      // contributoryWage: new FormControl([2000, 7860]),
      // totalAmount: new FormControl([2000, 7860]),
      // contribtuionUnit: new FormControl([5, 26]),
      saudiPerson: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  /**
   * Method to get filter details
   *
   */
  applyFilter() {
    if (
      this.contributoryWage.value[0] !== this.contributoryWageMin ||
      this.contributoryWage.value[1] !== this.contributoryWageMax
    ) {
      this.filterParams.maxContributoryWage = this.contributoryWage.value[1];
      this.filterParams.minContributoryWage = this.contributoryWage.value[0];
    } else {
      this.filterParams.maxContributoryWage = this.contributoryWageMax;
      this.filterParams.minContributoryWage = this.contributoryWageMin;
    }
    if (this.totalAmount.value[0] !== this.totalAmountMin || this.totalAmount.value[1] !== this.totalAmountMax) {
      this.filterParams.maxTotal = this.totalAmount.value[1];
      this.filterParams.minTotal = this.totalAmount.value[0];
    } else {
      this.filterParams.maxTotal = this.totalAmountMax;
      this.filterParams.minTotal = this.totalAmountMin;
    }
    if (
      this.contribtuionUnit.value[0] !== this.contributorunitMin ||
      this.contribtuionUnit.value[1] !== this.contributorunitMax
    ) {
      this.filterParams.maxContributionUnit = this.contribtuionUnit.value[1];
      this.filterParams.minContributionUnit = this.contribtuionUnit.value[0];
    } else {
      this.filterParams.maxContributionUnit = this.contributorunitMax;
      this.filterParams.minContributionUnit = this.contributorunitMin;
    }
    if (this.ContribtuionFilterForm.get('saudiPerson').value) {
      if (this.ContribtuionFilterForm.get('saudiPerson').get('english').value === 'Saudi') {
        this.filterParams.saudiPerson = true;
      } else if (this.ContribtuionFilterForm.get('saudiPerson').get('english').value === 'Non Saudi') {
        this.filterParams.saudiPerson = false;
      }
    } else {
      this.filterParams.saudiPerson = undefined;
    }
    this.filtervalues.emit(this.filterParams);
  }

  // method toclear all  filter branch details
  clearAllFiters() {
    this.ContribtuionFilterForm.reset();
    this.contributoryWage = new FormControl([this.contributoryWageMin, this.contributoryWageMax]);
    this.totalAmount = new FormControl([this.totalAmountMin, this.totalAmountMax]);
    this.contribtuionUnit = new FormControl([this.contributorunitMin, this.contributorunitMax]);
    this.filterParams.maxContributoryWage = undefined;
    this.filterParams.minContributionUnit = undefined;
    this.filterParams.minContributoryWage = undefined;
    this.filterParams.minTotal = undefined;
    this.filterParams.maxContributionUnit = undefined;
    this.filterParams.maxTotal = undefined;
    this.filterParams.saudiPerson = undefined;
    this.filtervalues.emit(this.filterParams);
  }
}
