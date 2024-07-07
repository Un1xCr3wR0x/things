import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AddedByList,
  AlertService,
  DocumentIndividualItem,
  DocumentItem,
  DocumentService,
  FilterKeyEnum,
  FilterKeyValue,
  LanguageToken,
  Lov,
  LovList,
  downloadFile
} from '@gosi-ui/core';
import { DocumentManagementScBaseComponent } from '../../../../shared/base/document-management-sc.base-component';
import {
  DocumentFilters,
  DocumentRequest,
  EstablishmentConstants,
  EstablishmentService,
  PaginationSize,
  SortRequest
} from '@gosi-ui/features/establishment/lib/shared';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme/src';
import { tap } from 'rxjs/operators';
import { ChangePersonService, ManagePersonConstants, ManagePersonService, RequestLimit } from '@gosi-ui/features/customer-information/lib/shared';
import { ContributorService } from '@gosi-ui/features/contributor/lib/shared/services/contributor.service';
import { SimisDocDetails } from '@gosi-ui/features/customer-information/lib/shared/models/person-details-dto';
import { BehaviorSubject } from 'rxjs-compat';
import { DocFilters } from '@gosi-ui/features/customer-information/lib/shared/models/doc-filter-key';
import { FileOperation } from '@gosi-ui/foundation-theme/lib/components/widgets/input-file-sc/file-operations';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
declare var UTIF;

@Component({
  selector: 'cim-document-view-sc',
  templateUrl: './document-view-sc.component.html',
  styleUrls: ['./document-view-sc.component.scss']
})
export class DocumentViewScComponent extends DocumentManagementScBaseComponent implements OnInit, OnDestroy {
  /** Local Variables */
  docUploadAccess = EstablishmentConstants.ESTABLISHMENT_UPLOAD_DOCUMENT_ACCESS_ROLES;
  isSearched = false;
  searchParam = '';
  filterKey = '';
  estRegNo: number;
  personId: number;
  personNo: number;
  appliedFilter: FilterKeyValue[] = new Array<FilterKeyValue>();
  hasFiltered: boolean;
  addedByList: LovList; //input
  newaddedByList: LovList;
  systemSimisList: LovList;
  newdocumentTypeList: LovList;
  transactionTypeList: LovList;
  appliedFilterValue: boolean = false;
  clearDocumentFilter: DocumentFilters = new DocumentFilters();
  documentRequest: DocumentRequest = <DocumentRequest>{};
  documentFilters: DocFilters = new DocFilters();
  documentNewArrayList: any;
  documentType: string[];
  isReset: boolean = false;
  itemsPerPage = 5; // Pagination
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  paginationId = 'document-list-pagination';
  count: number = 0;
  simisCount: number = 0;
  simisNewCount: number = 0;
  currentPage = 1; // Pagination
  // documentList: DocumentIndividualItem[] = [];
  documentList: DocumentItem[] = [];
  limitItem: RequestLimit = new RequestLimit();
  @ViewChild('paginationComponent') paginationComponent: PaginationDcComponent;
  @ViewChild('paginationDigitalComponent') paginationDigitalComponent: PaginationDcComponent;
  @Output() limit: EventEmitter<RequestLimit> = new EventEmitter();
  totalItems: number;
  isRegistered: boolean;
  userList: AddedByList[];
  personIdentifier: number;
  simisDocDetails: SimisDocDetails;
  sin: any;
  documentArrayListNew: any[] = [];
  documentArrayList: any[] = [];
  lang = 'en';
  initialPageNo = 0;
  page: number;
  addedBy: string[];
  fromDate: string;
  toDate: string;
  transactionType: string[];
  system: string;
  fileUrl;
  docType: any;

  estPagination = 'estPagination';
  estDigitalPagination = 'estDigitalPagination';
  constructor(
    readonly router: Router,
    private sanitizer: DomSanitizer,
    readonly activatedRoute: ActivatedRoute,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    public manageService: ManagePersonService,
    readonly changePersonService: ChangePersonService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
  ) {
    super(documentService, alertService);
  }

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    //this.alertService.clearAlerts();
    if (this.contributorService.NINDetails?.length > 0) {
      this.personIdentifier = this.contributorService.NINDetails[0].newNin;
    } else if (this.contributorService.IqamaDetails?.length > 0) {
      this.personIdentifier = this.contributorService.IqamaDetails[0].iqamaNo;
    }
    this.activatedRoute.parent.parent.paramMap.subscribe(params => {
      if (params.get('personId')) {
        if (params) this.personId = Number(params.get('personId'));


        this.changePersonService.getSocialInsuranceNo().subscribe(res => {
          this.sin = res;
        })
        this.changePersonService.getPersonID().subscribe(res => {
          let personId = res;
          this.personNo = personId;
          // this.changePersonService.getPersonDetails(personId)?.subscribe(res => {
          //   let identity: any = res.identity[0];
          //   for (var i = 0; i <= identity.length; i++) {
          //     if (identity[i].idType == "IQAMA") {
          //       this.personIdentifier = identity[i].iqamaNo;
          //     }
          //     else if (identity[i].idType == "NIN") {
          //       this.personIdentifier = identity[i].newNin;
          //     }
          //   }

          this.getDigitalDocs(personId, 0);
          this.getSimisDetails(personId, 0);
        })

      }
    });
    super.getDocuments();
    // this.getEstProfileData();
    this.initializeData();
  }
  /**
   * Method to initialise the parameters
   */
  initializeData() {
    this.documentRequest.sort = new SortRequest();
    this.documentRequest.page = new PaginationSize();
    //this.limitItem.size = this.itemsPerPage;
    this.limitItem.pageNo = 0;
    //this.documentRequest.page = this.limitItem;
    this.documentRequest.sort.direction = 'DESC';
    // this.getRecords();
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
    this.manageService.getDocumentDetails(this.personNo, this.personId, this.sin, this.searchParam).subscribe(res => {
      let data: any = res;
      // this.documentArrayList = data?.documentList;
      // this.simisCount = data?.docCount;
      this.documentNewArrayList = data?.documentList;
      this.appliedFilterValue = true;
      this.simisNewCount = data?.docCount;
    })
    // this.getRecords();
  }
  filterDocuments(filterValues: DocFilters) {
    if (filterValues) {
      //   this.documentFilters.addedBy = filterValues.addedBy;
      //   this.documentFilters.addedByFilter = [];
      //   this.documentFilters.documentType = filterValues.documentType;
      //   this.documentFilters.documentTypeIds = [];
      //   this.documentFilters.uploadPeriod.fromDate = filterValues.uploadPeriod.fromDate;
      //   this.documentFilters.uploadPeriod.toDate = filterValues.uploadPeriod.toDate;
      //   this.documentFilters.system = filterValues.system;
      //   this.documentFilters?.documentType.forEach(element => {
      //       this.documentType = element?.english;
      //   })
      //   this.setAddedByFIlter();
      //   this.setDocTypeIds();
      //   this.documentRequest.filter = this.documentFilters;
    }
    // this.resetPagination();
    // this.manageService.getDocumentDetails(this.personNo, this.personId, this.sin, this.searchParam, this.documentType, null,this.documentFilters?.uploadPeriod?.toDate, this.documentFilters?.uploadPeriod?.fromDate).subscribe(res => {
    //   let data: any = res;
    //   this.documentArrayList = data?.documentList;
    // })
    // this.getRecords();
    // this.manageService.getDocumentDetails(this.personNo, this.personId, this.sin, this.searchParam, this.documentType, null,this.documentFilters?.uploadPeriod?.toDate, this.documentFilters?.uploadPeriod?.fromDate).subscribe(res => {
    //   let data: any = res;
    //   this.documentArrayList = data?.documentList;
    // })
  }

  // setDocTypeIds() {
  //   const docTypeList = this.documentFilters?.documentType;
  //   if (this.documentRequest?.filter?.documentType?.length > 0) {
  //     const docType: number[] = [];
  //     docTypeList?.forEach(element => {
  //       const addedDoc = [];
  //       this.documentTypeList?.items?.forEach(data => {
  //         if (data?.value.english === element?.english) addedDoc.push(data?.code);
  //       });
  //       addedDoc?.forEach(item => {
  //         docType.push(item);
  //       });
  //     });
  //     this.documentRequest.filter.documentTypeIds = docType;
  //   }
  // }
  resetApplied(val){
    this.appliedFilterValue = false;
  }

  filterApplied(val) {
    this.appliedFilterValue = false;
    // this.appliedFilter = [];
    // val.forEach(element => {
    //   if (element.key === FilterKeyEnum.PERIOD) {
    //     this.appliedFilter.push(element);
    //   } else {
    //     if (element.bilingualValues.length > 0) {
    //       this.appliedFilter.push(element.bilingualValues[0].english);
    //     }
    //   }
    // });
    // this.hasFiltered = this.appliedFilter.length > 0 ? true : false;
    this.documentType = [];
    this.addedBy = [];
    this.transactionType = [];
    if (val.documentType?.length > 0) {
      val.documentType.forEach(type => {
        if (type) {
          this.documentType?.push(type);
        }
      });
    }
    if (val.addedBy?.length > 0) {
      val.addedBy.forEach(type => {
        if (type) {
          this.addedBy?.push(type);
        }
      });
    }
    if (val.transactionType?.length > 0) {
      val.transactionType.forEach(type => {
        if (type) {
          this.transactionType?.push(type);
        }
      });
    }
    this.system = val?.system;
    this.toDate = val?.uploadPeriod?.toDate;
    this.fromDate = val?.uploadPeriod?.fromDate;
    this.manageService.getDocumentDetails(this.personNo, this.personId, this.sin, this.searchParam, this.documentType, this.system, this.toDate, this.fromDate, this.addedBy, this.transactionType).subscribe(res => {
      let data: any = res;
      this.documentNewArrayList = data?.documentList;
      this.appliedFilterValue = true;
      this.simisNewCount = data?.docCount;
    })
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
      .getAllDocumentsOfIndividual(
        this.documentTransactionKey,
        null,
        this.personId,
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
          this.documentList = response[0].documentList;
          this.totalItems = response[0].docCount;
          this.userList = response[0].addedByList;
          this.addedByList = this.mapAddedByLov(response[0].addedByList);
        })
      )
      .subscribe(
        () => { },
        err => {
          this.showErrors(err);
        }
      );
    if (this.totalItems === 0) this.documentList = [];
  }
  // setAddedByFIlter() {
  //   const addedByList = this.documentFilters?.addedBy;
  //   if (this.documentRequest?.filter?.addedBy?.length > 0) {
  //     const addedBy: string[] = [];
  //     addedByList?.forEach(element => {
  //       const addedPerson = [];
  //       this.userList.forEach(data => {
  //         if (data?.userName === element?.english) addedPerson.push(data?.userId);
  //       });
  //       addedPerson?.forEach(item => {
  //         addedBy.push(String(item));
  //       });
  //     });
  //     this.documentRequest.filter.addedByFilter = addedBy;
  //   }
  // }

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
    this.router.navigate([ManagePersonConstants.IND_PROFILE_UPLOAD_DOC_ROUTE(this.personId)]);
  }
  /** This method is invoked for handling pagination operation. */
  paginateDocumentList(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.currentPage = this.pageDetails.currentPage = page;
      this.limitItem.pageNo = this.currentPage - 1;
      //this.documentRequest.page = this.limitItem;
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
    if (this.paginationDigitalComponent) {
      this.paginationDigitalComponent.resetPage();
    }
  }

  ngOnDestroy() {
    this.alertService.clearAlerts();
    super.ngOnDestroy();
  }

  getDigitalDocs(id: any, page: number) {
    this.manageService.getDocumentDetails(id, this.personId, this.sin).subscribe(res => {
      let data: any = res;
      this.simisCount = data.docCount;
      this.documentArrayListNew = data?.documentList;
      this.getAddedByList();
      this.getTypeList();
      this.getTnxList();
      this.getList();
    })

    this.manageService.getDigitalDocumentDetails(id, page, this.personId, this.sin).subscribe(res => {
      let data: any = res;
      this.simisCount = data.docCount;
      this.documentArrayList = data?.documentList;

      // })
    })
  }

  getSimisDetails(id: any, page: number) {
    this.manageService.getsimisDocDetails(id, page).subscribe(res => {

      this.simisDocDetails = res;
      this.count = this.simisDocDetails?.microFinches[0]?.docSize;
    }
    )

  }

  selectDigitalPage(pageNo: number) {

    this.getDigitalDocs(this.personNo, pageNo - 1);
    this.pageDetails.currentPage = pageNo;
  }

  selectPage(pageNo: number) {

    this.getSimisDetails(this.personNo, pageNo - 1);
    this.pageDetails.currentPage = pageNo;
    // if (pageNo - 1 !== this.limitItem.pageNo) {
    //   this.pageDetails.currentPage = pageNo;
    //   this.limitItem.pageNo = pageNo - 1;
    //   this.onLimit();
    // }
  }

  private onLimit() {
    this.limit.emit(this.limitItem);
  }
  getAddedByList() {
    let newList: Lov[] = [];
    this.documentArrayListNew.forEach((val, i) => {
      if (val?.documentAddedBy) {
        newList.push({
          value: {
            arabic: val?.documentAddedBy,
            english: val?.documentAddedBy
          },
          sequence: i
        })
      }
    }
    );
    newList = newList.reduce((acc, val) => {
      if (!acc.find(el => el.value.arabic === val.value.arabic || el.value.english === val.value.english)) {
        acc.push(val);
      }
      return acc;
    }, [])
    this.newaddedByList = new LovList(newList);
  }
  getList() {
    let newList: Lov[] = [];
    // this.documentArrayList.forEach((val, i )=>{
    newList.push({
      value: {
        arabic: 'يدوياََ ',
        english: 'Manually Uploaded'
      },
      sequence: 1
    })
    // }
    // );
    this.systemSimisList = new LovList(newList);
  }
  getTypeList() {
    let newList: Lov[] = [];
    this.documentArrayListNew.forEach((val, i) => {
      if (val?.fileName?.arabic || val?.fileName?.english) {
        newList.push({
          value: {
            arabic: val?.fileName?.arabic,
            english: val?.fileName?.english
          },
          sequence: i
        })
      }
    }
    );
    newList = newList.reduce((acc, val) => {
      if (!acc.find(el => el.value.arabic === val.value.arabic || el.value.english === val.value.english)) {
        acc.push(val);
      }
      return acc;
    }, [])
    this.newdocumentTypeList = new LovList(newList);
  }
  getTnxList() {
    let newList: Lov[] = [];
    this.documentArrayListNew.forEach((val, i) => {
      if (val?.transactionName?.arabic || val?.transactionName?.english) {
        newList.push({
          value: {
            arabic: val?.transactionName?.arabic,
            english: val?.transactionName?.english
          },
          sequence: i,
          code: val?.transactionId
        })
      }
    }
    );
    newList = newList.reduce((acc, val) => {
      if (!acc.find(el => el.value.arabic === val.value.arabic || el.value.english === val.value.english)) {
        acc.push(val);
      }
      return acc;
    }, [])
    this.transactionTypeList = new LovList(newList);
  }


  /**
   * This method handles the document preview.
   */
  docPreveiew(evnt) {
    this.documentService.getDocumentContent(evnt.contentId).subscribe(res => {
      
      this.docType = res.fileName.split('.')[1];
      this.fileUrl = this.getDocumentUrl(res.content);
      if(this.docType == 'pdf'){
        // const fileURL = URL.createObjectURL(res);
        window.open(this.fileUrl.changingThisBreaksApplicationSecurity, '_blank');
      }
    })
  }

  getArrayBuffer(content: string) {
    const byteCharacters = atob(content);
    const byteCharactersLength = byteCharacters.length;
    const byteArrays = new Uint8Array(byteCharactersLength);
    for (let i = 0; i < byteCharactersLength; i++) {
      byteArrays[i] = byteCharacters.charCodeAt(i);
    }
    return byteArrays;
  }

  onDownload(evnt) {
    this.documentService.getDocumentContent(evnt.contentId).subscribe(res => {debugger
      
    let docType = res.fileName.split('.')[1];
    if(docType == 'pdf' || docType == 'tiff'){
      downloadFile(res.fileName, 'application/'+docType , this.getArrayBuffer(res.content));
    }
    else{
      downloadFile(res.fileName, 'image/'+docType, this.getArrayBuffer(res.content));
    }
    
    })
  }

  /**
   * This method is to generate a Url with document content
   * @param documentContent
   */
  getDocumentUrl(documentContent: string) {
    if (this.docType == 'pdf') {
      if (documentContent) {
        let byteChar = atob(documentContent);
        if (byteChar.includes('data:application/pdf;base64,')) {
          byteChar = byteChar.replace('data:application/pdf;base64,', '');
          byteChar = atob(byteChar);
        }
        const byteArrays = [];
        for (let offset = 0; offset < byteChar.length; offset += 512) {
          const slice = byteChar.slice(offset, offset + 512),
            byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        // if (this.documentType === 'pdf') {
        const blob = new Blob(byteArrays, {
          type: `application/pdf`
        });
        return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob) + '#toolbar=0&navpanes=0');
        // } else {
        //   return byteChar;
        // }
      }
    }
    else if (this.docType == 'tiff') {
      const buffer = this.getArrayBuffer(documentContent);
      const ifds = UTIF.decode(buffer);
      const w = window.open('');
      for (let i = 0; i < ifds.length; i++) {
        const img = new Image();
        UTIF.decodeImage(buffer, ifds[i]);
        const timage = ifds[i];
        const array = new Uint8ClampedArray(UTIF.toRGBA8(timage));
        const imageData = new ImageData(array, timage.width, timage.height);
        const canvas = self.document.createElement('canvas');
        canvas.width = timage.width;
        canvas.height = timage.height;
        canvas.getContext('2d').putImageData(imageData, 0, 0);
        img.src = canvas.toDataURL('image/jpeg');
        img.width = 1280;
        w.document.write(img.outerHTML);
        w.document.write('\n\n\n');
      }
    } else {
      const img = new Image();
      img.src = 'data:image/jpeg;base64,' + documentContent;
      const w = window.open('');
      w.document.write(img.outerHTML);
    }
  }
  // getDocumentUrl(documentContent: string) {
  //   if (documentContent) {
  //     let byteChar = atob(documentContent);
  //     if (byteChar.includes('data:application/pdf;base64,')) {
  //       byteChar = byteChar.replace('data:application/pdf;base64,', '');
  //       byteChar = atob(byteChar);
  //     }
  //     const byteArrays = [];
  //     for (let offset = 0; offset < byteChar.length; offset += 512) {
  //       const slice = byteChar.slice(offset, offset + 512),
  //         byteNumbers = new Array(slice.length);
  //       for (let i = 0; i < slice.length; i++) {
  //         byteNumbers[i] = slice.charCodeAt(i);
  //       }
  //       const byteArray = new Uint8Array(byteNumbers);
  //       byteArrays.push(byteArray);
  //     }

  //     // if (this.documentType === 'pdf') {
  //     const blob = new Blob(byteArrays, {
  //       type: `application/pdf`
  //     });
  //     return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob) + '#toolbar=0&navpanes=0');
  //     // } else {
  //     //   return byteChar;
  //     // }
  //   }
  // }

  systemList = [
    {
      english: 'Simis',
      arabic: 'سيمس'
    },
    {
      english: 'Ameen',
      arabic: 'أمين'
    }
  ];
  // systemSimisList = [
  //   {
  //     english: 'Manually Uploaded',
  //     arabic: 'تجاوزت اتفاقية مستوى التشغيل'
  //   }
  // ];
}
