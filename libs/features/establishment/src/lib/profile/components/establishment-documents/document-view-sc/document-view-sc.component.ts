import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AddedByList,
  AlertService,
  DocumentItem,
  DocumentService,
  FilterKeyEnum,
  FilterKeyValue,
  Lov,
  LovList
} from '@gosi-ui/core';
import {
  DocumentFilters,
  DocumentRequest,
  Establishment,
  EstablishmentConstants,
  EstablishmentService,
  PaginationSize,
  SortRequest
} from '@gosi-ui/features/establishment/lib/shared';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme/src';
import { tap } from 'rxjs/operators';
import { DocumentManagementScBaseComponent } from '../../../../shared/base/document-management-sc.base-component';
@Component({
  selector: 'est-document-view-sc',
  templateUrl: './document-view-sc.component.html',
  styleUrls: ['./document-view-sc.component.scss']
})
export class DocumentViewScComponent extends DocumentManagementScBaseComponent implements OnInit, OnDestroy {
  /** Local Variables */
  docUploadAccess = EstablishmentConstants.ESTABLISHMENT_UPLOAD_DOCUMENT_ACCESS_ROLES;
  isSearched = false;
  searchParam = '';
  estRegNo: number;
  establishment: Establishment;
  appliedFilter: FilterKeyValue[] = new Array<FilterKeyValue>();
  hasFiltered: boolean;
  addedByList: LovList; //input
  clearDocumentFilter: DocumentFilters = new DocumentFilters();
  documentRequest: DocumentRequest = <DocumentRequest>{};
  documentFilters: DocumentFilters = new DocumentFilters();
  itemsPerPage = 10; // Pagination
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  paginationId = 'document-list-pagination';
  currentPage = 1; // Pagination
  documentList: DocumentItem[] = [];
  limitItem: PaginationSize = new PaginationSize();
  @ViewChild('paginationComponent') paginationComponent: PaginationDcComponent;
  totalItems: number;
  isRegistered: boolean;
  isPpa = false;
  ppaEstablishment: boolean;
  userList: AddedByList[];

  constructor(
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly establishmentService: EstablishmentService
  ) {
    super(documentService, alertService);
  }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap.subscribe(
      param => (this.estRegNo = param.get('registrationNo') ? Number(param.get('registrationNo')) : null)
    );
    super.getDocuments();
    this.getEstProfileData();
    this.initializeData();
    this.isPpa = this.establishmentService.isPpaEstablishment;
  }
  /**
   * Method to initialise the parameters
   */
  initializeData() {
    this.documentRequest.sort = new SortRequest();
    this.documentRequest.page = new PaginationSize();
    this.limitItem.size = this.itemsPerPage;
    this.limitItem.pageNo = 0;
    this.documentRequest.page = this.limitItem;
    this.documentRequest.sort.direction = 'DESC';
    this.getRecords();
  }
  getEstProfileData() {
    this.establishmentService.getEstablishmentProfileDetails(this.estRegNo, true).subscribe(res => {
      this.isRegistered = res?.status?.english === 'Registered' ? true : false;
    });
  }

  onSearchEnable(searchKey: string) {
    if (!searchKey && this.isSearched) {
      this.isSearched = false;
      this.searchParam = searchKey;
      this.getSearchedDoc(searchKey);
    }
  }
  searchDocument(searchKey) {
    this.searchParam = searchKey;
    this.isSearched = true;
    this.getSearchedDoc(searchKey);
  }
  getSearchedDoc(searchKey) {
    if (searchKey) {
      this.documentRequest.searchKey = searchKey;
    } else {
      this.alertService.clearAlerts();
      this.documentRequest.searchKey = undefined;
    }
    this.resetPagination();
    this.alertService.clearAlerts();
    this.getRecords();
  }
  filterDocuments(filterValues: DocumentFilters) {
    if (filterValues) {
      this.documentFilters.addedBy = filterValues.addedBy;
      this.documentFilters.addedByFilter = [];
      this.documentFilters.documentType = filterValues.documentType;
      this.documentFilters.documentTypeIds = [];
      this.documentFilters.uploadPeriod.fromDate = filterValues.uploadPeriod.fromDate;
      this.documentFilters.uploadPeriod.toDate = filterValues.uploadPeriod.toDate;
      this.setAddedByFIlter();
      this.setDocTypeIds();
      this.documentRequest.filter = this.documentFilters;
    }
    this.resetPagination();
    this.getRecords();
  }

  setDocTypeIds() {
    const docTypeList = this.documentFilters?.documentType;
    if (this.documentRequest?.filter?.documentType?.length > 0) {
      const docType: number[] = [];
      docTypeList?.forEach(element => {
        const addedDoc = [];
        this.documentTypeList?.items?.forEach(data => {
          if (data?.value.english === element?.english) addedDoc.push(data?.code);
        });
        addedDoc?.forEach(item => {
          docType.push(item);
        });
      });
      this.documentRequest.filter.documentTypeIds = docType;
    }
  }

  filterApplied(val) {
    this.appliedFilter = [];
    val.forEach(element => {
      if (element.key === FilterKeyEnum.PERIOD) {
        this.appliedFilter.push(element);
      } else {
        if (element.bilingualValues.length > 0) {
          this.appliedFilter.push(element);
        }
      }
    });
    this.hasFiltered = this.appliedFilter.length > 0 ? true : false;
  }
  cancelledFilter(val: FilterKeyValue[]) {
    if (val.length === 0) {
      this.clearDocumentFilter = new DocumentFilters();
      this.appliedFilter = [];
      this.hasFiltered = false;
    } else {
      this.clearDocumentFilter = new DocumentFilters();
      val.forEach(element => {
        if (element.key === FilterKeyEnum.ROLES) {
          this.clearDocumentFilter.addedBy = element.bilingualValues;
        }
        if (element.key === FilterKeyEnum.NATIONALITY) {
          this.clearDocumentFilter.documentType = element.bilingualValues;
        }
        if (element.key === FilterKeyEnum.PERIOD) {
          this.clearDocumentFilter.uploadPeriod.fromDate = element.values[0];
          this.clearDocumentFilter.uploadPeriod.toDate = element.values[1];
        }
      });
      this.hasFiltered = true;
    }
  }

  /**
   *
   * Method to fetch history from the service
   */
  getRecords() {
    const pageDetails = this.documentRequest?.page;
    const uploadPeriod = this.documentRequest?.filter?.uploadPeriod;
    const filters = this.documentRequest?.filter;
    this.totalItems = 0;
    this.documentService
      .getDocumentList(
        this.estRegNo,
        this.documentTransactionType,
        null,
        pageDetails?.pageNo,
        pageDetails?.size,
        uploadPeriod?.fromDate,
        uploadPeriod?.toDate,
        filters?.documentTypeIds,
        filters?.addedByFilter,
        this.documentRequest?.searchKey
      )
      .pipe(
        tap(response => {
          if (response.length > 0) {
            const index = response.length - 1;
            this.documentList = response[index].documentList;
            this.totalItems = response[index].docCount;
            this.userList = response[index].addedByList;
            this.addedByList = this.mapAddedByLov(response[index].addedByList);
          }
        })
      )
      .subscribe(
        () => {},
        err => {
          this.showErrors(err);
        }
      );
    if (this.totalItems === 0) this.documentList = [];
  }
  setAddedByFIlter() {
    const addedByList = this.documentFilters?.addedBy;
    if (this.documentRequest?.filter?.addedBy?.length > 0) {
      const addedBy: string[] = [];
      addedByList?.forEach(element => {
        const addedPerson = [];
        this.userList.forEach(data => {
          if (data?.userName === element?.english) addedPerson.push(data?.userId);
        });
        addedPerson?.forEach(item => {
          addedBy.push(String(item));
        });
      });
      this.documentRequest.filter.addedByFilter = addedBy;
    }
  }

  mapAddedByLov(addedByValues: AddedByList[]): LovList {
    const items: Lov[] = [];
    addedByValues.forEach((element, i) => {
      const lookUpValue = new Lov();
      lookUpValue.code = lookUpValue.sequence = i;
      lookUpValue.value.english = element?.userName;
      lookUpValue.value.arabic = element?.userName;
      items.push(lookUpValue);
    });
    return new LovList(items);
  }
  /**
   *
   * @param error This method to show the page level error
   */
  showErrors(error) {
    if (error && error.error && error.error.message) {
      this.alertService.showError(error.error.message, error.error.details);
    }
  }
  uploadDocument() {
    this.router.navigate([EstablishmentConstants.EST_PROFILE_UPLOAD_DOC_ROUTE(this.estRegNo)]);
  }
  /** This method is invoked for handling pagination operation. */
  paginateDocumentList(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.currentPage = this.pageDetails.currentPage = page;
      this.limitItem.pageNo = this.currentPage - 1;
      this.documentRequest.page = this.limitItem;
      this.getRecords();
    }
  }
  /**
   * Method to reset pagination
   */
  resetPagination() {
    this.limitItem.pageNo = 0;
    this.pageDetails.currentPage = 1;
    if (this.paginationComponent) {
      this.paginationComponent.resetPage();
    }
  }

  ngOnDestroy() {
    this.alertService.clearAlerts();
    super.ngOnDestroy();
  }
}
