import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressModule, ContactModule } from '@gosi-ui/foundation/form-fragments';
import { ContributorProfileRoutingModule } from './contributor-profile-routing.module';
import { SharedModule } from '../shared';
import { MY_PROFILE_COMPONENTS } from './components';
import { ThemeModule } from '@gosi-ui/foundation-theme';

@NgModule({
  declarations: [MY_PROFILE_COMPONENTS],
  imports: [CommonModule, SharedModule, ThemeModule, ContributorProfileRoutingModule, AddressModule, ContactModule]
})
export class ContributorProfileModule {}
