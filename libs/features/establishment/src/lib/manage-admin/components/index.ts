/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AddAdminScComponent } from './add-admin-sc/add-admin-sc.component';
import { AdminFilterDcComponent } from './admin-filter-dc/admin-filter-dc.component';
import { AdminListDcComponent } from './admin-list-dc/admin-list-dc.component';
import { AdminScComponent } from './admin-sc/admin-sc.component';
import { AdministratingBranchItemDcComponent } from './administrating-branch-item-dc/administrating-branch-item-dc.component';
import { AdministratingBranchesDcComponent } from './administrating-branches-dc/administrating-branches-dc.component';
import { BranchRoleHeadingDcComponent } from './branch-role-heading-dc/branch-role-heading-dc.component';
import { BranchRoleMappingDcComponent } from './branch-role-mapping-dc/branch-role-mapping-dc.component';
import { DeleteAdminModalDcComponent } from './delete-admin-modal-dc/delete-admin-modal-dc.component';
import { ModifyAdminModalDcComponent } from './modify-admin-modal-dc/modify-admin-modal-dc.component';
import { RegisterSuperAdminScComponent } from './register-super-admin-sc/register-super-admin-sc.component';
import { ReplaceAdminInfoDcComponent } from './replace-admin-info-dc/replace-admin-info-dc.component';
import { ReplaceAdminScComponent } from './replace-admin-sc/replace-admin-sc.component';
import { ReplaceSuperAdminScComponent } from './replace-super-admin-sc/replace-super-admin-sc.component';
import { UpdateAdminScComponent } from './update-admin-sc/update-admin-sc.component';
import { UpdateMissingDetailsScComponent } from './update-missing-details-sc/update-missing-details-sc.component';

export const ADMIN_COMPONENTS = [
  AdminScComponent,
  AddAdminScComponent,
  AdministratingBranchesDcComponent,
  AdministratingBranchItemDcComponent,
  AdminListDcComponent,
  ModifyAdminModalDcComponent,
  BranchRoleHeadingDcComponent,
  DeleteAdminModalDcComponent,
  ReplaceSuperAdminScComponent,
  BranchRoleMappingDcComponent,
  ReplaceAdminScComponent,
  ReplaceAdminInfoDcComponent,
  UpdateAdminScComponent,
  RegisterSuperAdminScComponent,
  AdminFilterDcComponent,
  UpdateMissingDetailsScComponent
];

export * from './add-admin-sc/add-admin-sc.component';
export * from './admin-filter-dc/admin-filter-dc.component';
export * from './admin-list-dc/admin-list-dc.component';
export * from './admin-sc/admin-sc.component';
export * from './administrating-branch-item-dc/administrating-branch-item-dc.component';
export * from './administrating-branches-dc/administrating-branches-dc.component';
export * from './branch-role-mapping-dc/branch-role-mapping-dc.component';
export * from './delete-admin-modal-dc/delete-admin-modal-dc.component';
export * from './modify-admin-modal-dc/modify-admin-modal-dc.component';
export * from './replace-admin-info-dc/replace-admin-info-dc.component';
export * from './replace-admin-sc/replace-admin-sc.component';
export * from './replace-super-admin-sc/replace-super-admin-sc.component';
export * from './update-admin-sc/update-admin-sc.component';
export * from './update-missing-details-sc/update-missing-details-sc.component';
