import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  Channel,
  DocumentService,
  InspectionReferenceType,
  InspectionService,
  InspectionStatus,
  InspectionTypeEnum,
  LookupService,
  LovList,
  RouterData,
  RouterDataToken,
  TransactionService,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, noop, of, throwError } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';
import {
  ContributorBPMRequest,
  ContributorConstants,
  DocumentTransactionId,
  DocumentTransactionType,
  UpdatedWageDetails,
  ValidatorRoles,
  YesOrNo
} from '../../../shared';
import {
  ContractAuthenticationService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../shared/services';
import { TransactionBaseScComponent } from '../shared/base/transaction-base-sc/transaction-base-sc.component';

@Component({
  selector: 'cnt-change-engagement-sc',
  templateUrl: './change-engagement-sc.component.html',
  styleUrls: ['./change-engagement-sc.component.scss']
})
export class ChangeEngagementScComponent extends TransactionBaseScComponent implements OnInit {
  /** Local variables */
  engagement: UpdatedWageDetails;
  transactionTypes: string[] = [];
  canEditPenalty = false;
  canRequestInspection = false;
  hasInspectionCompleted = false;
  fieldActivityNo: string;
  engagementDetails;

  isModifyCoverage = false;
  validatorForm: FormGroup = new FormGroup({});
  isPrivate: boolean;

  /** Observables */
  yesOrNoList: Observable<LovList>;

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly inspectionService: InspectionService,
    readonly manageWageService: ManageWageService,
    readonly workflowService: WorkflowService,
    readonly engagementService: EngagementService,
    readonly contractService: ContractAuthenticationService,
    readonly fb: FormBuilder,
    readonly router: Router,
    readonly transactionService: TransactionService,

    @Inject(RouterDataToken) private routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(
      contributorService,
      establishmentService,
      engagementService,
      lookupService,
      documentService,
      transactionService,
      alertService,
      router
    );
  }

  ngOnInit(): void {
    this.isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    super.getTransactionDetails();
    this.getDataForView();
    this.getLookupValues();
  }
  getLookupValues() {
    this.yesOrNoList = this.lookupService.getYesOrNoList();
  }

  /** Method to retrieve data for validator view. */

  getDataForView() {
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId) {
      super.getBasicDetails(new Map().set('checkBeneficiaryStatus', true)).subscribe(
        () => {
          let serviceCall;
          if (!this.isModifyCoverage) {
            serviceCall = this.manageWageService.getEngagementInWorkflow(
              this.registrationNo,
              this.socialInsuranceNo,
              this.engagementId,
              this.referenceNo
            );
          } else {
            serviceCall = this.manageWageService.getModifyCoverageDetails(
              this.registrationNo,
              this.socialInsuranceNo,
              this.engagementId,
              this.referenceNo
            );
          }
          serviceCall.subscribe(res => {
            this.transactionTypes = this.establishment.gccEstablishment
              ? [DocumentTransactionType.CHANGE_ENGAGEMENT_IN_GCC]
              : res.docFetchTypes;
            this.engagement = res;
            this.checkPenaltyIndicator();
            this.channel?.english === Channel.TAMINATY_INDIVIDUAL
              ? this.getScannedDocument(this.referenceNo)
              : this.getChangeDocuments();
          });
        },
        err => {
          super.handleError(err, false);
        }
      );
    }
  }
  getChangeDocuments() {
    super
      .getDocuments(
        !this.isModifyCoverage ? DocumentTransactionId.CHANGE_ENGAGEMENT : DocumentTransactionId.MAINTAIN_COVERAGE,
        this.transactionTypes,
        this.engagementId,
        this.routerDataToken.transactionId
      )
      .subscribe(() => {
        if (!this.isPPA && this.isPrivate) {
          this.checkInspectionStatus().subscribe(() => {
            if (this.hasInspectionCompleted) {
              this.getInspectionDocuments().subscribe(
                () => {},
                err => {
                  super.handleError(err, false);
                }
              );
            }
          });
        }
      });
  }
  /** get scanned documents */
  getScannedDocument(referenceNo) {
    this.documentService.getAllDocuments(null, referenceNo).subscribe(res => {
      this.documents = res;
    });
  }

  /** Method to enable,disable and set set penalty indicator. */
  checkPenaltyIndicator() {
    if (
      this.routerDataToken.assignedRole === ValidatorRoles.VALIDATOR ||
      this.routerDataToken.assignedRole === ValidatorRoles.VALIDATOR_ONE
    )
      this.canEditPenalty = true;
    this.setPenaltyIndicator();
  }

  /** Method to check inspection completion status. */
  checkInspectionStatus() {
    return this.inspectionService.getInspectionByTransactionId(this.referenceNo, this.socialInsuranceNo).pipe(
      filter(res => res && res.length > 0),
      tap(res => {
        this.hasInspectionCompleted = res[0].inspectionTypeInfo.status === InspectionStatus.COMPLETED;
        this.fieldActivityNo = res[0].fieldActivityNumber;
      })
    );
  }

  /** Method to get Inspection documents. */
  getInspectionDocuments() {
    return this.documentService
      .getRasedDocuments(
        InspectionTypeEnum.EMPLOYEE_AFFAIRS,
        this.socialInsuranceNo,
        InspectionReferenceType.CONTRIBUTOR,
        this.fieldActivityNo
      )
      .pipe(
        tap(res => {
          if (res.length > 0) this.documents = res.concat(this.documents);
        }),
        catchError(error => {
          super.handleError(error, false);
          return of(this.documents);
        })
      );
  }

  /**Method to  set penalty indicator*/
  setPenaltyIndicator() {
    if (this.engagement.penaltyIndicator !== null && this.engagement.penaltyIndicator !== undefined) {
      if (this.engagement.penaltyIndicator === 1) this.validatorForm.get('penalty.english')?.setValue(YesOrNo.YES);
      else this.validatorForm.get('penalty.english')?.setValue(YesOrNo.NO);
    }
  }
  /** Method to handle workflow events. */
  handleWorkflowEvents(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerDataToken, action);
    this.savePenaltyIndicator(data);
    super.hideModal();
  }

  /** Method to dave penalty. */
  savePenaltyIndicator(payload: ContributorBPMRequest) {
    this.engagementService
      .updatePenaltyIndicator(
        this.registrationNo,
        this.socialInsuranceNo,
        this.engagementId,
        this.validatorForm.get('penalty.english').value === YesOrNo.YES ? 1 : 0
      )
      .subscribe(
        () => this.saveWorkflow(payload),
        err => this.handleError(err, false)
      );
  }

  /** Method to check for  active inspection. */
  checkForActiveInspection() {
    this.inspectionService
      .getInspectionList(this.registrationNo, this.socialInsuranceNo, true)
      .pipe(
        tap(res => {
          if (res.length > 0)
            this.alertService.showErrorByKey(ContributorConstants.VALIDATOR_CANNOT_SEND_FOR_INSPECTION, {
              personFullName: this.getPersonName(),
              transactionId: Number(res[0].transactionTraceId)
            });
          else
            this.initiateInspection(
              this.routerDataToken,
              !this.isModifyCoverage
                ? 'CONTRIBUTOR.SUCCESS-MESSAGES.CHANGE-ENGAGEMENT-INSPECTION-SUCCESS-MESSAGE'
                : 'CONTRIBUTOR.SUCCESS-MESSAGES.MODIFY-COVERAGE-INSPECTION-SUCCESS-MESSAGE'
            );
        })
      )
      .subscribe({ error: err => this.handleError(err, false) });
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
}
