import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  BPMUpdateRequest,
  DocumentItem,
  DocumentService,
  getPersonArabicName,
  getPersonEnglishName,
  LookupService,
  LovList,
  Name,
  RouterConstants,
  RouterConstantsBase,
  RouterData,
  RouterDataToken,
  startOfDay,
  TransactionService,
  WizardItem,
  WorkFlowActions,
  WorkflowService,
  AuthTokenService
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalService } from 'ngx-bootstrap/modal';
import { iif, noop, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  ContributorDetails,
  ContributorsInfo,
  ContributorSummary,
  EngagementDetails,
  EngagementInfo,
  Engagements,
  RaiseContributorDetails,
  RaiseEngagementDetails,
  RaiseViolationContributor,
  ViolationsBaseScComponent,
  ViolationTransaction
} from '../../../shared';
import {
  DocumentTransactionId,
  DocumentTransactionType,
  RecordActionEnum,
  ViolationsEnum,
  ViolationsWizardTypes,
  ViolationTypeEnum
} from '../../../shared/enums';
import { ViolationContributorEnum } from '../../../shared/enums/violation-contributor';
import { BenefitInfo } from '../../../shared/models/benefit-info';
import { RaiseWrongBenefits } from '../../../shared/models/raise-wrong-benefits';
import {
  EstablishmentViolationsService,
  ViolationContributorService,
  ViolationsValidatorService
} from '../../../shared/services';
import {AppealViolationsService} from "@gosi-ui/features/violations/lib/shared/services/appeal-violations.service";

@Component({
  selector: 'vol-report-violation-sc',
  templateUrl: './report-violation-sc.component.html',
  styleUrls: ['./report-violation-sc.component.scss']
})
export class ReportViolationScComponent extends ViolationsBaseScComponent implements OnInit, OnDestroy {
  activeTab = 0;
  reportwizardItems: WizardItem[] = [];
  contributorSummaryDetails: ContributorSummary = new ContributorSummary();
  addedContributorDetail: ContributorSummary = new ContributorSummary();
  engagementsInfo: EngagementInfo;
  engInfo: EngagementInfo;
  documentList: DocumentItem[];
  documentList$: Observable<DocumentItem[]>;
  violationTypeList$: Observable<LovList>;
  inspectionTypeList$: Observable<LovList>;
  violationYesOrNoList$: Observable<LovList>;
  wrongBenefitsType$: Observable<LovList>;
  reportViolationForm: FormGroup = new FormGroup({});
  estRegNo: number;
  updateBpmTask: BPMUpdateRequest = new BPMUpdateRequest();
  isComments: boolean;
  transactionNo = Number(DocumentTransactionId.RAISE_VIOLATION_FO_ID);
  isPersonVerified = false;
  raiseViolationData: RaiseViolationContributor = new RaiseViolationContributor();
  violationData: RaiseViolationContributor = new RaiseViolationContributor();
  violationDetails: ViolationTransaction;
  //ViewChild components
  @ViewChild('reportViolationWizard', { static: false })
  reportViolationWizard: ProgressWizardDcComponent;
  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;

  violationType: String;
  hideContributor: boolean;
  removeContributorIndex: number;
  isContributorEdit: boolean;
  removeNewlyAdedEng: boolean;
  changeViolationType: boolean = false;
  makeAddContributorRed: boolean = false;
  hasProactiveEng: boolean = false;

  /**
   * @param lookUpService
   * @param alertService
   * @param documentService
   */
  constructor(
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly validatorService: ViolationsValidatorService,
    readonly activatedroute: ActivatedRoute,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location,
    readonly lookUpService: LookupService,
    readonly violationContributorService: ViolationContributorService,
    readonly estViolationService: EstablishmentViolationsService,
    readonly transactionService: TransactionService,
    readonly appealVlcService: AppealViolationsService,
    readonly authService: AuthTokenService
  ) {
    super(
      lookUpService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router,
      validatorService,
      routerData,
      activatedroute,
      appToken,
      location,
      transactionService,
      appealVlcService,
      authService
    );
  }

  ngOnInit(): void {
    if (this.estViolationService?.estRegNumber) {
      this.initializeWizard();
      this.setRouteParams();
      this.getEstablishment(this.estRegNo);
      this.setLookUpLists();
      this.docBusinessTransaction = DocumentTransactionType.REGISTER_VIOLATION_THROUGH_FO;
      this.raiseViolationData = new RaiseViolationContributor();
    } else this.location.back();
    // for editing page data
  }

  setRouteParams() {
    this.activatedroute.params.subscribe(param => {
      if (param) {
        this.estRegNo = Number(param.regno);
      }
    });
    this.activatedroute.queryParams.subscribe(queryParam => {
      if (queryParam) {
        this.violationId = Number(queryParam.violationId);
      }
    });
    if (this.router.url.indexOf('/edit') >= 0) {
      if (this.routerData.payload) super.initializeToken();
      this.updateBpmTask.taskId = this.routerData.taskId;
      this.updateBpmTask.user = this.routerData.assigneeId;
      this.isComments = true;
      this.editMode = true;
      this.transactionTraceId = this.routerData.transactionId;
      this.fetchDataForEdit();
      this.reportwizardItems[0].isActive = true;
      this.reportwizardItems[0].isDisabled = false;
    }
  }
  initializeWizard() {
    this.reportwizardItems = this.getWizardItems();
    this.reportwizardItems[0].isActive = true;
    this.reportwizardItems[0].isDisabled = false;
  }
  getWizardItems() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(ViolationsWizardTypes.VIOLATION_DETAILS, 'file-invoice-dollar'));
    wizardItems.push(new WizardItem(ViolationsWizardTypes.DOCUMENTS, 'file-alt'));
    return wizardItems;
  }
  /**
   * Event emitted method from progress wizard to make form navigation
   * @param index
   */
  selectWizard(wizardIndex: number) {
    this.alertService.clearAlerts();
    this.activeTab = wizardIndex;
  }

  setLookUpLists() {
    this.violationTypeList$ = this.lookUpService.getModifyViolationType();
    this.inspectionTypeList$ = this.lookUpService.getModifyInspectionType();
    this.violationYesOrNoList$ = this.lookUpService.getYesOrNoList();
    this.wrongBenefitsType$ = this.lookUpService.getWrongBenefitsType();
  }

  // method for service call during verify clicking
  getContributorInfo(identifier?: number) {
    this.alertService.clearAlerts();
    this.isPersonVerified = false;
    this.reportViolationForm.get('violationData').markAllAsTouched();
    this.hasProactiveEng = false;
    if (this.reportViolationForm.get('violationData').valid) {
      this.violationContributorService
        .getContributorInfo(this.estRegNo, identifier)
        .pipe(
          tap(res => {
            if (res?.contributors[0]?.socialInsuranceNo) {
              if (this.raiseViolationData?.contributorDetails.length > 0) {
                let isAlreadyAdded = false;
                this.raiseViolationData?.contributorDetails?.forEach(contributor => {
                  if (contributor?.socialInsuranceNumber === res?.contributors[0]?.socialInsuranceNo) {
                    isAlreadyAdded = true;
                  }
                });
                if (isAlreadyAdded) {
                  this.alertService.showErrorByKey('VIOLATIONS.CONTRIBUTOR-ALREADY-ADDED');
                } else {
                  this.isPersonVerified = true;
                  this.getEngagementInfo(res?.contributors[0]?.socialInsuranceNo, res);
                }
              } else {
                this.isPersonVerified = true;
                this.getEngagementInfo(res?.contributors[0]?.socialInsuranceNo, res);
              }
            } else {
              this.isPersonVerified = false;
              this.alertService.showErrorByKey('VIOLATIONS.NO-CONTRIBUTOR-FOUND');
            }
          })
        )
        .subscribe(noop, err => {
          this.alertService.showError(err?.error?.message, err?.error?.details);
          this.isPersonVerified = false;
        });
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
  setContributorName(name: Name) {
    this.contributorSummaryDetails.contributorName = {
      arabic: name?.arabic ? getPersonArabicName(name?.arabic) : null,
      english: name?.english?.name ? getPersonEnglishName(name?.english) : null
    };
  }

  /**
   * This method is to confirm cancelation the form
   */
  confirmCancel() {
    this.regNo = this.estRegNo;
    this.rejectViolation(this.activeTab);
  }

  // for buttons
  saveViolationDetails(isFinalSave: boolean, isContributor?: boolean) {
    this.alertService.clearAlerts();
    let isValid = true;
    let isFinalSaveValid = true;
    if (
      this.raiseViolationData.contributorDetails.length <= 0 &&
      this.raiseViolationData.violationType?.english.toUpperCase() !=
        ViolationTypeEnum.RAISE_VIOLATING_PROVISIONS.toUpperCase()
    ) {
      isValid = false;
    }
    if (isFinalSave && (this.isPersonVerified || this.isContributorEdit)) isFinalSaveValid = false;
    if (this.setViolationDataFromForm() && isValid && isFinalSaveValid) {
      this.saveReportViolation(isFinalSave, isContributor);
      this.makeAddContributorRed = false;
    } else {
      if (isValid && isFinalSaveValid) {
        this.alertService.showMandatoryErrorMessage();
        this.removeAddedEng();
      } else if (isValid && !isFinalSaveValid)
        this.alertService.showErrorByKey('VIOLATIONS.CONTRIBUTOR-UPDATE-IN-PROGRESS');
      else this.alertService.showErrorByKey('VIOLATIONS.ADD-ATLEAST-ONE-CONTRIBUTOR');
      if (!isFinalSaveValid && !this.isContributorEdit) this.makeAddContributorRed = true;
    }
  }
  saveReportViolation(isFinalSave: boolean, isContributor: boolean, vioTypeChange?: boolean) {
    this.estViolationService
      .saveReportViolationData(this.estRegNo, this.raiseViolationData)
      .pipe(
        tap(res => {
          if (res?.referenceNo && !this.editMode) this.transactionTraceId = res?.referenceNo;
          if (res?.violationId && !this.editMode) this.violationId = res?.violationId;
          this.hasSaved = true;
          if (isContributor) {
            this.hideContributor = false;
            this.isPersonVerified = false;
            this.isContributorEdit = this.isContributorEdit ? !this.isContributorEdit : this.isContributorEdit;
            if (!vioTypeChange) this.alertService.showSuccess(res?.message);
          }
          if (isFinalSave) {
            this.activeTab++;
            if (this.reportViolationWizard) this.reportViolationWizard.setNextItem(this.activeTab);
          }
          this.setViolationData(isContributor);
          if (!isContributor && !isFinalSave) {
            this.removeAddedEng();
          }
        }),
        switchMap(() =>
          iif(
            () => isFinalSave,
            this.getDocuments(
              DocumentTransactionId.MANUALLY_TRIGGERED_VIOLATION,
              DocumentTransactionType.REGISTER_VIOLATION_THROUGH_FO,
              this.violationId,
              this.editMode ? this.raiseViolationData?.referenceNo : this.transactionTraceId
            )
          )
        ),
        catchError(err => {
          this.removeNewlyAddedEng();
          this.handleErrors(err);
          return throwError(err);
        })
      )
      .subscribe();
  }
  removeAddedEng() {
    const contributorIndex = this.getContributorIndex(this.contributorSummaryDetails?.socialInsuranceNo);
    this.engagementsInfo?.engagements?.forEach(engagement => {
      if (this.checkIfEngAdded(engagement, contributorIndex)) engagement.alreadyAdded = true;
      else engagement.alreadyAdded = false;
    });
  }
  checkIfEngAdded(eng: Engagements, contIndex: number): boolean {
    let engSaved = false;
    this.raiseViolationData?.contributorDetails[contIndex]?.engagementDetails?.forEach(engagement => {
      if (engagement?.engagementId === eng?.engagementId) engSaved = true;
    });
    return engSaved;
  }
  getContributorIndex(socialInsuranceNo) {
    let index = -1;
    this.raiseViolationData?.contributorDetails.forEach((contributor, i) => {
      if (contributor?.socialInsuranceNumber === socialInsuranceNo) {
        index = i;
      }
    });
    return index;
  }
  removeNewlyAddedEng() {
    this.raiseViolationData?.contributorDetails?.forEach(contributor => {
      contributor.engagementDetails = contributor.engagementDetails.filter(
        eng => eng.recordActionType !== RecordActionEnum.ADD // filter only recordAction as modify or noaction... confirm with BE
      );
      if (contributor.engagementDetails.length === 0) {
        contributor.benefitsDetails = [];
      }
    });
    this.removeNewlyAdedEng = !this.removeNewlyAdedEng;
  }
  setViolationData(isContributor?: boolean) {
    this.raiseViolationData.referenceNo = this.transactionTraceId;
    this.setContributorAction();
    if (isContributor) {
      this.raiseViolationData.contributorDetails.forEach(contributor => {
        if (contributor.socialInsuranceNumber === this.contributorSummaryDetails.socialInsuranceNo) {
          contributor.contributorName = this.contributorSummaryDetails.contributorName;
          contributor.identity = this.contributorSummaryDetails.identity;
        }
      });
      this.violationData = JSON.parse(JSON.stringify(this.raiseViolationData));
      this.contributorSummaryDetails = new ContributorSummary();
      this.engagementsInfo = new EngagementInfo();
    }
  }
  setContributorAction() {
    this.raiseViolationData.contributorDetails = this.raiseViolationData?.contributorDetails.filter(
      contributor => contributor?.recordAction !== RecordActionEnum.REMOVE
    );
    this.raiseViolationData?.contributorDetails.forEach(contributor => {
      if (contributor?.recordAction !== RecordActionEnum.REMOVE) {
        contributor.recordAction = RecordActionEnum.NO_ACTION;
      }
      this.setEngagementAction(contributor);
    });
  }
  setEngagementAction(contributor: RaiseContributorDetails) {
    contributor.engagementDetails = contributor?.engagementDetails.filter(
      engagement => engagement?.recordActionType !== RecordActionEnum.REMOVE
    );
    contributor?.engagementDetails.forEach(engagement => {
      if (engagement?.recordActionType !== RecordActionEnum.REMOVE) {
        engagement.recordActionType = RecordActionEnum.NO_ACTION;
      }
    });
  }
  cancelViolationDetails() {}

  //The method to navigate to previous tab

  previousSectionDetails() {
    this.alertService.clearAlerts();
    this.activeTab--;
    this.reportViolationWizard.setPreviousItem(this.activeTab);
  }

  getEngagementInfo(
    socialInsuranceNo: number,
    contributorData: ContributorsInfo,
    isEditAdded?: boolean,
    index?: number
  ) {
    this.contributorSummaryDetails.engagements = new Array<Engagements>();
    this.violationContributorService
      .getEngagementInfo(this.estRegNo, socialInsuranceNo)
      .pipe(
        tap(res => {
          res?.engagements?.forEach(engagement => {
            if (
              (engagement?.status === ViolationContributorEnum.LIVE ||
                engagement?.status === ViolationContributorEnum.HISTORY ||
                engagement?.status === ViolationContributorEnum.CANCELLED) &&
              engagement?.proactive === true
            ) {
              this.hasProactiveEng = true;
            }
          });
          return res;
        }),
        tap(res => {
          res.engagements = res.engagements.filter(engagement => {
            if (
              (engagement?.status === ViolationContributorEnum.LIVE ||
                engagement?.status === ViolationContributorEnum.HISTORY ||
                engagement?.status === ViolationContributorEnum.CANCELLED) &&
              engagement?.proactive === false
            ) {
              return engagement;
            }
          });
          if (isEditAdded) {
            this.addedContributorDetail = new ContributorSummary();
            this.addedContributorDetail.contributorName = this.violationData.contributorDetails[index].contributorName;
            this.addedContributorDetail.socialInsuranceNo = this.violationData.contributorDetails[
              index
            ].socialInsuranceNumber;
            this.addedContributorDetail.identity = this.violationData.contributorDetails[index].identity;
            this.addedContributorDetail.engagements = { ...res.engagements };
            this.engInfo = { ...res };
          } else {
            this.contributorSummaryDetails = new ContributorSummary();
            let contributorDetails = contributorData?.contributors[0]?.person;
            this.setContributorName(contributorDetails?.name);
            this.contributorSummaryDetails.identity = contributorDetails?.identity;
            this.contributorSummaryDetails.socialInsuranceNo = contributorData?.contributors[0]?.socialInsuranceNo;
            this.contributorSummaryDetails.engagements = { ...res.engagements };
            this.engagementsInfo = { ...res };
          }
        })
      )
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message, err?.error?.details);
        this.isPersonVerified = false;
      });
  }
  resetPerson() {
    this.isPersonVerified = false;
    this.makeAddContributorRed = false;
    // if (this.checkForRemovalRecordAction()) this.saveViolationDetails(false);
    if (this.checkForRemovalRecordAction()) this.saveContributor();
  }
  cancelCurrentContributor() {
    this.makeAddContributorRed = false;
    if (this.checkForRemovalRecordAction()) this.saveContributor();
    else {
      this.hideContributor = false;
      this.isPersonVerified = false;
    }
  }
  checkForRemovalRecordAction() {
    let haveRemove = false;
    this.raiseViolationData.contributorDetails.forEach(item => {
      if (item.recordAction !== RecordActionEnum.NO_ACTION) haveRemove = true;
    });
    return haveRemove;
  }
  /** Method to fetch data for edit on return. */
  fetchDataForEdit() {
    this.getViolationDetails(this.violationId, this.estRegNo).subscribe(
      res => {
        this.violationDetails = res;
        this.setViolationDetailsData(this.violationDetails);
      },
      err => {
        this.handleErrors(err);
        return throwError(err);
      }
    );
  }
  setViolationDetailsData(violationDetails: ViolationTransaction) {
    if (violationDetails) {
      this.violationData = new RaiseViolationContributor();
      this.violationData.contributorDetails = this.getViolatedContributorsList(violationDetails?.contributors);
      this.violationData.discoveredAfterInspection =
        this.violationDetails?.discoveredAfterInspection?.english === ViolationsEnum.BOOLEAN_YES ? true : false;
      this.violationData.discoveryDate = violationDetails?.dateReported;
      this.violationData.inspectionType = violationDetails?.inspectionInfo?.inspectionType;
      this.violationData.referenceNo = violationDetails?.violationReferenceNumber;
      this.violationData.violationDescription = violationDetails?.violationDescription;
      this.violationData.violationType = violationDetails?.violationType;
      this.violationData.visitId = violationDetails?.inspectionInfo?.visitId;
      this.setViolationDataForEdit();
      this.violationType = this.violationData?.violationType?.english;
    }
  }
  setViolationDataForEdit() {
    this.raiseViolationData = JSON.parse(JSON.stringify(this.violationData));
    this.contributorSummaryDetails = new ContributorSummary();
    this.engagementsInfo = new EngagementInfo();
  }
  getViolatedContributorsList(contributors: ContributorDetails[]): RaiseContributorDetails[] {
    let contributorsList: RaiseContributorDetails[] = new Array<RaiseContributorDetails>();
    contributorsList = [];
    contributors.forEach(contributor => {
      contributorsList.push({
        engagementDetails: this.getAddedContributorEngs(contributor?.engagementInfo),
        benefitsDetails: this.getAddedContributorBenefits(contributor?.benefitInfo),
        recordAction: RecordActionEnum.NO_ACTION,
        socialInsuranceNumber: contributor?.socialInsuranceNo,
        contributorId: contributor?.contributorId,
        contributorName: contributor?.contributorName,
        identity: contributor?.identity,
        enableEdit: false
      });
    });
    return contributorsList;
  }
  getAddedContributorEngs(engagementInfo: EngagementDetails[]): RaiseEngagementDetails[] {
    let engagementList: RaiseEngagementDetails[] = new Array<RaiseEngagementDetails>();
    engagementList = [];
    engagementInfo.forEach(eng => {
      engagementList.push({
        cancelledPeriodEndDate: eng?.cancelledDurationEndDate,
        cancelledPeriodStartDate: eng?.cancelledDurationStartDate,
        contributionAmount: eng?.contributionAmount,
        engagementId: eng?.engagementId,
        isBenefitEffected:
          eng?.isBenefitsEffected?.english === ViolationsEnum.BOOLEAN_YES
            ? true
            : eng?.isBenefitsEffected?.english === ViolationsEnum.BOOLEAN_NO
            ? false
            : null,
        isEngagementBackdated:
          eng?.isBackdated?.english === ViolationsEnum.BOOLEAN_YES
            ? true
            : eng?.isBackdated?.english === ViolationsEnum.BOOLEAN_NO
            ? false
            : null,
        isFullyCancelled:
          eng?.isEngagementFullyCanceled?.english === ViolationsEnum.BOOLEAN_YES
            ? true
            : eng?.isEngagementFullyCanceled?.english === ViolationsEnum.BOOLEAN_NO
            ? false
            : null,
        isWageCorrected: eng?.isWageCorrected,
        isProvisionsViolating: null,
        recordActionType: RecordActionEnum.NO_ACTION
      });
    });
    return engagementList;
  }
  getAddedContributorBenefits(benefitInfo: BenefitInfo[]): RaiseWrongBenefits[] {
    let benefitList: RaiseWrongBenefits[] = new Array<RaiseWrongBenefits>();
    benefitList = [];
    benefitInfo?.forEach(benefit => {
      benefitList.push({
        benefitType: benefit?.benefitType,
        benefitAmount: benefit?.benefitAmount,
        firstPaymentDate: benefit?.firstPaymentDate,
        lastBenefitsDuration: benefit?.lastBenefitDate,
        recordActionType: RecordActionEnum.NO_ACTION
      });
    });
    return benefitList;
  }

  violationTypeSelected(type: string) {
    // prompt a msg warning contributor removal. on confirm remove all contributors that are added.
    this.alertService.clearAlerts();
    // this.modalRef = this.modalService.show(templateRef, {
    //   class: 'modal-md modal-dialog-centered',
    //   ignoreBackdropClick: true
    // });
    if (type) {
      if (this.raiseViolationData?.contributorDetails?.length > 0) {
        this.setContRecordActionRemove();
        this.saveReportViolation(false, true, true);
      }
      this.raiseViolationData.violationType.english = this.raiseViolationData.violationType.arabic = type;
      this.isPersonVerified = false;
      this.hideContributor = false;
      this.raiseViolationData.contributorDetails = [];
      this.violationType = type;
      this.makeAddContributorRed = false;
    }
  }

  setContRecordActionRemove() {
    this.raiseViolationData.contributorDetails.forEach(cont => {
      cont.engagementDetails = cont.engagementDetails.filter(eng => eng.recordActionType !== RecordActionEnum.ADD);
      if (cont.engagementDetails.length > 0) {
        cont.recordAction = RecordActionEnum.REMOVE;
      } else {
        cont.recordAction = RecordActionEnum.NO_ACTION;
      }
      this.raiseViolationData.contributorDetails = this.raiseViolationData.contributorDetails.filter(
        cont => cont.recordAction !== RecordActionEnum.NO_ACTION
      );
    });
  }
  // confirmTypeChange(){
  //   this.changeViolationType=true;
  //   this.hideModal();
  // }
  // cancelTypeChange(){
  //   this.changeViolationType=false;
  //   this.hideModal();
  // }
  setViolationDataFromForm() {
    this.reportViolationForm.get('violationData').markAllAsTouched();
    if (this.getFormValidity(this.reportViolationForm.get('violationData'))) {
      this.raiseViolationData.violationType = this.reportViolationForm.get('violationData').get('violationType').value;
      this.raiseViolationData.discoveryDate.gregorian = startOfDay(this.reportViolationForm
        .get('violationData')
        .get('violationDiscoveryDate')
        .get('gregorian').value);
      this.raiseViolationData.discoveredAfterInspection =
        this.reportViolationForm.get('violationData').get('inspectionDiscovered').get('english').value ===
        ViolationsEnum.BOOLEAN_YES
          ? true
          : false;
      this.raiseViolationData.inspectionType = this.reportViolationForm.get('violationData').get('inspectionType').value
        ? this.reportViolationForm.get('violationData').get('inspectionType').value
        : null;
      this.raiseViolationData.visitId = this.reportViolationForm.get('violationData').get('visitId').value
        ? this.reportViolationForm.get('violationData').get('visitId').value
        : null;
      this.raiseViolationData.violationDescription = this.reportViolationForm
        .get('violationData')
        .get('description').value;
      return true;
    } else return false;
  }
  getFormValidity(form: AbstractControl) {
    let valid = true;
    valid =
      (this.editMode ? true : form.get('violationType').valid) &&
      form.get('violationDiscoveryDate').get('gregorian').valid &&
      form.get('description').valid &&
      form.get('inspectionDiscovered').get('english').valid;
    if (form.get('inspectionDiscovered').get('english').value === ViolationsEnum.BOOLEAN_NO && valid) {
      valid = true;
    } else if (form.get('inspectionDiscovered').get('english').value === ViolationsEnum.BOOLEAN_YES && valid) {
      valid = form.get('inspectionType').get('english').valid;
      if (form.get('inspectionType').get('english').value === ViolationsEnum.MANUAL && valid) valid = true;
      else if (form.get('inspectionType').get('english').value === ViolationsEnum.RASED && valid)
        valid = form.get('visitId').valid;
    }
    return valid;
  }
  saveEngagement() {
    if (this.raiseViolationData?.contributorDetails?.length > 0) {
      this.saveViolationDetails(false);
    } else {
      this.alertService.showErrorByKey('VIOLATIONS.ADD-ATLEAST-ONE-CONTRIBUTOR');
    }
  }
  addContributorBtn() {
    this.hideContributor = true;
  }
  saveContributor() {
    this.saveViolationDetails(false, true);
  }
  /**
   * Method to submit document details
   */
  submitReportViolation() {
    if (this.checkDocumentValidity(this.reportViolationForm)) {
      const comments = this.reportViolationForm.get('comments.comments')?.value;
      this.validatorService
        .submitChangeViolation(
          this.violationId,
          this.transactionTraceId,
          comments,
          DocumentTransactionType.REPORT_VIOLATION,
          this.editMode
        )
        .subscribe(
          res => {
            if (this.editMode) {
              this.updateTaskWorkflows(comments);
            } else {
              this.setTransactionComplete();
              this.router.navigate([RouterConstantsBase.ROUTE_VIOLATION_HISTORY(this.estRegNo)]);
              this.validatorService.alertMessage = res.message;
            }
          },
          err => this.alertService.showError(err.error.message)
        );
    }
  }
  updateTaskWorkflows(comment) {
    this.updateBpmTask.comments = comment;
    this.updateBpmTask.outcome = WorkFlowActions.UPDATE;
    this.workflowService.updateTaskWorkflow(this.updateBpmTask).subscribe(
      res => {
        this.setTransactionComplete();
        this.alertService.showSuccessByKey(this.getSuccessMessage());
        this.router.navigate([RouterConstants.ROUTE_INBOX]);
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
  removeAddedContributor(index: number, templateRef: TemplateRef<HTMLElement>) {
    this.removeContributorIndex = index;
    this.modalRef = this.modalService.show(templateRef, {
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true
    });
  }
  confirmRemove() {
    this.raiseViolationData.contributorDetails[this.removeContributorIndex].recordAction = RecordActionEnum.REMOVE;
    this.saveReportViolation(false, true);
    this.hideModal();
  }
  hideRemoveContributorModal() {
    this.removeContributorIndex = -1;
    this.hideModal();
  }
  updateAddedContributor(index: number) {
    this.getEngagementInfo(
      this.violationData.contributorDetails[index].socialInsuranceNumber,
      new ContributorsInfo(),
      true,
      index
    );
    this.isContributorEdit = true;
  }
  cancelCurrentEdit() {
    this.isContributorEdit = false;
  }
  ngOnDestroy(): void {
    this.estViolationService.estRegNumber = null;
  }
}
