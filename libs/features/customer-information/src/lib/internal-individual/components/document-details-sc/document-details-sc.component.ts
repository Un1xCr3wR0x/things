import { Component, OnInit } from '@angular/core';
import { EstablishmentConstants } from '@gosi-ui/features/establishment/lib/shared';

@Component({
  selector: 'cim-document-details-sc',
  templateUrl: './document-details-sc.component.html',
  styleUrls: ['./document-details-sc.component.scss']
})
export class DocumentDetailsScComponent implements OnInit {
  constructor() {}

  /** Local Variables */
  isRegistered: boolean;
  // docUploadAccess = EstablishmentConstants.ESTABLISHMENT_UPLOAD_DOCUMENT_ACCESS_ROLES;
  isSearched = false;
  searchParam = '';

  ngOnInit(): void {}

  uploadDocument() {}

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
      //this.documentRequest.searchKey = searchKey;
    } else {
      //this.alertService.clearAlerts();
      //this.documentRequest.searchKey = undefined;
    }
    // this.resetPagination();
    // this.alertService.clearAlerts();
    // this.getRecords();
  }
}
