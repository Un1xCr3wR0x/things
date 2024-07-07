import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { DocumentItem, LanguageToken, UuidGeneratorService } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'bnt-add-documents-sc',
  templateUrl: './add-documents-sc.component.html',
  styleUrls: ['./add-documents-sc.component.scss']
})
export class AddDocumentsScComponent implements OnInit {
  lang = 'en';
  isAppPrivate = true;
  documentsToAdd: DocumentItem[] = [];
  modalRef: BsModalRef;

  //document related values
  referenceNo: number;
  ninContributor: number;
  transactionConstant: string;
  documentuuid: string;

  requiredDocuments = [
    {
      required: true,
      name: { arabic: 'أخرى', english: 'Others' },
      documentContent: null,
      reuse: false,
      sequenceNumber: 1,
      identifier: null,
      documentTypeId: 1272
    },
    {
      required: true,
      name: { arabic: 'أخرى', english: 'Proof Of Payment' },
      documentContent: null,
      reuse: false,
      sequenceNumber: 2,
      identifier: null,
      documentTypeId: 1272
    }
  ];

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly uuidGeneratorService: UuidGeneratorService,
    readonly modalService: BsModalService
  ) {}

  ngOnInit(): void {
    // fetching selected language
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.getDocumentRelatedValues();
  }

  /**  Initial Functions */
  getDocumentRelatedValues() {
    this.documentuuid = this.uuidGeneratorService.getUuid();
  }

  /** Event Related functions */

  showAddDocument(document: DocumentItem) {
    this.documentsToAdd.push(document);
  }

  onDelete(document) {}

  refreshDocument(document) {}

  submitDocument() {}

  /** helper functions  */
  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
    this.routeBack();
  }

  decline() {}

  routeBack() {}
}
