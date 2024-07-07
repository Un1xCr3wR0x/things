import { CUSTOM_ELEMENTS_SCHEMA,NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DISEASE_ASSESMENT_COMPONENTS } from '.';
import { SharedModule } from '../shared/shared.module';
import { IconsModule, ThemeModule } from '@gosi-ui/foundation-theme';
import { DiseaseAssesmentRoutingModule } from './disease-assesment-routing.module';


@NgModule({
  declarations: [...DISEASE_ASSESMENT_COMPONENTS],
  imports: [
    CommonModule, SharedModule, IconsModule, ThemeModule,DiseaseAssesmentRoutingModule  ],
    exports: [...DISEASE_ASSESMENT_COMPONENTS],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DiseaseAssesmentModule { }
