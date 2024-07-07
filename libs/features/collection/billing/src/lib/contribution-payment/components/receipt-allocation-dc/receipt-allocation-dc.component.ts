/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText, CurrencySar, LovList, GccCountryEnum } from '@gosi-ui/core';
import { BillingConstants, PaymentConstants } from '../../../shared/constants';
import { CurrencyArabic } from '../../../shared/enums';
import { BranchDetails, EstablishmentDetails, BranchFilter } from '../../../shared/models';
import { EstablishmentService } from '../../../shared/services';

@Component({
  selector: 'blg-receipt-allocation-dc',
  templateUrl: './receipt-allocation-dc.component.html',
  styleUrls: ['./receipt-allocation-dc.component.scss']
})
export class ReceiptAllocationDcComponent implements OnInit, OnChanges {
  noOfRecords: 400;
  paginationId = 'receivePayment';
  itemsPerPage = 10;
  currentPage = 1;
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  //Input variables
  @Input() currency: BilingualText;
  @Input() parentForm: FormGroup;
  @Input() gccFlag: boolean;
  @Input() noFilterResult: boolean;
  @Input() branchLists: BranchDetails[];
  @Input() outsideBranchLists: BranchDetails[];
  @Input() establishmentDetails: EstablishmentDetails;
  @Input() isBranchesClosed: boolean;
  @Input() totalAmountValue: number;
  @Input() currentReceiptMode: string;
  @Input() branchFilterDetails: BranchDetails[];
  @Input() establishmentLocationList: LovList;
  @Input() establishmentStatusList: LovList;
  @Input() fieldArray: BranchDetails[];
  @Input() outsideEstablishment: boolean;
  @Input() twoDecimalval: boolean;
  @Input() isGovPayment: boolean;
  @Input() allocatedAmount? = 0;
  //Output variables
  @Output() branchSearch: EventEmitter<string> = new EventEmitter();
  @Output() outSideBranchSearch: EventEmitter<string> = new EventEmitter();
  @Output() validateOutsideBranch: EventEmitter<boolean> = new EventEmitter();
  @Output() branchDetailsFilter: EventEmitter<BranchFilter> = new EventEmitter();
  // @Output() LocationFilter: EventEmitter<string> = new EventEmitter();

  //Local variables
  filterValue: BranchFilter;
  branchList: FormArray = new FormArray([]);
  branches: BranchDetails[];
  totalAmountForm: FormGroup;
  currentCurrency: BilingualText;
  establishment: BranchDetails[] = [];
  separatorLimit = BillingConstants.AMOUNT_RECEIVED_SEPARATOR_LIMIT;
  isSearched = false;
  isFiltered = false;
  tempBranchList: FormArray = new FormArray([]);
  estCount = 0;
  sumInsideAndOutside = 0.0;
  newAttribute = {};
  fieldArrays = [];
  registerNumber;
  ousideBranchList: FormArray = new FormArray([]);
  outsideBranches: BranchDetails[] = [];
  outsideTotalAmountForm: FormGroup;
  statusFlag = false;
  amountDisabledFlag = false;
  filterFlag: boolean;
  insideTotalAmount = 0;
  value = 0;
  amountChange = false;
  chequeNoMaxLength = PaymentConstants.CHEQUE_NUMBER_MAX_LENGTH;

  /**
   * Creates an instance of ReceiptAllocationDcComponent
   * @param fb
   */
  constructor(private fb: FormBuilder, readonly establishmentService: EstablishmentService) {}
  ngOnInit() {
    this.totalAmountForm = this.getTotalAmountForm();
    this.outsideTotalAmountForm = this.getOutsideTotalAmountForm();
    this.parentForm.addControl('totalAmountAllocated', this.totalAmountForm);
    this.parentForm.addControl('totalOutSideAmountAllocated', this.outsideTotalAmountForm);
  }
  /**
   * This method is used to handle the changes in the input variables
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    this.setTotalAmount(changes);
    if (changes && changes.branchLists && changes.branchLists.currentValue) {
      this.branches = changes.branchLists.currentValue;
      if (!this.isSearched) {
        this.estCount = this.branches.length;
      }
      this.initializeFormData();
    } else if (changes && changes.branchFilterDetails && changes.branchFilterDetails.currentValue) {
      this.branches = changes.branchFilterDetails.currentValue;
      if (!this.isSearched) {
        this.estCount = this.branches.length;
      }
      this.initializeFormData();
    }
    this.totalAllocationAmount();
    // this.initializeFormData();
    if (changes && changes.currency && changes.currency.currentValue) {
      if (this.gccFlag === true) {
        //to convert the currecy code in abbrevation to full form in arabic
        this.currentCurrency = new BilingualText();
        this.currentCurrency.english = this.currency.english;
        this.currentCurrency.arabic = CurrencyArabic[this.currency.english];
        this.updateCurrencyCode(this.tempBranchList, this.currentCurrency.english);
        this.updateCurrencyCode(this.branchList, this.currentCurrency.english);
      } else {
        this.currentCurrency = BillingConstants.CURRENCY_SAR;
      }
    }
    if (changes && changes.fieldArray && changes.fieldArray.currentValue) {
      changes.fieldArray.currentValue.forEach((data: BranchDetails) => {
        if (data.registrationNo === Number(this.registerNumber)) {
          this.outsideBranches.push(data);
          this.fieldArrays = [];
        }
      });
      this.initializeOutsideFormData();
      this.totalOutsideAllocationAmount();
    }
    if (changes && changes.outsideBranchLists && changes.outsideBranchLists.currentValue) {
      this.outsideBranches = changes.outsideBranchLists.currentValue;
      this.initializeOutsideFormData();
      this.totalOutsideAllocationAmount();
    }
  }

  setTotalAmount(changes) {
    if (changes && changes.totalAmountValue && changes.totalAmountValue.currentValue) {
      this.sumInsideAndOutside = changes.totalAmountValue.currentValue;
    }
  }

  /** Method to create branch breakup from. */
  getBranchBreakupForm(): FormGroup {
    return this.fb.group({
      registrationNo: null,
      establishmentType: this.fb.group({
        english: '',
        arabic: ''
      }),
      allocatedAmount: this.fb.group({
        amount: '0.00',
        currency: this.currency.english !== null ? this.currency.english : CurrencySar.ENGLISH
      })
    });
  }

  /** Method to create total amount form. */
  getTotalAmountForm(): FormGroup {
    return this.fb.group({
      totalAmount: [
        this.sumInsideAndOutside > 0 ? this.sumInsideAndOutside : '0.00',
        { validators: Validators.required }
      ]
    });
  }

  //Method to bind the values to branchBreakupform
  initializeFormData() {
    //To sort the branches such that Main establishment comes first.
    this.branches.sort((a, b) => {
      if (a.establishmentType.english > b.establishmentType.english) {
        return -1;
      } else if (a.establishmentType.english < b.establishmentType.english) {
        return 1;
      } else {
        return 0;
      }
    });

    this.branchList = this.fb.array([]);
    let sum = 0;
    this.branches.forEach((res: BranchDetails) => {
      const branch: FormGroup = this.getBranchBreakupForm();
      branch.get('registrationNo').setValue(res.registrationNo);
      branch.get('establishmentType').setValue(res.establishmentType);
      //Set allocated amount to form in case of edit mode.
      if (res.allocatedAmount) {
        branch.get('allocatedAmount.amount').setValue(parseFloat(res.allocatedAmount.amount.toString()).toFixed(3));

        //Calculate sum for total amount in edit mode.
        sum += res.allocatedAmount.amount;
      }
      if (this.isGovPayment && this.branches.length === 1 && this.allocatedAmount > 0) {
        branch.get('allocatedAmount.amount').setValue(parseFloat(String(this.allocatedAmount)).toFixed(2));
      }
      this.branchList.push(branch);
    });

    //Bind total amount in total amount form.
    this.totalAmountForm = this.getTotalAmountForm();
    this.totalAmountForm.get('totalAmount').setValue(parseFloat(sum.toString()).toFixed(3));
    this.calculateSumInsideAndOutside();
    if (this.parentForm.get('branchBreakupForm')) {
      this.parentForm.removeControl('branchBreakupForm');
    }
    this.parentForm.addControl('branchBreakupForm', this.branchList);
    if (!this.isSearched || this.isFiltered) {
      this.bindTempListToBranchForm();
    }
    // this.bindTempListToBranchForm();
  }

  /** Method to find total allocated amount. */

  /** Method to find total allocated amount. */
  totalAllocationAmount() {
    let sum = 0;
    if (this.branchList.length >= 1) {
      this.branchList.value.forEach(item => {
        sum += Number(item.allocatedAmount.amount);
      });
      this.totalAmountForm.get('totalAmount').patchValue(parseFloat(sum.toString()).toFixed(3));
    }
    this.calculateSumInsideAndOutside();
  }

  /**
   * Method to handle branch search.
   * @param registartionNumber registration number
   */
  searchBranches(registartionNumber: string) {
    //Trigger search if 3 or more characters is entered.
    if (registartionNumber) {
      this.isSearched = registartionNumber.length !== 0 ? true : false;
      //To store the values temporarily.
      this.bindAllocatedAmount();
      this.branchSearch.emit(registartionNumber);
    } else {
      this.bindAllocatedAmount();
      this.branchSearch.emit(null);
      this.isSearched = false;
    }
  }
  bindAllocatedAmount() {
    this.branchList.controls.forEach((branch: FormGroup) => {
      if (branch.get('allocatedAmount.amount').value && Number(branch.get('allocatedAmount.amount').value) !== 0) {
        if (this.tempBranchList.getRawValue().length > 0) {
          let matchFound = false;
          this.tempBranchList.controls.forEach((temp: FormGroup) => {
            //If branch is already present in tempList update the value entered
            if (temp.get('registrationNo').value === branch.get('registrationNo').value) {
              matchFound = true;
              temp.get('allocatedAmount.amount').patchValue(branch.get('allocatedAmount.amount').value);
            }
          });
          //If not present in tempList, add it
          if (!matchFound) {
            this.tempBranchList.push(branch);
          }
        } else {
          this.tempBranchList.push(branch);
        }
      }
    });

    if (this.parentForm.get('tempBranchList')) {
      this.parentForm.removeControl('tempBranchList');
    }
    this.parentForm.addControl('tempBranchList', this.tempBranchList);
    // this.bindTempListToBranchForm();
  }
  /** Method to bind temp values after search. */
  bindTempListToBranchForm() {
    let sum = 0;
    this.tempBranchList.controls.forEach((temp: FormGroup) => {
      this.branchList.controls.forEach((branch: FormGroup) => {
        if (temp.get('registrationNo').value === branch.get('registrationNo').value) {
          sum += Number(temp.get('allocatedAmount.amount').value);
          branch.get('allocatedAmount.amount').setValue(temp.get('allocatedAmount.amount').value);
        }
      });
    });
    this.totalAmountForm.get('totalAmount').patchValue(parseFloat(sum.toString()).toFixed(3));
    this.calculateSumInsideAndOutside();
  }

  /**
   * Method to change currency code on contry change
   * @param list branch list form array
   * @param currencyCode currency code
   */
  updateCurrencyCode(list: FormArray, currencyCode: string) {
    if (list) {
      list.controls.forEach((fg: FormGroup) => {
        fg.get('allocatedAmount.currency').patchValue(currencyCode);
      });
    }
  }
  /**
   * Method to get Branch Details
   */
  getBranchFilter(branchFilter: BranchFilter) {
    this.isFiltered = true;
    this.bindAllocatedAmount();
    this.branchDetailsFilter.emit(branchFilter);
    this.filterValue = branchFilter;
  }

  //OUTSIDE ESTABLISHMENT

  addNewOutsideEstablishment() {
    if (this.fieldArrays.length === 0) {
      this.amountDisabledFlag = true;
      this.fieldArrays.push(this.newAttribute);
      this.newAttribute = {};
    }
  }

  deleteFieldValue(index, typeAdded) {
    if (typeAdded === 1) {
      this.fieldArrays.splice(index, 1);
    } else {
      this.outsideBranches.splice(index, 1);
      this.ousideBranchList.removeAt(index);
      this.totalOutsideAllocationAmount();
    }
  }
  /**
   * Method to handle branch search.
   * @param registerNumber registration number
   */

  searchOutsideBranches(registerNumber: string) {
    this.statusFlag = false;
    this.registerNumber = registerNumber;
    this.branches.forEach((inSideData: BranchDetails) => {
      if (inSideData.registrationNo === Number(this.registerNumber)) {
        this.statusFlag = true;
        this.validateOutsideBranch.emit(this.statusFlag);
      }
    });
    this.outsideBranches.forEach((outSideData: BranchDetails) => {
      if (outSideData.registrationNo === Number(this.registerNumber)) {
        this.statusFlag = true;
        this.validateOutsideBranch.emit(this.statusFlag);
      }
    });
    if (this.statusFlag === false) {
      this.outSideBranchSearch.emit(this.registerNumber);
    }
  }
  /** Method to find total allocated amount. */
  totalOutsideAllocationAmount() {
    let sum = 0;
    if (this.ousideBranchList.length > 0) {
      this.ousideBranchList.value.forEach(item => {
        sum += Number(item.allocatedAmount.amount);
      });
    }
    this.outsideTotalAmountForm.get('totalAmount').patchValue(parseFloat(sum.toString()).toFixed(3));
    this.calculateSumInsideAndOutside();
  }

  getDisabledStatus() {
    if (this.branches.length === 1 && this.branchList.controls[0]) {
      return this.branchList.controls[0].get('allocatedAmount').get('amount').value >=
        this.parentForm.get('totalAmountAllocated.totalAmount').value
        ? true
        : false;
    } else if (this.totalAmountForm) {
      return this.totalAmountForm.get('totalAmount').value >=
        this.parentForm.get('totalAmountAllocated.totalAmount').value
        ? true
        : false;
    }
  }

  /** Method to create branch breakup from. */
  getOutsideBranchBreakupForm(): FormGroup {
    return this.fb.group({
      registrationNo: null,
      outsideGroup: true,
      establishmentType: this.fb.group({
        english: '',
        arabic: ''
      }),
      allocatedAmount: this.fb.group({
        amount: '0.00',
        currency: this.currency.english !== null ? this.currency.english : CurrencySar.ENGLISH
      })
    });
  }

  /** Method to create total amount form. */
  getOutsideTotalAmountForm(): FormGroup {
    return this.fb.group({
      totalAmount: ['0.00']
    });
  }

  initializeOutsideFormData() {
    this.outsideBranches.forEach((res: BranchDetails) => {
      if (this.ousideBranchList.value.map(data => data['registrationNo']).indexOf(res['registrationNo']) < 0) {
        const branch: FormGroup = this.getOutsideBranchBreakupForm();
        branch.get('registrationNo').setValue(res.registrationNo);
        branch.get('establishmentType').setValue(res.establishmentType);
        branch.get('outsideGroup').setValue(true);
        //Set allocated amount to form in case of edit mode.
        if (res.allocatedAmount) {
          branch.get('allocatedAmount.amount').setValue(parseFloat(res.allocatedAmount.amount.toString()).toFixed(3));
        }
        this.ousideBranchList.push(branch);
      }
    });

    //Bind total amount in total amount form.
    this.outsideTotalAmountForm = this.getOutsideTotalAmountForm();
    if (this.parentForm.get('outSideBranchBreakupForm')) {
      this.parentForm.removeControl('outSideBranchBreakupForm');
    }
    this.parentForm.addControl('outSideBranchBreakupForm', this.ousideBranchList);
  }

  calculateSumInsideAndOutside() {
    let outsideTotalAmount = 0;
    if (!this.filterFlag) {
      if (this.isBranchesClosed || this.branches.length === 1) {
        this.insideTotalAmount = this.branchList.controls[0].get('allocatedAmount').get('amount').value;
      } else {
        this.insideTotalAmount = this.totalAmountForm.get('totalAmount').value;
      }
    } else {
      this.insideTotalAmount = this.totalAmountForm.get('totalAmount').value;
    }
    if (this.outsideTotalAmountForm) {
      if (this.isSearched) {
        this.tempBranchList.controls.forEach((temp: FormGroup) => {
          this.branchList.controls.forEach((branch: FormGroup) => {
            if (temp.get('registrationNo').value !== branch.get('registrationNo').value) {
              outsideTotalAmount += Number(temp.get('allocatedAmount.amount').value);
            }
          });
        });
      } else {
        outsideTotalAmount = Number(this.outsideTotalAmountForm.get('totalAmount').value);
      }
    }
    this.sumInsideAndOutside = Number(this.insideTotalAmount) + outsideTotalAmount;
  }
  // emit filter values as boolean
  getFilterFlag(value) {
    this.filterFlag = value;
  }
  /*
   * @param page method to trigger the page select event
   */
  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
    }
  }
  absoluteIndex(indexOnPage: number): number {
    return this.itemsPerPage * (this.currentPage - 1) + indexOnPage;
  }
}
