/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  AuthTokenService,
  BPMUpdateRequest,
  BilingualText,
  DocumentItem,
  DocumentService,
  Environment,
  EnvironmentToken,
  LookupService,
  MenuService,
  RouterData,
  RouterDataToken,
  RouterService,
  Transaction,
  TransactionService,
  UuidGeneratorService,
  WorkflowService,
  getChannel,
  markFormGroupTouched
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { noop, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ContactBaseScComponent } from '../../../shared/components';
import { TransactionConstants } from '../../../shared/constants';
import { ValidatorRoutingService, ValidatorService } from '../../../shared/services';
@Component({
  selector: 'gosi-ui-appeal-sc',
  templateUrl: './appeal-sc.component.html',
  styleUrls: ['./appeal-sc.component.scss']
})
export class AppealScComponent extends ContactBaseScComponent implements OnInit {
  /**
   * local variables
   */
  isGeneralAppeal = false;
  noFilesError = false;
  modalRef: BsModalRef;
  appealForm: FormGroup;
  documentDetails: any;
  diabledUpload = false;
  stringTransactionId: string;
  transaction: Transaction;
  employeeComment: string;
  appealHeader: BilingualText;
  backPath: string;
  taskPayLoad: any;

  /**
   *
   * @param modalService
   * @param validatorService
   * @param documentService
   * @param uuidService
   * @param alertService
   * @param router
   * @param workflowService
   * @param route
   * @param routerData
   * @param appToken
   * @param routerService
   */
  constructor(
    readonly formBuilder: FormBuilder,
    readonly modalService: BsModalService,
    readonly validatorService: ValidatorService,
    readonly documentService: DocumentService,
    readonly uuidService: UuidGeneratorService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly workflowService: WorkflowService,
    public route: ActivatedRoute,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly routerService: RouterService,
    readonly lookUpService: LookupService,
    readonly validatorRoutingService: ValidatorRoutingService,
    readonly transactionService: TransactionService,
    readonly location: Location,
    readonly menuService: MenuService,
    @Inject(EnvironmentToken) readonly environment: Environment,
    readonly transactionNavigationService: TransactionService,
    readonly authTokenService: AuthTokenService
  ) {
    super(
      formBuilder,
      modalService,
      validatorService,
      documentService,
      uuidService,
      alertService,
      router,
      workflowService,
      route,
      routerData,
      appToken,
      routerService,
      lookUpService,
      validatorRoutingService,
      location,
      menuService,
      environment,
      transactionNavigationService,
      authTokenService
    );
  }

  ngOnInit(): void {
    this.transactionTraceId = this.validatorRoutingService.complaintRouterData.transactionTraceId;
    this.category = this.validatorRoutingService.complaintRouterData.requestType;
    this.assignedRole = this.validatorRoutingService.complaintRouterData.assignedRole;
    this.assigneeId = this.validatorRoutingService.complaintRouterData.assigneeId;
    this.taskId = this.validatorRoutingService.complaintRouterData.taskId;
    this.employeeComment = this.validatorRoutingService.routerData.userComment[0]?.comment;
    this.appealId = this.validatorRoutingService.routerData.idParams.get('appealId');
    this.registrationNo = this.validatorRoutingService.routerData.idParams.get('registrationNo');
    this.customerIdentifier = this.validatorRoutingService.routerData.idParams.get('userId');
    this.taskPayLoad = JSON.parse(this.validatorRoutingService.routerData.payload);
    this.getCustomerDetails(this.customerIdentifier, this.registrationNo);
    this.retrieveAppealDetails();
    this.getAppealDocuments(this.transactionTraceId);
    this.getworkflowDetails(this.transactionTraceId);
    this.appealForm = this.createAppealForm();
  }

  /**
   * Method to create Appeal form
   * @returns formGroup
   */
  createAppealForm(): FormGroup {
    return this.formBuilder.group({
      reason: [null, Validators.compose([Validators.required])],
      appealType: [null, Validators.compose([Validators.required])],
      transactionRefNumber: [null, Validators.compose([Validators.required])],
      transactionSource: [null, Validators.compose([Validators.required])],
      objector: [null, Validators.compose([Validators.required])],
      documents: [null, Validators.compose([Validators.required])],
      registrationNo: [null, Validators.compose([Validators.required])],
      edited: [true, Validators.compose([Validators.required])]
    });
  }

  /**
   * This method retrieve Appeal Details by Appeal Id
   */
  retrieveAppealDetails() {
    this.transactionService.getAppealDetailsById(this.appealId).subscribe(
      response => {
        this.appealDetails = response;
        this.documentDetails = TransactionConstants.APPEAL_DOCUMENT_DETAILS.find(
          item => item.type == this.appealDetails.type
        );
        this.stringTransactionId = this.documentDetails.transactionId;
        this.transaction = new Transaction();
        this.transaction.transactionRefNo = this.appealDetails.refNumber;
        this.transaction.status = this.appealDetails.status;
        this.transaction.title = this.appealDetails.title;
        this.transaction.channel = getChannel(this.taskPayLoad.sourceChannel);
        this.appealHeader = this.appealDetails.title;
        this.setUpAppealForm();
      },
      err => {
        this.alertService.showError(err.error.message);
      },
      () => {}
    );
  }

  /**
   * Method to set up the appeal form's required values
   */
  setUpAppealForm() {
    this.appealForm.controls.appealType.setValue(this.appealDetails?.type); // This value is  for Appeal transaction
    this.appealForm.controls.transactionSource.setValue(this.appealDetails.transactionSource.english);
    this.appealForm.controls.transactionRefNumber.setValue(this.transactionTraceId);
    this.appealForm.controls.objector.setValue(this.customerIdentifier);
    this.appealForm.controls.registrationNo.setValue(this.registrationNo);
    this.appealDetails ? this.appealForm.controls.reason.setValue(this.appealDetails?.reason) : '';
  }

  /**
   * Method that gets triggered if any change happens to the files uploadEvent
   */
  uploadEvent(flag: boolean) {
    if (this.documents.length > 0 && this.documents[this.documents.length - 1].documentContent != null) {
      this.diabledUpload = false;
    }
  }

  /**
   * Metod to emit the delete document
   */
  deleteDocument(document: DocumentItem) {
    this.documents = this.documents.filter(item => item.contentId !== document.contentId);
    this.documents.length == 0 ? this.addAnotherDocument() : '';
  }

  /**
   * Method to add another document to this list of documents
   */
  addAnotherDocument() {
    this.sequenceNumber = this.documents.length + 1;
    let documentItem = new DocumentItem();
    documentItem.uuid = this.uuid;
    documentItem.sequenceNumber = this.sequenceNumber;
    documentItem.transactionId = this.documentDetails.transactionId.toString();
    documentItem.documentTypeId = this.documentDetails.documentType;
    documentItem.name = { arabic: '', english: this.documentDetails.docTitle };
    documentItem.required = true;
    this.stringTransactionId = documentItem.transactionId;
    this.documents.push(documentItem);
    this.noFilesError = false;
    this.documents.length = this.documents.length;
    if (this.documents.length > 0 && !this.documents[this.documents.length - 1].documentContent) {
      this.diabledUpload = true;
    }
  }

  /**
   * This method is to perform cleanup activities when an instance of component is destroyed.
   */
  ngOnDestroy() {
    this.validatorRoutingService.setRouterToken();
    this.alertService.clearAlerts();
    super.ngOnDestroy();
  }

  /**
   * Method of cancel template
   */
  onCancel(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }

  /**
   * Method to cancel the process of raising the Appeal
   */
  confirmGeneralCancel() {
    this.alertService.clearAlerts();
    this.modalRef?.hide();
    this.location.back();
  }

  /**
   * Method to hide modal
   */
  decline() {
    this.modalRef.hide();
  }

  /**
   * This method resubmit appeals that were retrned by establishment-private (gosi employee)
   */

  returnAppeal() {
    let documentContentsList = this.documents.map(item => item.contentId);
    this.appealForm.controls.documents.setValue(documentContentsList);

    if (this.appealForm.valid && documentContentsList[0] != null) {
      this.transactionService.returnAppeal(this.appealForm.value, this.appealId).subscribe(
        response => {
          this.saveWorkflow();
        },
        err => {
          this.alertService.showError(err.error.message);
        },
        () => {}
      );
    } else if (!this.appealForm.valid && documentContentsList[0] != null) {
      markFormGroupTouched(this.appealForm);
      this.alertService.showMandatoryErrorMessage();
    } else {
      markFormGroupTouched(this.appealForm);
      this.noFilesError = true;
      this.alertService.showMandatoryErrorMessage();
    }
  }

  /**
   * This method updates the BPM workflow by returning appeal from the user to GOSI Employee
   */
  saveWorkflow() {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.taskId = this.taskId;
    bpmUpdateRequest.user = this.assigneeId;
    bpmUpdateRequest.outcome = this.validatorRoutingService.complaintRouterData.customActions[0];

    this.workflowService
      .updateTaskWorkflow(bpmUpdateRequest)
      .pipe(
        tap(() => {
          this.alertService.showSuccessByKey('COMPLAINTS.SUCCESS-RETURN-MSG');
          setTimeout(() => this.location.back(), 2000);
        }),
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  navigateToTransaction() {
    if (this.appealDetails) {
      const transaction = new Transaction();
      transaction.transactionId = this.appealDetails?.againstTransactionId;
      transaction.status = this.appealDetails?.status;
      transaction.transactionRefNo = this.appealDetails?.transactionRefNumber;
      this.onNavigateToTransaction(transaction);
    }
  }
}
