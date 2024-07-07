import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MEDICAL_BOARD_ASSESSMENTS_COMPONENTS, ViewAssessmentDetailsDcComponent } from './components';
import { SharedModule } from '../shared/shared.module';
import { FormFragmentsModule } from '@gosi-ui/foundation/form-fragments';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { MedicalBoardAssessmentsRoutingModule } from './medical-board-assessments-routing.module';
import { MedicalBoardAssessmentsHeadingDcComponent } from './components/medical-board-assessments-heading-dc/medical-board-assessments-heading-dc.component';
import { MedicalBoardAssessmentsDcComponent } from './medical-board-assessments-dc.component';
import { MedicalBoardAssessmentsFilterDcComponent } from './components/medical-board-assessments-filter-dc/medical-board-assessments-filter-dc.component';
import { AssessmentsDirectionSortDcComponent } from './components/assessments-direction-sort-dc/assessments-direction-sort-dc.component';

@NgModule({
  declarations: [MedicalBoardAssessmentsDcComponent, ...MEDICAL_BOARD_ASSESSMENTS_COMPONENTS],
  imports: [CommonModule, SharedModule, FormFragmentsModule, ThemeModule, MedicalBoardAssessmentsRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [MEDICAL_BOARD_ASSESSMENTS_COMPONENTS]
})
export class MedicalBoardAssessmentsModule {}
