import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressModule, ContactModule, ValidatorModule } from '@gosi-ui/foundation/form-fragments';
import { FormsRoutingModule } from './forms-routing.module';
import { FormsDcComponent } from './forms-dc.component';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { COMPONENTS } from './components';

@NgModule({
  declarations: [FormsDcComponent, ...COMPONENTS],
  imports: [CommonModule, FormsRoutingModule, ThemeModule, ContactModule, AddressModule, ValidatorModule]
})
export class FormsModule {}
