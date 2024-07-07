/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, Inject, OnDestroy, TemplateRef } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  BilingualText,
  DocumentItem,
  DocumentService,
  InspectionTypeEnum,
  LookupService,
  Lov,
  LovList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionReferenceData,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, iif, noop, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ViolationConstants, ViolationRouteConstants } from '../../constants';
import {
  DocumentTransactionId,
  DocumentTransactionType,
  InspectionChannel,
  SystemParameterEnum,
  ViolationClassEnum,
  ViolationTypeEnum,
  ViolationValidatorRoles,
  ViolationsEnum
} from '../../enums';
import {
  AutoTierClass,
  ChangeViolationValidator,
  ContributorRequestDetails,
  ContributorsTier,
  ExcludedContributors,
  MemberDecisionDto,
  PenaltyDetails,
  PenaltyInfo,
  PenaltyInfoResponse,
  ViolatedContributor,
  ViolationBPMRequest,
  ViolationTransaction
} from '../../models';
import { ViolationsValidatorService } from '../../services';
import { checkContributorsSaved, checkIfAllExcluded } from '../../utils/violation-utils';
import { ExcludedContributorDcComponent } from '../excluded-contributor-dc/excluded-contributor-dc.component';
import { PenaltyDetailsDcComponent } from '../penalty-details-dc/penalty-details-dc.component';
import { PreviousContributorViolationsScComponent } from '../previous-contributor-violations-sc/previous-contributor-violations-sc.component';
import { PreviousEstablishmentViolationsScComponent } from '../previous-establishment-violations-sc/previous-establishment-violations-sc.component';
import { VcApproveRestrictionDcComponent } from '../vc-approve-restriction-dc/vc-approve-restriction-dc.component';
@Directive()
export class ValidatorBaseScComponent extends BaseComponent implements OnDestroy {
  /** Local variables */
  allExcluded: boolean;
  assignedRole: string;
  assigneeId: string;
  assigneeName: string;
  assigneeIndex: number;
  bpmTaskId: string;
  canEdit: boolean;
  canReject: boolean;
  canReturn: boolean;
  channel: string;
  channelRased = InspectionChannel.RASED;
  channelSimis = InspectionChannel.SIMIS;
  channelE_Inspection = InspectionChannel.E_INSPECTION;
  decisionBy: string;
  documentList: DocumentItem[];
  documents: DocumentItem[] = [];
  e_Inspection = false;
  isRasedInspection = false;
  checkFAN = false;
  isReturn: boolean;
  isReturnToAdmin: boolean;
  memberDto: MemberDecisionDto = new MemberDecisionDto();
  modalRef: BsModalRef;
  notallExcluded: boolean;
  penaltyArrayLen: number[] = new Array<number>();
  penaltyCalculationResponse: PenaltyInfoResponse;
  penaltyInfoDetails: PenaltyDetails[] = new Array<PenaltyDetails>();
  penaltyRequest: PenaltyInfo;
  referenceNo: number;
  returnReasonList$: Observable<LovList>;
  transactionDetails: ViolationTransaction;
  transactionReferenceData: TransactionReferenceData[] = [];
  validatorMemberForm: FormGroup = new FormGroup({});
  violationClassList: Lov[];
  violationDetails: ChangeViolationValidator;
  violationId: number;
  estRegNo: number;
  yesOrNoList$: Observable<LovList>;
  penaltyInfoData: PenaltyDetails[] = new Array<PenaltyDetails>();
  billBatchInProgress = false;
  showVcAlert: boolean;
  numberOfContributorsAffected: number;
  isButtonApprove: boolean;
  totalRecords: number;
  noPenaltyPopupYes: string = ViolationsEnum.NO_PENALTY_POPUP_YES;
  isRaiseVioFoVcm: boolean;
  autoTierClass: AutoTierClass;
  contributorsTier: ContributorsTier[];
  isAutoSuggestionDirectApproved: Boolean;
  saveContributorButtonClicked: Boolean = false;

  constructor(
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly modalService: BsModalService,
    readonly validatorService: ViolationsValidatorService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super();
  }
  getDataFromToken(tokenData: RouterData) {
    if (tokenData.payload) {
      const payload = JSON.parse(tokenData.payload);
      if (payload.referenceNo) this.referenceNo = payload.referenceNo;
      if (payload.channel) this.channel = payload.channel;
      if (payload.violationId) this.violationId = payload.violationId;
      if (payload.registrationNo) this.estRegNo = payload.registrationNo;
      this.isReturn = payload?.previousOutcome === ViolationsEnum.RETURN ? true : false;
    }
    this.transactionReferenceData = this.routerDataToken.comments;
  }
  getRolesForView(tokenData: RouterData) {
    if (tokenData) {
      this.bpmTaskId = tokenData.taskId;
      this.assignedRole = tokenData.assignedRole;
      this.assigneeId = tokenData.assigneeId;
      this.assigneeName = tokenData.assigneeName;
      this.canReturn = this.assignedRole === ViolationValidatorRoles.COMMITEE_HEAD ? true : false;
    }
  }
  getLovList() {
    this.yesOrNoList$ = this.lookupService.getYesOrNoList();
    this.returnReasonList$ = this.lookupService.getRegistrationReturnReasonList();
    this.getSystemParameters();
  }
  initializeView(): void {
    this.getViolationDetails()
      .pipe(
        tap(res => {
          this.penaltyInfoDetails = JSON.parse(JSON.stringify(res?.penaltyInfo));
          res.penaltyInfo.forEach(item => {
            this.penaltyArrayLen.push(item.excludedContributors.length);
          });
          if (res?.violationType?.english.toUpperCase() !== ViolationTypeEnum.VIOLATING_PROVISIONS.toUpperCase()) {
            this.getContributorsTierValues().subscribe(
              res => {
                this.autoTierClass = res;
                this.bindToTransactionDetailsModel();
              },
              err => {
                this.alertService.showError(err.error.message);
              }
            );
          }
        }),
        switchMap(() => iif(() => this.isRasedInspection, this.getRasedInspectionDocuments(), of(true))),
        switchMap(() => iif(() => this.e_Inspection && this.checkFAN, this.getEinspectionDocuments(), of(true))),
        switchMap(() =>
          iif(
            () => this.isRaiseVioFoVcm,
            this.getViolationDocuments(
              DocumentTransactionId.MANUALLY_TRIGGERED_VIOLATION,
              DocumentTransactionType.REGISTER_VIOLATION_THROUGH_FO,
              this.violationId,
              this.transactionDetails?.violationReferenceNumber
            ),
            of(true)
          )
        ),
        catchError(err => {
          this.handleErrors(err, true);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  getSystemParameters() {
    this.validatorService
      .getSystemParams()
      .pipe(
        tap(parameter => {
          const billBatchParamter = parameter.filter(
            param => param.name === SystemParameterEnum.billBatchIndicator
          )?.[0];
          this.billBatchInProgress = +billBatchParamter?.value === 1;
          if (this.billBatchInProgress) {
            this.alertService.setInfoByKey('CORE.INFO.BILL-BATCH-IN-PROGRESS');
          }
        })
      )
      .subscribe();
  }
  getRasedInspectionDocuments() {
    if (this.isRasedInspection) {
      return this.documentService
        .getRasedDocuments(
          InspectionTypeEnum.EMPLOYEE_AFFAIRS,
          this.transactionDetails.violationTypeForRased,
          ViolationsEnum.VIOLATION_TYPE,
          this.transactionDetails.inspectionInfo.visitId
        )
        .pipe(
          tap(docs => {
            if (docs.length > 0) this.documents = this.documents.concat(docs);
          }),
          catchError(error => {
            this.handleErrors(error, false);
            return of(this.documents);
          })
        );
    }
  }
  getEinspectionDocuments() {
    if (this.e_Inspection) {
      return this.documentService
        .getRasedDocuments(
          InspectionTypeEnum.EMPLOYEE_AFFAIRS,
          this.transactionDetails.contributors[0].socialInsuranceNo,
          ViolationsEnum.CONTRIBUTOR_NUMBER,
          this.transactionDetails.inspectionInfo.visitId
        )
        .pipe(
          tap(res => {
            if (res.length > 0) this.documents = this.documents.concat(res);
          }),
          catchError(error => {
            this.handleErrors(error, false);
            return of(this.documents);
          })
        );
    }
  }
  // method to bind contributorsTier data with violation details
  bindToTransactionDetailsModel() {
    this.contributorsTier = this.autoTierClass.contributorDetails;
    const mapByContributorId = new Map(this.contributorsTier.map(contr => [contr.contributorId, contr]));
    this.transactionDetails?.contributors.forEach(contributor => {
      const contributorFromTier = mapByContributorId.get(contributor?.contributorId);
      if (contributorFromTier) {
        contributor.violationStartDate = contributorFromTier?.violationStartDate;
        if (contributorFromTier?.violationsList.length >= 1) {
          contributor.showPrevViolationTable = true;
          contributor.violationList = contributorFromTier?.violationsList;
        } else {
          contributor.showPrevViolationTable = false;
          contributor.violationList = [];
        }
      }
    });
  }
  /** Method to get documents for the modify/cancel Violations. */
  getViolationDocuments(
    documentId: string,
    documentType: string | string[],
    contractId: number,
    referenceNo: number
  ): Observable<DocumentItem[]> {
    return this.documentService.getDocuments(documentId, documentType, contractId, referenceNo).pipe(
      tap(res => {
        this.documents = res.filter(item => item.documentContent !== null);
      })
    );
  }
  getViolationClassList(isAllExcluded: boolean) {
    return this.validatorService.getViolationClassDetails(this.violationId, isAllExcluded).subscribe(
      res => {
        this.violationClassList = res;
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  handleErrors(error, flag: boolean): void {
    this.alertService.showError(error.error.message);
    if (flag) this.routeToInbox();
  }
  viewModal(templateRef: TemplateRef<HTMLElement>): void {
    this.modalRef = this.modalService.show(templateRef, { class: 'modal-lg modal-dialog-centered' });
  }
  routeToInbox(): void {
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  getWorkflowActions(key: number): string {
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
      case 3:
        action = WorkFlowActions.SUBMIT;
        break;
    }
    return action;
  }
  setWorkflowData(routerData: RouterData, action: string): ViolationBPMRequest {
    const data = new ViolationBPMRequest();
    if (this.validatorMemberForm.get('rejectionReason'))
      data.rejectionReason = this.validatorMemberForm.get('rejectionReason').value;
    if (this.validatorMemberForm.get('comments')) data.comments = this.validatorMemberForm.get('comments').value;
    if (this.validatorMemberForm.get('returnReason'))
      data.returnReason = this.validatorMemberForm.get('returnReason').value;
    data.taskId = routerData.taskId;
    data.user = routerData.assigneeId;
    data.outcome = action;
    return data;
  }
  saveWorkflow(data: ViolationBPMRequest): void {
    this.workflowService
      .updateTaskWorkflow(data)
      .pipe(
        tap(() => {
          this.alertService.showSuccessByKey(this.getSuccessMessage(data.outcome));
          this.routeToInbox();
        }),
        catchError(err => {
          this.isButtonApprove = false;
          this.handleErrors(err, false);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  getSuccessMessage(outcome: string) {
    let messageKey: string;
    switch (outcome) {
      case WorkFlowActions.APPROVE:
        messageKey = 'VIOLATIONS.WORKFLOW-FEEDBACKS.TRANSACTION-APPROVAL-MESSAGE';
        break;
      case WorkFlowActions.REJECT:
        messageKey = 'VIOLATIONS.WORKFLOW-FEEDBACKS.TRANSACTION-REJECTION-MESSAGE';
        break;
      case WorkFlowActions.RETURN:
        messageKey = 'VIOLATIONS.WORKFLOW-FEEDBACKS.TRANSACTION-RETURN-MESSAGE';
        break;
    }
    return messageKey;
  }
  navigateToEstProfile(regNo: number) {
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      url = '/establishment-private/#' + ViolationRouteConstants.ROUTE_ESTABLISHMENT_PROFILE_PAGE(regNo);
    } else {
      url = '/establishment-public/#' + ViolationRouteConstants.ROUTE_ESTABLISHMENT_PROFILE_PAGE(regNo);
    }
    window.open(url, '_blank');
  }
  getTransaction() {
    this.setNoPenalty();
    if (this.transactionDetails?.penaltyInfo?.length === 0) {
      this.transactionDetails.penaltyInfo = new Array<PenaltyDetails>();
      this.assigneeIndex = 0;
      this.assignCurrentRole();
    } else if (this.transactionDetails?.penaltyInfo?.length > 0) {
      this.assigneeIndex = this.transactionDetails.penaltyInfo.findIndex(res => res.memberId === this.assigneeId);
      if (this.assigneeIndex === -1) this.assignCurrentRole();
    }
    if (
      this.transactionDetails.penaltyInfo[this.assigneeIndex].excludedContributors.length ===
        this.transactionDetails.contributors.length ||
      checkIfAllExcluded(this.transactionDetails?.contributors)
    )
      this.getViolationClassList(true);
    else this.getViolationClassList(false);
  }
  assignCurrentRole() {
    const violatedContributorsList = new Array<ViolatedContributor>();
    this.transactionDetails.contributors.forEach(item => {
      const violated = {
        contributionAmount: item.totalContributionAmount,
        contributorId: item.contributorId,
        contributorName: item.contributorName,
        violationAmount: 0,
        compensated: null,
        repetitionTierType: undefined,
        penaltyCalculationEquation: undefined,
        totalBenefitAmount: item.totalBenefitAmount
      };
      violatedContributorsList.push(violated);
    });
    const currentRole = {
      decisionBy: this.assigneeName,
      memberId: this.assigneeId,
      selectedViolationClass: null,
      role: {
        english: this.assignedRole,
        arabic: ''
      },
      excludedContributors: new Array<ExcludedContributors>(),
      violatedContributors: violatedContributorsList,
      justification: null,
      penaltyAmount: null,
      dateOfModification: null,
      establishmentProactiveAction: null,
      penaltyCalculationEquation: {
        english: '',
        arabic: ''
      }
    };
    this.transactionDetails.penaltyInfo.push(currentRole);
    this.assigneeIndex = this.transactionDetails.penaltyInfo.findIndex(res => res.memberId === this.assigneeId);
  }
  getViolationDetails(): Observable<ViolationTransaction> {
    return this.validatorService.getTransactionDetails(this.violationId, this.estRegNo).pipe(
      tap(res => {
        this.penaltyInfoData = JSON.parse(JSON.stringify(res.penaltyInfo));
        this.transactionDetails = { ...res };
        if (this.transactionDetails.inspectionInfo.channel.english === InspectionChannel.RASED)
          this.isRasedInspection = true;
        if (this.transactionDetails.inspectionInfo.channel.english === InspectionChannel.E_INSPECTION)
          this.e_Inspection = true;
        if (this.transactionDetails.inspectionInfo.visitId) this.checkFAN = true;
        if (this.transactionDetails?.manualViolation) {
          this.isRaiseVioFoVcm = true;
        } else {
          this.isRaiseVioFoVcm = false;
        }
        if (this.transactionDetails.referenceNo)
          this.searchTransactionData(this.transactionDetails?.referenceNo, this.penaltyInfoData);
        this.getTransaction();
      })
    );
  }
  getContributorsTierValues(): Observable<AutoTierClass> {
    return this.validatorService.getContributorsTierValues(this.violationId);
  }
  navigateToProfile(index: number) {
    const regNo = this.transactionDetails.establishmentInfo.registrationNo;
    const sinNo = this.transactionDetails.contributors[index].socialInsuranceNo;
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      url = '/establishment-private/#' + ViolationRouteConstants.ROUTE_CONTRIBUTOR_PROFILE_PAGE(regNo, sinNo);
    } else {
      url = '/establishment-public/#' + ViolationRouteConstants.ROUTE_CONTRIBUTOR_PROFILE_PAGE(regNo, sinNo);
    }
    window.open(url, '_blank');
  }
  navigateToTracker(data: { index?: number; engIndex?: number; isOh?: boolean }) {
    const index = data.index;
    const engIndex = data.engIndex;
    const transactionId = this.transactionDetails.referenceNo;

    // const transactionNumber =
    //   this.transactionDetails.contributors[index]?.engagementInfo[engIndex]?.changeTerminationReasonTransaction;
    let transactionNumber = undefined;
    if (data.isOh) {
      transactionNumber =
        this.transactionDetails.contributors[index]?.engagementInfo[engIndex]?.injuryDetails[index]
          ?.injuryTransactionId;
    } else {
      transactionNumber =
        this.transactionDetails.contributors[index]?.engagementInfo[engIndex]?.changeTerminationReasonTransaction;
    }
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      url =
        '/establishment-private/#' +
        ViolationRouteConstants.ROUTE_TRANSACTION_TRACKING(transactionId, transactionNumber);
    } else {
      url =
        '/establishment-public/#' +
        ViolationRouteConstants.ROUTE_TRANSACTION_TRACKING(transactionId, transactionNumber);
    }
    window.open(url, '_blank');
  }

  hideModal(isApprove?: boolean): void {
    this.isButtonApprove = !isApprove ? false : true;
    this.modalRef.hide();
  }
  submitMemberDecision(memberDto: MemberDecisionDto) {
    this.validatorService.submitValidation(this.violationId, memberDto, this.bpmTaskId).subscribe(
      res => {
        this.routeToInbox();
        this.alertService.showSuccess(res);
      },
      err => {
        this.isButtonApprove = false;
        this.alertService.showError(err.error.message);
      }
    );
  }
  contributorInfoDtoData() {
    this.memberDto.assignedCommitteeUser = this.assigneeId;
    this.memberDto.committeeMemberOrHead = this.assignedRole;
    this.memberDto.penaltyAmount = this.penaltyCalculationResponse?.establishmentViolationAmount
      ? this.penaltyCalculationResponse?.establishmentViolationAmount
      : this.isAutoSuggestionDirectApproved
      ? this.autoTierClass?.establishmentViolationAmount
      : this.memberDto.penaltyAmount;
    this.memberDto.penaltyCalculationEquation = this.isAutoSuggestionDirectApproved
      ? this.autoTierClass?.penaltyCalculationEquation
      : this.penaltyCalculationResponse?.penaltyCalculationEquation;
    this.memberDto.systemSuggestedClass =
      this.autoTierClass?.violationClass?.english && !this.isReturn
        ? this.autoTierClass?.violationClass?.english
        : null;
    this.memberDto.contributorsDecisionInfoDto = [];
    this.transactionDetails.contributors.forEach(contributor => {
      const contributorDto = {
        compensated: contributor?.compensated?.english === 'Yes' ? true : false,
        contributionAmount: contributor?.totalContributionAmount ? contributor?.totalContributionAmount : 0,
        contributorId: contributor.contributorId,
        excluded: this.verifyExcluded(contributor.contributorId),
        repetitionTierType: contributor.repetetionTier,
        benefitAmount: contributor?.totalBenefitAmount ? contributor.totalBenefitAmount : 0
      };
      this.memberDto.contributorsDecisionInfoDto.push(contributorDto);
    });
  }
  verifyExcluded(contributorId) {
    let isExcluded = false;
    this.transactionDetails.penaltyInfo[this.assigneeIndex]?.excludedContributors?.forEach(val => {
      if (val.contributorId === contributorId) isExcluded = true;
    });
    if (isExcluded) return true;
    else return false;
  }
  getClassViolations(event) {
    if (event) {
      this.getViolationClassList(true);
      this.allExcluded = true;
      this.notallExcluded = false;
    } else {
      this.getViolationClassList(false);
      this.allExcluded = false;
      this.notallExcluded = true;
    }
  }

  getClassValueChange(violationForm: FormGroup, violationClass?: BilingualText, isPrepopulate?: Boolean) {
    this.transactionDetails.showSaveError = false;
    (violationForm.get('contributordetails') as FormArray).markAllAsTouched();
    const isTierChoosen = this.checkIfRepetitionTierSelected(violationForm);
    const isContributorSaved = checkContributorsSaved(this.transactionDetails?.contributors);
    const repetitionTierList = ViolationConstants.REPETETION_TIER_LIST;
    if (
      (violationForm.get('penalty.penalty.english')?.value !== null || violationClass) &&
      this.transactionDetails &&
      (isTierChoosen || violationClass?.english === ViolationClassEnum.DO_NOT_IMPOSE_PENALTY) &&
      isContributorSaved
    ) {
      this.transactionDetails.showSaveError = false;
      const contributorData = new Array<ContributorRequestDetails>();
      if (this.transactionDetails.penaltyInfo[this.assigneeIndex].violatedContributors.length === 0) {
        const data = {
          contributionAmount: 0,
          contributorId: 0,
          repetitionTierType: repetitionTierList.items[0].value,
          benefitAmount: 0
        };
        contributorData.push(data);
      } else {
        this.transactionDetails?.penaltyInfo[this.assigneeIndex]?.violatedContributors.forEach((item, i) => {
          const index = this.transactionDetails?.contributors.findIndex(
            contributor => contributor?.contributorId === item?.contributorId
          );
          const contributor = this.transactionDetails?.contributors[index];
          const data = {
            benefitAmount: contributor?.totalBenefitAmount ? contributor?.totalBenefitAmount : null,
            contributionAmount: item.contributionAmount ? item.contributionAmount : 0,
            contributorId: item.contributorId,
            repetitionTierType: (violationForm.get('contributordetails') as FormArray)?.controls[index].get(
              'repetetionTier'
            )?.value
          };
          contributorData.push(data);
        });
      }
      this.penaltyRequest = new PenaltyInfo();
      this.penaltyRequest.violationClass = violationClass
        ? violationClass
        : violationForm.get('penalty.penalty')?.value;
      this.penaltyRequest.channel = this.transactionDetails.inspectionInfo.channel.english;
      this.penaltyRequest.violationType = this.transactionDetails?.violationType;
      this.penaltyRequest.contributorRequestDetails = contributorData;
      this.isAutoSuggestionDirectApproved = isPrepopulate ? true : false;
      if (isPrepopulate === true) {
        this.setPenaltyOfCurrentUserInitially();
      } else {
        this.validatorService.submitPenaltyCalculations(this.violationId, this.penaltyRequest).subscribe(res => {
          this.penaltyCalculationResponse = res;
          this.setPenaltyOfCurrentUser(res);
        });
      }
    } else if (!isContributorSaved) {
      this.transactionDetails.showSaveError = true;
      this.scrollToContributor();
    } else if (!isTierChoosen) this.alertService.showMandatoryErrorMessage();
  }
  scrollToContributor() {
    const element = document.getElementById('contributorSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }
  setPenaltyOfCurrentUser(res: PenaltyInfoResponse) {
    this.transactionDetails?.penaltyInfo[this.assigneeIndex]?.violatedContributors.forEach(item => {
      res.contributorViolationAmountDetails.forEach(element => {
        if (element.contributorId === item.contributorId) {
          item.repetitionTierType = element?.repetitionTierTypeBilingual;
          item.penaltyCalculationEquation = element?.penaltyCalculationEquation;
          item.violationAmount = element?.violationAmount;
        }
      });
    });
    this.transactionDetails.penaltyInfo[this.assigneeIndex].selectedViolationClass = res.violationClass;
    this.transactionDetails.penaltyInfo[this.assigneeIndex].penaltyCalculationEquation = res.penaltyCalculationEquation;
    this.transactionDetails.penaltyInfo[this.assigneeIndex].penaltyAmount = res.establishmentViolationAmount;
  }
  // Method to handle the prepopulate scenario before changing the class value
  setPenaltyOfCurrentUserInitially() {
    this.transactionDetails?.penaltyInfo[this.assigneeIndex]?.violatedContributors.forEach(item => {
      this.contributorsTier.forEach(element => {
        if (element.contributorId === item.contributorId) {
          item.repetitionTierType = element?.repetitionTierTypeBilingual;
          item.penaltyCalculationEquation = element?.penaltyCalculationEquation;
          item.violationAmount = element?.violationAmount;
        }
      });
    });
    this.transactionDetails.penaltyInfo[this.assigneeIndex].selectedViolationClass = this.autoTierClass?.violationClass;
    this.transactionDetails.penaltyInfo[this.assigneeIndex].penaltyCalculationEquation =
      this.autoTierClass?.penaltyCalculationEquation;
    this.transactionDetails.penaltyInfo[this.assigneeIndex].penaltyAmount =
      this.autoTierClass?.establishmentViolationAmount;
  }
  checkIfRepetitionTierSelected(violationForm: FormGroup) {
    let isValid = true;
    this.transactionDetails.penaltyInfo[this.assigneeIndex].violatedContributors.forEach((item, i) => {
      (violationForm.get('contributordetails') as FormArray)?.controls[i].get('repetetionTier')?.markAsTouched();
      this.transactionDetails.contributors.forEach(ele => {
        if (item.contributorId === ele.contributorId) {
          isValid = (violationForm.get('contributordetails') as FormArray)?.controls[i].get('repetetionTier')?.invalid
            ? false
            : true;
        }
      });
    });
    return isValid;
  }
  searchTransactionData(referenceNo: string, penaltyInfo: PenaltyDetails[]) {
    let showAlert = false;
    this.validatorService.searchTransaction(referenceNo).subscribe(res => {
      if (res.listOfTransactionDetails[0].actionedBy === this.assigneeId) {
        showAlert = this.isPresentInPenaltyInfo(penaltyInfo);
      } else if (this.isPresentInPenaltyInfo(penaltyInfo) && !this.isReturn) showAlert = true;
      else showAlert = false;
    });
    if (showAlert) {
      this.showVcAlert = true;
      this.alertService.showWarningByKey('VIOLATIONS.VC-ALERT-MESSAGE');
    } else this.showVcAlert = false;
  }

  isPresentInPenaltyInfo(penaltyInfo: PenaltyDetails[]): boolean {
    let isPresent = false;
    penaltyInfo.forEach(data => {
      if (data?.memberId === this.assigneeId) {
        isPresent = true;
      }
    });
    return isPresent;
  }

  showPopupViolations(index: number) {
    const initialState = {
      transactionDetails: this.transactionDetails,
      index: index
    };
    this.modalRef = this.modalService.show(PreviousContributorViolationsScComponent, {
      ignoreBackdropClick: true,
      backdrop: true,
      class: `modal-xl modal-dialog-centered`,
      initialState
    });
  }
  showVcRestrictionModal() {
    this.modalRef = this.modalService.show(VcApproveRestrictionDcComponent, {
      backdrop: true,
      ignoreBackdropClick: false,
      class: `modal-s modal-dialog-centered`
    });
  }
  ngOnDestroy() {
    this.isButtonApprove = false;
    this.alertService.clearAllInfoAlerts();
    this.alertService.clearAllWarningAlerts();
    this.transactionDetails = new ViolationTransaction();
  }
  showPopupForEstablishmentViolations() {
    const initialState = {
      transactionDetails: this.transactionDetails
    };
    this.modalRef = this.modalService.show(PreviousEstablishmentViolationsScComponent, {
      ignoreBackdropClick: true,
      backdrop: true,
      class: `modal-xl modal-dialog-centered`,
      initialState
    });
  }
  navigateToExcludeContributorPage(totalRecords: number, templateRef?: TemplateRef<HTMLElement>) {
    const initialState = {
      transactionDetails: this.transactionDetails,
      totalRecords: totalRecords,
      assigneeIndex: this.assigneeIndex,
      isVch: this.assignedRole === ViolationValidatorRoles.COMMITEE_HEAD ? true : false
    };
    this.modalRef = this.modalService.show(ExcludedContributorDcComponent, {
      backdrop: true,
      class: `modal-xl modal-dialog-centered`,
      ignoreBackdropClick: true,
      initialState
    });
  }
  /** This method is to show the modal reference for penalty details. */
  getPenaltyDetails(data: { index: number; isCurrentMember: boolean; isCancelEngagement: boolean }) {
    this.transactionDetails.index = data?.index;
    const initialState = {
      index: data?.index,
      penaltyInfoDetails: data?.isCurrentMember ? this.transactionDetails.penaltyInfo : this.penaltyInfoData,
      isCancelEngagement: data?.isCancelEngagement
    };

    this.modalRef = this.modalService.show(PenaltyDetailsDcComponent, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl modal-dialog-centered',
      initialState
    });
  }
  contributorSaved(saveContributorButtonClicked: boolean) {
    this.saveContributorButtonClicked = saveContributorButtonClicked;
    if (checkContributorsSaved(this.transactionDetails.contributors)) this.transactionDetails.showSaveError = false;
    (checkIfAllExcluded(this.transactionDetails?.contributors) ||
      this.transactionDetails.penaltyInfo[this.assigneeIndex].excludedContributors.length ===
        this.transactionDetails.contributors.length) &&
    checkContributorsSaved(this.transactionDetails.contributors)
      ? this.getClassViolations(true)
      : this.getClassViolations(false);
    this.scrollToContributor();
  }
  ValidateContributor() {
    if (checkContributorsSaved(this.transactionDetails?.contributors)) return true;
    else {
      this.transactionDetails.showSaveError = true;
      const element = document.getElementById('contributorSection');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
      return false;
    }
  }
  setNoPenalty() {
    this.transactionDetails?.contributors?.forEach(contributor => {
      let isNoPenalty = true;
      contributor?.engagementInfo.forEach(engagement => {
        if (engagement?.isViolationHappenedBeforeFiveYears?.english !== this.noPenaltyPopupYes) isNoPenalty = false;
      });
      contributor.isNoPenalty = isNoPenalty;
    });
  }
  // Method to navigate to violation profile page
  openViolationProfile(violationId) {
    const regNo = this.transactionDetails.establishmentInfo.registrationNo;
    let url = '';
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      url = '/establishment-private/#' + ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(violationId, regNo);
    } else {
      url = '/establishment-public/#' + ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(violationId, regNo);
    }
    window.open(url, '_blank');
  }
}
