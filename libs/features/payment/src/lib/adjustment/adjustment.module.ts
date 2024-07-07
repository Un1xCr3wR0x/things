import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule, IconsModule } from '@gosi-ui/foundation-theme';
import { ValidatorModule as CommonValidatorModule } from '@gosi-ui/foundation/form-fragments';
import { SharedModule } from '../shared/shared.module';

import { AdjustmentRoutingModule } from './adjustment-routing.module';
import { ADJUSTMENT_COMPONENTS } from './components';
import { MaxCharactersDirective } from './directives/max-characters.directive';
import { SadadOptionDcComponent } from './components/adjustment-payment-method-sc/sadad-option-dc/sadad-option-dc.component';
import { ModifyStopThirdPartyDcComponent } from './components/third-party-adjustment/modify-stop-third-party-dc/modify-stop-third-party-dc.component';
import { SearchResultPayeeDcComponent } from './components/third-party-adjustment/search-result-payee-dc/search-result-payee-dc.component';
import { CreateThirdPartyAdjustmentScComponent } from './components/third-party-adjustment/create-third-party-adjustment-sc/create-third-party-adjustment-sc.component';
import { ManageThirdPartyAdjustmentScComponent } from './components/third-party-adjustment/manage-third-party-adjustment-sc/manage-third-party-adjustment-sc.component';
import { AdjustmentHeirDcComponent } from './components/adjustment-heir-dc/adjustment-heir-dc.component';

@NgModule({
  declarations: [
    ...ADJUSTMENT_COMPONENTS,
    MaxCharactersDirective,
    SadadOptionDcComponent,
    ModifyStopThirdPartyDcComponent,
    SearchResultPayeeDcComponent,
    CreateThirdPartyAdjustmentScComponent,
    ManageThirdPartyAdjustmentScComponent,
    AdjustmentHeirDcComponent
  ],
  imports: [CommonModule, AdjustmentRoutingModule, ThemeModule, IconsModule, SharedModule, CommonValidatorModule]
})
export class AdjustmentModule {}
