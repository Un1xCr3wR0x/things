/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Admin, BranchList } from '../../../shared';
import { GenderEnum, LovList, Lov, BilingualText } from '@gosi-ui/core';
import { Observable, of } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { branchAndOtherOptions, getOtherRoles } from '../../../shared/utils';
//TODO Remove this component - vd changed
@Component({
  selector: 'est-modify-admin-modal-dc',
  templateUrl: './modify-admin-modal-dc.component.html',
  styleUrls: ['./modify-admin-modal-dc.component.scss']
})
export class ModifyAdminModalDcComponent implements OnInit {
  dropDownList$ = getOtherRoles();
  radioList$ = branchAndOtherOptions();
  enableAdminDropDown: Boolean;
  selectedValues: BilingualText[];

  ownerSelectionForm: FormGroup;
  constructor(private fb: FormBuilder) {}
  femaleGender = GenderEnum.FEMALE;
  @Input() admin: Admin = new Admin();
  @Input() branch: BranchList;
  @Output() onConfirm = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  ngOnInit(): void {
    this.ownerSelectionForm = this.createOwnerSelectionForm();
    this.selectedValues = this.branch.roles as BilingualText[];
  }
  confirm() {
    this.onConfirm.emit();
  }

  decline() {
    this.onCancel.emit();
  }
  selectAdminRole(adminRole: String) {
    if (adminRole === 'Other Roles') {
      this.enableAdminDropDown = true;
    } else if (adminRole === 'Unassign') {
      this.enableAdminDropDown = false;
    } else {
      this.enableAdminDropDown = false;
    }
  }
  getRadioList(): Observable<LovList> {
    const lovArray: Lov[] = [];
    ['Branch Admin', 'Other Roles', 'Unassign this branch'].some((itemValue, index) => {
      lovArray.push({
        sequence: index,
        value: { english: itemValue, arabic: itemValue }
      });
    });
    return of(new LovList(lovArray));
  }

  createOwnerSelectionForm(): FormGroup {
    return this.fb.group({
      radioList: this.fb.group({
        english: [{ validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      adminRoles: this.fb.group({
        english: ['', { validators: Validators.required }],
        arabic: ['', { validators: Validators.required }]
      })
    });
  }
}
