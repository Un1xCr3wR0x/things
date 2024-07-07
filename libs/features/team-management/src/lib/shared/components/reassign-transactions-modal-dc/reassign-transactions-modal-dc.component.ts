/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LovList, AlertService, BPMTask, Lov } from '@gosi-ui/core';
import { TeamManagementService } from '../../services';
import { TransactionModalTypeEnum } from '../../enums';
import { ActiveReporteeItem } from '../../models';

@Component({
  selector: 'tm-reassign-transactions-modal-dc',
  templateUrl: './reassign-transactions-modal-dc.component.html',
  styleUrls: ['./reassign-transactions-modal-dc.component.scss']
})
export class ReassignTransactionsModalDcComponent implements OnInit, OnChanges {
  /**
   * input varaibles
   */
  @Input() selectedTransactions: BPMTask[] = [];
  @Input() teamMemberList: ActiveReporteeItem[] = [];
  @Input() modalHeader: string;
  @Input() actionButton: string;
  @Input() modalType: string;
  @Input() reassignForm: FormGroup;
  @Input() commentForm: FormGroup;
  @Input() isUnHold: boolean;
  /** Output variables */
  @Output() closeModal: EventEmitter<null> = new EventEmitter();
  @Output() action: EventEmitter<string> = new EventEmitter();
  /**
   * local variables
   */
  teamLovList: LovList = new LovList([]);
  arrayList: string[] = [];
  list: LovList = new LovList([]);
  modalEnum = TransactionModalTypeEnum;
  constructor(
    readonly fb: FormBuilder,
    readonly tmService: TeamManagementService,
    readonly alertService: AlertService
  ) {}
  /**
   * method to initialise taska
   */
  ngOnInit(): void {}
  /**
   * method to set comment form
   */
  get isCommentsForm() {
    return this.modalType === this.modalEnum.HOLD;
  }
  /**method to set reassign form
   *
   */
  get isReassignForm() {
    return this.modalType === this.modalEnum.REASSIGN || this.modalType === this.modalEnum.UNHOLD_AND_REASSIGN;
  }
  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.teamMemberList && changes.teamMemberList.currentValue) {
        this.teamMemberList = changes.teamMemberList.currentValue;
      }
      this.getReporteeList();
    }
  }
  /***
   * Method to get the reportee list
   */
  getReporteeList() {
    this.teamLovList = new LovList([]);
    this.teamMemberList.forEach(item => {
      const lov = new Lov();
      lov.value.arabic = item.displayName;
      lov.value.english = item.displayName;
      lov.code = item.sequenceCode;
      if (this.isUnHold) {
        this.teamLovList.items.push(lov);
      } else if (!this.selectedTransactions.every(transaction => transaction.assigneeId === item.userId)) {
        this.teamLovList.items.push(lov);
      }
    });
  }
  /**
   * method to emit action
   */
  confirmSubmit() {
    this.action.emit(this.modalType);
  }
  /** Method to close the modal. */
  closeReassignModal() {
    if (this.isCommentsForm) this.commentForm.reset();
    else this.reassignForm.reset();
    this.closeModal.emit();
  }
  /**
   * Method to get userId
   * @param user
   */
  onUserSelect(user: Lov) {
    if (user) {
      this.reassignForm
        .get('userId')
        .setValue(this.teamMemberList.find(item => item.sequenceCode === user.code).userId);
    }
  }
}
