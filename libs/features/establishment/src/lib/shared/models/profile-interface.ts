import { TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Alert, Establishment, EstablishmentProfile, MainEstablishmentInfo } from '@gosi-ui/core';
import { EstablishmentWorkFlowStatus } from './establishment-workflow-status';

export interface IEstablishmentProfile {
  workflowsInProgress: EstablishmentWorkFlowStatus[];
  establishment: Establishment;
  isMainRegistered: boolean;
  hasDifferentLE: boolean;
  router: Router;
  editWarningHeading: string;
  editWarningMsg: Alert[];
  establishmentTranslateModule: string;
  mainEstablishment: MainEstablishmentInfo;
  establishmentProfile: EstablishmentProfile;
  draftTransaction: EstablishmentWorkFlowStatus;
  isAppPrivate: boolean;
  showModal(template: TemplateRef<HTMLElement>, size: string, hasBackDrop: boolean);
  showMedModal(template: TemplateRef<HTMLElement>, hasBackDrop?: boolean);
}
