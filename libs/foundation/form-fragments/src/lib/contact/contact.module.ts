import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactDcComponent } from './contact-dc/contact-dc.component';
import { FormFragmentsModule } from '../form-fragments.module';
import { ViewContactDcComponent } from './view-contact-dc/view-contact-dc.component';
@NgModule({
  declarations: [ContactDcComponent, ViewContactDcComponent],
  imports: [CommonModule, FormFragmentsModule],
  exports: [ContactDcComponent, ViewContactDcComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContactModule {}
