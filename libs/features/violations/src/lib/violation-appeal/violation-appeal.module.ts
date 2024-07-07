import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {FormFragmentsModule, ValidatorModule} from '@gosi-ui/foundation/form-fragments';
import {SharedModule} from '../shared';
import {VIOLATION_APPEAL} from "./components";
import {ViolationAppealRoutingModule} from "./violation-appeal-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {ThemeModule} from "@gosi-ui/foundation-theme";

@NgModule({
  declarations: [...VIOLATION_APPEAL],
  imports: [CommonModule, ValidatorModule, ThemeModule, ReactiveFormsModule, FormFragmentsModule, SharedModule, ViolationAppealRoutingModule]
})


export class ViolationAppealModule {
}
