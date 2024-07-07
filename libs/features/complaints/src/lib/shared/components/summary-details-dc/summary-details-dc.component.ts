/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  ApplicationTypeToken,
  DocumentItem,
  ItTicketHistory,
  MenuService,
  RoleIdEnum,
  Transaction,
  TransactionReferenceData,
  TransactionWorkflowItem
} from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ComplaintConstants } from '../../constants';
import { CategoryEnum } from '../../enums';
import { CustomerSummary, EstablishmentSummary, TransactionSummary } from '../../models';
import { ITSMDetails } from '../../models/itsm-details';

@Component({
  selector: 'ces-summary-details-dc',
  templateUrl: './summary-details-dc.component.html',
  styleUrls: ['./summary-details-dc.component.scss']
})
export class SummaryDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Local variables
   */
  complaint = ComplaintConstants.COMPLAINT;
  modalRef: BsModalRef;
  commentsMandatory: boolean;
  modalHeader: string;
  isTicketNumber: boolean = false;
  isCustomerCareSeniorOfficer: boolean = false;

  /**
   * Input variables
   */
  @Input() workflow: TransactionWorkflowItem[] = [];
  @Input() comment: TransactionReferenceData[] = [];
  @Input() canReOpen = false;
  @Input() canEdit = false;
  @Input() transactionSummary: TransactionSummary;
  @Input() simisTransactionSummary: TransactionSummary;
  @Input() documents: DocumentItem[] = [];
  @Input() transactionType: string = null;
  @Input() isBack = true;
  @Input() isPrivate = false;
  @Input() canRaiseItsm = false;
  @Input() typeLabel: string;
  @Input() subTypeLabel: string;
  @Input() dateLabel: string;
  @Input() timeLabel: string;
  @Input() detailLabel: string;
  @Input() heading: string;
  @Input() header: string;
  @Input() isTypeLabel = true;
  @Input() summaryHeading: string;
  @Input() customerSummary: CustomerSummary = undefined;
  @Input() establishmentSummary: EstablishmentSummary = undefined;
  @Input() isPreviousTransaction = true;
  @Input() isTracking = false;
  @Input() ticketHistory: ItTicketHistory[] = [];
  @Input() isIndividualApp: boolean;
  @Input() isTicketNumberorNot: boolean = false;
  @Input() itsmDetails: ITSMDetails;
  @Input() IsReopenTransaction: boolean = false;

  /**
   * Output variables
   */
  @Output() reOpen: EventEmitter<null> = new EventEmitter();
  @Output() priority: EventEmitter<null> = new EventEmitter();
  @Output() raiseTicket: EventEmitter<null> = new EventEmitter();
  @Output() showPreviousTransactions: EventEmitter<null> = new EventEmitter();
  @Output() navigateToSaedni: EventEmitter<string> = new EventEmitter();
  @Output() onITSMDetails: EventEmitter<string> = new EventEmitter();
  @Output() navigate: EventEmitter<Transaction> = new EventEmitter();
  @Output() onSubmit1: EventEmitter<any> = new EventEmitter();
  mainHeading: string;
  isSuggestion: boolean;
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string,
    readonly menuService: MenuService,) { }

  ngOnInit(): void { }

  /**
   * method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.documents) this.documents = changes.documents.currentValue;
    if (changes && changes.transactionSummary) this.transactionSummary = changes.transactionSummary.currentValue;
    if (changes && changes.itsmDetails) this.itsmDetails = changes.itsmDetails.currentValue;
    if (changes && changes.workflow) this.workflow = changes.workflow.currentValue;
    if (changes && changes.comment && changes.comment.currentValue) {
      this.comment = changes.comment.currentValue;
    }
    if (changes && changes.canReOpen) this.canReOpen = changes.canReOpen.currentValue;
    if (changes && changes.IsReopenTransaction) this.IsReopenTransaction = changes.IsReopenTransaction.currentValue;
    if (changes && changes.canEdit) this.canEdit = changes.canEdit.currentValue;
    if (changes && changes.transactionType) {
      this.transactionType = changes.transactionType.currentValue;
      this.isSuggestion = this.transactionType === CategoryEnum.SUGGESTION ? true : false;
      this.getMainHeading();
    }
    
    const roles = this.menuService.getRoles();
    if (
      roles.find(
        item =>
          item === RoleIdEnum.CUSTOMER_CARE_SENIOR_OFFICER.toString())) {
      this.isCustomerCareSeniorOfficer = true;
    }
    this.updateChanges(changes);
  }
  /**
   * Method to handle changes
   * @param changes
   */
  updateChanges(changes: SimpleChanges) {
    if (changes && changes.customerSummary) this.customerSummary = changes.customerSummary.currentValue;
    if (changes && changes.canRaiseItsm) this.canRaiseItsm = changes.canRaiseItsm.currentValue;
    if (changes && changes.establishmentSummary) this.establishmentSummary = changes.establishmentSummary.currentValue;
  }
  /**
   * method to emit reopen complaint event
   */
  reOpenComplaint() {
    this.reOpen.emit();
  }

  /**
   * method to emit edit priority event
   */
  editPriority() {
    this.priority.emit();
  }
  /**
   * method to emit raise itsm event
   */
  raiseItsm() {
    this.raiseTicket.emit();
  }
  /**
   * method to get main heading
   */
  getMainHeading() {
    if (this.transactionType && this.transactionType.toLowerCase() === CategoryEnum.COMPLAINT.toLowerCase()) {
      this.mainHeading = ComplaintConstants.COMPLAINT_DETAILS;
    } else if (this.transactionType && this.transactionType.toLowerCase() === CategoryEnum.ENQUIRY.toLowerCase()) {
      this.mainHeading = ComplaintConstants.ENQUIRY_DETAILS;
    } else if (this.transactionType && this.transactionType.toLowerCase() === CategoryEnum.APPEAL.toLowerCase()) {
      this.mainHeading = ComplaintConstants.APPEAL_DETAILS;
    } else if (this.transactionType && this.transactionType.toLowerCase() === CategoryEnum.PLEA.toLowerCase()) {
      this.mainHeading = ComplaintConstants.PLEA_DETAILS;
    } else if (this.transactionType && this.transactionType.toLowerCase() === CategoryEnum.SUGGESTION.toLowerCase()) {
      this.mainHeading = ComplaintConstants.SUGGESTION_DETAILS;
    }
  }
  /**
   * method to emit previous txns
   */
  onShowPreviousTransactions() {
    this.showPreviousTransactions.emit();
  }
  onNavigateToSaedni(ticketNumber: string) {
    this.isTicketNumber = true;
    this.navigateToSaedni.emit(ticketNumber);
  }
  oonITSMDetails(ticketNumber: string) {
    this.onITSMDetails.emit(ticketNumber);
  }
  onNavigateTransaction(transaction: Transaction) {
    this.navigate.emit(transaction);
  }

  onSubmit(data) {
    this.onSubmit1.emit(data);
  }

  onBackFromITSM() {
    this.isTicketNumber = false;
  }
}
