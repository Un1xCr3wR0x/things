import { TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Alert } from '@gosi-ui/core';
import { EstablishmentWorkFlowStatus } from './establishment-workflow-status';
export interface IProfileAndGroup {
  draftTransaction: EstablishmentWorkFlowStatus;
  router: Router;
  editWarningHeading: string;
  editWarningMsg: Alert[];
  showModal(template: TemplateRef<HTMLElement>, size: string, hasBackDrop: boolean);
  showMedModal(template: TemplateRef<HTMLElement>, hasBackDrop?: boolean);
}
