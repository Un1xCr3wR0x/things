/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  AlertTypeEnum,
  BilingualText,
  CalendarService,
  CalendarTypeEnum,
  DocumentService,
  LegalEntitiesEnum,
  LookupService,
  Lov,
  LovList,
  OccupationList,
  RouterData,
  RouterDataToken,
  StorageService,
  WorkflowService,
  bindToObject,
  convertToStringDDMMYYYY,
  getPersonNameAsBilingual,
  hijiriToJSON,
  markFormGroupUntouched,
  scrollToTop,
  startOfDay,
  startOfMonth,
  startOfMonthHijiri
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ContributorBaseScComponent } from '../../../../shared/components';
import { ContributorRouteConstants, ManageWageConstants } from '../../../../shared/constants';
import { SearchTypeEnum } from '../../../../shared/enums';
import {
  ContributorFilter,
  ContributorWageDetails,
  ContributorWageDetailsResponse,
  ContributorWageParams,
  ManageWageLookUp,
  TerminateContributorPayload,
  UpdateWageError,
  UpdateWageRequest,
  UpdateWageResponse
} from '../../../../shared/models';
import {
  ContributorService,
  ContributorsWageService,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  TerminateContributorService
} from '../../../../shared/services';
import { ContributorTableDcComponent } from '../contributor-table-dc/contributor-table-dc.component';

@Component({
  selector: 'cnt-multiple-wage-update-sc',
  templateUrl: './multiple-wage-update-sc.component.html',
  styleUrls: ['./multiple-wage-update-sc.component.scss']
})
export class MultipleWageUpdateScComponent extends ContributorBaseScComponent implements OnInit, OnDestroy {
  /** Local Variables */
  contributorWageDetailsResponse: ContributorWageDetailsResponse = new ContributorWageDetailsResponse();
  occupationList$: Observable<OccupationList> = new Observable<OccupationList>(null);
  nationalityList$: Observable<LovList> = new Observable<LovList>(null);
  parentForm: FormGroup = new FormGroup({});
  date = new Date();
  isDescending = false;
  selectedLegalEntity: BilingualText;
  totalNumberOfActiveContributors = 0;
  modalRef: BsModalRef;
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  currentPageNo = 0; // Pagination
  itemsPerPage = 10; // Pagination
  paginationId = 'wage-update'; // Pagination id
  successCount = 0;
  failedCount = 0;
  terminatePayload: TerminateContributorPayload = new TerminateContributorPayload();
  terminateSin: number;
  terminateMessage: string;
  personName: BilingualText;
  deathDate: string;
  isSelectAll = false;
  sortParameters = ManageWageConstants.MULTIPLE_WAGE_UPDATE_SORT_PARAMS;
  searchValue: string | number;
  sortByValue: string;
  filterValue: ContributorFilter;
  successMessage: string;
  navigateFlag: boolean;
  isapiTriggered = false;
  lookUpDatas: ManageWageLookUp[] = new Array<ManageWageLookUp>();
  monthStartHijiri: string;

  /** Template & directive references */
  @ViewChild('saveTemplate', {static: true })
  saveTemplate: TemplateRef<HTMLElement>;
  @ViewChild('noChangesTemplate', { static: true })
  noChangesTemplate: TemplateRef<HTMLElement>;
  @ViewChild('navigateWithChangesTemplate', { static: true })
  navigateWithChangesTemplate: TemplateRef<HTMLElement>;
  @ViewChild('navigateErrorTemplate', { static: true })
  navigateErrorTemplate: TemplateRef<HTMLElement>;
  @ViewChild('navigateWithSummaryReport', { static: true })
  navigateWithSummaryReport: TemplateRef<HTMLElement>;
  @ViewChild('contributorTableDcComponent')
  contributorTableDcComponent: ContributorTableDcComponent;
  @ViewChild('terminateTemplate', { static: true })
  terminateTemplate: TemplateRef<HTMLElement>;

  /** This method is to initialize ManageContributorsWageScComponent. */
  constructor(
    readonly lookupService: LookupService,
    readonly contributorWageService: ContributorsWageService,
    readonly storageService: StorageService,
    readonly alertService: AlertService,
    readonly fb: FormBuilder,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly engagementService: EngagementService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly manageWageService: ManageWageService,
    readonly terminateContributorService: TerminateContributorService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    private router: Router,
    readonly calendarService: CalendarService
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
    super.getTodaysDate();
  }

  /** This method is used to handle further more innializatin tasks. */
  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.registrationNo = this.establishmentService.getRegistrationFromStorage();
    if (this.registrationNo) {
      this.checkEstablishment(this.registrationNo);
    }
    this.occupationList$ = this.lookupService.getOccupationList();
    this.nationalityList$ = this.lookupService.getNationalityList();
  }

  /** This method is search for an establishment and fetch its legal entity. */
  checkEstablishment(regNumber: number): void {
    this.establishmentService
      .getEstablishmentDetails(regNumber)
      .pipe(
        tap(res => {
          this.registrationNo = res.registrationNo;
          this.selectedLegalEntity = res.legalEntity;
          this.ppaEstablishment = res.ppaEstablishment;
          if (this.ppaEstablishment) {
            this.getCalenderDataForPPAEst();
            // this.jobScaleList$ = this.lookupService.getJobScale();
            // this.getJobClass();
            setTimeout(() => {
              this.monthStartHijiri = startOfMonthHijiri(this.sysDate?.hijiri);
            }, 3500);
          }
        })
      )
      .subscribe(
        () => this.getContributorWageDetails(),
        err => this.alertService.showError(err.error.message)
      );
  }

  /** This method is invoked for handling pagination operation. */
  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.currentPageNo = page;
      if (!this.checkState()) {
        scrollToTop();
        this.pageDetails.currentPage = page;
        const search = this.checkSearchFormControl();
        const sort = this.checkSortFormControl();
        this.getContributorWageDetails(search, sort, page, this.itemsPerPage);
      }
    }
  }
  /** This method is check validity and value of search form control. */
  checkSearchFormControl(): string | number | null {
    if (
      this.parentForm.get('searchContributorFormControl').valid &&
      this.parentForm.get('searchContributorFormControl').value
    )
      return this.parentForm.get('searchContributorFormControl').value;
    else return null;
  }

  /** This method is check validity and value of search form control. */
  checkSortFormControl(): string | null {
    if (
      this.parentForm.get('sortContributorFormControl').valid &&
      this.parentForm.get('sortContributorFormControl').value
    )
      return this.parentForm.get('sortContributorFormControl').value;
    else return null;
  }

  /**Method to handle actions of sort , search and filter */
  fetchContWageDetails(req): void {
    this.totalNumberOfActiveContributors = 0;
    if (req && (req.search || req.sortBy || req.filter)) {
      this.pageDetails.currentPage = 1;
      this.searchValue = req.search ? req.search : null;
      this.sortByValue = req.sortBy ? req.sortBy : null;
      this.filterValue = req.filter ? req.filter : null;
      this.getContributorWageDetails(this.searchValue, this.sortByValue, null, null, this.filterValue);
    } else {
      this.pageDetails.currentPage = 1;
      this.getContributorWageDetails();
    }
  }

  /**
   * This method is used to fetch contributor with wage details
   */
  getContributorWageDetails(
    identifier?: string | number,
    sortBy?: string,
    pageNo?: number,
    pageSize?: number,
    filterReq?: ContributorFilter,
    clearAlert = true
  ): void {
    if (clearAlert) this.alertService.clearAlerts();
    this.contributorWageDetailsResponse = new ContributorWageDetailsResponse();
    this.contributorWageService
      .getContributorWageDetails(
        this.registrationNo,
        new ContributorWageParams(
          true,
          null,
          SearchTypeEnum.ACTIVE,
          pageNo,
          pageSize,
          identifier,
          filterReq,
          sortBy,
          this.isDescending ? 'DESC' : 'ASC'
        ),
        true
      )
      .pipe(
        tap(res => {
          if (res?.numberOfContributors === 0 || res?.contributors.length === 0)
            this.alertService.showErrorByKey('CONTRIBUTOR.WAGE.PERSON-BLOCK-MESSAGE');
        })
      )
      .subscribe(
        (wageDetails: ContributorWageDetailsResponse) => {
          this.contributorWageDetailsResponse = wageDetails;
          this.totalNumberOfActiveContributors = wageDetails.numberOfContributors;
          this.checkTerminationRequired(wageDetails.contributors);
          if (this.ppaEstablishment) {
            // this.getCalenderDataForPPAEst();
            this.jobScaleList$ = this.lookupService.getJobScale();
            this.setJobDataForPPA();
          }
        },
        err => this.alertService.showError(err.error.message)
      );
  }
  /** Method to check whether any contributor needs to be terminated. */
  checkTerminationRequired(contributors: ContributorWageDetails[]) {
    let flag = false;
    contributors.forEach(contributor => {
      if (!flag) {
        this.personName = getPersonNameAsBilingual(contributor.name);
        if (!this.personName.english) this.personName.english = this.personName.arabic;
        if (contributor.deathDate && contributor.deathDate.gregorian) {
          flag = true;
          this.terminatePayload.leavingDate.gregorian = startOfDay(contributor.deathDate.gregorian);
          this.terminatePayload.leavingReason.english = ManageWageConstants.DEAD_PERSON_LEAVING_REASON;
          this.terminateSin = contributor.socialInsuranceNo;
          this.terminateMessage = ManageWageConstants.ACTIVE_DEAD_PERSON_MESSAGE_KEY;
          this.deathDate = convertToStringDDMMYYYY(contributor.deathDate.gregorian.toString());
        } else if (
          contributor.govtEmp &&
          this.selectedLegalEntity.english !== LegalEntitiesEnum.GOVERNMENT &&
          this.selectedLegalEntity.english !== LegalEntitiesEnum.SEMI_GOVERNMENT
        ) {
          flag = true;
          this.terminatePayload.leavingDate.gregorian = startOfDay(new Date());
          this.terminatePayload.leavingReason.english = ManageWageConstants.GOVT_EMPLOYEE_LEAVING_REASON;
          this.terminateSin = contributor.socialInsuranceNo;
          this.terminateMessage = ManageWageConstants.ACTIVE_GOVT_EMPLOYEE_MESSAGE_KEY;
        }
      }
    });
    // if (flag) this.showTemplate(this.terminateTemplate);
  }

  /** Method to terminate the contributor. */
  // terminateContributor() {
  //   this.terminateContributorService
  //     .terminateAllActiveEngagements(this.registrationNo, this.terminateSin, this.terminatePayload)
  //     .subscribe(() => {
  //       this.modalRef.hide();
  //       this.getContributorWageDetails(
  //         this.checkSearchFormControl(),
  //         this.checkSortFormControl(),
  //         this.pageDetails.currentPage,
  //         this.itemsPerPage
  //       );
  //     });
  // }

  onSubmit(){
    this.showTemplate(this.saveTemplate);
  }

  /** This method is to save list of contributor in which change is made. */
  updateContributorWageDetailsList(): void {
    this.decline();
    if (!this.isapiTriggered) {
      let isFormDirty = false;
      this.alertService.clearAlerts();
      const wageUpdateRequestArray: UpdateWageRequest[] = [];
      this.isapiTriggered = true;
      this.storageService.setLocalValue('triggered', this.isapiTriggered);
      const formArray = this.parentForm.controls.wageForms as FormArray;
      if (formArray) {
        formArray.controls.forEach((form: FormGroup) => {
          if (form.dirty) {
            isFormDirty = true;
            if (form.valid) {
              this.contributorWageDetailsResponse.contributors.forEach((contWage: ContributorWageDetails) => {
                if (contWage.socialInsuranceNo === form.controls.socialInsuranceNo.value) {
                  this.setStartDate(form.controls.wageDetails as FormGroup, contWage);
                  const updateWageReq: UpdateWageRequest = bindToObject(new UpdateWageRequest(), form.getRawValue());
                  if (this.ppaEstablishment) {
                    updateWageReq.wageDetails.wage.commission = null;
                    updateWageReq.wageDetails.wage.housingBenefit = null;
                    updateWageReq.wageDetails.wage.otherAllowance = null;
                  }
                  wageUpdateRequestArray.push(updateWageReq);
                }
              });
            } else {
              this.alertService.showMandatoryErrorMessage();
              this.isapiTriggered = false;
            }
          }
        });
        if (!isFormDirty) {
          this.isapiTriggered = false;
          this.showTemplate(this.noChangesTemplate);
        }
        if (wageUpdateRequestArray.length > 0) {
          this.contributorWageService
            .updateContributorWageDetailsList(wageUpdateRequestArray, this.registrationNo)
            .pipe(
              tap(res => {
                this.successCount = res.noOfSuccess;
                this.failedCount = res.noOfFailures;
                if (this.successCount) {
                  this.successMessage = 'CONTRIBUTOR.WAGE.UPDATE-WAGE-INFO-';
                  this.successMessage +=
                    this.successCount > 10
                      ? '11'
                      : this.successCount > 2 && this.successCount < 11
                      ? '3-10'
                      : this.successCount === 2
                      ? '2'
                      : '1';
                }
              })
            )
            .subscribe((resUpdateWage: UpdateWageResponse) => {
              if (resUpdateWage['noOfFailures'] > 0 && resUpdateWage['noOfSuccess'] > 0)
                this.showTemplate(this.navigateWithSummaryReport);
              else if (resUpdateWage['noOfFailures'] > 0 && resUpdateWage['noOfSuccess'] === 0)
                this.alertService.showErrorByKey('CONTRIBUTOR.WAGE.PLEASE-CORRECT-BELOW');
              else {
                this.alertService.showSuccessByKey(this.successMessage, resUpdateWage);
                this.parentForm.markAllAsTouched();
                this.getContributorWageDetails(
                  this.checkSearchFormControl(),
                  this.checkSortFormControl(),
                  this.pageDetails.currentPage,
                  this.itemsPerPage,
                  null,
                  false
                );
              }
              this.isapiTriggered = false;
              if (resUpdateWage?.content?.length > 0) this.handleErrorResponse(resUpdateWage.content);
            });
        }
      }
    }
  }
  /** This method is to set start date as existing wage start date
   * if the wage start date is greater than first fo month else first of month. */
  setStartDate(form: FormGroup, contWage: ContributorWageDetails): void {
    const firstOfMonth = startOfMonth(new Date());
    const firstOfMonthHijiri = hijiriToJSON(this.monthStartHijiri);
    if (moment(contWage.wageDetails.startDate.gregorian).isAfter(firstOfMonth)) {
      form.get('startDate.gregorian').setValue(new Date(contWage.wageDetails.startDate.gregorian));
      form.get('startDate.hijiri').setValue(new Date(contWage.wageDetails.startDate.hijiri));
      form
        .get('startDate.entryFormat')
        .setValue(this.disableCalendarForPpa ? CalendarTypeEnum.HIJRI : CalendarTypeEnum?.GREGORIAN);
    } else {
      form.get('startDate.gregorian').setValue(firstOfMonth);
      form.get('startDate.hijiri').setValue(firstOfMonthHijiri);
      form
        .get('startDate.entryFormat')
        .setValue(this.disableCalendarForPpa ? CalendarTypeEnum.HIJRI : CalendarTypeEnum?.GREGORIAN);
    }
  }
  /** * This methods is to handle the error response from updte api into modal. */
  handleErrorResponse(contents: UpdateWageError[]): void {
    const formArray = this.parentForm.controls.wageForms as FormArray;
    formArray.controls.forEach((wageForm: FormGroup) => markFormGroupUntouched(wageForm));
    contents.forEach(contWage => {
      formArray.controls.forEach((wageForm: FormGroup) => {
        if (contWage.socialInsuranceNo === wageForm.controls.socialInsuranceNo.value && contWage.hasError) {
          wageForm.markAsDirty();
          return;
        }
      });
    });
    this.contributorWageDetailsResponse.contributors.forEach((contWage: ContributorWageDetails) => {
      contWage.message = null;
      contents.forEach(res => {
        if (contWage.socialInsuranceNo === res.socialInsuranceNo && res.hasError) {
          contWage.message = res.message;
          contWage.message.type = AlertTypeEnum.DANGER;
        }
      });
    });
  }
  /** This method is used to show given template. */
  showTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: 'modal-dialog-centered' };
    this.modalRef = this.modalService.show(template, config);
  }
  /** Method to close modal if there are no chnages made to be saved. */
  confirmNoChanges() {
    this.pageDetails = { currentPage: this.pageDetails.currentPage, goToPage: '' };
    this.setNavigationState(undefined);
    this.decline();
  }
  /** Method to hide popup */
  decline(): void {
    if (this.modalRef) this.modalRef.hide();
  }
  /**Method to navigate to home */
  confirmCancel(): void {
    this.decline();
    this.router.navigateByUrl('/home');
  }
  /** Method to revert change. */
  revertChanges() {
    scrollToTop();
    const search = this.checkSearchFormControl();
    const sort = this.checkSortFormControl();
    this.contributorTableDcComponent.generateFormView();
    this.decline();
    this.parentForm.get('searchContributorFormControl').patchValue('');
    this.parentForm.get('sortContributorFormControl').patchValue(null);
    this.pageDetails.currentPage = this.currentPageNo;
    if (!this.navigateFlag)
      this.getContributorWageDetails(search, sort, this.pageDetails.currentPage, this.itemsPerPage);
    else this.navigateToProfile();
  }

  /** Method to handke navigation. */
  handleNavigation(sin: number) {
    if (!this.checkState())
      this.contributorService.getContributor(this.registrationNo, sin).subscribe(
        () => {
          this.setNavigationState(sin);
          this.navigateToProfile();
        },
        err => {
          this.setNavigationState(undefined);
          this.alertService.showError(err.error.message);
        }
      );
    else this.setNavigationState(sin);
  }

  /** Method to set navigation state. */
  setNavigationState(sin: number) {
    this.socialInsuranceNo = sin;
    this.navigateFlag = sin ? true : false;
  }

  /** Method to check the state of component. */
  checkState() {
    const formArray = this.parentForm.controls.wageForms as FormArray;
    const isFormDirty = formArray.controls.some(control => control.dirty);
    const isFormValid = formArray.status === 'VALID';
    if (!isFormValid && isFormDirty) this.showTemplate(this.navigateErrorTemplate);
    else if (isFormDirty && isFormValid) this.showTemplate(this.navigateWithChangesTemplate);
    return (!isFormValid && isFormDirty) || (isFormDirty && isFormValid);
  }

  /** Method to navigate to profile. */
  navigateToProfile() {
    this.router
      .navigate([ContributorRouteConstants.ROUTE_NORMAL_PROFILE(this.registrationNo, this.socialInsuranceNo)])
      .then(() => (this.navigateFlag = false), (this.socialInsuranceNo = undefined));
  }

  /** Method to handle tasks on component destroy. */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }
  setJobDataForPPA() {
    this.jobScaleList$.subscribe(jobScale => {
      if (jobScale) {
        this.civilianJobScale = this.establishment?.jobScaleType
        // jobScale.items.filter(res => {
        //   return res.value.english === 'Civil Job class';
        // })[0]?.code;
        //Job Class List For PPA
        this.contributorService.getJobClass(this.civilianJobScale).subscribe(val => {
          this.jobClassLov = [];
          val.forEach((eachJobType, index) => {
            const lov = new Lov();
            lov.code = eachJobType?.jobClassCode;
            lov.value = eachJobType?.jobClassName;
            lov.sequence = index;
            this.jobClassLov.push(lov);
          });
          this.getJobClassData();
        });
      }
    });
  }
  getJobClassData() {
    this.contributorWageDetailsResponse?.contributors.forEach((contributor, index) => {
      this.lookUpDatas.push(new ManageWageLookUp());
      this.lookUpDatas[index].jobClassLov = this.jobClassLov;
      this.lookUpDatas[index].civilianJobScale = this.civilianJobScale;
      const lov = this.lookUpDatas[index]?.jobClassLov?.find(
        lov => lov.code === contributor?.wageDetails?.jobClassCode
      );
      let selectedJobCLassLov: Lov = new Lov();
      if (lov?.code) {
        selectedJobCLassLov = lov;
      }
      if (selectedJobCLassLov?.code) {
        this.jobClassListChange({ data: selectedJobCLassLov, index: index }, contributor?.wageDetails?.jobRankCode);
      }
    });
  }
  jobClassListChange(event: { data: Lov; index: number }, selectedRank?: number) {
    this.lookUpDatas[event?.index].jobClassCivilTypeLov = event?.data;
    this.contributorService
      .getRank(this.lookUpDatas[event?.index]?.civilianJobScale, event?.data?.code)
      .subscribe(res => {
        let jobRankLov = [];
        let selectedJobRankLov: Lov = new Lov();
        res.forEach((eachRankType, index) => {
          const lov = new Lov();
          lov.code = eachRankType?.jobRankCode;
          lov.value = eachRankType?.jobRankName;
          lov.sequence = index;
          jobRankLov.push(lov);
          if (selectedRank == eachRankType?.jobRankCode) {
            selectedJobRankLov = lov;
          }
        });
        this.lookUpDatas[event?.index].jobRankLov = jobRankLov;
        this.jobRankLov = jobRankLov;
        if (selectedJobRankLov?.code || selectedJobRankLov?.code === 0) {
          this.jobRankListChange({ data: selectedJobRankLov, index: event?.index });
        }
      });
  }
  jobRankListChange(event: { data: Lov; index: number }) {
    this.lookUpDatas[event?.index].jobRankListLov = event.data;
    this.contributorService
      .getGrade(
        this.lookUpDatas[event?.index]?.civilianJobScale,
        this.lookUpDatas[event?.index]?.jobClassCivilTypeLov?.code,
        event?.data?.code
      )
      .subscribe(res => {
        let jobGradeLov = [];
        this.lookUpDatas[event?.index].jobGradeApiResponse = res;
        this.jobGradeApiResponse = res;
        res.forEach((eachGradeType, index) => {
          const lov = new Lov();
          lov.value = eachGradeType?.jobGradeName;
          lov.sequence = index;
          lov.code = parseInt(eachGradeType?.jobGradeCode);
          jobGradeLov.push(lov);
        });
        this.lookUpDatas[event.index].jobGradeLov = jobGradeLov;
        this.jobGradeLov = jobGradeLov;
      });
  }
  clearFilterAlert(){
    this.alertService.clearAlerts();
  }
}
