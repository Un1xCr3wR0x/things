import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, ApplicationTypeToken, DocumentService, LookupService, RouterData, RouterDataToken, TransactionService, WorkflowService } from '@gosi-ui/core';
import { AppealService } from '@gosi-ui/features/appeals';
import { VlidatorBaseScComponent } from '@gosi-ui/features/appeals/lib/shared/components/base';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'appeals-validate-appeal-sc',
  templateUrl: './validate-appeal-sc.component.html',
  styleUrls: ['./validate-appeal-sc.component.scss']
})
export class ValidateAppealScComponent extends VlidatorBaseScComponent implements OnInit {

/**
   *
   * @param modalService
   * @param alertService
   * @param workflowService
   * @param router
   * @param lookupService
   * @param documentService
   * @param routerDataToken
   */
constructor(
  readonly modalService: BsModalService,
  readonly alertService: AlertService,
  readonly workflowService: WorkflowService,
  readonly router: Router,
  readonly lookupService: LookupService,
  readonly documentService: DocumentService,
  readonly transactionService: TransactionService,
  @Inject(RouterDataToken) readonly routerDataToken: RouterData,
  @Inject(ApplicationTypeToken) readonly appTokenValue: string,
  readonly fb: FormBuilder,
  readonly validatorService: AppealService,
) {
  super(
    lookupService,
    documentService,
    alertService,
    workflowService,
    modalService,
    validatorService,
    router,
    routerDataToken,
    appTokenValue
  );
}

/**
 * Method to initialise tasks
 */
  ngOnInit(): void {
  this.initialiseParams();
  this.alertService.clearAlerts();
}
initialiseParams() {
  if(this.routerDataToken.taskId === undefined || this.routerDataToken.taskId === null ){this.routeToInbox();}
  super.getDataFromToken(this.routerDataToken);
  // super.getPersonDetails();
  // super.getAppealDataService();
}


}
