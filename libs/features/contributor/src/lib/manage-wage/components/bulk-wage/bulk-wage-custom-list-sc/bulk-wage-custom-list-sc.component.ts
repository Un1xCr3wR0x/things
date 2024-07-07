/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  CalendarService,
  DocumentService,
  LookupService,
  LovList,
  RouterData,
  RouterDataToken,
  StorageService,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ContributorBaseScComponent } from '../../../../shared/components';
import { ContributorRouteConstants, ManageWageConstants } from '../../../../shared/constants';
import { SearchTypeEnum } from '../../../../shared/enums';
import {
  ContributorFilter,
  ContributorWageDetailsResponse,
  ContributorWageParams,
  DownloadCsvParams
} from '../../../../shared/models';
import {
  BulkWageService,
  ContributorService,
  ContributorsWageService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../../shared/services';

@Component({
  selector: 'cnt-bulk-wage-custom-list-sc',
  templateUrl: './bulk-wage-custom-list-sc.component.html',
  styleUrls: ['./bulk-wage-custom-list-sc.component.scss']
})
export class BulkWageCustomListScComponent extends ContributorBaseScComponent implements OnInit, OnDestroy {
  contributorWageDetailsResponse: ContributorWageDetailsResponse = new ContributorWageDetailsResponse();
  nationalityList$: Observable<LovList> = new Observable<LovList>(null);
  parentForm: FormGroup = new FormGroup({});
  isDescending = false;
  totalNumberOfActiveContributors = 0;
  modalRef: BsModalRef;
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  currentPageNo = 0; // Pagination
  itemsPerPage = 10; // Pagination
  paginationId = 'custom-list';
  sortParameters = ManageWageConstants.CUSTOMLIST_SORT_PARAMS;
  searchValue: string | number;
  sortByValue: string;
  filterValue: ContributorFilter;
  isPrivate: boolean;

  @ViewChild('cancelTemplate', { static: true })
  cancelTemplate: TemplateRef<HTMLElement>;

  /** This method is to initialize BulkWageCustomListScComponent. */
  constructor(
    readonly alertService: AlertService,
    readonly bulkWageService: BulkWageService,
    readonly contributorWageService: ContributorsWageService,
    readonly documentService: DocumentService,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly engagementService: EngagementService,
    readonly modalService: BsModalService,
    readonly lookupService: LookupService,
    readonly workflowService: WorkflowService,
    readonly manageWageService: ManageWageService,
    readonly storageService: StorageService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
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
  }

  /** This method is used to handle further more initialize tasks. */
  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.isPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.registrationNo = this.isPrivate
      ? this.establishmentService.getRegistrationNo
      : this.establishmentService.getRegistrationFromStorage();
    if (this.registrationNo) this.fetchEstablishment(this.registrationNo);
    this.nationalityList$ = this.lookupService.getNationalityList();
  }

  /** This method is fetch establishment details. */
  fetchEstablishment(regNumber: number): void {
    this.establishmentService.getEstablishmentDetails(regNumber).subscribe(
      () => this.getContributorWageDetails(this.assembleContributorWageParams()),
      err => this.showError(err)
    );
  }

  /** This method is used to fetch contributor with wage details. */
  getContributorWageDetails(params: ContributorWageParams): void {
    this.alertService.clearAlerts();
    this.contributorWageDetailsResponse = new ContributorWageDetailsResponse();
    this.contributorWageService
      .getContributorWageDetails(this.registrationNo, params, true)
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
        },
        err => this.showError(err)
      );
  }

  /** Method to handle actions of sort , search and filter. */
  fetchContWageDetails(params): void {
    this.totalNumberOfActiveContributors = 0;
    if (params && (params.search || params.sortBy || params.filter)) {
      this.pageDetails.currentPage = 1;
      this.searchValue = params.search ? params.search : null;
      this.sortByValue = params.sortBy ? params.sortBy : null;
      this.filterValue = params.filter ? params.filter : null;
    } else {
      this.searchValue = null;
      this.sortByValue = null;
      this.filterValue = null;
      this.pageDetails.currentPage = 1;
    }
    this.getContributorWageDetails(
      this.assembleContributorWageParams(this.searchValue, this.sortByValue, null, null, this.filterValue)
    );
  }

  /** Method to assemble contributor wage params. */
  assembleContributorWageParams(
    identifier?: string | number,
    sortBy?: string,
    pageNo?: number,
    pageSize?: number,
    filterReq?: ContributorFilter
  ): ContributorWageParams {
    return new ContributorWageParams(
      true,
      null,
      SearchTypeEnum.ACTIVE,
      pageNo,
      pageSize,
      identifier,
      filterReq,
      sortBy,
      this.isDescending ? 'DESC' : 'ASC'
    );
  }

  /** This method is invoked for handling pagination operation. */
  paginateContributors(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.currentPageNo = this.pageDetails.currentPage = page;
      this.getContributorWageDetails(
        this.assembleContributorWageParams(
          this.searchValue,
          this.sortByValue,
          this.currentPageNo,
          this.itemsPerPage,
          this.filterValue
        )
      );
    }
  }

  /** This method is navigate back or cancel transaction. */
  navigateBack() {
    if (this.searchValue || this.sortByValue || this.filterValue) this.showTemplate(this.cancelTemplate);
    else this.navigetBack();
  }

  /** This method is to route history. */
  navigetBack() {
    this.router.navigate([
      this.isPrivate
        ? ContributorRouteConstants.ROUTE_BULK_WAGE_UPDATE
        : ContributorRouteConstants.ROUTE_MANAGE_WAGE_TABS
    ]);
  }

  /** This method is to confirm cancel modal. */
  confirmCancel() {
    this.parentForm.get('searchContributorFormControl').patchValue(null);
    this.parentForm.get('sortContributorFormControl').patchValue(null);
    this.pageDetails.currentPage = this.currentPageNo;
    this.hideModal();
    this.navigetBack();
  }

  /** This method is used to show given template. */
  showTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }

  /** Method to hide modal. */
  hideModal() {
    this.modalRef.hide();
  }

  /** Method to download csv file for active contributors. */
  downloadActiveCsvFile() {
    this.bulkWageService
      .downloadActiveContributorsCSV(
        this.registrationNo,
        new DownloadCsvParams(this.searchValue, this.filterValue, this.sortByValue, this.isDescending ? 'DESC' : 'ASC'),
        false
      )
      .subscribe(
        res => this.saveCsvFile(res),
        err => this.showError(err)
      );
  }

  /** Method to download CSV. */
  saveCsvFile(data: string): void {
    const universalBOM = '\ufeff'; //Byte Order Mask to force UTF-8 when csv opened in excel
    const csv = new Blob([universalBOM + data], { type: 'text/csv;charset=UTF-8' });
    const aElement = document.createElement('a');
    aElement.href = URL.createObjectURL(csv);
    aElement.download = ManageWageConstants.WAGE_UPDATE_FILE_NAME;
    document.body.appendChild(aElement);
    aElement.click();
    document.body.removeChild(aElement);
    URL.revokeObjectURL(aElement.href);
  }

  /** Method to handle tasks on component destroy. */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }
}
