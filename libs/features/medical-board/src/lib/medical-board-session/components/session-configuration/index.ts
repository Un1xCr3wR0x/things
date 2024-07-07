import { SessionConfigurationScComponent } from './session-configuration-sc/session-configuration-sc.component';
import { SessionConfigurationDetailsScComponent } from './session-configuration-details-sc/session-configuration-details-sc.component';
import { ConfigurationListDcComponent } from './configuration-list-dc/configuration-list-dc.component';
import { StopSessionModalDcComponent } from './stop-session-modal-dc/stop-session-modal-dc.component';
import { HoldSessionModalDcComponent } from './hold-session-modal-dc/hold-session-modal-dc.component';

export const SESSION_CONFIGURATION_COMPONENTS = [
  SessionConfigurationScComponent,
  SessionConfigurationDetailsScComponent,
  ConfigurationListDcComponent,
  StopSessionModalDcComponent,
  HoldSessionModalDcComponent
];

export * from './session-configuration-sc/session-configuration-sc.component';
export * from './session-configuration-details-sc/session-configuration-details-sc.component';
export * from './configuration-list-dc/configuration-list-dc.component';
export * from './stop-session-modal-dc/stop-session-modal-dc.component';
export * from './hold-session-modal-dc/hold-session-modal-dc.component';
