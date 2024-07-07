/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
  OnChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BranchDetails, EstablishmentDetails, CreditManagmentRequest } from '../../../../shared/models';
import { CreditBalanceDetails } from '../../../../shared/models';
import { FormGroup } from '@angular/forms';
import { CreditManagementService } from '../../../../shared/services';

@Component({
  selector: 'blg-available-balance-details-dc',
  templateUrl: './available-balance-details-dc.component.html',
  styleUrls: ['./available-balance-details-dc.component.scss']
})
export class AvailableBalanceDetailsDcComponent implements OnChanges {
  // Local Variables
  modalRef: BsModalRef;
  amountValue = false;

  // Output Variables

  @Output() registerNo: EventEmitter<string> = new EventEmitter();
  @Output() save: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() selectedBranchList = new EventEmitter();
  @Output() confirmDetail = new EventEmitter();
  @Output() errorFlag: EventEmitter<boolean> = new EventEmitter();
  @Output() cancelPopup: EventEmitter<null> = new EventEmitter();
  @Output() searchValue: EventEmitter<string> = new EventEmitter();
  @Output() popupValue: EventEmitter<null> = new EventEmitter();
  @Output() wrongSearchValue: EventEmitter<null> = new EventEmitter();

  // Input Variables
  @Input() fieldArray = [];
  @Input() creditDetailsReq: CreditManagmentRequest;
  @Input() parentForm: FormGroup;
  @Input() creditBalanceDetails: CreditBalanceDetails;
  @Input() branchLists: BranchDetails[];
  @Input() establishmentDetails: EstablishmentDetails;
  @Input() isSave: boolean;
  @Input() inWorkflow: boolean;
  @Input() isAppPrivate: boolean;

  constructor(private modalService: BsModalService, readonly creditManagementService: CreditManagementService) {}
  /** Template & directive references */
  @ViewChild('branchDetailsView', { static: true })
  branchDetailsView: TemplateRef<HTMLElement>;

  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.branchLists && changes.branchLists.currentValue) {
      this.branchLists = changes.branchLists.currentValue;
    }
    if (changes && changes.establishmentDetails && changes.establishmentDetails.currentValue) {
      this.establishmentDetails = changes.establishmentDetails.currentValue;
    }
    if (changes && changes.isSave && changes.isSave.currentValue) {
      if (this.isSave === true) {
        this.showModal(this.branchDetailsView, 'md');
      }
    }
  }

  /** Method to show modal. */
  saveAndNext(): void {
    this.save.emit();
  }
  showModal(template: TemplateRef<HTMLElement>, size: string) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  searchBranches(registerNumber: string) {
    this.registerNo.emit(registerNumber);
  }
  /**
   * Method to show a confirmation popup for cancelling the transaction.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  /** Method to decline the popUp. */
  decline() {
    this.modalRef.hide();
  }

  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
    this.cancel.emit();
  }

  selectedBranch(list) {
    this.selectedBranchList.emit(list);
  }
  confirmModal() {
    this.modalRef.hide();
    this.confirmDetail.emit();
  }
  cancelModal() {
    this.isSave = false;
    this.modalRef.hide();
    this.cancelPopup.emit();
  }
  setErrorMessage(val) {
    this.errorFlag.emit(val);
  }
  searchValues(res) {
    this.searchValue.emit(res);
  }
  popupCancel() {
    this.popupValue.emit();
  }
  amountFlagValue(res) {
    this.amountValue = res;
  }
  wrongSearch() {
    this.wrongSearchValue.emit();
  }
}
