/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BaseComponent,
  CsvFile,
  EstablishmentStatusEnum,
  RegistrationNoToken,
  RegistrationNumber,
  RoleIdEnum,
  RouterConstants,
  RouterConstantsBase,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { iif, interval, noop, Observable, Subscription, throwError } from 'rxjs';
import { catchError, startWith, switchMap, tap } from 'rxjs/operators';
import { ContributorRouteConstants, ManageWageConstants } from '../../../../shared/constants';
import { SearchTypeEnum, SubmitActions } from '../../../../shared/enums';
import {
  BulkWageDetails,
  BulkWageRequestDetails,
  ContributorBPMRequest,
  ContributorWageParams,
  Establishment
} from '../../../../shared/models';
import { BulkWageService, ContributorsWageService, EstablishmentService } from '../../../../shared/services';

@Component({
  selector: 'cnt-bulk-wage-update-sc',
  templateUrl: './bulk-wage-update-sc.component.html',
  styleUrls: ['./bulk-wage-update-sc.component.scss']
})
export class BulkWageUpdateScComponent extends BaseComponent implements OnInit, OnDestroy {
  /** Local variables */
  registrationNo: number;
  totalNumberOfFiles = 0;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  currentPageNo = 0; // Pagination
  itemsPerPage = 4; // Pagination
  paginationId = 'bulk-upload'; // Pagination id
  isProcessing = true;
  bulkFile: CsvFile;
  uploadFileHistory: BulkWageDetails[] = [];
  interval = interval(30000);
  isAppPrivate: boolean;
  isValid = false;
  uploadedFile: File;
  bulkWageForm: FormGroup = new FormGroup({});
  isEditMode = false;
  modalRef: BsModalRef;
  requestId: number;
  isWorkflowInProgress = false;
  subscription: Subscription;
  totalContributors: number;
  transactionNo: number;
  userRoles: string[] = [];
  isPPAEst = false;

  /** Child components */
  @ViewChild('componentChild') paginationDcComponent: PaginationDcComponent;

  /** Creates an instance of BulkWageUpdateScComponent. */
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly bulkWageService: BulkWageService,
    readonly wageService: ContributorsWageService,
    readonly workflowService: WorkflowService,
    readonly alertService: AlertService,
    readonly authTokenService: AuthTokenService,
    readonly modalService: BsModalService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    @Inject(ApplicationTypeToken) private appToken: string,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(RegistrationNoToken) readonly regNoToken: RegistrationNumber
  ) {
    super();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
  }

  /** Method to initialize the component. */
  ngOnInit(): void {
    if (this.isAppPrivate) {
      this.getUserRolesFO();
      this.checkEditMode();
    }
    if (this.isEditMode) this.initializeViewForEdit();
    else {
      this.registrationNo = this.isAppPrivate
        ? this.regNoToken.value
        : this.establishmentService.getRegistrationFromStorage();
      if (this.registrationNo) this.onEstablishmentSearch(this.registrationNo);
    }
  }

  /** Method to get user role for field office. */
  getUserRolesFO() {
    const gosiscp = this.authTokenService.getEntitlements();
    this.userRoles = gosiscp ? gosiscp?.[0].role?.map(r => r.toString()) : [];
  }

  /** Method to check edit mode. */
  checkEditMode() {
    this.route.url.subscribe(res => {
      if (res.length > 0 && res[0].path === 'update' && res[1].path === 'bulk')
        if (res[2] && res[2].path === 'edit') this.isEditMode = true;
    });
  }

  /** Method to initialize view for edit. */
  initializeViewForEdit() {
    this.isProcessing = false;
    this.readKeysFromToken(this.routerData);
  }

  /** Method to read keys from token. */
  readKeysFromToken(token: RouterData) {
    if (token.payload) {
      const payload = JSON.parse(token.payload);
      if (payload.registrationNo) this.registrationNo = payload.registrationNo;
      if (payload.id) this.requestId = payload.id;
    }
  }
  /** Method to initiaize the view. */
  initializeView() {
    this.wageService
      .getContributorWageDetails(
        this.registrationNo,
        new ContributorWageParams(false, true, SearchTypeEnum.ACTIVE),
        false
      )
      .subscribe(res => (this.totalContributors = res.numberOfContributors));
    this.getProcessedFileHistory(this.currentPageNo).subscribe(noop, noop);
    this.subscription = this.getFilesUnderProcessing(true).subscribe(noop, noop);
  }

  /** Method to handle establishment serach. */
  onEstablishmentSearch(registrationNo: number) {
    if (registrationNo) {
      this.alertService.clearAllErrorAlerts();
      this.establishmentService.getEstablishmentDetails(this.registrationNo).subscribe(
        res => {
          this.checkUserPrivileges(res);
          this.isPPAEst = res?.ppaEstablishment;
        },
        err => this.showError(err)
      );
    }
  }

  /** Method to check user privileges. */
  checkUserPrivileges(establishment: Establishment) {
    if (
      this.isAppPrivate &&
      this.userRoles.includes(RoleIdEnum.CSR.toString()) &&
      establishment?.gccEstablishment?.gccCountry
    )
      this.alertService.showErrorByKey('CONTRIBUTOR.BULK-WAGE-CSR-ERROR');
    else if (
      this.isAppPrivate &&
      this.userRoles.includes(RoleIdEnum.GCC_CSR.toString()) &&
      !establishment?.gccEstablishment?.gccCountry
    )
      this.alertService.showErrorByKey('CONTRIBUTOR.BULK-WAGE-GCC-CSR-ERROR');
    else if (establishment.status.english !== EstablishmentStatusEnum.REGISTERED)
      this.alertService.showErrorByKey('CONTRIBUTOR.BULK-WAGE.ESTABLISHMENT-NOT-REGISTERED-ERROR');
    else {
      this.initializeView();
      this.isValid = true;
    }
  }

  /** Method to download CSV for all active contributors. */
  downloadAllActiveContributorsCSV(): void {
    this.bulkWageService.downloadActiveContributorsCSV(this.registrationNo, null, this.isEditMode).subscribe(
      res => this.saveCSVFile(res),
      err => this.showError(err)
    );
  }

  /** Method to save CSV file. */
  saveCSVFile(data: string): void {
    const universalBOM = '\ufeff'; //Byte Order Mask to force UTF-8 when csv opened in excel
    const blob = new Blob([data ? universalBOM + data : ManageWageConstants.BULK_WAGE_CSV_FILE_HEADER], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', ManageWageConstants.WAGE_UPDATE_FILE_NAME);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  /** Method to start bulk wage file processing. */
  startBulkWageFileProcessing(file: File) {
    if (this.isAppPrivate) this.isWorkflowInProgress = true;
    else this.isProcessing = true;
    this.uploadedFile = file;
    this.bulkFile = new CsvFile(file.name, new Date(), file.size);
    this.bulkWageService
      .processBulkWageUpdate(
        this.registrationNo,
        this.uploadedFile,
        this.isAppPrivate ? this.bulkWageForm.get('comments.comments').value : null,
        this.isEditMode
      )
      .pipe(
        tap(res => {
          if (this.isAppPrivate) this.transactionNo = res.referenceNo;
          this.subscription = this.getFilesUnderProcessing(true).subscribe(noop, noop);
        }),
        switchMap(() => iif(() => this.isEditMode, this.updateBulkWageInEditMode())),
        catchError(err => {
          this.isProcessing = false;
          this.isWorkflowInProgress = false;
          this.showError(err);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }

  /** Method to get upload history. */
  getUploadHistory(pageNo: number, status: string, sortOrder: string = 'Desc'): Observable<BulkWageRequestDetails> {
    return this.bulkWageService
      .getUploadedFileHistory(this.registrationNo, pageNo, this.itemsPerPage, sortOrder, status)
      .pipe(
        catchError(err => {
          this.showError(err);
          return throwError(err);
        })
      );
  }

  /** This method is used to fetch processed file history. */
  getProcessedFileHistory(pageNo: number, sortOrder: string = 'Desc'): Observable<BulkWageRequestDetails> {
    return this.getUploadHistory(pageNo, 'History', sortOrder).pipe(
      tap(res => {
        if (res.bulkWageRequests.length > 0) {
          this.uploadFileHistory = [...res.bulkWageRequests];
          this.totalNumberOfFiles = res.bulkWageRequestCount;
        }
      })
    );
  }

  /** Method to get files under processing. */
  getFilesUnderProcessing(historyRequired: boolean = false) {
    return this.interval.pipe(
      startWith(true),
      switchMap(() => {
        return this.getUploadHistory(0, 'Pending').pipe(
          tap(res => {
            this.checkBulkWageUpdateStatus(res);
            if (!this.isProcessing && !this.isWorkflowInProgress && historyRequired)
              this.getProcessedFileHistory(0).subscribe(noop, noop);
            if (!this.isProcessing && !this.isWorkflowInProgress) this.subscription.unsubscribe();
          })
        );
      })
    );
  }

  /** Method to check bulk wage update status. */
  checkBulkWageUpdateStatus(bulkUpdateDetails: BulkWageRequestDetails) {
    if (bulkUpdateDetails.bulkWageRequestCount > 0) {
      this.isProcessing = bulkUpdateDetails.bulkWageRequests[0].status === 'Initiated';
      this.isWorkflowInProgress = bulkUpdateDetails.bulkWageRequests[0].status === 'Incomplete';
      if (this.isWorkflowInProgress) this.transactionNo = bulkUpdateDetails.bulkWageRequests[0].transactionTraceId;
      this.bulkFile = new CsvFile(
        bulkUpdateDetails.bulkWageRequests[0].fileName,
        bulkUpdateDetails.bulkWageRequests[0].uploadDate.gregorian,
        bulkUpdateDetails.bulkWageRequests[0].fileSize
      );
    } else {
      this.isProcessing = false;
      this.isWorkflowInProgress = false;
      this.bulkFile = undefined;
    }
  }

  /** Method to update bulk wage in edit mode. */
  updateBulkWageInEditMode() {
    return this.workflowService.updateTaskWorkflow(this.assembleBPMPayload()).pipe(
      tap(() => {
        this.alertService.showSuccessByKey('CONTRIBUTOR.SUCCESS-MESSAGES.VALIDATOR-EDIT-MESSAGE');
        this.router.navigate([RouterConstants.ROUTE_INBOX]);
      })
    );
  }

  /** Method to assembel BPM payload. */
  assembleBPMPayload() {
    const data = new ContributorBPMRequest();
    data.taskId = this.routerData.taskId;
    data.user = this.routerData.assigneeId;
    data.outcome = SubmitActions.SUBMIT;
    data.comments = this.bulkWageForm.get('comments.comments').value;
    return data;
  }

  /** Method to fetch report  */
  fetchReport(data: { requestId: number; isSuccessDownload: boolean }): void {
    this.bulkWageService
      .getReport(this.registrationNo, data?.requestId, data?.isSuccessDownload)
      .subscribe(res => this.saveCSVFile(res));
  }

  /** Method to handle upload history pagination. */
  paginateFiles(page: number, sortOrder: string = 'Desc'): void {
    if (page !== this.pageDetails.currentPage) {
      this.currentPageNo = this.pageDetails.currentPage = page;
      this.getProcessedFileHistory(this.currentPageNo, sortOrder).subscribe(noop, noop);
    }
  }

  /** Method to show error alert. */
  showError(error): void {
    this.alertService.showError(error.error.message, error.error.details);
  }

  /** Method to check for changes. */
  checkForChanges(template: TemplateRef<HTMLElement>) {
    if (this.bulkWageForm.get('uploadForm.changed').value) this.showModal(template);
    else this.navigateBack();
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
  hideModal() {
    this.modalRef.hide();
  }

  /** Method to navigate back. */
  navigateBack() {
    if (this.modalRef) this.modalRef.hide();
    if (this.isEditMode) this.router.navigate([ContributorRouteConstants.ROUTE_BULK_WAGE_UPDATE_VALIDATOR]);
    else
      this.router.navigate([RouterConstantsBase.ROUTE_ESTABLISHMENT_SEARCH]),
        (this.establishmentService.setRegistrationNo = null);
  }

  /** Method invoked when component is destroyed. */
  ngOnDestroy() {
    if (!this.subscription?.closed) this.subscription?.unsubscribe();
    //removing registration number form service.
    if (this.establishmentService.getRegistrationNo) this.establishmentService.setRegistrationNo = undefined;
  }
}
