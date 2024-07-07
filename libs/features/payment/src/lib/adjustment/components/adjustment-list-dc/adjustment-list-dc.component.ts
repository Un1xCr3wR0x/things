import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Adjustment, AdjustmentDetails, getAdjustmentReasonForReform} from '../../../shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LovList } from '@gosi-ui/core';

@Component({
  selector: 'pmt-adjustment-list-dc',
  templateUrl: './adjustment-list-dc.component.html',
  styleUrls: ['./adjustment-list-dc.component.scss']
})
export class AdjustmentListDcComponent implements OnInit {
  @Input() activeAdjustments: AdjustmentDetails;
  @Input() set adjustmentReasonList$(value: LovList) {
    this.adjustmentReasonWholeList = value;
    this.adjustmentReasonList = getAdjustmentReasonForReform(value);
  }
  get adjustmentReasonList$() {
    return this.adjustmentReasonList;
  }
  @Input() beneficiaries;
  @Input() type;
  @Input() isValidator: Boolean = false;

  @Output() onAdjustmentAdded = new EventEmitter();
  @Output() onAdjustmentModified = new EventEmitter();
  @Output() onBenefitTypeClicked = new EventEmitter();
  @Output() onAdjustmentEdited = new EventEmitter();

  isAddAdjustment = false;
  modalRef: BsModalRef;
  adjustmentReasonList: LovList;
  adjustmentReasonWholeList: LovList;

  constructor(readonly modalService: BsModalService) {}

  ngOnInit(): void {
    // this.adjustmentReasonList = getAdjustmentReasonForReform(this.adjustmentReasonList$);
  }

  addAdjustment(flag) {
    this.isAddAdjustment = flag;
  }
  showModal(template) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-md' }));
  }
  cancelModal() {
    this.isAddAdjustment = false;
    this.modalRef.hide();
  }
  onAddAdjustment(addFormValues) {
    this.onAdjustmentAdded.emit(addFormValues);
    this.isAddAdjustment = false;
  }
  onEditAdjustment(editFormValues, adjustmentDetail) {
    this.onAdjustmentEdited.emit(editFormValues);
    adjustmentDetail.isEditAdjustment = false;
  }
  onModifyAdjustment(editFormValues, adjustmentDetail) {
    this.onAdjustmentModified.emit(editFormValues);
    adjustmentDetail.isModifyCancelAdjustment = false;
  }
  getActionName(type) {
    if (type === 'Add') {
      return { name: 'ADJUSTMENT.NEW', color: 'primary' };
    } else if (type === 'Modify') {
      return { name: 'ADJUSTMENT.MODIFIED', color: 'info' };
    } else if (type === 'Cancel') {
      return { name: 'ADJUSTMENT.CANCELLED', color: 'danger' };
    } else if (type === 'Recovery') {
      return { name: 'ADJUSTMENT.NEW', color: 'primary' };
    }
  }
  modifyCancelFlag(flag, adjustmentDetail) {
    this.adjustmentReasonList = getAdjustmentReasonForReform(this.adjustmentReasonWholeList, adjustmentDetail.eligibleForPensionReform);
    adjustmentDetail.isModifyCancelAdjustment = flag;
  }
  onIconClicked(adjustmentDetail: Adjustment, flag) {
    this.adjustmentReasonList = getAdjustmentReasonForReform(this.adjustmentReasonWholeList, adjustmentDetail.eligibleForPensionReform);
    if (adjustmentDetail?.actionType?.english === 'Recovery') {
      adjustmentDetail.isViewAdjustment = flag;
    } else if (adjustmentDetail?.actionType?.english === 'Add') {
      adjustmentDetail.isEditAdjustment = flag;
    } else {
      adjustmentDetail.isModifyCancelAdjustment = flag;
    }
  }
  onCancelAddAdjustment(flag, cancelTemplate) {
    if (flag) {
      this.showModal(cancelTemplate);
    } else {
      this.isAddAdjustment = false;
    }
  }
  onCancelEditAdjustment(flag, cancelEditTemplate, adjustmentDetail) {
    if (flag) {
      this.showModal(cancelEditTemplate);
    } else {
      adjustmentDetail.isEditAdjustment = false;
    }
  }
  onModifyCancelFormCancel(flag, adjustmentDetail, cancelModifyTemplate) {
    if (flag) {
      this.showModal(cancelModifyTemplate);
    } else {
      this.modifyCancelFlag(false, adjustmentDetail);
    }
  }
  cancelEditModal(adjustmentDetail) {
    this.onIconClicked(adjustmentDetail, false);
    this.modalRef.hide();
  }
  cancelModifyModal(adjustmentDetail) {
    this.modifyCancelFlag(false, adjustmentDetail);
    this.modalRef.hide();
  }
  navigateToBenefitDetails(benefit) {
    this.onBenefitTypeClicked.emit(benefit);
  }
}
