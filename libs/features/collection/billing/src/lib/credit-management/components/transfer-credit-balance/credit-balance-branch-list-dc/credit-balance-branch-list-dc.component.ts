import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BranchDetails, EstablishmentDetails } from '../../../../shared/models';

@Component({
  selector: 'blg-credit-balance-branch-list-dc',
  templateUrl: './credit-balance-branch-list-dc.component.html',
  styleUrls: ['./credit-balance-branch-list-dc.component.scss']
})
export class CreditBalanceBranchListDcComponent implements OnInit, OnChanges {
  // Local varaiables
  values: '';
  inviteList;
  checkForm: FormGroup;
  reg = [];
  istrue = false;

  branchValue: BranchDetails[];
  branchListValue: FormArray = new FormArray([]);
  noResult = false;
  regex: RegExp = new RegExp(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/);

  // Input varaiables
  @Input() branchLists: BranchDetails[];
  @Input() establishmentDetails: EstablishmentDetails;

  // outut varaiables
  @Output() selectedBranchList = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() searchValues: EventEmitter<string> = new EventEmitter();

  list = [];

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.checkForm = this.createCheckForm();
  }
  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.branchLists && changes.branchLists.currentValue) {
      this.branchLists = changes.branchLists.currentValue;
      this.branchValue = this.branchLists;
      this.createFormData();
    }

    if (changes && changes.establishmentDetails && changes.establishmentDetails.currentValue) {
      this.establishmentDetails = changes.establishmentDetails.currentValue;
    }
  }
  createFormData() {
    this.branchLists.forEach(() => {
      this.branchListValue.push(this.createCheckForm());
    });
  }
  onSearchAmount(evt) {
    this.values = evt;
    this.branchLists = [];
    if (evt.length !== 0) {
      this.branchValue.forEach(res => {
        if (String(res.registrationNo).includes(evt) || res.name.arabic.includes(evt)) {
          this.branchLists.push(res);
          if (this.branchLists.length === 0) this.noResult = true;
        } else if (res.name.english !== null) {
          if (String(res.name.english).toLowerCase().includes(evt.toLowerCase())) {
            this.branchLists.push(res);
            if (this.branchLists.length === 0) this.noResult = true;
          }
        }
      });
      for (let i = 0; i < this.branchLists.length; i++) {
        this.reg.forEach(res => {
          if (res === this.branchLists[i].registrationNo)
            this.branchListValue.controls[i].get('checkBoxFlag').patchValue(true);
          else this.branchListValue.controls[i].get('checkBoxFlag').patchValue(false);
        });
      }
    } else {
      this.branchLists = this.branchValue;
      this.checkFormValue();
    }
  }
  selectEstablishment(i) {
    if (this.branchListValue.controls[i].get('checkBoxFlag').value === true) {
      this.branchLists[i].selectedCheckBox = true;
      this.istrue = true;
      this.reg.push(this.branchLists[i].registrationNo);
    } else {
      this.branchLists[i].selectedCheckBox = false;
      this.reg = this.reg.filter(item => item !== this.branchLists[i].registrationNo);
    }
  }

  closePopUp() {
    this.branchLists.forEach(element => {
      element.selectedCheckBox = false;
    });
    this.branchListValue.reset();
    this.cancel.emit();
  }
  checkFormValue() {
    this.branchListValue.controls.forEach(evt => {
      evt.get('checkBoxFlag').patchValue(false);
    });
    this.reg.forEach(res => {
      this.branchValue.forEach((item, i) => {
        if (res === item.registrationNo) this.branchListValue.controls[i].get('checkBoxFlag').patchValue(true);
      });
    });
  }
  confirm() {
    this.list = [];
    for (const evt of this.branchValue) {
      for (const res of this.reg) {
        if (evt.registrationNo === res) {
          const listItem = {
            name: evt.name,
            status: evt.status,
            registrationNo: evt.registrationNo
          };
          this.list.push(listItem);
        }
      }
    }
    this.selectedBranchList.emit(this.list);
    this.branchListValue.reset();
    this.branchLists.forEach(element => {
      element.selectedCheckBox = false;
    });
  }
  createCheckForm(): FormGroup {
    return this.fb.group({
      checkBoxFlag: [false]
    });
  }
}
