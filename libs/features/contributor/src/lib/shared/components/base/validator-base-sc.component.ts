/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Directive, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  BaseComponent,
  Channel,
  DocumentItem,
  DocumentService,
  EstablishmentStatusEnum,
  LookupService,
  LovList,
  RouterConstants,
  RouterData,
  TransactionReferenceData,
  WorkFlowActions,
  WorkflowService,
  getPersonNameAsBilingual
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, noop, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ValidatorRoles } from '../../enums';
import { Contributor, ContributorBPMRequest, Establishment, SystemParameter } from '../../models';
import { ContributorService, EstablishmentService } from '../../services';

@Directive()
export class ValidatorBaseScComponent extends BaseComponent {
  /** Local variables */
  canEdit: boolean;
  canReject: boolean;
  canReturn: boolean;
  isReturnToAdmin: boolean;
  registrationNo: number;
  socialInsuranceNo: number;
  resourceType: string;
  engagementId: number;
  referenceNo: number;
  personId: Number;
  comments: TransactionReferenceData[];
  documents: DocumentItem[];
  modalRef: BsModalRef;
  validatorForm: FormGroup = new FormGroup({});
  isBeneficiary: boolean;
  channel: string;
  systemParams: SystemParameter;
  isBillBatch = false;
  titleEnglish: string;
  titleEnglishRegVic: string = 'Register VIC';
  titleArabic: string;

  establishment: Establishment;
  contributor: Contributor;
  age: number;
  isModifyCoverage = false;
  backDatedValidator: boolean;

  /** Observables */
  rejectReasonList$: Observable<LovList>;
  returnReasonList$: Observable<LovList>;
  reInspectionFlag: boolean;
  disableIconReopen: boolean;
  rasedWageUpdate: boolean = false;
  isPPA = false;
  customActions: any;

  /** Creates an instance of ValidatorBaseScComponent. */
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    readonly router: Router
  ) {
    super();
  }

  /**
   * Method to read data from token.
   * @param token token
   */
  readDataFromToken(token: RouterData) {
    if (token.payload) {
      const payload = JSON.parse(token.payload);
      if (payload.registrationNo) this.registrationNo = payload.registrationNo;
      if (payload.socialInsuranceNo) this.socialInsuranceNo = payload.socialInsuranceNo;
      if (payload.resource) this.resourceType = payload.resource;
      if (payload.engagementId) this.engagementId = payload.engagementId;
      if (payload.referenceNo) this.referenceNo = payload.referenceNo;
      if (payload.channel) this.channel = payload.channel;
      if (payload.titleEnglish) this.titleEnglish = payload.titleEnglish;
      if (payload.titleArabic) this.titleArabic = payload.titleArabic;
      if (payload.reInspectionFlag)
        this.reInspectionFlag = payload?.reInspectionFlag === 'NULL' ? null : payload?.reInspectionFlag;
      if (payload.rasedWageUpdate)
        this.rasedWageUpdate = payload?.rasedWageUpdate === 'NULL' ? null : payload?.rasedWageUpdate;
      if (payload.resource) {
        if (payload.resource === RouterConstants.TRANSACTION_MODIFY_COVERAGE) this.isModifyCoverage = true;
      }
    }
    this.customActions = token?.customActions;
    this.comments = token.comments;
  }

  /**
   * Method to set flags for view.
   * @param token token
   */
  setFlagsForView(token: RouterData) {
    if (token) {
      if (
        (token.assignedRole === ValidatorRoles.VALIDATOR_ONE || token.assignedRole === ValidatorRoles.VALIDATOR) &&
        this.channel === Channel.GOSI_ONLINE
      ) {
        //In case of transaction from gosi online or gosi website
        this.canEdit = false;
        this.canReject = true;
        this.canReturn = true;
        this.isReturnToAdmin = true;
      } else if (token.assignedRole === ValidatorRoles.VALIDATOR && this.channel === Channel.TAMINATY) {
        this.canEdit = false;
        this.canReject = true;
        this.canReturn = false;
      } else if (
        token.assignedRole === ValidatorRoles.VALIDATOR_ONE &&
        this.titleEnglishRegVic === this.titleEnglish &&
        (this.channel === Channel.TAMINATY ||
          this.channel === Channel.TAMINATY_VALUE ||
          this.channel == Channel.INDIVIDUAL)
      ) {
        this.canEdit = false;
        this.canReject = true;
      } else if (token.assignedRole === ValidatorRoles.VALIDATOR_ONE) {
        this.canReturn = false;
        //For PPA,secondment and studyleave the edit option should be disabled
        this.canEdit =
          this.resourceType === 'Register study leave' || this.resourceType === 'Register Secondment' ? false : true;
        this.canReject = true;
      } else if (token.assignedRole === ValidatorRoles.VALIDATOR_TWO) {
        this.canEdit = false;
        this.canReject = true;
        this.canReturn = true;
      } else if (
        token.assignedRole === ValidatorRoles.BACKDATED_ENGAGEMENT_VALIDATOR &&
        this.channel === Channel.GOSI_ONLINE
      ) {
        this.canEdit = false;
        this.canReject = true;
        this.canReturn = false;
        if (
          this.channel === Channel.GOSI_ONLINE &&
          token.assignedRole === ValidatorRoles.BACKDATED_ENGAGEMENT_VALIDATOR
        ) {
          this.backDatedValidator = true;
        }
      } else if (
        token.assignedRole === ValidatorRoles.FC_VALIDATOR ||
        token.assignedRole === ValidatorRoles.VALIDATOR_FC //todo remove this role on bpm change and from the roles file as well
      ) {
        this.canReturn = true;
        this.canEdit = false;
        this.canReject = false;
      } else if (this.channel === Channel.HRSD || this.channel === Channel.MASAR || this.channel === Channel.AJEER) {
        this.canReturn = false;
        this.canEdit = false;
        this.canReject = true;
      } else if (
        token.assignedRole === ValidatorRoles.BENEFICIARY_HEAD ||
        token.assignedRole === ValidatorRoles.GOVERNOR
      ) {
        this.canReturn = true;
      }
    }
  }

  /** Method to get lookup values for component. */
  getDefaultLookupValues() {
    this.rejectReasonList$ = this.lookupService.getEstablishmentRejectReasonList();
    this.returnReasonList$ = this.lookupService.getRegistrationReturnReasonList();
  }

  /** Method to get basic details. */
  getBasicDetails(options?: Map<string, boolean>) {
    return this.establishmentService.getEstablishmentDetails(this.registrationNo).pipe(
      tap(
        res => (
          (this.establishment = res),
          (this.disableIconReopen =
            this.establishmentService.getEstablishmentStatus.english ===
            EstablishmentStatusEnum.REOPEN_CLOSING_IN_PROGRESS),
          (this.isPPA = res?.ppaEstablishment)
        )
      ),
      switchMap(() => {
        return this.contributorService.getContributor(this.registrationNo, this.socialInsuranceNo, options).pipe(
          tap(res => {
            this.contributor = res;
            this.isBeneficiary = this.contributor.isBeneficiary;
            this.age = moment(new Date()).diff(moment(this.contributor.person.birthDate.gregorian), 'year');
          })
        );
      })
    );
  }

  /** Method to get documents for the transaction. */
  getDocuments(
    transactionId: string,
    transactionType: string | string[],
    identifier: number,
    referenceNo: number
  ): Observable<DocumentItem[]> {
    return this.documentService.getDocuments(transactionId, transactionType, identifier, referenceNo).pipe(
      tap(res => {
        this.documents = res.filter(item => item.documentContent !== null);
      })
    );
  }

  getAllDocuments(referenceNo: number): Observable<DocumentItem[]> {
    return this.documentService.getAllDocuments(null, referenceNo).pipe(
      tap(res => {
        this.documents = res.filter(item => item.documentContent !== null);
      })
    );
  }
  /** Method to navigate to inbox on error during view initialization. */
  handleError(error, flag: boolean): void {
    this.alertService.showError(error.error.message);
    if (flag) this.navigateToInbox();
  }

  /**
   * This method is to show the modal reference.
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, isAutoSize = false, disableEsc = false): void {
    const style = isAutoSize ? '' : 'modal-lg ';
    this.modalRef = this.modalService.show(templateRef, {
      class: style + 'modal-dialog-centered',
      backdrop: true,
      ignoreBackdropClick: true,
      keyboard: !disableEsc
    });
  }

  /** This method is to hide the modal reference. */
  hideModal(): void {
    this.modalRef.hide();
  }

  /** Method to navigate to inbox. */
  navigateToInbox(): void {
    this.modalRef?.hide();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  /** Method to get workflow action. */
  getWorkflowAction(key: number): string {
    let action: string;
    switch (key) {
      case 0:
        action = WorkFlowActions.APPROVE;
        break;
      case 1:
        action = WorkFlowActions.REJECT;
        break;
      case 2:
        action = WorkFlowActions.RETURN;
        break;
    }
    return action;
  }

  /** Method to set workflow details. */
  setWorkflowData(routerData: RouterData, action: string): ContributorBPMRequest {
    const data = new ContributorBPMRequest();
    if (this.validatorForm.get('rejectionReason'))
      data.rejectionReason = this.validatorForm.get('rejectionReason').value;
    if (this.validatorForm.get('comments')) data.comments = this.validatorForm.get('comments').value;
    if (this.validatorForm.get('returnReason')) data.returnReason = this.validatorForm.get('returnReason').value;
    if (this.validatorForm.get('penalty')) {
      if (this.validatorForm.get('penalty.english').value === 'No') data.penaltyIndicator = 0;
      else data.penaltyIndicator = 1;
    }
    data.taskId = routerData.taskId;
    data.user = routerData.assigneeId;
    data.outcome = action;
    data.isExternalComment =
      (this.channel === Channel.GOSI_ONLINE && routerData.assignedRole === ValidatorRoles.VALIDATOR) ||
      (routerData.assignedRole === ValidatorRoles.VALIDATOR_ONE && this.channel === Channel.TAMINATY);
    return data;
  }

  /**
   * Method to save workflow details.
   * @param data workflow data
   */
  saveWorkflow(data: ContributorBPMRequest): void {
    this.workflowService
      .updateTaskWorkflow(data)
      .pipe(
        tap(() => {
          this.alertService.showSuccessByKey(this.getSuccessMessage(data.outcome));
          this.navigateToInbox();
        }),
        catchError(err => {
          this.handleError(err, false);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to get success message. */
  getSuccessMessage(outcome: string) {
    let messageKey: string;
    switch (outcome) {
      case WorkFlowActions.APPROVE:
        messageKey = 'CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-APPROVAL-MESSAGE';
        break;
      case WorkFlowActions.REJECT:
        messageKey = 'CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-REJECTION-MESSAGE';
        break;
      case WorkFlowActions.RETURN:
        messageKey = 'CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-RETURN-MESSAGE';
        break;
      case WorkFlowActions.UPDATE:
        messageKey = 'CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-APPROVAL-MESSAGE';
        break;
      case WorkFlowActions.APPROVE_WITH_DOCS:
        messageKey = 'CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-APPROVAL-MESSAGE';
        break;
    }
    return messageKey;
  }

  /** Method to initiate inspection. */
  initiateInspection(routerData: RouterData, messageKey: string) {
    this.workflowService
      .updateTaskWorkflow(this.setWorkflowData(routerData, WorkFlowActions.SEND_FOR_INSPECTION))
      .subscribe(
        () => {
          this.alertService.showSuccessByKey(messageKey, {
            personFullName: this.getPersonName(),
            transactionId: this.referenceNo
          });
          this.navigateToInbox();
        },
        err => this.handleError(err, false)
      );
  }

  /** Method to get person name. */
  getPersonName() {
    const personName = getPersonNameAsBilingual(this.contributor.person.name);
    if (!personName.english) personName.english = personName.arabic;
    return personName;
  }
  /** Method to get system parameters. */
  getSystemParameters() {
    this.contributorService.getSystemParams().subscribe(res => {
      this.systemParams = new SystemParameter().fromJsonToObject(res);
      if (this.systemParams.BILL_BATCH_INDICATOR === 1) {
        // this.alertService.setInfoByKey('CONTRIBUTOR.SERVICE-MAINTANACE');
        this.isBillBatch = true;
      }
    });
  }
}
