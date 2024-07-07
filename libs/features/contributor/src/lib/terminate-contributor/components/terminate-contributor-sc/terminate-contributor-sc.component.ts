/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BankAccount,
  BilingualText,
  CalendarService,
  CoreIndividualProfileService,
  DocumentItem,
  DocumentService,
  GosiCalendar,
  LookupService,
  LovList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  StorageService,
  TransactionService,
  UuidGeneratorService,
  WorkflowService,
  bindToObject,
  convertToHijriFormat,
  convertToHijriFormatAPI,
  convertToStringDDMMYYYY,
  getFormErrorCount,
  markFormGroupTouched,
  scrollToTop,
  startOfDay
} from '@gosi-ui/core';
import moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, iif, noop, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ContributorBaseScComponent } from '../../../shared/components';
import { ContributorConstants, ContributorRouteConstants } from '../../../shared/constants';
import { DocumentTransactionId, DocumentTransactionType, PersonTypesEnum } from '../../../shared/enums';
import {
  ContributorBPMRequest,
  HijiriConstant,
  PersonalInformation,
  SecondmentDetailsDto,
  StudyLeaveDetailsDto,
  SystemParameter,
  TerminateContributorDetails,
  TerminateContributorPayload
} from '../../../shared/models';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  TerminateContributorService
} from '../../../shared/services';
import { TerminationReason } from '../../../shared/enums/termination-reason';

@Component({
  selector: 'cnt-terminate-contributor-sc',
  templateUrl: './terminate-contributor-sc.component.html',
  styleUrls: ['./terminate-contributor-sc.component.scss']
})
export class TerminateContributorScComponent extends ContributorBaseScComponent implements OnInit, OnDestroy {
  /** Local variables */
  terminateForm: FormGroup = new FormGroup({});
  isAppPrivate: boolean;
  terminatePayload: TerminateContributorPayload;
  terminationDetails: TerminateContributorDetails;
  systemParameter: SystemParameter;
  isTransactionSuccess = false;
  isDocumentsRequired: boolean;
  apiTriggered = false;
  nicDetails: PersonalInformation;
  errorAlert: boolean = false;
  isAdminReEdit: boolean;
  role: string;
  backdatedEngValidatorRequired: boolean;
  maxHijLeavingDate = '13/04/1439';
  hijiriDateConst: HijiriConstant;
  ppaCalenderShiftDate: GosiCalendar;
  /** Observables */
  leavingReasonList$: Observable<LovList>;
  validCheck: TerminateContributorPayload;
  certificationTypeAbroad$: Observable<LovList>;
  certificationTypeNoAbroad$: Observable<LovList>;
  SecondmentEstType$: Observable<LovList>;
  secondmentEstablishments$: Observable<LovList>;
  terminationReason = TerminationReason;
  selectedLeavingReason: string;
  bankNameList$: Observable<LovList>;
  isBankDetailsPending: boolean;
  bankAccount: BankAccount;
  nicDateErr = false;
  nicReasonErr = false;
  isUnclaimed: boolean = false;
  payload;
  minDiff: any;
  secDiff: any;
  seconds: string;
  isGOL: boolean;
  taskId: string = undefined;

  /** Creates an instance of TerminateContributorScComponent. */
  constructor(
    readonly contributorService: ContributorService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly manageWageService: ManageWageService,
    readonly lookupService: LookupService,
    readonly engagementService: EngagementService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly terminateContributorService: TerminateContributorService,
    readonly workflowService: WorkflowService,
    readonly route: ActivatedRoute,
    readonly storageService: StorageService,
    readonly router: Router,
    readonly coreService: CoreIndividualProfileService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    private uuidGeneratorService: UuidGeneratorService,
    readonly location: Location,
    readonly calendarService: CalendarService,
    readonly transactionService: TransactionService
  ) {
    super(
      alertService,
      establishmentService,
      contributorService,
      engagementService,
      documentService,
      workflowService,
      manageWageService,
      routerDataToken,
      calendarService
    );
  }

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.fetchSystemParameters();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.isDocumentsRequired = this.isAppPrivate ? true : false;
    this.checkEditMode();
    this.setKeysForView();
    if (this.isEditMode) this.checkReEdit();
    this.fetchDataToDisplay();
    if (!this.isEditMode) this.uuid = this.uuidGeneratorService.getUuid();
    this.calculateTimeDiff();
  }

  /** Method to get system parameter like maximum backdated joining date. */
  fetchSystemParameters(): void {
    this.calendarService.getSystemRunDate().subscribe(res => {
      this.sysDate = res;
    });
    this.contributorService.getSystemParams().subscribe(res => {
      (this.systemParameter = new SystemParameter().fromJsonToObject(res)), this.setHijiriDate();
    });
  }

  /** Method to check whether it is edit mode. */
  checkEditMode() {
    this.route.url.subscribe(res => {
      if (res.length > 0 && res[0].path === 'edit') this.isEditMode = true;
    });
    if (this.routerDataToken.payload) {
      super.initializeFromToken();
      this.payload = JSON.parse(this.routerDataToken.payload);
      this.taskId = this.routerDataToken.taskId
      this.isUnclaimed = this.payload?.isPool;
      this.isGOL = this.payload.channel === 'gosi-online' ? true : false;
      console.log("payload",this.payload,"taskid",this.taskId,"claim",this.isUnclaimed)
    }
  }

  /** Method to fetch data to display. */
  fetchDataToDisplay(): void {
    if (this.registrationNo && this.socialInsuranceNo && this.engagementId) {
      this.getEstablishmentDetails(this.registrationNo)
        .pipe(
          // switchMap(() => this.getContributorDetails(this.registrationNo, this.socialInsuranceNo)),
          switchMap(() =>
            iif(
              () => this.isEditMode,
              this.terminateContributorService
                .getTerminationDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
                .pipe(tap(res => (this.terminationDetails = res))),
              this.getEngagementDetails(this.registrationNo, this.socialInsuranceNo, this.engagementId, null).pipe(
                tap(res => (this.engagement = res))
              )
            )
          ),
          switchMap(() =>
            iif(
              () => this.engagement?.secondment || this.engagement?.studyLeave,
              this.isAppPrivate
                ? this.getContributorDetailsBySin(this.socialInsuranceNo, new Map().set('includeBankAccountInfo', true))
                : this.getContributorDetails(
                    this.registrationNo,
                    this.socialInsuranceNo,
                    new Map().set('includeBankAccountInfo', true)
                  ),
              this.getContributorDetails(this.registrationNo, this.socialInsuranceNo)
            )
          ),
          tap(() => this.getDocs()),
          switchMap(() => {
            //To fetch leaving reason based on nationality of the person.
            const nationalityType: string = this.contributor.person.personType === PersonTypesEnum.SAUDI ? '1' : '2';
            this.leavingReasonList$ =
              this.isPpa || this.engagement?.ppaIndicator
                ? this.engagement?.secondment || this.engagement?.studyLeave
                  ? this.lookupService.getReasonForLeavingSecondment()
                  : this.lookupService.getReasonForLeavingListPpa()
                : this.lookupService.getReasonForLeavingList(nationalityType);
            //Government job joining should be available only in FO.
            if (!this.isAppPrivate)
              this.leavingReasonList$ = this.leavingReasonList$.pipe(
                filter(lovlist => lovlist && lovlist !== null),
                map(lovList => {
                  return new LovList(
                    lovList.items.filter(lov => lov.value.english !== ContributorConstants.GOV_JOB_JOINING)
                  );
                })
              );
            // if (!this.contributor.person.deathDate?.gregorian && nationalityType === '1') this.extractLeavingReason();
            return this.leavingReasonList$;
          }),
          switchMap(() =>
            iif(() => this.engagement?.secondment || this.engagement?.studyLeave, this.checkBankWorkflow())
          ),
          catchError(err => {
            this.showError(err);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    }
    this.SecondmentEstType$ = this.lookupService.getSecondmentEstType();
    this.secondmentEstablishments$ = this.lookupService.getSecondmentEstList();
    this.certificationTypeAbroad$ = this.lookupService.getCertificationTypeListOutsideSaudi();
    this.certificationTypeNoAbroad$ = this.lookupService.getCertificationTypeListInsideSaudi();
  }

  // this method is used to set max min hijiri dates
  setHijiriDate() {
    this.hijiriDateConst = new HijiriConstant();
    const currentDate = new Date();

    // this.hijiriDateConst.gosiMinHijiriDate =  "01/10/1317";
    this.hijiriDateConst.gosiMaxHijiriDate = '13/04/1439';
    // this.hijiriDateConst.gosiMaxHijiriDateInGregorian = '2017-12-31';
    // this.hijiriDateConst.gosiMaxHijiriNextDateInGregorian = '2018-01-01';
    // this.hijiriDateConst.gosiMaxHijiriNextYearInGregorian = '2018';

    // this.hijiriDateConst.ppaMinHijiriDate = "01/10/1317";
    moment(currentDate).isBefore(moment(this.systemParameter.REG_CONT_MIN_START_DATE_G_PPA))
      ? (this.hijiriDateConst.ppaMaxHijirDate = convertToHijriFormat(this.sysDate?.hijiri))
      : (this.hijiriDateConst.ppaMaxHijirDate = this.systemParameter.REG_CONT_MAX_END_DATE_H_PPA);
    this.ppaCalenderShiftDate = new GosiCalendar();
    this.ppaCalenderShiftDate.gregorian = moment(this.systemParameter.PPA_CALENDAR_SHIFT_DATE).toDate();
    this.calendarService.getHijiriDate(this.ppaCalenderShiftDate.gregorian).subscribe(res => {
      this.ppaCalenderShiftDate.hijiri = convertToHijriFormat(res.hijiri);
    });

    // this.hijiriDateConst.ppaMinGregorianDate = this.systemParams.REG_CONT_MIN_START_DATE_G_PPA;
    this.hijiriDateConst.ppaMaxHjiriDateInGregorian = this.systemParameter.REG_CONT_MIN_START_DATE_G_PPA;
    // this.hijiriDateConst.ppaMaxHijiriNextDateInGregorian = addDays(this.systemParams.REG_CONT_MIN_START_DATE_G_PPA , 1);
  }

  leavingReasonSelected(value: string) {
    this.selectedLeavingReason = value;
    if (value === this.terminationReason.SECONDMENT || value === this.terminationReason.STUDYLEAVE) {
      this.getRequiredDocuments(
        this.engagementId,
        value === this.terminationReason.SECONDMENT
          ? DocumentTransactionId.REGISTER_SECONDMENT
          : DocumentTransactionId.REGISTER_STUDY_LEAVE,
        value === this.terminationReason.SECONDMENT
          ? DocumentTransactionType.REGISTER_SECONDMENT
          : DocumentTransactionType.REGISTER_STUDY_LEAVE,
        this.isEditMode,
        this.referenceNo
      );
    } else if (!this.engagement?.secondment && !this.engagement?.studyLeave) {
      this.getRequiredDocuments(
        this.engagementId,
        DocumentTransactionId.TERMINATE_CONTRIBUTOR,
        this.getDocumentTransactionType(),
        this.isEditMode,
        this.referenceNo
      );
    }
  }
  getDocs() {
    if (this.engagement?.secondment || this.engagement?.studyLeave) {
      this.getRequiredDocuments(
        this.engagementId,
        DocumentTransactionId.TERMINATE_CONTRIBUTOR,
        this.getDocTerminateType(),
        this.isEditMode,
        this.referenceNo
      );
    } else
      this.getRequiredDocuments(
        this.engagementId,
        DocumentTransactionId.TERMINATE_CONTRIBUTOR,
        this.getDocumentTransactionType(),
        this.isEditMode,
        this.referenceNo
      );
  }
  /** Method to get document transaction type. */
  getDocumentTransactionType(): string {
    return this.establishment.gccEstablishment
      ? DocumentTransactionType.TERMINATE_CONTRIBUTOR_IN_GCC
      : DocumentTransactionType.TERMINATE_CONTRIBUTOR;
  }
  /** Method to get document transaction type for terminate secondment and studyleave. */
  getDocTerminateType(): string {
    return this.engagement?.secondment
      ? DocumentTransactionType.TERMINATE_SECONDMENT
      : DocumentTransactionType.TERMINATE_STUDY_LEAVE;
  }

  /** Method to refresh documents after scan. */
  refreshDocument(doc: DocumentItem): void {
    if (
      this.selectedLeavingReason === this.terminationReason.SECONDMENT ||
      this.selectedLeavingReason === this.terminationReason.STUDYLEAVE
    ) {
      super.refreshDocument(
        doc,
        this.engagementId,
        this.selectedLeavingReason === this.terminationReason.SECONDMENT
          ? DocumentTransactionId.REGISTER_SECONDMENT
          : DocumentTransactionId.REGISTER_STUDY_LEAVE,
        this.selectedLeavingReason === this.terminationReason.SECONDMENT
          ? DocumentTransactionType.REGISTER_SECONDMENT
          : DocumentTransactionType.REGISTER_STUDY_LEAVE,
        this.referenceNo,
        this.uuid
      );
    } else {
      super.refreshDocument(
        doc,
        this.engagementId,
        DocumentTransactionId.TERMINATE_CONTRIBUTOR,
        this.getDocumentTransactionType(),
        this.referenceNo,
        this.uuid
      );
    }
  }

  /** Method to submit terminate transaction. */
  submitTransaction(): void {
    if (!this.apiTriggered) {
      if (this.checkValidity()) {
        this.apiTriggered = true;
        this.storageService.setLocalValue('triggered', this.apiTriggered);
        this.terminatePayload = this.assembleTerminatePayload();
        this.terminateContributorService
          .submitTerminateTransaction(
            this.registrationNo,
            this.socialInsuranceNo,
            this.engagementId,
            this.terminatePayload
          )
          .pipe(
            tap(res => {
              if (!this.isEditMode) {
                this.isTransactionSuccess = true;
                this.handleTransactionCompletion(res.message);
              }
            }),
            switchMap(res => iif(() => this.isEditMode, this.submitTransactionOnEdit(res.message))),
            catchError(err => {
              this.apiTriggered = false;
              this.showError(err);
              return throwError(err);
            })
          )
          .subscribe(noop, noop);
      }
    }
  }

  /** Method to check validity of data. */
  checkValidity(): boolean {
    let flag = true;
    const documentScanStatus = this.isDocumentsRequired
      ? this.documentService.checkMandatoryDocuments(this.documents)
      : true;
    this.validCheck = this.assembleTerminatePayload();
    if (!this.terminateForm.valid) {
      markFormGroupTouched(this.terminateForm.get('terminateDetails') as FormGroup);
      //markFormGroupTouched(this.terminateForm.get('comments') as FormGroup);
      flag = false;
      this.showMandatoryFieldsError();
    } else if (!documentScanStatus) {
      flag = false;
      this.showMandatoryDocumentsError();
    } else if (this.nicReasonErr) {
      flag = false;
      this.alertService.showErrorByKey('CONTRIBUTOR.LEAVING-REASON-NOT-DEATH');
      scrollToTop();
    } else if (this.errorAlert) {
      flag = false;
      this.alertService.showErrorByKey('CONTRIBUTOR.TERMINATION-DATE-DEATH');
      scrollToTop();
    }
    return flag;
  }

  /** Method to assemble terminate contributor payload. */
  assembleTerminatePayload(): TerminateContributorPayload {
    const data: TerminateContributorPayload = bindToObject(
      new TerminateContributorPayload(),
      (this.terminateForm.get('terminateDetails') as FormGroup).getRawValue()
    );
    if (this.terminateForm?.get('terminateDetails')?.get('secondmentDetails')) {
      data.secondmentDetails = bindToObject(
        new SecondmentDetailsDto(),
        (this.terminateForm.get('terminateDetails')?.get('secondmentDetails') as FormGroup).getRawValue()
      );
    }
    if (this.terminateForm?.get('terminateDetails')?.get('studyLeaveDetails')) {
      data.studyLeaveDetails = bindToObject(
        new StudyLeaveDetailsDto(),
        (this.terminateForm.get('terminateDetails')?.get('studyLeaveDetails') as FormGroup).getRawValue()
      );
    }
    data.leavingDate.gregorian = startOfDay(data.leavingDate.gregorian);
    data.leavingDate.hijiri = convertToHijriFormatAPI(data.leavingDate.hijiri);
    if (data?.secondmentDetails?.secondmentStartDate) {
      data.secondmentDetails.secondmentStartDate.gregorian = startOfDay(
        this.terminateForm
          ?.get('terminateDetails')
          ?.get('secondmentDetails')
          ?.get('secondmentStartDate')
          ?.get('gregorian').value
      );
      data.secondmentDetails.secondmentStartDate.hijiri = convertToHijriFormatAPI(
        this.terminateForm?.get('terminateDetails')?.get('secondmentDetails')?.get('secondmentStartDate')?.get('hijiri')
          .value
      );
      data.secondmentDetails.secondmentEndDate.gregorian = startOfDay(
        this.terminateForm
          ?.get('terminateDetails')
          ?.get('secondmentDetails')
          ?.get('secondmentEndDate')
          ?.get('gregorian').value
      );
      data.secondmentDetails.secondmentEndDate.hijiri = convertToHijriFormatAPI(
        this.terminateForm?.get('terminateDetails')?.get('secondmentDetails')?.get('secondmentEndDate')?.get('hijiri')
          .value
      );
    }
    if (data?.studyLeaveDetails?.studyLeaveStartDate) {
      data.studyLeaveDetails.studyLeaveStartDate.gregorian = startOfDay(
        this.terminateForm
          ?.get('terminateDetails')
          ?.get('studyLeaveDetails')
          ?.get('studyLeaveStartDate')
          ?.get('gregorian').value
      );
      data.studyLeaveDetails.studyLeaveStartDate.hijiri = convertToHijriFormatAPI(
        this.terminateForm?.get('terminateDetails')?.get('studyLeaveDetails')?.get('studyLeaveStartDate')?.get('hijiri')
          .value
      );
      data.studyLeaveDetails.studyLeaveEndDate = null;
    }
    if (
      this.terminateForm?.get('terminateDetails')?.get('studyLeaveDetails')?.get('studyInsideSaudi')?.get('english')
        .value
    ) {
      data.studyLeaveDetails.studyingAbroad =
        this.terminateForm?.get('terminateDetails')?.get('studyLeaveDetails')?.get('studyInsideSaudi')?.get('english')
          .value === 'Yes'
          ? false
          : true;
    }
    data.comments = this.terminateForm.get('comments')?.get('comments')?.value;
    if (this.engagement?.secondment || this.engagement?.studyLeave) {
      data.bankAccount = this.assembleBankDetails();
    }
    if (this.isEditMode) data.editFlow = true;
    else {
      data.editFlow = false;
      data.uuid = this.uuid;
    }
    return data;
  }

  /** Method to handle transaction completion. */
  handleTransactionCompletion(message: BilingualText) {
    this.alertService.showSuccess(message, null, 5);
    this.navigateBack();
  }

  /** Method to submit transaction on edit mode. */
  submitTransactionOnEdit(message: BilingualText) {
    const workflowPayload: ContributorBPMRequest = this.assembleWorkflowPayload(
      this.routerDataToken,
      this.terminateForm.get('comments.comments').value
    );
    return this.workflowService.updateTaskWorkflow(workflowPayload).pipe(
      tap(() => {
        this.isTransactionSuccess = true;
        this.handleTransactionCompletion(message);
      })
    );
  }

  /**Method to fetch bank details */
  getBankDetails(ibanCode: string): void {
    this.clearErrorAlerts();
    this.bankNameList$ = this.lookupService.getBank(ibanCode).pipe(
      tap(res => {
        if (res.items.length === 0) this.alertService.showErrorByKey('CONTRIBUTOR.INVALID-IBAN-ERROR');
      })
    );
  }
  /** Method to check bank workflow. */
  checkBankWorkflow() {
    return this.contributorService
      .getBankDetailsWorkflowStatus(new Map().set('personId', this.contributor.person.personId))
      .pipe(
        tap(res => {
          if (res) {
            this.isBankDetailsPending = true;
            this.bankAccount = res;
          } else this.bankAccount = this.contributor?.bankAccountDetails[0];
        })
      );
  }
  /** Method to assemble bank details. */
  assembleBankDetails(): BankAccount {
    if (
      this.terminateForm.get('bankDetailsForm') &&
      (this.bankAccount ? this.bankAccount.ibanAccountNo : '') !==
        this.terminateForm.get('bankDetailsForm.ibanAccountNo').value
    )
      return <BankAccount>(this.terminateForm.get('bankDetailsForm') as FormGroup).getRawValue();
    else if (this.bankAccount?.ibanAccountNo) {
      this.terminateForm.get('bankDetailsForm')?.get('ibanAccountNo').setValue(this.bankAccount?.ibanAccountNo);
      this.terminateForm.get('bankDetailsForm')?.get('bankName').setValue(this.bankAccount?.bankName);
      return this.bankAccount;
    } else return undefined;
  }
  /** Method to check for changes. */
  checkForChanges(template: TemplateRef<HTMLElement>): void {
    const docStatus = this.checkDocumentStatus();
    if (getFormErrorCount(this.terminateForm) > 0 || this.terminateForm.dirty || docStatus) this.showModal(template);
    else this.navigateBack();
  }

  /** Method to gt document status. */
  checkDocumentStatus(): boolean {
    return this.terminateForm.get('docStatus.changed') ? this.terminateForm.get('docStatus.changed').value : false;
  }

  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>): void {
    this.modalRef = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered'
    });
  }

  /** Method to hide modal. */
  hideModal(): void {
    this.modalRef.hide();
  }

  /** Method to check whether revert is required. */
  checkRevertRequired(): void {
    this.hideModal();
    if (this.checkDocumentStatus() && this.isEditMode) this.revertTerminationRequest();
    else this.navigateBack();
  }

  /** Method to revert termination request. */
  revertTerminationRequest(): void {
    this.contributorService
      .revertTransaction(this.registrationNo, this.socialInsuranceNo, this.engagementId, this.referenceNo)
      .subscribe(
        () => this.navigateBack(),
        err => this.showError(err)
      );
  }

  /** Method to navigate back based on mode. */
  navigateBack() {
    if (this.isEditMode && this.isAppPrivate && !this.isTransactionSuccess)
      this.router.navigate([ContributorRouteConstants.ROUTE_TERMINATE_CONTRIBUTOR_VALIDATOR]);
    else if (this.isEditMode && this.isAppPrivate && this.isTransactionSuccess)
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    else if (this.isEditMode && !this.isAppPrivate) this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
    else if (!this.isEditMode) this.location.back();
  }

  /** Method for filtering leaving reason */
  extractLeavingReason() {
    this.leavingReasonList$ = this.leavingReasonList$?.pipe(
      filter(lovlist => lovlist && lovlist !== null),
      map(lovList => {
        return new LovList(
          lovList?.items?.filter(lov => ContributorConstants.DEAD_LEAVING_REASONS.indexOf(lov?.value?.english) === -1)
        );
      })
    );
  }

  /* Fetch data from NIC call and compare leaving date and death date */
  checkIndividualDetails(nicVar: boolean, queryParams: string, leavingDeathReason: boolean) {
    const currentDate = new Date().toISOString();
    if (nicVar) {
      this.contributorService.getPersonDetails(queryParams, new Map().set('fetchAddressFromWasel', true)).subscribe(
        res => {
          this.nicDetails = res;
          if (res.deathDate == null) {
            this.alertService.showErrorByKey('CONTRIBUTOR.LEAVING-REASON-NOT-DEATH');
            this.nicReasonErr = true;
          } else {
            if (
              moment(res.deathDate.gregorian).isAfter(currentDate) ||
              (!this.isEditMode &&
                moment(res?.deathDate?.gregorian).isBefore(this.engagement?.joiningDate?.gregorian)) ||
              (this.isEditMode &&
                moment(res?.deathDate?.gregorian).isBefore(this.terminationDetails?.joiningDate?.gregorian))
            ) {
              this.alertService.showErrorByKey('CONTRIBUTOR.TERMINATION-DATE-DEATH');
              this.nicDateErr = true;
              this.errorAlert = true;
            }
          }
        },
        err => {
          this.showError(err);
        }
      );
    } else {
      this.nicReasonErr = false;
      this.errorAlert = false;
      this.alertService.clearAlerts();
    }
    if (leavingDeathReason) {
      this.extractLeavingReason();
    }
  }
  checkReEdit() {
    if (this.routerDataToken.payload) {
      const payload = JSON.parse(this.routerDataToken.payload);
      this.role = payload.assignedRole;
      if (this.role === 'Admin') {
        this.isAdminReEdit = true;
      }
      this.backdatedEngValidatorRequired = payload.backdatedEngValidatorRequired;
    }
  }


  claimTask() {
    this.calculateTimeDiff();
    this.transactionService.accquireTasks(this.taskId).subscribe(
      (res: any) => {
        const value = {
          english:
            'Transaction has been assigned . You can now process the transaction or release it back to Establishment inbox ',
          arabic: 'تم إسناد المعاملة، بإمكانك البدء بمعالجة المعاملة او ارجعاها إلى صندوق بريد المنشاة '
        };
        this.alertService.showSuccess(value);
        this.isUnclaimed = false;
      },
      err => {
        //console.log(err.error.status, err.headers.status);
        const value = {
          english: 'This Transaction can’t be assigned. Another admin have already assigned it to him ',
          arabic: 'لا يمكن اسناد المعاملة. لقد تم اسناد المعاملة من قبل مشرف آخر'
        };
        this.router.navigate(['home/transactions/list/todolist']);
        this.alertService.showError(value);
        setTimeout(() => {
          this.alertService.showError(value);
        }, 500);
      }
    );
    //  this.onClaimClicked.emit();
  }
  calculateTimeDiff() {
    var currentDate: any = this.payload.currentDate;
    var convertedDate: any = moment.tz(currentDate, 'Asia/Riyadh');
    var expDate: any = this.payload.claimTaskExpiry;
    // console.log(currentDate,convertedDate.format())
    var updated = moment(convertedDate.format(), 'DD-MM-YYYY HH:mm:ss'); //now
    var expiry = moment(expDate, 'DD-MM-YYYY HH:mm:ss');
    if (expDate == 'NULL') {
      this.minDiff = '89';
      this.seconds = '0';
    } else {
      this.minDiff = Math.floor(expiry.diff(updated, 'seconds') / 60);
      this.secDiff = expiry.diff(updated, 'seconds');
      this.seconds = (this.secDiff % 60).toString();
    }
  }
  release() {
    this.minDiff = '89';
    this.seconds = '0';
    this.payload.claimTaskExpiry = 'NULL';
    this.transactionService.releaseTasks(this.taskId).subscribe((res: any) => {
      const value = {
        english: 'Transaction released to Establishment Inbox',
        arabic: 'تم إعادة تعيين المعاملة إلى صندوق المنشأة'
      };
      this.alertService.showSuccess(value);
      this.isUnclaimed = true;
      setTimeout(() => {
        this.router.navigate(['home/transactions/list/todolist']);
      }, 2000);
    });
  }

  /** Method to clear error alerts. */
  clearErrorAlerts() {
    this.alertService.clearAllErrorAlerts();
  }

  /**Method to clear alerts  */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }
}
