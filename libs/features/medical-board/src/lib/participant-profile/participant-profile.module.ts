import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantProfileDcComponent } from './participant-profile-dc.component';
import { ValidatorModule, FormFragmentsModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '@gosi-ui/features/contributor/lib/shared/shared.module';
import { ParticipantProfileRoutingModule } from './participant-profile-routing.module';



@NgModule({
  declarations: [ParticipantProfileDcComponent],
  imports: [CommonModule, ValidatorModule, FormFragmentsModule, SharedModule, ParticipantProfileRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParticipantProfileModule { }
