/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Output, EventEmitter, SimpleChanges, OnChanges, OnInit, TemplateRef, Input } from '@angular/core';
import { BranchDetails, EstablishmentDetails, CreditBalanceDetails } from '../../../../shared/models';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertService } from '@gosi-ui/core/lib/services';
import { greaterThanValidator } from '@gosi-ui/core';

@Component({
  selector: 'blg-recepient-establishment-details-dc',
  templateUrl: './recepient-establishment-details-dc.component.html',
  styleUrls: ['./recepient-establishment-details-dc.component.scss']
})
export class RecepientEstablishmentDetailsDcComponent implements OnInit, OnChanges {
  /**Local Variables */
  estFlag = false;
  newAttribute = {};
  fieldArrays = [];
  newBranch = [];
  um = 0;
  total = 0;
  branchList: FormArray = new FormArray([]);
  totalAmountForm: FormGroup;
  modalRef: BsModalRef;
  errorMesg = false;
  amountFlag = false;
  wrongSearchValue = false;
  wrongBranchSearch = false;
  branchValue = [];
  branchAmount = 0;

  /**Input Variables */
  @Input() fieldArray = [];
  @Input() parentForm: FormGroup;
  @Input() branchLists: BranchDetails[];
  @Input() establishmentDetails: EstablishmentDetails;
  @Input() creditBalanceDetails: CreditBalanceDetails;
  @Input() inWorkflow: boolean;
  /**Output Variables */
  @Output() registerNo: EventEmitter<string> = new EventEmitter();
  @Output() selectedBranchList = new EventEmitter();
  @Output() errorFlag: EventEmitter<boolean> = new EventEmitter();
  @Output() searchValue: EventEmitter<string> = new EventEmitter();
  @Output() popupCancel: EventEmitter<null> = new EventEmitter();
  @Output() amountFlagValue: EventEmitter<boolean> = new EventEmitter();
  @Output() wrongSearch: EventEmitter<null> = new EventEmitter();

  /**
   * Creates an instance of RecepientEstablishmentDetailsDcComponent.
   * @param fb
   * @param modalService
   */
  constructor(private fb: FormBuilder, readonly modalService: BsModalService, readonly alertService: AlertService) {}

  // This method is used to initialise the component on loading
  ngOnInit(): void {
    this.totalAmountForm = this.getOutsideTotalAmountForm();
    this.parentForm.addControl('totalAmountAllocated', this.totalAmountForm);
  }
  /** Method to detect chnages in input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.branchLists && changes.branchLists.currentValue) {
      this.branchLists = changes.branchLists.currentValue;
    }
    if (changes && changes.establishmentDetails && changes.establishmentDetails.currentValue) {
      this.establishmentDetails = changes.establishmentDetails.currentValue;
    }
    if (changes && changes.fieldArray && changes.fieldArray.currentValue) {
      changes.fieldArray.currentValue.forEach((data: BranchDetails) => {
        this.newBranch.push(data);
        this.amountFlagValue.emit(true);
        this.fieldArrays = [];
      });
    }
    this.intialData();
  }

  getBranchBreakupForm(): FormGroup {
    return this.fb.group({
      registrationNo: null,
      estName: this.fb.group({
        english: '',
        arabic: ''
      }),
      amount: ['', { validators: Validators.compose([greaterThanValidator(0), Validators.required]) }]
    });
  }

  /** Method to create total amount form. */
  getOutsideTotalAmountForm(): FormGroup {
    return this.fb.group({
      totalAmount: ['0.00']
    });
  }
  intialData() {
    let sum = 0;
    this.newBranch.forEach(res => {
      if (this.branchList.value.map(data => data['registrationNo']).indexOf(res['registrationNo']) < 0) {
        const branch: FormGroup = this.getBranchBreakupForm();
        branch.get('registrationNo').setValue(res.registrationNo);
        branch.get('estName').setValue(res.name);
        if (res.amount) {
          branch.get('amount').setValue(parseFloat(res.amount.toString()).toFixed(2));
          sum += res.amount;
        }
        this.branchList.push(branch);
      }
    });
    //Bind total amount in total amount form.

    if (this.inWorkflow) {
      this.totalAmountForm = this.getOutsideTotalAmountForm();
      this.totalAmountForm.get('totalAmount').setValue(parseFloat(sum.toString()).toFixed(2));
      this.totalAmount();
    }
    if (this.branchList.length !== 0) this.estFlag = true;
    if (this.parentForm.get('branchBreakupForm')) {
      this.parentForm.removeControl('branchBreakupForm');
    }

    this.parentForm.addControl('branchBreakupForm', this.branchList);
  }
  addEstablishment() {
    this.estFlag = true;
    if (this.fieldArrays.length === 0) {
      this.fieldArrays.push(this.newAttribute);
      this.newAttribute = {};
    }
  }
  deleteFieldValue(index, typeAdded) {
    if (typeAdded === 1) {
      this.fieldArrays.splice(index, 1);
      if (this.branchList.length === 0) this.estFlag = false;
      this.amountFlagValue.emit(false);
    } else {
      this.newBranch.splice(index, 1);
      this.branchList.removeAt(index);
      if (this.branchList.length === 0) this.estFlag = false;
      this.totalAmount();
    }
  }
  searchBranches(registerNumber: string) {
    this.wrongSearchValue = false;
    this.amountFlagValue.emit(true);
    if (this.branchList.length > 0) {
      this.branchList.value.forEach(item => {
        if (item.registrationNo === Number(registerNumber)) {
          this.wrongSearchValue = true;
          this.amountFlagValue.emit(false);
          this.wrongSearch.emit();
        }
        return;
      });
      if (!this.wrongSearchValue) this.registerNo.emit(registerNumber);
      this.wrongSearchValue = true;
    } else this.registerNo.emit(registerNumber);
  }
  totalAmount() {
    this.alertService.clearAlerts();
    let sum = 0;
    if (this.branchList.length > 0) {
      this.branchList.value.forEach(item => {
        if (Number(item.amount) === 0) {
          this.amountFlag = true;
          this.amountFlagValue.emit(this.amountFlag);
        } else this.amountFlagValue.emit(false);
        sum += Number(item.amount);
      });
    }
    if (this.creditBalanceDetails) {
      this.totalAmountForm.get('totalAmount').patchValue(parseFloat(sum.toString()).toFixed(2));
      if (Number(this.totalAmountForm.get('totalAmount').value) > this.creditBalanceDetails.transferableBalance) {
        this.amountFlagValue.emit(true);
        this.errorMesg = true;
        this.errorFlag.emit(this.errorMesg);
      } else if (this.branchList.valid) {
        this.amountFlagValue.emit(false);
        this.errorMesg = false;
      } else this.amountFlagValue.emit(true);
    }
  }

  /** Method to show modal. */
  showBranchDetModel(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  selectBranches() {}

  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.popupCancel.emit();
    this.modalRef.hide();
  }

  selectedBranch(evt) {
    this.branchValue = [];
    if (this.branchList.length > 0) {
      for (let i = 0; i < evt.length; i++) {
        this.wrongBranchSearch = false;
        this.branchList.value.forEach(item => {
          if (Number(evt[i].registrationNo) === item.registrationNo) this.wrongBranchSearch = true;
          return;
        });
        if (!this.wrongBranchSearch) {
          this.branchValue.push(evt[i]);
          this.wrongBranchSearch = false;
        }
      }

      this.selectedBranchList.emit(this.branchValue);
    } else this.selectedBranchList.emit(evt);
    if (evt) {
      this.confirmCancel();
    }
  }
  searchValues(res) {
    this.searchValue.emit(res);
  }
}
