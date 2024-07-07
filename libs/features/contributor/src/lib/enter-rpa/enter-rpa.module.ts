import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { SharedModule } from '../shared/shared.module';
import { EnterRpaRoutingModule } from "./enter-rpa-routing.module";
import { ENTER_RPA_COMPONENTS } from "./components";
import { EnterRpaDcComponent } from "./enter-rpa-dc.component";

@NgModule({
    declarations: [ EnterRpaDcComponent ,ENTER_RPA_COMPONENTS ],
    imports: [CommonModule, EnterRpaRoutingModule, SharedModule],
    exports: [ENTER_RPA_COMPONENTS],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  
  export class EnterRpaModule {}