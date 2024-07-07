/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BilingualText, CommonIdentity, GenderEnum, getIdentityByType } from '@gosi-ui/core';
import { Admin } from '../../../shared';

@Component({
  selector: 'est-delete-admin-modal-dc',
  templateUrl: './delete-admin-modal-dc.component.html',
  styleUrls: ['./delete-admin-modal-dc.component.scss']
})
export class DeleteAdminModalDcComponent implements OnInit, OnChanges {
  role: BilingualText = new BilingualText();
  identifier: CommonIdentity;

  constructor() {}
  femaleGender = GenderEnum.FEMALE;
  @Input() admin: Admin = new Admin();
  @Output() onConfirm = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  ngOnInit(): void {
    this.bindRolesAndIdentifier();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.admin && !changes.admin.firstChange) {
      this.bindRolesAndIdentifier();
    }
  }

  bindRolesAndIdentifier() {
    const roles = this.admin.roles as BilingualText[];
    this.role.english = roles?.map(role => role.english).join(',');
    this.role.arabic = roles?.map(role => role.arabic).join(',');
    this.identifier = getIdentityByType(this.admin.person.identity, this.admin.person.nationality.english);
    this.identifier.idType = 'ESTABLISHMENT.' + this.identifier.idType;
  }

  confirm() {
    this.onConfirm.emit();
  }

  decline() {
    this.onCancel.emit();
  }
}
