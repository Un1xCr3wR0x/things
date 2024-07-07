/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

// TODO: Add disclaimer and comments
import { AddressDcComponent } from './address-dc/address-dc.component';
import { AddressItemDcComponent } from './address-item-dc/address-item-dc.component';
import { NationalAddressDcComponent } from './national-address-dc/national-address-dc.component';
import { OverseasAddressDcComponent } from './overseas-address-dc/overseas-address-dc.component';
import { PoAddressDcComponent } from './po-address-dc/po-address-dc.component';

export const ADDRESS_COMPONENTS = [
  PoAddressDcComponent,
  NationalAddressDcComponent,
  AddressDcComponent,
  OverseasAddressDcComponent,
  AddressItemDcComponent
];

export * from './address-dc/address-dc.component';
export * from './address-item-dc/address-item-dc.component';
export * from './national-address-dc/national-address-dc.component';
export * from './overseas-address-dc/overseas-address-dc.component';
export * from './po-address-dc/po-address-dc.component';
