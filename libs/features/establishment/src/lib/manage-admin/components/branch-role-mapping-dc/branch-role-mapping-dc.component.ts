/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BilingualText, LovList, markFormGroupTouched } from '@gosi-ui/core';
import { AdminRoleEnum, BranchList, IBranchRole } from '../../../shared';
import { branchAndOtherOptions, getAdminRole, getOtherRoles, otherRoles } from '../../../shared/utils';

@Component({
  selector: 'est-branch-role-mapping-dc',
  templateUrl: './branch-role-mapping-dc.component.html',
  styleUrls: ['./branch-role-mapping-dc.component.scss']
})
export class BranchRoleMappingDcComponent implements OnInit, OnChanges {
  selectedRoles: BilingualText[] = [];
  branchRoleForm: FormGroup;
  isRadioDisabled: boolean;
  isSelected = false;
  branchRoleList = new LovList(branchAndOtherOptions().items);
  roleList = getOtherRoles();
  readOnly = false;

  @Input() branch: BranchList;
  @Input() rolesBeforeChange: BilingualText[] = [];
  @Input() showOnlyRoleAdmins: boolean;
  @Input() hideMultiSelect: boolean;
  @Input() index: string;
  @Input() isValid: boolean;
  @Input() canSelect = true;
  @Input() canDelete = false;

  @Output() updateRoles: EventEmitter<IBranchRole> = new EventEmitter();

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.branchRoleForm = this.fb.group({
      isBranch: this.fb.group({
        english: '',
        arabic: ''
      }),
      hasRole: false,
      roles: this.fb.group({
        english: '',
        arabic: ''
      })
    });
    this.bindToForm(this.branch?.roles?.length > 0 ? this.branch.roles : []);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.branch && !changes.branch.firstChange) {
      this.bindToForm(this.branch?.roles?.length > 0 ? this.branch.roles : []);
    }
    if (changes.isValid) {
      if (this.isValid === false) {
        markFormGroupTouched(this.branchRoleForm);
      }
    }
  }

  /**
   * Method to bind the roles to form
   * @param roles
   */
  bindToForm(roles: BilingualText[]) {
    if (this.showOnlyRoleAdmins) {
      this.getFormControls()[2].setValidators(Validators.required);
    }
    const roleCheck = roles.reduce(
      (pre, role) => {
        if (role.english === AdminRoleEnum.BRANCH_ADMIN) {
          pre.hasBranch = true;
          pre.roles.push(role);
          return pre;
        }
        if (getOtherRoles().items.findIndex(item => role.english === item.value.english) !== -1 && !pre.hasBranch) {
          pre.roles.push(role);
          return pre;
        }
      },
      { hasBranch: false, roles: [] }
    );
    const controls = this.getFormControls();
    if (roleCheck.roles && roleCheck.roles.length > 0) {
      this.isSelected = true;
      this.isRadioDisabled = false;
      controls[1].setValue(roleCheck.hasBranch === true ? roleCheck.roles[0].english : otherRoles.english);
      if (roleCheck.hasBranch === false) {
        this.getFormControls()[2].setValidators(Validators.required);
        this.hideMultiSelect = false;
        this.selectedRoles = roleCheck.roles;
      } else {
        this.hideMultiSelect = true;
      }
      controls[0].setValue(true);
    } else {
      this.isSelected = false;
      this.isRadioDisabled = true;
      this.hideMultiSelect = true;
      controls[0].setValue(false);
      controls[1].setValue(undefined);
      this.selectedRoles = [];
    }
    controls.forEach(control => control.updateValueAndValidity());
  }

  /**
   * Method to select or deselect the branch
   * @param value
   */
  selectBranch(value: string) {
    this.isSelected = false;
    const controls = this.getFormControls();
    this.selectedRoles = [];
    this.hideMultiSelect = true;
    this.getFormControls()[2].clearValidators();
    controls[2].setValue(null);
    if (value === 'true') {
      this.isSelected = true;
      if (this.showOnlyRoleAdmins) {
        this.hideMultiSelect = false;
        this.getFormControls()[2].setValidators(Validators.required);
      }
      this.isRadioDisabled = false;
      controls[1].setValue(this.branchRoleList.items[0].value.english);
      this.updateRoles.emit({ roles: getAdminRole([AdminRoleEnum.BRANCH_ADMIN]), isValid: !this.showOnlyRoleAdmins });
    } else {
      this.isRadioDisabled = true;
      controls[1].setValue(null);
      this.updateRoles.emit({ roles: undefined, isValid: true });
    }
    controls.forEach(control => control.updateValueAndValidity());
  }

  /**
   * Method to select the role
   * @param roles
   */
  changeRoles(roles: BilingualText[]) {
    if (this.selectedRoles.length !== roles.length) {
      this.updateRoles.emit({ roles: roles, isValid: this.isRolesValid() });
      this.selectedRoles = roles;
    }
  }

  /**
   * Method to update admin role as branch or not
   * @param roleInEnglish
   */
  selectBranchAdmin(roleInEnglish: string) {
    this.selectedRoles = [];
    if (roleInEnglish === AdminRoleEnum.BRANCH_ADMIN) {
      this.hideMultiSelect = true;
      this.getFormControls()[2].clearValidators();
      this.updateRoles.emit({ roles: getAdminRole([roleInEnglish]), isValid: true });
    } else {
      this.hideMultiSelect = false;
      this.getFormControls()[2].setValidators(Validators.required);
      this.updateRoles.emit({ roles: [], isValid: false });
    }
    this.getFormControls()[2].updateValueAndValidity();
  }

  /**
   * Method to get the form controls
   * 0) If branch is selected
   * 1) Branch Admin or not
   * 3) Role admins
   */
  getFormControls(): FormControl[] {
    const form = this.branchRoleForm;
    return [
      form.get('hasRole') as FormControl,
      form.get('isBranch').get('english') as FormControl,
      form.get('roles').get('english') as FormControl
    ];
  }

  isRolesValid(): boolean {
    this.getFormControls()[2].updateValueAndValidity();
    return this.getFormControls()[2].valid;
  }
}
