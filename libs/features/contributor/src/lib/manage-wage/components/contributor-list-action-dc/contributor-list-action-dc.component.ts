/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DropdownValues,
  KeyValue,
  LovList,
  OccupationList,
  greaterThanLessThanValidator,
  startOfDay
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { distinctUntilChanged } from 'rxjs/operators';
import { ContributorFilter, ContributorWageDetailsResponse } from '../../../shared/models';
import { FilterDcComponent } from '@gosi-ui/foundation-theme/lib/components/widgets';

enum valueConstant {
  Filter = 'filter',
  Sort = 'sort',
  SortDirection = 'sortDirection',
  Search = 'search'
}

@Component({
  selector: 'cnt-contributor-list-action-dc',
  templateUrl: './contributor-list-action-dc.component.html',
  styleUrls: ['./contributor-list-action-dc.component.scss']
})
export class ContributorListActionDcComponent implements OnInit {
  /** Local variables */
  searchContributorFormControl: FormControl;
  sortContributorFormControl: FormControl = new FormControl();
  filterForm: FormGroup;
  modalRef: BsModalRef;
  checkedOption: string;
  hasAppliedFilter = false;
  selectedNationalityList: DropdownValues[] = [];
  tempFormValue: Object;
  searchValue: string | number;
  sortByValue: string = null;
  filterValue: ContributorFilter;
  valueChange: valueConstant;
  minWage: number = 0;
  maxWage: number = 1000000;
  maxWageLimit: number = 1000000;
  selectedOccupationList: DropdownValues[] = [];
  maximumDate: Date;
  validationChanged: boolean;

  /** Input variable */
  @Input() contributorWageDetailsResponse: ContributorWageDetailsResponse;
  @Input() isRouteCustom = false;
  @Input() nationalityList: LovList;
  @Input() occupationList: Observable<OccupationList>;
  @Input() parentForm: FormGroup;
  @Input() isDescending: boolean;
  @Input() sortParameters: KeyValue[];
  @Input() clearDropdown: boolean;

  /** Output variables */
  @Output() getContributorWageDetails = new EventEmitter(null);
  @Output() stayOnPage = new EventEmitter(null);
  @Output() revertChanges = new EventEmitter(null);
  @Output() isDescendingChange = new EventEmitter();
  @Output() selectedOption = new EventEmitter();
  @Output() clearFilterAlert = new EventEmitter(null);

  /** Child references. */
  @ViewChild('navigateWithChangesTemplate', { static: true })
  navigateWithChangesTemplate: TemplateRef<HTMLElement>;
  @ViewChild('navigateWithErrorTemplate', { static: true })
  navigateWithErrorTemplate: TemplateRef<HTMLElement>;
  @ViewChild('filter') filterComponent: FilterDcComponent;

  /** Creates an instance of BulkActionSectionDcComponent. */
  constructor(private fb: FormBuilder, private modalService: BsModalService) {}

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.createForms();
    this.detectFormChanges();
    this.maximumDate = new Date();
  }

  /**Method to create essential form for page */
  createForms(): void {
    this.filterForm = this.createFilterForm();
    this.searchContributorFormControl = new FormControl(null, {
      validators: Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(60),
        Validators.pattern('[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF a-z A-Z 0-9]+') //NO special characters
      ])
    });
    this.parentForm.addControl('sortContributorFormControl', this.sortContributorFormControl);
    this.parentForm.addControl('searchContributorFormControl', this.searchContributorFormControl);
  }

  /** Method to create filter form. */
  createFilterForm() {
    return this.fb.group({
      engDateRangePicker: [],
      dateRangePicker: [],
      wage: this.fb.group({
        wageRangePicker: this.fb.control([0, 1000000]),
        minWage: [
          0,
          { validators: Validators.compose([greaterThanLessThanValidator(0, this.maxWageLimit), Validators.required]) }
        ],
        maxWage: [
          this.maxWageLimit,
          { validators: Validators.compose([greaterThanLessThanValidator(0, this.maxWageLimit), Validators.required]) }
        ]
      }),
      nationality: this.fb.group({
        english: [],
        arabic: []
      }),
      occupation: this.fb.group({
        english: [],
        arabic: []
      })
    });
  }

  /** This method is to detect form value changes. */
  detectFormChanges(): void {
    //If data in search input is cleared fetch all contributors
    this.searchContributorFormControl.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      if (value === null || value === '') {
        this.sortContributorFormControl.reset();
        this.sortByValue = null;
        this.isDescending = false;
        this.assembleOperationParams();
      }
    });
    // ma wage value change detection
    // this.filterForm.get('wage.maxWage').valueChanges.subscribe(value => {
    //    this.maxWage = parseInt(value, 10); this.updateMaxWageValidation();
    //   });
  }
  // updateMaxWageValidation() {
  //    const maxWageControl = this.filterForm.get('wage.maxWage');
  //    if (this.minWage != null) {
  //      maxWageControl.setValidators([greaterThanLessThanValidator(this.minWage, 1000000)]);
  //      maxWageControl.updateValueAndValidity();
  //     }
  //   }

  /** Method to check wage form validity */
  checkWageFormValidity(value: valueConstant): boolean {
    const formArray = this.parentForm.controls.wageForms as FormArray;
    let isFormDirty = false;
    let isFormValid = false;
    this.valueChange = value;
    if (formArray) {
      formArray.controls.forEach((form: FormGroup) => {
        if (form.dirty) isFormDirty = true;
        if (formArray.status === 'VALID') isFormValid = true;
      });
    }
    if (!isFormValid && isFormDirty) this.showTemplate(this.navigateWithErrorTemplate);
    else if (isFormDirty && isFormValid) this.showTemplate(this.navigateWithChangesTemplate);
    else return true;
    return false;
  }

  /** Method to check search form is valid or not. */
  checkSearchForm() {
    return this.searchContributorFormControl.valid && this.searchContributorFormControl.value;
  }

  /** This method is to valid search contributor using entered details in search box. */
  onSearchContributor(): void {
    if (this.isRouteCustom ? true : this.checkWageFormValidity(valueConstant.Search)) this.handleSearchContributor();
  }

  /** This method is to valid search contributor using entered details in search box. */
  handleSearchContributor(): void {
    if (this.checkSearchForm()) {
      this.assembleOperationParams();
    }
  }

  /** Method to get search value. */
  getSearchValue() {
    return this.searchContributorFormControl.value;
  }

  /** Method to handle multi selection. */
  handleMultiSelection(selectedList: DropdownValues[]) {
    this.selectedNationalityList = selectedList;
  }
  /** Method to handle multi selection of occupation. */
  handleMultiOccupation(selectedOccupation: DropdownValues[]) {
    this.selectedOccupationList = selectedOccupation;
  }

  /** Method to check filter form is valid or not. */
  checkFilterForm() {
    return this.hasAppliedFilter && this.filterForm.valid;
  }

  /** Method to fetch contributor on filter */
  onFilterContributor(): void {
    if (this.isRouteCustom ? true : this.checkWageFormValidity(valueConstant.Filter)) this.handleFilterContributors();
    if (!this.hasAppliedFilter) {
      this.filterComponent.isOpen = true;
      this.clearFilterAlert.emit();
    }
  }

  /** Method to fetch contributor on filter */
  handleFilterContributors(): void {
    this.hasAppliedFilter = true;
    if (this.checkFilterForm()) {
      this.assembleOperationParams();
    } else this.hasAppliedFilter = false;
  }

  /** Method to get filter params. */
  getFilterParams(): ContributorFilter {
    const formValue = this.filterForm.value;
    const filterRequest: ContributorFilter = new ContributorFilter();
    if (formValue.wage.wageRangePicker?.length === 2) {
      filterRequest.maxWage = formValue.wage.wageRangePicker[1];
      filterRequest.minWage = formValue.wage.wageRangePicker[0];
    }
    if (formValue.dateRangePicker?.length === 2) {
      filterRequest.maxDate = moment(startOfDay(formValue.dateRangePicker[1])).format('YYYY-MM-DD');
      filterRequest.minDate = moment(startOfDay(formValue.dateRangePicker[0])).format('YYYY-MM-DD');
    }
    if (formValue.engDateRangePicker?.length === 2) {
      filterRequest.engMinStartDate = moment(startOfDay(formValue.engDateRangePicker[0])).format('YYYY-MM-DD');
      filterRequest.engMaxStartDate = moment(startOfDay(formValue.engDateRangePicker[1])).format('YYYY-MM-DD');
    }
    if (this.selectedNationalityList.length > 0) {
      const nationalityList: string[] = [];
      this.selectedNationalityList.forEach(value => nationalityList.push(value.english));
      filterRequest.nationalityList = nationalityList;
    }
    if (this.selectedOccupationList.length > 0) {
      const occupationList: string[] = [];
      this.selectedOccupationList.forEach(value => occupationList.push(value.english));
      filterRequest.occupationList = occupationList;
    }
    return filterRequest;
  }

  /** Method to handle filter request. */
  handleFilterReset(): void {
    this.filterForm.reset(this.createFilterForm());
    this.hasAppliedFilter = false;
    this.selectedNationalityList = [];
    this.selectedOccupationList = [];
    this.filterForm?.get('wage')?.get('wageRangePicker').setValue([0, this.maxWageLimit]);
    this.filterForm.get('wage').get('minWage').setValue(0);
    this.filterForm.get('wage').get('maxWage').setValue(this.maxWageLimit);
    if (this.filterForm.valid) {
      this.assembleOperationParams();
    }
    this.tempFormValue = null;
  }

  /**Method to handle cancel filter action */
  cancelFilter(): void {
    this.filterForm.reset(this.tempFormValue);
  }

  /** Method to check sort form is valid or not. */
  checkSortForm() {
    return this.sortContributorFormControl.value;
  }

  onSortContributor(): void {
    if (this.isRouteCustom ? true : this.checkWageFormValidity(valueConstant.Sort)) this.handleSortContributor();
  }

  /** This method is to sort contributors based on various parameters. */
  handleSortContributor(): void {
    if (this.checkSortForm()) {
      this.isDescending = false;
      this.isDescendingChange.emit(this.isDescending);
      this.assembleOperationParams();
    }
  }

  /** Method to get sort by. */
  getSortBy() {
    return this.sortContributorFormControl.value;
  }

  /** This method is to changes sortBy direction. */
  onSortDirectionChange(): void {
    const sortBy = this.getSortBy();
    if (sortBy && sortBy !== 'null')
      if (this.isRouteCustom ? true : this.checkWageFormValidity(valueConstant.SortDirection))
        this.handleSortDirectionChange();
  }

  /** This method is to changes sortBy direction. */
  handleSortDirectionChange(): void {
    if (this.checkSortForm()) {
      this.isDescending = !this.isDescending;
      this.isDescendingChange.emit(this.isDescending);
      this.assembleOperationParams();
    }
  }

  /** Method to assemble operation params. */
  assembleOperationParams() {
    const operationParams = {};
    if (this.checkSearchForm()) this.searchValue = operationParams['search'] = this.getSearchValue();
    if (this.checkSortForm()) this.sortByValue = operationParams['sortBy'] = this.getSortBy();
    if (this.checkFilterForm())
      (operationParams['filter'] = this.getFilterParams()), (this.tempFormValue = this.filterForm.value);
    this.getContributorWageDetails.emit(operationParams);
  }

  /** This method is used to show given template. */
  showTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: 'modal-dialog-centered' };
    this.modalRef = this.modalService.show(template, config);
  }

  /** Method to hide popup */
  decline(): void {
    this.modalRef.hide();
  }

  /**Method to keep changes */
  stay(): void {
    this.decline();
    this.resetFormValues();
    this.stayOnPage.emit();
  }
  /**Method to reset form values */
  resetFormValues(): void {
    this.searchContributorFormControl.setValue(this.searchValue);
    this.sortContributorFormControl.setValue(this.sortByValue);
    this.cancelFilter(); //reset to old value
  }
  /**Method to revert change */
  revertChange(): void {
    this.revertChanges.emit();
    this.decline();
  }

  /**Method to discard changes and continue with actions */
  discardChanges(): void {
    this.decline();
    switch (this.valueChange) {
      case valueConstant.Filter:
        this.handleFilterContributors();
        break;
      case valueConstant.Search:
        this.handleSearchContributor();
        break;
      case valueConstant.Sort:
        this.handleSortContributor();
        break;
      case valueConstant.SortDirection:
        this.handleSortDirectionChange();
        break;
    }
  }
  clearOccupationFiter() {
    this.filterForm.get('occupation').reset();
    // this.filte
    this.selectedOccupationList = [];
    this.tempFormValue = this.filterForm.value;
  }
  clearNationalityFiter() {
    this.filterForm.get('nationality').reset();
    this.selectedNationalityList = [];
    this.tempFormValue = this.filterForm.value;
  }
  setWage(minWageClicked?: boolean) {
    this.validationChanged = false;
    this.minWage = parseInt(this.filterForm?.get('wage')?.get('minWage').value, 10);
    this.maxWage = parseInt(this.filterForm?.get('wage')?.get('maxWage').value, 10);
    if (
      this.filterForm?.get('wage').valid &&
      (this.minWage || this.minWage === 0) &&
      (this.maxWage || this.maxWage === 0) &&
      this.minWage <= this.maxWage
    ) {
      this.checkForSliderChange(false);
    } else if (this.minWage || this.minWage === 0) {
      if (!this.filterForm?.get('wage')?.get('minWage').valid) {
        this.filterForm
          ?.get('wage')
          ?.get('minWage')
          .setValidators([Validators.required, greaterThanLessThanValidator(0, this.maxWageLimit)]);
        this.filterForm?.get('wage')?.get('minWage').updateValueAndValidity();
        // this.filterForm?.get('wage')?.get('maxWage').setValue(this.maxWageLimit);
        if (this.minWage <= this.maxWageLimit) {
          this.filterForm?.get('wage')?.get('maxWage').setValue(this.maxWageLimit);
        } else {
          this.filterForm?.get('wage')?.get('wageRangePicker').setValue([0, this.maxWageLimit]);
        }
      }
      if (minWageClicked && !this.filterForm?.get('wage')?.get('maxWage').valid) {
        this.filterForm?.get('wage')?.get('maxWage').setValue(this.maxWageLimit);
        this.filterForm?.get('wage')?.get('maxWage').markAsUntouched();
        this.filterForm?.get('wage')?.get('maxWage').markAsPristine();
      }
      let tempMaxWage = parseInt(this.filterForm?.get('wage')?.get('maxWage').value, 10);
      if (minWageClicked && this.minWage > tempMaxWage) {
        this.filterForm?.get('wage')?.get('maxWage').setValue(this.maxWageLimit);
      }
      if (minWageClicked) {
        let validMinWage = this.minWage <= this.maxWageLimit ? this.minWage : 0;
        this.filterForm
          ?.get('wage')
          ?.get('maxWage')
          .setValidators([Validators.required, greaterThanLessThanValidator(validMinWage, 1000000)]);
        this.filterForm?.get('wage')?.get('maxWage').updateValueAndValidity();
        this.validationChanged = true;
      }
      if (this.filterForm?.get('wage')?.get('minWage').valid) {
        this.filterForm?.get('wage')?.get('wageRangePicker').setValue([this.minWage, 1000000]);
      }
    } else if (this.maxWage) {
      if (this.filterForm?.get('wage')?.get('maxWage').valid) {
        this.filterForm?.get('wage')?.get('wageRangePicker').setValue([0, this.maxWage]);
      }
      this.filterForm
        ?.get('wage')
        ?.get('minWage')
        .setValidators([Validators.required, greaterThanLessThanValidator(0, this.maxWage)]);
      this.filterForm?.get('wage')?.get('minWage').updateValueAndValidity();
    }
  }
  setMaxWage() {
    this.minWage = parseInt(this.filterForm?.get('wage')?.get('minWage').value, 10);
    let validMinWage = this.minWage <= this.maxWageLimit ? this.minWage : 0;
    this.filterForm
      ?.get('wage')
      ?.get('maxWage')
      .setValidators([Validators.required, greaterThanLessThanValidator(validMinWage, 1000000)]);
    this.filterForm?.get('wage')?.get('maxWage').updateValueAndValidity();
    this.setWage(false);
  }
  // setting value in boxes when slider changes
  checkForSliderChange(isSliderChanged: boolean) {
    if (isSliderChanged) {
      const sliderWageValues = this.filterForm.get('wage')?.get('wageRangePicker');
      this.minWage = sliderWageValues?.value[0];
      this.maxWage = sliderWageValues?.value[1];
    }
    this.setWageForm();
    this.filterForm?.get('wage')?.get('wageRangePicker').setValue([this.minWage, this.maxWage]);
    this.filterForm?.get('wage')?.get('minWage').setValue(this.minWage);
    this.filterForm?.get('wage')?.get('maxWage').setValue(this.maxWage);
  }
  setWageForm() {
    this.filterForm?.removeControl('wage');
    this.filterForm?.addControl(
      'wage',
      this.fb.group({
        wageRangePicker: new FormControl([this.minWage, this.maxWage]),
        minWage: [
          null,
          { validators: Validators.compose([greaterThanLessThanValidator(0, this.maxWage), Validators.required]) }
        ],
        maxWage: [
          null,
          { validators: Validators.compose([greaterThanLessThanValidator(this.minWage, 1000000), Validators.required]) }
        ]
      })
    );
  }
}
