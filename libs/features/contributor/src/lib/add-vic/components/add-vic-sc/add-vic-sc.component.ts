/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpParams } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  CalendarService,
  DocumentItem,
  DocumentService,
  GosiCalendar,
  LookupService,
  Lov,
  LovList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WorkflowService,
  scrollToTop,
  startOfMonth,
  subtractMonths
} from '@gosi-ui/core';
import { EngagementWageAddDcComponent } from '@gosi-ui/features/contributor/lib/add-contributor/components';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, forkJoin, iif, noop, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  ContributorRouteConstants,
  EngagementDetails,
  EngagementPeriod,
  VicConstants,
  VicEngagementDetailsDcComponent
} from '../../../shared';
import { DocumentTransactionId, TransactionId, ValidatorRoles } from '../../../shared/enums';
import {
  Contributor,
  HealthRecordDetails,
  PersonalInformation,
  VicEngagementDetails,
  VicEngagementPayload
} from '../../../shared/models';
import {
  AddVicService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  VicService
} from '../../../shared/services';
import { AddVicBaseScComponent } from './add-vic-base-sc.component';

@Component({
  selector: 'cnt-add-vic-sc',
  templateUrl: './add-vic-sc.component.html',
  styleUrls: ['./add-vic-sc.component.scss']
})
export class AddVicScComponent extends AddVicBaseScComponent implements OnInit, OnDestroy {
  /** Local variables */
  parentForm = new FormGroup({ vicSubmitCheck: new FormControl(false, { validators: Validators.requiredTrue }) });
  registrationSummary: VicEngagementDetails;
  purposeOfRegistration: string;
  modalRef: BsModalRef;
  vicEngagement: VicEngagementDetails;
  comments: string;
  hasCurrentYearVicEngagement: boolean;
  specializationList$: Observable<LovList>;
  systemRunDate: GosiCalendar;
  maxDate: Date;
  minDate: Date;
  engagementPeriods: EngagementPeriod[] = [];
  engagementDetailsModel = new EngagementDetails();
  occupationList = new LovList([]);
  @ViewChild(EngagementWageAddDcComponent, { static: false })
  engagementWageAddDcComponent: EngagementWageAddDcComponent;
  @ViewChild(VicEngagementDetailsDcComponent, { static: false })
  vicEngagementDetailsDcComponent: VicEngagementDetailsDcComponent;

  /** Creates an instance of AddVicScComponent. */
  constructor(
    readonly contributorService: ContributorService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly manageWageService: ManageWageService,
    readonly engagementService: EngagementService,
    readonly addVicService: AddVicService,
    readonly vicService: VicService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly lookupService: LookupService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly modalService: BsModalService,
    readonly calenderService: CalendarService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(
      alertService,
      establishmentService,
      contributorService,
      engagementService,
      documentService,
      lookupService,
      workflowService,
      modalService,
      manageWageService,
      vicService,
      router,
      routerDataToken,
      appToken,
      calenderService
    );
  }

  /** Method to handle initialise for AddVicScComponent. */
  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.getSystemRunDate();
    // console.log(moment(this.systemRunDate.gregorian).subtract(1, 'months').startOf('month').toDate());
    super.getSystemParameters();
    this.setParamsForView();
    this.initializeWizard();
    this.checkEditMode();
    if (this.isEditMode) this.initializeViewForEdit();
    this.fetchLookUpDetails();
    this.getSpecilationLovList();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
  }

  getSystemRunDate() {
    this.calenderService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
      this.maxDate = moment(this.systemRunDate.gregorian).toDate();
    });
    const today = new Date();
    this.minDate = startOfMonth(subtractMonths(today, 1));
    // this.minDate = moment(this.systemRunDate.gregorian).subtract(1, 'months').startOf('month').toDate();
  }

  /*Method to add existing specialization  to the list */
  getSpecilationLovList() {
    this.specializationList$
      .pipe(
        tap(res => {
          const items = new Lov();
          items.value = this.contributor?.person?.specialization;
          if (items.value) {
            if (!res?.items.some(item => item.value.english === items?.value.english)) {
              res.items.push(items);
            }
          }
        })
      )
      .subscribe();
  }
  /** Method to set parameters for view. */
  setParamsForView() {
    this.totalTab = 5;
    this.transactionId = TransactionId.REGISTER_VIC_CONTRIBUTOR;
  }

  /** Method to check for edit mode. */
  checkEditMode() {
    this.route.url.subscribe(res => {
      if (res.length > 0) if (res[0].path === 'edit') this.isEditMode = true;
    });
  }

  /** Method to initialize view for edit mode. */
  initializeViewForEdit() {
    this.initializeFromToken();
    this.activeTab = this.routerDataToken.tabIndicator;
    this.isDoctorEdit = this.routerDataToken.assignedRole === ValidatorRoles.DOCTOR;
    this.setWizardOnEdit(this.activeTab - 1);
    this.getEngagementDetailsInWorkflow()
      .pipe(
        tap(() => (this.purposeOfRegistration = this.vicEngagement.purposeOfRegistration.english)),
        switchMap(() => this.getPurposeOfEngagement()),
        switchMap(() =>
          iif(
            () =>
              !this.vicWageCategories && this.purposeOfEngagement && !this.purposeOfEngagement.pensionReformEligible,
            this.getVICWageCategories(),
            of(true)
          )
        ),
        switchMap(() => this.fetchHealthRecords()),
        switchMap(() => this.checkPreviousVicEngagementInCurrentYear()),
        tap(() => {
          if (this.activeTab === 4) this.getDocumentsOnEdit();
        }),
        catchError(err => {
          this.showError(err);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to get engagement details in workflow. */
  getEngagementDetailsInWorkflow() {
    return forkJoin([
      this.addVicService.getVicEngagementDetails(this.socialInsuranceNo, this.engagementId).pipe(
        tap(res => {
          this.vicEngagement = res;
          this.hasDoctorVerified =
            this.vicEngagement.doctorVerificationStatus !== VicConstants.DOCTOR_NOT_VERIFIED_STATUS;
        })
      ),
      this.getContributor()
    ]);
  }

  /** Method to get documents in edit mode. */
  getDocumentsOnEdit() {
    this.documentService
      .getDocuments(
        DocumentTransactionId.REGISTER_VIC_CONTRIBUTOR,
        this.getDocumentTransactionType(this.purposeOfRegistration, this.isAppPrivate),
        this.engagementId,
        this.referenceNo
      )
      .subscribe(res => {
        res.forEach(doc => {
          if (doc.name.english === VicConstants.VIC_DOCTOR_REPORT) doc.canDelete = this.isDoctorEdit;
          else doc.canDelete = !this.isDoctorEdit;
        });
        //In doctor edit only doctor report is required to be scanned other optional docs which are not scanned needs to be filtered
        //In validator edit, show doctor report only if doctor has already scanned the document.
        this.documents = res.filter(item =>
          this.isDoctorEdit
            ? item.name.english !== VicConstants.VIC_DOCTOR_REPORT && item.documentContent === null
              ? false
              : true
            : item.name.english === VicConstants.VIC_DOCTOR_REPORT && item.documentContent === null
            ? false
            : true
        );
      });
  }

  /** Method to search vic person. */
  searchSaudiPerson(queryParam: string, nin: number): void {
    this.nin = nin;
    this.contributorService
      .getPersonDetails(queryParam, new Map().set('fetchAddressFromWasel', true))
      .pipe(
        tap(res => {
          this.contributor = new Contributor();
          if (res) {
            this.person = this.contributor.person = res;
            this.getSpecilationLovList();
          }
        }),
        switchMap(res => {
          if (res.personId)
            //To check sin for existing contributor
            return this.contributorService.setSin(this.person.personId).pipe(
              tap(response => {
                if (response) {
                  this.socialInsuranceNo = response.socialInsuranceNo;
                  this.checkPreviousVicEngagementInCurrentYear().subscribe();
                }
              })
            );
        })
      )
      .subscribe({
        next: () => {
          this.activeTab++;
          this.alertService.clearAllErrorAlerts();
        },
        error: err => this.showError(err)
      });
  }

  /** Method to check whether there is previous vic engagement in current year. */
  checkPreviousVicEngagementInCurrentYear() {
    return this.vicService
      .getVicEngagements(this.nin)
      .pipe(
        tap(
          res =>
            (this.hasCurrentYearVicEngagement =
              res.filter(item => item.leavingDate && moment(item.leavingDate.gregorian).isSame(new Date(), 'year'))
                .length > 0)
        )
      );
  }

  /** Method to handle save person. */
  onSavePerson(person: PersonalInformation): void {
    if (person) this.saveVicPerson(person);
    else this.showMandatoryFieldsError();
  }

  /** Method to save or update person. */
  saveVicPerson(person: PersonalInformation): void {
    this.hasSaved = true;
    if (this.socialInsuranceNo) {
      //console.log("test1")
      this.addVicService
        .updateVICPerson(
          person,
          this.nin,
          this.isEditMode ? new HttpParams().set('navigationIndicator', 'First Validator Submit') : null
        )
        .pipe(
          switchMap(() => iif(() => !this.purposeOfEngagement, this.getPurposeOfEngagement(), of(true))),
          switchMap(() =>
            iif(
              () =>
                !this.vicWageCategories && this.purposeOfEngagement && !this.purposeOfEngagement.pensionReformEligible,
              this.getVICWageCategories(),
              of(true)
            )
          )
        )
        .subscribe({
          next: () => this.setNextTab(),
          error: err => this.showError(err)
        });
    } else {
      //console.log("test2")
      this.addVicService
        .saveVICPerson(person)
        .pipe(
          tap(res => (this.socialInsuranceNo = res.socialInsuranceNo)),
          switchMap(() => this.getPurposeOfEngagement()),
          switchMap(() =>
            iif(
              () =>
                !this.vicWageCategories && this.purposeOfEngagement && !this.purposeOfEngagement.pensionReformEligible,
              this.getVICWageCategories(),
              of(true)
            )
          )
        )
        .subscribe({
          next: () => this.setNextTab(),
          error: err => this.showError(err)
        });
    }
    //console.log()
    //console.log("test")
  }

  /** Method to handle change in purpose of registration. */
  handlePurposeOfRegistrationChange(purposeOfRegistration: string) {
    this.alertService.clearAlerts();
    if (this.purposeOfEngagement && !this.purposeOfEngagement.pensionReformEligible) {
      this.getVICWageCategories(purposeOfRegistration).subscribe(noop, err => this.showError(err));
    }
  }

  /** Method to handle saving engagement. */
  onSaveVicEngagement(vicEngagement: VicEngagementPayload): void {
    if (vicEngagement) this.saveVicEngagement(vicEngagement);
    else this.showMandatoryFieldsError();
  }

  /** Method to save vic engagement. */
  saveVicEngagement(vicEngagement: VicEngagementPayload): void {
    this.hasSaved = true;
    const service = this.isEditMode
      ? this.addVicService.updateVicEngagement(this.nin, this.engagementId, vicEngagement)
      : this.addVicService.saveVicEngagement(this.nin, vicEngagement);
    service
      .pipe(
        tap(res => {
          this.purposeOfRegistration = vicEngagement.purposeOfRegistration.english;
          this.engagementId = res.id;
          this.referenceNo = res.referenceNo;
        }),
        switchMap(() => iif(() => !this.healthRecordList, this.fetchHealthRecords(), of(true)))
      )
      .subscribe({
        next: () => this.setNextTab(),
        error: err => {
          if (err) this.showError(err);
        }
      });
  }

  /** Method to save health records. */
  saveHealthRecordDetails(healthRecords: HealthRecordDetails[]): void {
    this.hasSaved = true;
    if (healthRecords && healthRecords.length > 0)
      this.addVicService
        .saveHealthRecordDetails(this.nin, this.engagementId, healthRecords)
        .pipe(
          tap(() => {
            if (this.isEditMode) this.getDocumentsOnEdit();
            else
              super.getRequiredDocuments(
                this.engagementId,
                DocumentTransactionId.REGISTER_VIC_CONTRIBUTOR,
                this.getDocumentTransactionType(this.purposeOfRegistration, this.isAppPrivate),
                this.hasSaved,
                this.referenceNo
              );
          })
        )
        .subscribe({
          next: () => this.setNextTab(),
          error: err => this.showError(err)
        });
    else if (healthRecords && healthRecords.length === 0) this.showMandatoryFieldsError();
    else this.alertService.showErrorByKey(VicConstants.MANDATORY_HEALTH_ACkNOWLEDGEMENT_ERROR);
  }

  /** Method to refresh document. */
  refreshDocument(document: DocumentItem): void {
    super.refreshDocument(
      document,
      this.engagementId,
      DocumentTransactionId.REGISTER_VIC_CONTRIBUTOR,
      null,
      this.referenceNo
    );
  }

  /** Method to handle vic registration submit. */
  onSubmitVicRegistration(): void {
    this.parentForm.get('vicSubmitCheck').markAsTouched();
    if (this.checkDocuments())
      if (this.parentForm.get('vicSubmitCheck').valid || this.isEditMode || this.isDoctorEdit)
        this.submitVicRegistration();
      else this.showMandatoryFieldsError();
    else this.showMandatoryDocumentsError();
  }

  /** Method to submit vic registration. */
  submitVicRegistration(): void {
    this.hasSaved = true;
    this.addVicService
      .submitVicRegistration(this.nin, this.engagementId, this.parentForm.get('comments.comments').value)
      .pipe(
        tap(res => (this.successMessage = res.message)),
        switchMap(() =>
          iif(
            () => this.isEditMode,
            this.submitTransactionOnEdit(),
            this.addVicService
              .getVicEngagementDetails(this.socialInsuranceNo, this.engagementId)
              .pipe(tap(res => (this.registrationSummary = res)))
          )
        )
      )
      .subscribe({
        next: () => {
          if (!this.isEditMode) this.setNextTab();
        },
        error: err => this.showError(err)
      });
  }

  /** Method to submit transaction on edit. */
  submitTransactionOnEdit(isDoctor = false) {
    const workflowPayload = this.assembleWorkflowPayload(
      this.routerDataToken,
      this.parentForm.get('comments.comments').value,
      isDoctor
    );
    return this.workflowService.updateTaskWorkflow(workflowPayload).pipe(
      tap(() => {
        isDoctor
          ? this.alertService.showSuccessByKey('CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-APPROVAL-MESSAGE')
          : this.alertService.showSuccess(this.successMessage);
        this.navigateBack(true);
      })
    );
  }

  /** Method to handle doctor submit. */
  onDoctorSubmit() {
    this.submitTransactionOnEdit(true).subscribe(noop, noop);
  }

  /** Method to check for changes. */
  checkForChanges(template: TemplateRef<HTMLElement>) {
    if (this.checkConfirmationRequired(this.parentForm)) this.showModal(template);
    else this.navigateBack();
  }

  /** Method to handle confirm cancellation. */
  confirmCancel() {
    this.hideModal();
    if (this.checkRevertRequired(this.parentForm.get('docStatus.changed'))) this.revertTransaction();
    else this.navigateBack();
  }

  /** Method to navigate back. */
  navigateBack(isCompleted: boolean = false) {
    if (this.isEditMode)
      this.router.navigate([
        isCompleted ? RouterConstants.ROUTE_INBOX : ContributorRouteConstants.ROUTE_ADD_VIC_VALIDATOR
      ]);
    else this.router.navigate(['home/contributor/add-vic/refresh']);
  }

  /** Method to revert transaction. */
  revertTransaction(): void {
    this.vicService.revertTransaction(this.socialInsuranceNo, this.engagementId, this.referenceNo).subscribe(
      () => this.navigateBack(),
      err => this.showError(err)
    );
  }

  /**Method to reset saudi search */
  resetSaudiSearch(): void {
    this.alertService.clearAllErrorAlerts();
    scrollToTop();
    this.hideModal();
    if (this.parentForm.get('saudiSearch')) {
      this.parentForm.get('saudiSearch').reset();
      this.parentForm.get('saudiSearch.calenderType.english').reset('Gregorian');
    }
  }

  /**Method to clear alerts  */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }

  addWagePeriod(wageDetails) {
    wageDetails.canEdit = false;
    this.engagementPeriods.push(wageDetails);
    this.engagementPeriods = this.sortEngagementPeriod(this.engagementPeriods);
  }

  sortEngagementPeriod(wageDetails: EngagementPeriod[]) {
    return wageDetails.sort((a, b) => {
      const dateOne = moment(b?.startDate?.gregorian);
      const dateTwo = moment(a?.startDate?.gregorian);
      return dateOne.isAfter(dateTwo) ? 1 : dateOne.isBefore(dateTwo) ? -1 : 0;
    });
  }

  /**
   * Method to save edited row changes on clicking save button
   * @param wageDetails
   */
  updateWagePeriod(wageDetails) {
    this.engagementPeriods.forEach((element, index) => {
      if (index === wageDetails.index) {
        element.canEdit = false;
        element.occupation = wageDetails.wage.occupation;
        element.startDate = wageDetails.wage.startDate;
        element.wage = wageDetails.wage.wage;
      }
    });
  }

  /**
   * Method to remove wage period from wage history table
   * @param rowIndex
   */
  removeWagePeriod(rowIndex: number) {
    // this.engagementPeriods.splice(rowIndex, 1);
    // this.vicEngagementDetailsDcComponent.isEngagementWageAddFormVisible = true;
    // this.vicEngagementDetailsDcComponent.resetWageEntryForm();
    // this.vicEngagementDetailsDcComponent.bindToWageEntryForm(this.engagementDetails.engagementPeriod[0]);
  }
}
