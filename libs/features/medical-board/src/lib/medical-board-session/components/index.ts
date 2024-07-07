import { MedicalBoardSessionScComponent } from './medical-board-session-sc/medical-board-session-sc.component';
import { CreateRegularSessionScComponent } from './create-regular-session-sc/create-regular-session-sc.component';
import { CreateAdhocSessionScComponent } from './create-adhoc-session-sc/create-adhoc-session-sc.component';
import { SESSION_SHARED_COMPONENTS } from './shared';
import { SCHEDULED_SESSION_COMPONENTS } from './scheduled-session';
import { SESSION_CONFIGURATION_COMPONENTS } from './session-configuration';

export const MEDICAL_BOARD_SESSION_COMPONENTS = [
  MedicalBoardSessionScComponent,
  CreateRegularSessionScComponent,
  CreateAdhocSessionScComponent,
  SESSION_SHARED_COMPONENTS,
  SCHEDULED_SESSION_COMPONENTS,
  SESSION_CONFIGURATION_COMPONENTS
];

export * from './medical-board-session-sc/medical-board-session-sc.component';
export * from './create-regular-session-sc/create-regular-session-sc.component';
export * from './create-adhoc-session-sc/create-adhoc-session-sc.component';
export * from './shared';
export * from './scheduled-session';
export * from './session-configuration';
