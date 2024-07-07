import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BilingualText, LovList, convertToYYYYMMDD, Lov } from '@gosi-ui/core';
import { ContractAuthConstant } from '@gosi-ui/features/contributor/lib/shared';
import { EngagementFilter } from '@gosi-ui/features/contributor/lib/shared/models';
import { EmployerList } from '@gosi-ui/features/contributor/lib/shared/models/employer-list';
import { InputDaterangeDcComponent } from '@gosi-ui/foundation-theme/src';
import { Subject } from 'rxjs';

@Component({
  selector: 'cnt-engagement-filter-dc',
  templateUrl: './engagement-filter-dc.component.html',
  styleUrls: ['./engagement-filter-dc.component.scss']
})
export class EngagementFilterDcComponent implements OnInit, OnChanges {
  engagementDateForm = new FormControl();
  tempDate: Date;
  maxDate: Date;
  occupationListValues: BilingualText[] = [];
  employerListValues: BilingualText[] = [];
  engagementTypeList: BilingualText[] = [];
  engagementTypeFilterForm:FormGroup;
  selectedEngagementOptions: Array<BilingualText>;
  engagementStatusList: BilingualText[] = [];
  engagementStatusFilterForm:FormGroup;
  selectedEngagementStatus: Array<BilingualText>;
  employerLovList: LovList;
  persistFilters: boolean;
  engHistoryForm: FormGroup;
  filterValues: EngagementFilter = new EngagementFilter();
  resetClicked: Subject<void> = new Subject<void>();
  @ViewChild('dateRangePicker') dateRangePicker: InputDaterangeDcComponent;
  @Input() employerList?: EmployerList;
  @Input() occupationList: LovList;
  @Output() engagementFilterValues: EventEmitter<EngagementFilter> = new EventEmitter();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.engagementTypeList=ContractAuthConstant.getEngagementTypeList();
    this.engagementStatusList=ContractAuthConstant.getEngagementStatusList();
    this.maxDate = new Date();
    this.engHistoryForm = this.createForm();
    this.engagementTypeFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.engagementStatusFilterForm = this.fb.group({
      items: new FormArray([])
    });
    this.engagementTypeList?.forEach((value, i) => {
      let control = new FormControl();
      if (this.selectedEngagementOptions) {
        this.selectedEngagementOptions?.forEach(items => {
          if (items.english === value.english) {
            control = new FormControl(true);
          }
        });
      } else {
        control = new FormControl();
      }
      (this.engagementTypeFilterForm.controls.items as FormArray).push(control);
    });
    this.engagementStatusList?.forEach((value, i) => {
      let control = new FormControl();
      if (this.selectedEngagementStatus) {
        this.selectedEngagementStatus?.forEach(items => {
          if (items.english === value.english) {
            control = new FormControl(true);
          }
        });
      } else {
        control = new FormControl();
      }
      (this.engagementStatusFilterForm.controls.items as FormArray).push(control);
    }); 
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.employerList && changes.employerList.currentValue) {
      this.employerList = changes.employerList.currentValue;
      this.convertToLov(this.employerList);
    }
    if (changes && changes.occupationList && changes.occupationList.currentValue) {
      this.occupationList = changes.occupationList.currentValue;
      this.convertOccupationToLov(this.occupationList);
    }
  }
  setEngagementType(val){
    this.selectedEngagementOptions = val;
  }
  setEngagementStatus(val){
    this.selectedEngagementStatus = val;
  }
  createForm() {
    return this.fb.group({
      name: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      occupation: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  convertToLov(employerList: EmployerList) {
    const items: Lov[] = [];
    employerList.items.forEach((element, i) => {
      const lookUpValue = new Lov();
      lookUpValue.code = element.code;
      lookUpValue.value = element.value;
      lookUpValue.sequence = i;
      items.push(lookUpValue);
    });
    this.employerLovList = new LovList(items);
  }
  convertOccupationToLov(occupationList: LovList) {
    const items: Lov[] = [];
    occupationList.items.forEach((element, i) => {
      const lookUpValue = new Lov();
      lookUpValue.code = element.code;
      lookUpValue.value = element.value;
      lookUpValue.sequence = i;
      items.push(lookUpValue);
    });
    this.occupationList = new LovList(items);
  }
  applyFilter() {
    this.persistFilters = true;
    if (this.occupationListValues.length > 0) {
      this.filterValues.occupation = this.engHistoryForm.get('occupation').value.english;
    } else {
      this.filterValues.occupation = null;
    }
    if (this.engagementDateForm.value) {
      this.filterValues.startDate = convertToYYYYMMDD(this.engagementDateForm?.value[0]);
      this.filterValues.endDate = convertToYYYYMMDD(this.engagementDateForm?.value[1]);
      this.tempDate = new Date(this.engagementDateForm?.value[1]);
      this.tempDate = new Date(this.tempDate.getFullYear(), this.tempDate.getMonth() + 1, 0);
      this.filterValues.endDate = convertToYYYYMMDD(this.tempDate.toDateString());
    } else {
      this.filterValues.startDate = null;
      this.filterValues.endDate = null;
    }
    if (this.employerListValues.length > 0) {
      this.filterValues.employer = this.engHistoryForm.get('name').value.english;
    } else {
      this.filterValues.employer = null;
    }
    if (this.selectedEngagementOptions && this.selectedEngagementOptions.length > 0) {
      const selectListForEngagementType = new Array<BilingualText>();
      this.selectedEngagementOptions.forEach((item, i) => {
        switch (item.english) {
          case 'VIC':
            selectListForEngagementType.push(item);
            break;
          case 'Regular':
            selectListForEngagementType.push(item);
            break;
        }
      });
      this.filterValues.engagementType = selectListForEngagementType;
    } else {
      this.filterValues.engagementType = null;
    }
    if (this.selectedEngagementStatus && this.selectedEngagementStatus.length > 0) {
      const selectListForEngagementStatus = new Array<BilingualText>();
      this.selectedEngagementStatus.forEach((item, i) => {
        switch (item.english) {
          case 'Active':
            selectListForEngagementStatus.push(item);
            break;
          case 'Inactive':
            selectListForEngagementStatus.push(item);
            break;
          case 'Cancelled':
            selectListForEngagementStatus.push(item);
            break;
        } 
      });
      this.filterValues.engagementStatus = selectListForEngagementStatus;
    } else {
      this.filterValues.engagementStatus= null;
    }
    this.engagementFilterValues.emit(this.filterValues);
  }
  clearAllFiters() {
    this.engagementDateForm.reset();
    this.engHistoryForm.reset();
    this.engagementStatusFilterForm.reset();
    this.engagementTypeFilterForm.reset();
    this.filterValues.startDate = null;
    this.filterValues.endDate = null;
    this.filterValues.employer = null;
    this.filterValues.occupation = null;
    this.engagementFilterValues.emit(null);
    this.occupationListValues = [];
    this.employerListValues = [];
    this.resetClicked.next();
  }
  clearOccupationFiter() {
    this.engHistoryForm.controls['occupation'].reset();
    this.filterValues.occupation = null;
    this.occupationListValues = [];
  }
  clearEmployerFiter() {
    this.engHistoryForm.controls['name'].reset();
    this.filterValues.employer = null;
    this.employerListValues = [];
  }
  clearDateRangeFiter() {
    this.engagementDateForm.reset();
    this.filterValues.startDate = null;
    this.filterValues.endDate = null;
  }
  onScroll() {
    if (this.dateRangePicker.dateRangePicker.isOpen) this.dateRangePicker.dateRangePicker.hide();
  }
  selectedValue(evt) {
    this.occupationListValues = evt;
  }
}
