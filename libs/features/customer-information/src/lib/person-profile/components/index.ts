/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AddBorderDcComponent } from './add-border-dc/add-border-dc.component';
import { AddBorderScComponent } from './add-border-sc/add-border-sc.component';
import { AddIqamaDcComponent } from './add-iqama-dc/add-iqama-dc.component';
import { AddIqamaScComponent } from './add-iqama-sc/add-iqama-sc.component';
import { AddNinDcComponent } from './add-nin-dc/add-nin-dc.component';
import { AddNinScComponent } from './add-nin-sc/add-nin-sc.component';
import { AddPassportDcComponent } from './add-passport-dc/add-passport-dc.component';
import { AddPassportScComponent } from './add-passport-sc/add-passport-sc.component';
import { MainContentDcComponent } from './main-content-dc/main-content-dc.component';
import { PersonProfileScComponent } from './person-profile-sc/person-profile-sc.component';
import { UpdateAddressScComponent } from './update-address-sc/update-address-sc.component';

export const PERSON_PROFILE_COMPONENTS = [
  AddBorderDcComponent,
  AddIqamaDcComponent,
  AddPassportDcComponent,
  AddPassportScComponent,
  PersonProfileScComponent,
  AddIqamaScComponent,
  AddBorderScComponent,
  MainContentDcComponent,
  UpdateAddressScComponent,
  AddNinDcComponent,
  AddNinScComponent
];

export * from './add-border-dc/add-border-dc.component';
export * from './add-border-sc/add-border-sc.component';
export * from './add-iqama-dc/add-iqama-dc.component';
export * from './add-iqama-sc/add-iqama-sc.component';
export * from './add-passport-sc/add-passport-sc.component';
export * from './add-passport-dc/add-passport-dc.component';
export * from './main-content-dc/main-content-dc.component';
export * from './person-profile-sc/person-profile-sc.component';
export * from './update-address-sc/update-address-sc.component';
export * from './add-nin-dc/add-nin-dc.component';
export * from './add-nin-sc/add-nin-sc.component';

