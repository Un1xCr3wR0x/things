import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidatorModule } from '../validator';
import {COMMITMENT_INDICATOR_COMPONENTS} from './components'
import {CommitmentIndicatorRoutingModule} from './commitment-indicator-routing.module'
import { CommitmentIndicatorsDcComponent } from './commitment-indicators-dc.component';
import { FormFragmentsModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared';
@NgModule({
  declarations: [CommitmentIndicatorsDcComponent, ...COMMITMENT_INDICATOR_COMPONENTS],
  imports: [CommonModule , CommitmentIndicatorRoutingModule , FormFragmentsModule ]
})
export class CommitmentIndicatorModule { }
