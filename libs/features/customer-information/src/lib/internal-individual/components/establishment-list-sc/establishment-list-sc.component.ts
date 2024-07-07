import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  LanguageToken,
  statusBadgeType,
  StorageService,
  Person
} from '@gosi-ui/core';
import { RequestLimit } from '@gosi-ui/features/complaints/lib/shared/models';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/src/lib/search/services';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme/src';
import { BehaviorSubject } from 'rxjs';
import { ChangePersonService } from '../../../shared';
import { EstablishmentListDto } from '@gosi-ui/features/contributor/lib/shared/models/establishment-list';

@Component({
  selector: 'cim-establishment-list-sc',
  templateUrl: './establishment-list-sc.component.html',
  styleUrls: ['./establishment-list-sc.component.scss']
})
export class EstablishmentListScComponent implements OnInit {
  selectedLang = 'en';
  estPagination = 'estPagination';
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  itemsPerPage = 10;
  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;

  @Output() limit: EventEmitter<RequestLimit> = new EventEmitter();
  @Output() navigate: EventEmitter<number> = new EventEmitter();
  establishmentSearchCount: number;
  limitItem: RequestLimit = new RequestLimit();
  isPrivate = true;
  isRecent = false;
  isSearch: boolean;
  identifier: number;
  personDtls: Person;
  personId: number;
  establishments: EstablishmentListDto[] = [];
  estCount: number;
  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly dashboardSearchService: DashboardSearchService,
    readonly changePersonService: ChangePersonService,
    readonly activatedRoute: ActivatedRoute,
    readonly router: Router,
    readonly alertService: AlertService,
    readonly storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.changePersonService.getPersonID().subscribe(res => {
      this.personId = res;
      if (this.personId) this.getEstablishmentList(this.personId);
    });
  }

  getEstablishmentList(personId) {
    this.changePersonService.getEstablishmentList(personId).subscribe(res => {
      this.establishments = res;
      this.estCount = this.establishments.length;
    });
  }

  selectPage(pageNo: number) {
    if (pageNo - 1 !== this.limitItem.pageNo) {
      this.pageDetails.currentPage = pageNo;
      this.limitItem.pageNo = pageNo - 1;
      this.onLimit();
    }
  }

  private onLimit() {
    this.limit.emit(this.limitItem);
  }

  /**
   * method to emit est registration number
   * @param registrationNo
   */
  navigateToEstablishment(registrationNo: number) {
    this.dashboardSearchService.registrationNo = registrationNo;
    this.dashboardSearchService.isSummaryPage = true;
  }
  /**
   * method to reset pagination
   */
  resetPagination() {
    this.pageDetails.currentPage = 1;
    this.limitItem.pageNo = 0;
    if (this.paginationDcComponent) this.paginationDcComponent.resetPage();
  }

  /**
   * This method is used to style the status badge based on the received status
   */
  statusBadgeType(establishments) {
    return statusBadgeType(establishments.status.english);
  }

  loadSearchPage() {
    if (this.dashboardSearchService.isSummaryPage === false) {
      this.isSearch = true;
      // this.getSearchResults();
    }
  }

  ngOnDestroy() {
    this.dashboardSearchService.isSummaryPage = false;
  }
}
