import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import { LovList } from '@gosi-ui/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MofItemizedContributionFilter } from '../../../../shared/models/mof-itemized-contribution-filter';

@Component({
  selector: 'blg-mof-itemized-contribution-filter-dc',
  templateUrl: './mof-itemized-contribution-filter-dc.component.html',
  styleUrls: ['./mof-itemized-contribution-filter-dc.component.scss']
})
export class MofItemizedContributionFilterDcComponent implements OnInit, OnChanges {
  // Local Variables
  annuityAmountForm: FormGroup;
  ohAmountForm: FormGroup;
  uiAmountForm: FormGroup;
  totalAmountForm: FormGroup;
  adjustmentIndicatorForm: FormGroup;
  mofContributionFilterParams: MofItemizedContributionFilter = new MofItemizedContributionFilter();
  //  Output Variables
  @Output() mofContributionFilterValues: EventEmitter<MofItemizedContributionFilter> = new EventEmitter();

  //  Input Variables
  @Input() yesOrNoList: LovList;
  constructor(private fb: FormBuilder) {}

  // This method is used to initialize data on loading
  ngOnInit(): void {
    this.annuityAmountForm = this.fb.group({
      annuity: new FormControl([0, 100000])
    });
    this.ohAmountForm = this.fb.group({
      oh: new FormControl([0, 100000])
    });

    this.uiAmountForm = this.fb.group({
      ui: new FormControl([0, 100000])
    });
    this.totalAmountForm = this.fb.group({
      total: new FormControl([0, 100000])
    });
    this.adjustmentIndicatorForm = this.createForm();
  }
  // This method is used to get data on input change
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.yesOrNoList?.currentValue) {
      this.yesOrNoList = changes.yesOrNoList.currentValue;
    }
  }
  /** Method to create establishment list form. */
  createForm() {
    return this.fb.group({
      name: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }

  // This method is used to apply the filter values
  applyFilter() {
    if (this.annuityAmountForm.get('annuity').value) {
      this.mofContributionFilterParams.minAnnuityAmount = this.annuityAmountForm.get('annuity').value[0];
      this.mofContributionFilterParams.maxAnnuityAmount = this.annuityAmountForm.get('annuity').value[1];
    } else {
      this.mofContributionFilterParams.maxAnnuityAmount = undefined;
      this.mofContributionFilterParams.minAnnuityAmount = undefined;
    }
    if (this.ohAmountForm.get('oh').value) {
      this.mofContributionFilterParams.minOhAmount = this.ohAmountForm.get('oh').value[0];
      this.mofContributionFilterParams.maxOhAmount = this.ohAmountForm.get('oh').value[1];
    } else {
      this.mofContributionFilterParams.minOhAmount = undefined;
      this.mofContributionFilterParams.maxOhAmount = undefined;
    }
    if (this.uiAmountForm.get('ui').value) {
      this.mofContributionFilterParams.minUiAmount = this.uiAmountForm.get('ui').value[0];
      this.mofContributionFilterParams.maxUiAmount = this.uiAmountForm.get('ui').value[1];
    } else {
      this.mofContributionFilterParams.minUiAmount = undefined;
      this.mofContributionFilterParams.maxUiAmount = undefined;
    }
    if (this.totalAmountForm.get('total').value) {
      this.mofContributionFilterParams.minTotalAmount = this.totalAmountForm.get('total').value[0];
      this.mofContributionFilterParams.maxTotalAmount = this.totalAmountForm.get('total').value[1];
    } else {
      this.mofContributionFilterParams.minTotalAmount = undefined;
      this.mofContributionFilterParams.maxTotalAmount = undefined;
    }
    if (this.adjustmentIndicatorForm.get('name').value) {
      this.mofContributionFilterParams.adjustmentIndicator = this.adjustmentIndicatorForm.get('name').value.english;
    } else {
      this.mofContributionFilterParams.adjustmentIndicator = null;
    }

    this.mofContributionFilterValues.emit(this.mofContributionFilterParams);
  }

  // This method is used to reset filter values on applying reset
  clearAllFilters() {
    this.annuityAmountForm.reset();
    this.ohAmountForm.reset();
    this.uiAmountForm.reset();
    this.totalAmountForm.reset();
    this.adjustmentIndicatorForm.get('name').reset();
    this.mofContributionFilterParams.maxAnnuityAmount = undefined;
    this.mofContributionFilterParams.minAnnuityAmount = undefined;
    this.annuityAmountForm = this.fb.group({
      annuity: new FormControl([0, 100000])
    });

    this.mofContributionFilterParams.maxOhAmount = undefined;
    this.mofContributionFilterParams.minOhAmount = undefined;
    this.ohAmountForm = this.fb.group({
      oh: new FormControl([0, 100000])
    });

    this.mofContributionFilterParams.minUiAmount = undefined;
    this.mofContributionFilterParams.maxUiAmount = undefined;
    this.uiAmountForm = this.fb.group({
      ui: new FormControl([0, 100000])
    });

    this.mofContributionFilterParams.minTotalAmount = undefined;
    this.mofContributionFilterParams.maxTotalAmount = undefined;
    this.totalAmountForm = this.fb.group({
      total: new FormControl([0, 100000])
    });
    this.adjustmentIndicatorForm.get('name').reset();
    this.mofContributionFilterParams.adjustmentIndicator = undefined;
    this.mofContributionFilterValues.emit(this.mofContributionFilterParams);
  }
}
