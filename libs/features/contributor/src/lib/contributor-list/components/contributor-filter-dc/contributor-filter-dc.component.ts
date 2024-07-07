import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BilingualText, FilterKeyValue, LovList, OccupationList } from '@gosi-ui/core/lib/models';
import { ContractAuthConstant } from '../../../shared/constants';
import { Observable } from 'rxjs';
import { FilterKeyEnum } from '@gosi-ui/core/lib/enums';
import { convertToYYYYMMDD } from '@gosi-ui/core/lib/utils';
import { ContributorDetailsFilter } from '../../../shared/models/contributor-details-filter';
import { LookupService } from '@gosi-ui/core';


@Component({
  selector: 'cnt-contributor-filter-dc',
  templateUrl: './contributor-filter-dc.component.html',
  styleUrls: ['./contributor-filter-dc.component.scss']
})
export class ContributorFilterDcComponent implements OnInit , OnChanges {
  hasFilter: Boolean = false;
  maximumDate: Date;
  genderStatusList: BilingualText[] = [];
  selectedGender:string;
  floorWage=0;
  ceilWage=100000;
  filterRequest : ContributorDetailsFilter =new ContributorDetailsFilter();
  genderList: LovList;


  // input variables
  @Input() occupationList : Observable<OccupationList>;
  @Input() nationalityList : Observable<LovList> = new Observable<LovList>(null);
  @Input() resetFilterForm : boolean;
  @Input() contributorFilterForm : FormGroup;
  @Input() joiningDateFormControl : FormControl;
  @Input() leavingDateFormControl : FormControl;
  @Input() wageSlider : FormControl;
  @Input() selectedOccupationOptions : BilingualText[] = [];
  @Input() selectedNationalityOptions : BilingualText[] = [];


  // Output Variables
  @Output() apply: EventEmitter<Array<FilterKeyValue>> = new EventEmitter();
  @Output() filterData: EventEmitter<ContributorDetailsFilter> = new EventEmitter();
  @Output() resetFilter: EventEmitter<ContributorDetailsFilter> = new EventEmitter();
  @Output() changeReset: EventEmitter<ContributorDetailsFilter> = new EventEmitter();

  constructor(private fb: FormBuilder,
    readonly lookupService:LookupService) { }

  ngOnInit(): void {
    this.lookupService.getGenderList().subscribe(res => (this.genderList = res));
    this.maximumDate=new Date();
    this.genderStatusList=ContractAuthConstant.getGenderList();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if ( changes && changes?.resetFilterForm && changes?.resetFilterForm?.currentValue){
      this.clearFilterFields();
      this.changeReset.emit() ;
    }
  }
  applyFilter(){
    const appliedFilters: Array<FilterKeyValue> = [];
    if (this.joiningDateFormControl.value) {
      this.filterRequest.joiningDate.fromDate = convertToYYYYMMDD(this.joiningDateFormControl.value[0]);
      this.filterRequest.joiningDate.toDate = convertToYYYYMMDD(this.joiningDateFormControl.value[1]);
      appliedFilters.push({
        key: FilterKeyEnum.JOINING_DATE,
        values: [ convertToYYYYMMDD(this.joiningDateFormControl.value[0]),convertToYYYYMMDD(this.joiningDateFormControl.value[1])]
      });
    } else {
      this.filterRequest.joiningDate.fromDate = undefined;
      this.filterRequest.joiningDate.toDate = undefined;
    }
    if (this.leavingDateFormControl.value) {
      this.filterRequest.leavingDate.fromDate = convertToYYYYMMDD(this.leavingDateFormControl.value[0]);
      this.filterRequest.leavingDate.toDate = convertToYYYYMMDD(this.leavingDateFormControl.value[1]);
      appliedFilters.push({
        key: FilterKeyEnum.LEAVING_DATE,
        values: [ convertToYYYYMMDD(this.leavingDateFormControl.value[0]),convertToYYYYMMDD(this.leavingDateFormControl.value[1])]
      });
    } else {
      this.filterRequest.leavingDate.fromDate = undefined;
      this.filterRequest.leavingDate.toDate = undefined;
    }
    if (this.contributorFilterForm.get('gender').value.english !== null && this.selectedGender !== undefined && this.selectedGender !== null) {
      this.filterRequest.gender = this.selectedGender;
      appliedFilters.push({
        key: FilterKeyEnum.GENDER,
        values: [this.selectedGender]
      });
    } else {
      this.filterRequest.gender = null;
    }
    if (this.selectedNationalityOptions && this.selectedNationalityOptions.length > 0) {
      this.filterRequest.nationalityList = this.selectedNationalityOptions;
      appliedFilters.push({ key: FilterKeyEnum.NATIONALITY, bilingualValues: this.selectedNationalityOptions });
    } else {
      this.filterRequest.nationalityList = null;
    }
    if (this.selectedOccupationOptions && this.selectedOccupationOptions.length > 0) {
      this.filterRequest.occupationList = this.selectedOccupationOptions;
      appliedFilters.push({ key: FilterKeyEnum.OCCUPATION, bilingualValues: this.selectedOccupationOptions });
    } else {
      this.filterRequest.occupationList = null;
    }
    if(
      this.wageSlider.value[0] !== this.floorWage ||
      this.wageSlider.value[1] !== this.ceilWage
    ){
      this.filterRequest.wageRangeStart = this.wageSlider.value[0];
      this.filterRequest.wageRangeEnd = this.wageSlider.value[1];
      appliedFilters.push({
        key: FilterKeyEnum.TOTAL_WAGE_RANGE,
        values: [this.filterRequest.wageRangeStart.toString(),this.filterRequest.wageRangeEnd.toString()]
      });
    } else {
      this.filterRequest.wageRangeStart = this.floorWage;
      this.filterRequest.wageRangeEnd = this.ceilWage;
    }
    this.apply.emit(appliedFilters);
    this.filterData.emit(this.filterRequest)
  }
  clearAllFiters(){}
  setLeavingDate(){
      }
  setGenderType(val){
    if(val !== null){
      this.selectedGender = val;
    }
  }
  setNationalityType(val){
    if(val && val.length >= 0){
      this.selectedNationalityOptions=val;
    }
  }
  setOccupation(val){
    if(val && val.length >= 0){
      this.selectedOccupationOptions=val;
    }
  }
  clearOccupationFiter() {
    this.contributorFilterForm.controls['occupation'].reset();
    this.filterRequest.occupationList = null;
    this.selectedOccupationOptions = [];
  }
  clearNationalityFiter(){
    this.contributorFilterForm.controls['nationality'].reset();
    this.filterRequest.nationalityList = null;
    this.selectedNationalityOptions = [];
  }
   /**
   * Method to Clear Filter Forms
   */
   clearFilterForm() {
    this.clearFilterFields();
    this.resetFilter.emit()
    this.applyFilter();
  }
  clearFilterFields(){
    this.filterRequest=new ContributorDetailsFilter();
    this.clearOccupationFiter();
    this.clearNationalityFiter();
    this.wageSlider.value[0]=this.floorWage;
    this.wageSlider.value[1]=this.ceilWage;
    this.selectedGender = null;
  }
}
