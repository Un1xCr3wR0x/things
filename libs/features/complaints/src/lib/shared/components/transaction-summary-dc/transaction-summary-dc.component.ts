/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { AlertService, ApplicationTypeEnum, ApplicationTypeToken, DocumentClassificationEnum, DocumentItem, DocumentService, ItTicketHistory, RouterData, RouterDataToken, TransactionReferenceData, UuidGeneratorService } from '@gosi-ui/core';
import { CategoryEnum } from '../../enums';
import { TransactionSummary } from '../../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { noop, of, throwError } from 'rxjs';
import { TransactionConstants } from '../../constants';
import { catchError, tap } from 'rxjs/operators';
import { TransactionService } from '../../services';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';

export class reopenTrans {
  csrComment: string;
  referenceNo: number;
  uuid : string;
}

@Component({
  selector: 'ces-transaction-summary-dc',
  templateUrl: './transaction-summary-dc.component.html',
  styleUrls: ['./transaction-summary-dc.component.scss']
})
export class TransactionSummaryDcComponent implements OnInit, OnChanges {
  /**
   * Local variables
   */
  categoryEnumValue = CategoryEnum;
  comments: TransactionReferenceData;
  currentTicketHistory: ItTicketHistory[] = [];
  commentForm: FormGroup;
  sequenceNumber: number = 1;
  customerIdentity: number = null;
  transactionTraceId: number = null;
  modalRef: BsModalRef;
  
  
  /**
   * input variables
   */
  @Input() summaryHeading: string;
  @Input() showColumn: boolean;
  @Input() canEdit: boolean;
  @Input() canReopen: boolean;
  @Input() transactionSummary: TransactionSummary;
  @Input() lessPadding = false;
  @Input() typeLabel: string;
  @Input() subTypeLabel: string;
  @Input() dateLabel: string;
  @Input() timeLabel: string;
  @Input() detailLabel: string;
  @Input() isSuggestion: boolean;
  @Input() isTypeLabel: boolean;
  @Input() category: CategoryEnum;
  @Input() ticketHistory: ItTicketHistory[] = [];
  @Input() isIndividualApp: boolean;
  @Input() IsReopenTransaction: boolean = false;

  /**
   * output variables
   */
  @Output() priority: EventEmitter<null> = new EventEmitter();
  @Output() navigateToSaedni: EventEmitter<string> = new EventEmitter();

  isAppPublic: boolean = false;
  transactionCategory: any;
  uuid: string;
  transactionId: number;
  uploadDocuments: DocumentItem[] = [];
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string,
  private fb: FormBuilder,
  readonly documentService: DocumentService,
  readonly router: Router,
  readonly alertService: AlertService,
   readonly modalService: BsModalService,
  readonly transactionService: TransactionService,
  readonly location: Location,
  readonly changePersonService: ChangePersonService,
  readonly uuidService: UuidGeneratorService,
  @Inject(RouterDataToken) private routerData: RouterData) {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.generateUuid();
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.isAppPublic = true;
    }
    let tc = Object.values(CategoryEnum).indexOf(this.category);
    this.transactionCategory = Object.keys(CategoryEnum)[tc];
    this.commentForm = this.createCommentForm();
    this.getRequiredDocuments();
    this.transactionId = this.routerData.idParams.get('transactionID');
  }

  /**
   * method to denerate uuid
   */
  generateUuid() {
    this.uuid = this.uuidService.getUuid();
  }

  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.isTypeLabel) {
      this.isTypeLabel = changes.isTypeLabel.currentValue;
      //console.log("typeLabel is: "+ this.typeLabel);
    }
    if (changes?.ticketHistory?.currentValue) {
      this.currentTicketHistory = changes.ticketHistory.currentValue.slice(0, 2);
    }
  }
  /**
   * method to emit selected priority
   */
  editPriority() {
    this.priority.emit();
  }

  onNavigateToSaedni(ticketNumber: string) {
    this.navigateToSaedni.emit(ticketNumber);
  }

  createCommentForm() {
    return this.fb.group({
      comments: [null, Validators.compose([Validators.required])]
    });
  }

  
  /**
   * Method to get required document list
   */
  getRequiredDocuments() {
    this.getDocumentDetails().subscribe((documentResponse: DocumentItem[]) => {
      documentResponse = documentResponse.filter(item => item.documentClassification == 'Internal');
      documentResponse.forEach(item => {
        item.uuid = this.uuid;
        item.sequenceNumber = this.sequenceNumber;
        this.uploadDocuments.push(item);
      });
      this.sequenceNumber++;
    });
  }
  /**
   * Method to get document details
   */
  getDocumentDetails() {
    const docDetails = TransactionConstants.TRANSACTION_DOCUMENT_DETAILS.find(
      item => item.category?.toLowerCase() === this.category.toLowerCase()
    );
    const docTransactionId = docDetails?.docTransactionId;
    const transactionType = docDetails?.transactionType;
    if (docTransactionId && transactionType) {
      return this.documentService.getRequiredDocuments(docTransactionId, transactionType);
      
    } else return of([]);
  }
  /**
   * Method to get refresh document list
   * @param document
   */
  refreshDocument(document: DocumentItem) {debugger
    if (this.category) {
      this.documentService
        .refreshDocument(
          document,
          this.transactionTraceId,
          TransactionConstants.TRANSACTION_DOCUMENT_DETAILS.find(
            item => item.category?.toLowerCase() === this.category?.toLowerCase()
          )?.docTransactionId,
          TransactionConstants.TRANSACTION_DOCUMENT_DETAILS.find(
            item => item.category?.toLowerCase() === this.category?.toLowerCase()
          )?.transactionType,
          null,
          null,
          this.uuid,
          document.sequenceNumber
        )
        .pipe(
          tap(res => (document = res)),
          catchError(err => {
            this.alertService.showError(err.error.message);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    }
  }
  /**
   * Method to delete all documents
   * @param isRemoveAll
   */
  removeAllDocuments(isRemoveAll = true) {
    this.uploadDocuments.forEach(doc => {
      this.documentService
        .deleteDocument(
          this.transactionTraceId,
          doc.name.english,
          null,
          this.uuid,
          doc.sequenceNumber,
          undefined,
          doc.documentTypeId
        )
        .subscribe();
      this.uploadDocuments = this.uploadDocuments.filter(item => item.sequenceNumber !== doc.sequenceNumber);
    });
    if (this.uploadDocuments.length === 0 && !isRemoveAll) {
      this.getRequiredDocuments();
    }
  }
  /**
   * Method to delete the upload documents
   * @param document
   */
  removeDocuments(document: DocumentItem) {
    this.uploadDocuments = this.uploadDocuments.filter(item => item.sequenceNumber !== document.sequenceNumber);
    if (this.uploadDocuments.length === 0) {
      this.getRequiredDocuments();
    }
  }
  /**
   * Method to reset the document component
   */
  resetDocumentComponent() {
    this.removeAllDocuments();
  }

  onSubmit() {
    this.commentForm.markAllAsTouched();
    let reopenObj : reopenTrans = new reopenTrans();
    let complaintId: any;
    if(this.transactionSummary){
      complaintId = this.routerData.idParams.get('Complaint_ID');
      reopenObj.referenceNo = parseInt(this.transactionSummary.transactionTraceId);
      reopenObj.csrComment = this.commentForm.value.comments;
      reopenObj.uuid = this.uuid;
    }
    this.transactionService.onSubmit(complaintId, reopenObj).subscribe(data => {
      const personId = this.changePersonService.urlPersonId;
      //this.location.back();
      this.routerData.idParams.set('reopenMessage', data.message);
      this.router.navigate([`/home/profile/individual/internal/${personId}/transaction-history`]);
      this.alertService.showSuccess(data.message);
    })
    
  }
  confirmGeneralCancel() {
    this.alertService.clearAlerts();
    // this.resetPage();

    this.modalRef?.hide();
    this.location.back();
  }
  onCancel(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
  decline() {
    this.modalRef.hide();
  }
}
