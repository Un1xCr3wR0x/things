import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  BPMUpdateRequest,
  DocumentService,
  DocumentItem,
  LookupService,
  RouterData,
  RouterDataToken,
  TransactionService,
  WorkFlowActions,
  WorkflowService,
  BilingualText,
  Lov,
  AppealsType
} from '@gosi-ui/core';
import {
  AppealRouteConstants,
  AppealService,
  AppealValidatorRoles,
  FirstLevelFormService
} from '@gosi-ui/features/appeals';
import { VlidatorBaseScComponent } from '@gosi-ui/features/appeals/lib/shared/components/base';
import { AppealValidatorRolesNumber } from '@gosi-ui/features/appeals/lib/shared/enums/appeal-validator-roles-id';
import { BsModalService } from 'ngx-bootstrap/modal';
import { findKey } from 'lodash';
import { getPersonNameAsBilingual, getIdentityByType } from '@gosi-ui/core/lib/utils/person';
import { AppealSpecialistRoles } from '@gosi-ui/features/appeals/lib/shared';
@Component({
  selector: 'employee-appeals-validate-sc',
  templateUrl: './employee-validate-appeal-sc.component.html',
  styleUrls: ['./employee-validate-appeal-sc.component.scss']
})
export class EmployeeAppealScComponent extends VlidatorBaseScComponent implements OnInit {
  @ViewChild('SecretaryConfirmation', { static: true })
  secretaryConfirmation: TemplateRef<HTMLElement>;

  roles = AppealValidatorRoles;
  appealDetailNew: any;
  canAssignToSpecialist: boolean;
  canReturnToPrev: boolean;
  appealDocumentList: DocumentItem[] = [];
  appealTransactionName: BilingualText;
  appealUserFullName: string;
  appealUserNIN: number;
  appealUserEmailAddress: string;
  appealTransactionReferenceNo: number;
  btnReturnText: string;
  appealSpecialistList: Lov[] = [];

  externalCommentsRolls: AppealValidatorRoles[] = [
    AppealValidatorRoles.Executor_private,
    AppealValidatorRoles.Executor_public
  ];
  /**
   * @param modalService
   * @param alertService
   * @param workflowService
   * @param router
   * @param lookupService
   * @param documentService
   * @param routerDataToken
   * @param appealID
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
    private formService: FirstLevelFormService,
    private appealService: AppealService
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
    this.setFormSubmissionListener();
    this.alertService.clearAlerts();
    this.checkIfCanAssignToSpecialist();
    this.checkIfCanReturnToPrev();
    this.getAllDocuments();
    this.btnReturnText = this.getReturnText();
    setTimeout(() => {
      this.getLookups();
    }, 2000);
  }

  initialiseParams() {
    if (this.routerDataToken.taskId === undefined || this.routerDataToken.taskId === null) {
      this.routeToInbox();
    }
    super.getDataFromToken(this.routerDataToken);
    if (this.appealId) {
      this.getAppealDataService();
    }
  }

  getLookups(): void {
    switch (this.resourceType) {
      case AppealsType.TRANSACTION_APPEAL_ON_PRIVATE_SECTOR:
        this.lookupService.getPrivateSectorAppealSpecialist().subscribe(res => {
          this.appealSpecialistList = res;
        });
        break;
      default:
        this.lookupService.getPublicSectorAppealSpecialist().subscribe(res => {
          this.appealSpecialistList = res;
        });
        break;
    }
  }
  cancel(): void {
    this.cancelAndBack();
  }

  submit(): void {
    let shouldConfirm: boolean = this.shouldConfirmBeforeSubmit();

    if (shouldConfirm) {
      this.modalRef = this.modalService.show(this.secretaryConfirmation); // to do.. make it
    } else this.formService.notifyFormToEmit({ type: this.assignedRole as AppealValidatorRoles });
  }

  onReturnToUserConfirmed(data): void {
    const key = findKey(AppealValidatorRoles, value => value === this.assignedRole);
    let workflowData: BPMUpdateRequest = new BPMUpdateRequest();
    workflowData.comments = data.comments;

    workflowData.isExternalComment = [
      AppealValidatorRoles.IS_reviewer_private,
      AppealValidatorRoles.IS_reviewer_public
    ].includes(this.assignedRole); // Check If External Comment
    workflowData.roleId = AppealValidatorRolesNumber[key as unknown as string];
    if (
      [AppealValidatorRoles.Appeal_clerk_private, AppealValidatorRoles.Appeal_clerk_public].includes(this.assignedRole)
    )
      workflowData.outcome = WorkFlowActions.ASSIGN_TO_PREPARATION;
    else workflowData.outcome = WorkFlowActions.RETURN;
    this.mergeAndUpdateTask(workflowData);
    this.hideModal();
  }

  onReturnToClerkConfirmed(data): void {
    const key = findKey(AppealValidatorRoles, value => value === this.assignedRole);
    let workflowData: BPMUpdateRequest = new BPMUpdateRequest();
    workflowData.comments = data.comments;
    workflowData.roleId = AppealValidatorRolesNumber[key as unknown as string];
    workflowData.outcome = WorkFlowActions.RETURN;
    this.mergeAndUpdateTask(workflowData);
    this.hideModal();
  }

  onAssignToSpecialistConfirmed(data): void {
    let workflowData: BPMUpdateRequest = new BPMUpdateRequest();
    let outCome: WorkFlowActions = this.findSpecialistAction();

    workflowData.outcome = outCome;
    workflowData.roleId = data.roleId?.english;
    workflowData.comments = data.comments;
    this.mergeAndUpdateTask(workflowData);
    this.hideModal();
  }

  onSecretaryConfirmation(): void {
    let workflowData: BPMUpdateRequest = new BPMUpdateRequest();
    workflowData.outcome = WorkFlowActions.APPROVE;
    const key = findKey(AppealValidatorRoles, value => value === this.assignedRole);
    workflowData.roleId = AppealValidatorRolesNumber[key as unknown as string];

    this.callBbmApi(workflowData);
    this.hideModal();
  }

  findSpecialistAction(): WorkFlowActions {
    if (this.actions.includes(WorkFlowActions.TO_SPECIALIST)) {
      return WorkFlowActions.TO_SPECIALIST;
    } else if (this.actions.includes(WorkFlowActions.ASSIGN_TO_SPECIALIST)) {
      return WorkFlowActions.ASSIGN_TO_SPECIALIST;
    }
  }

  onAssignToSpecialistClicked(template: TemplateRef<HTMLElement>): void {
    this.modalRef = this.modalService.show(template);
  }

  setFormSubmissionListener(): void {
    this.formService.getFormValue().subscribe(res => {
      if (!res?.formData || !this.assignedRole) return;
      const key = findKey(AppealValidatorRoles, value => value === this.assignedRole);

      const bpmRequest = new BPMUpdateRequest();
      bpmRequest.roleId = AppealValidatorRolesNumber[key as unknown as string];
      bpmRequest.outcome = res.outCome;
      bpmRequest.comments = res?.formData?.comments;
      if (this.externalCommentsRolls.includes(this.assignedRole as AppealValidatorRoles)) {
        bpmRequest.isExternalComment = true;
      }
      if (Object.values(AppealSpecialistRoles).includes(this.assignedRole as any)) {
        this.callBbmApi(bpmRequest);
      } else this.mergeAndUpdateTask(bpmRequest, res?.formData);
    });
  }

  /** Method to hide modal. */
  hideModal(): void {
    if (this.modalRef) this.modalRef.hide();
  }

  /**
   * Method to getting Appeal Detail using appeald ID
   * and passing AppDetail to First Level Appeal Component
   */
  getAppealDataService() {
    this.appealService?.retrieveAppealDetails(this.appealId).subscribe(
      (res: any) => {
        this.appealDetailNew = res;
        this.appealTransactionReferenceNo = this.appealDetailNew?.transactionRefNumber;
        if (this.appealDetailNew?.type === '1001') {
          this.appealTransactionName = {
            english: 'Review Request',
            arabic: 'طلب مراجعة'
          };
        } else {
          this.appealTransactionName = this.transactionTitle;
        }
        this.getAppealPersonDetail(res?.objector);
      },
      (err: any) => {
        this.handleErrors(err, false);
      }
    );
  }

  checkIfCanAssignToSpecialist(): void {
    this.canAssignToSpecialist =
      this.actions.includes(WorkFlowActions.ASSIGN_TO_SPECIALIST) ||
      this.actions.includes(WorkFlowActions.TO_SPECIALIST);
  }

  checkIfCanReturnToPrev(): void {
    const allowedRolesForReturn: AppealValidatorRoles[] = [
      AppealValidatorRoles.Legal_reviewer_private,
      AppealValidatorRoles.Legal_reviewer_public,
      AppealValidatorRoles.Legal_auditor_private,
      AppealValidatorRoles.Legal_auditor_public,
      AppealValidatorRoles.Legal_manager_private,
      AppealValidatorRoles.Legal_manager_public,
      AppealValidatorRoles.Appeal_clerk_private,
      AppealValidatorRoles.Appeal_clerk_public
    ];

    this.canReturnToPrev =
      allowedRolesForReturn.includes(this.assignedRole as AppealValidatorRoles) &&
      this.actions.includes(WorkFlowActions.RETURN);
  }

  /**
   * Get All Appeals document details with content on the basis of Transaction Number
   */
  getAllDocuments() {
    let tranactionNo = this.referenceNo;
    this.getDocuments(tranactionNo).subscribe(
      (res: any) => {
        this.appealDocumentList = res;
      },
      (err: any) => {
        this.handleErrors(err, false);
        console.error('Error fetching Appeals documents:', err);
      }
    );
  }

  /**
   * Get person details for the appeal on the basis of person id Number
   */
  getAppealPersonDetail(nin: number) {
    this.appealService?.getPersonById(nin)?.subscribe(
      (res: any) => {
        const userName = getPersonNameAsBilingual(res?.name);
        this.appealUserFullName = userName?.arabic;
        const userNin = getIdentityByType(res?.identity, res?.nationality);
        this.appealUserNIN = userNin?.id;
        this.appealUserEmailAddress = res?.contactDetail?.emailId?.primary;
      },
      (err: any) => {
        this.handleErrors(err, false);
      }
    );
  }

  naivgateToUserView(): void {
    const nin = this.appealUserNIN;
    const url = '#/' + AppealRouteConstants.ROUTE_APPEAL_USER_VIEW(nin);
    window.open(url, '_blank');
  }

  getReturnText(): string {
    switch (this.assignedRole) {
      case AppealValidatorRoles.Legal_reviewer_private:
      case AppealValidatorRoles.Legal_reviewer_public:
        return 'APPEALS.RETURN-TO-IS-REVIEWER';

      case AppealValidatorRoles.Legal_auditor_private:
      case AppealValidatorRoles.Legal_auditor_public:
        return 'APPEALS.RETURN-TO-LEGAL-REVIEWER';

      case AppealValidatorRoles.Legal_manager_private:
      case AppealValidatorRoles.Legal_manager_public:
        return 'APPEALS.RETURN-TO-AUDITOR';

      case AppealValidatorRoles.Appeal_clerk_public:
      case AppealValidatorRoles.Appeal_clerk_private:
        return 'APPEALS.RETURN-TO-PREPARATION';

      default:
        return 'APPEALS.RETURN';
    }
  }

  shouldConfirmBeforeSubmit(): boolean {
    const includedRoles: AppealValidatorRoles[] = [
      AppealValidatorRoles.Committee_secretary_private,
      AppealValidatorRoles.Committee_secretary_public
    ];

    return includedRoles.includes(this.assignedRole as AppealValidatorRoles);
  }

  showModal(template: TemplateRef<HTMLElement>): void {
    this.modalRef = this.modalService.show(template);
  }
}
