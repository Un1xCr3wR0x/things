import { TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Alert } from '@gosi-ui/core';
import { EstablishmentWorkFlowStatus } from './establishment-workflow-status';
export interface IMofPayment {
  editWarningMsg: Alert[];
  router: Router;
  draftTransaction: EstablishmentWorkFlowStatus;
  showMedModal(template: TemplateRef<HTMLElement>, hasBackDrop?: boolean);
  goToMofTransaction();
  showModal(template: TemplateRef<HTMLElement>, size: string, hasBackDrop: boolean);
}
