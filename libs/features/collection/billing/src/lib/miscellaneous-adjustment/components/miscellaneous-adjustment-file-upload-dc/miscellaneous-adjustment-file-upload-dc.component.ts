import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentItem } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BillingConstants } from '../../../shared/constants';

@Component({
  selector: 'blg-miscellaneous-adjustment-file-upload-dc',
  templateUrl: './miscellaneous-adjustment-file-upload-dc.component.html',
  styleUrls: ['./miscellaneous-adjustment-file-upload-dc.component.scss']
})
export class MiscellaneousAdjustmentFileUploadDcComponent implements OnInit {
  /** Local variables */
  commentsForm: FormGroup;
  commentsMaxLength = BillingConstants.COMMENTS_MAX_LENGTH;
  modalRef: BsModalRef;

  /** Input variable */
  @Input() isScan: boolean;
  @Input() uuid: string;
  @Input() parentForm: FormGroup;
  @Input() transactionId: string;
  @Input() businessKey: number;
  @Input() referenceNo: number;
  @Input() documentList: DocumentItem[];
  @Input() inWorkflow: boolean;

  /** Output variable */
  @Output() doc: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() cancelBtn: EventEmitter<null> = new EventEmitter();

  constructor(private fb: FormBuilder, private modalService: BsModalService) {}

  ngOnInit() {
    this.commentsForm = this.fb.group({
      comments: [null]
    });
    if (this.parentForm) {
      this.parentForm.addControl('commentsForm', this.commentsForm);
    }
    if (this.inWorkflow) {
      this.uuid = undefined;
    }
  }

  /** Method to reftrsh the documents. */
  refreshDocument(item: DocumentItem) {
    this.doc.emit(item);
  }

  /** Method to Submit MS adjustment details. */
  finalSaveDetails() {
    this.submit.emit();
  }

  /** Method to navigate to prevous section. */
  previousSections() {
    this.previous.emit();
  }

  /**
   * Method to show a confirmation popup for cancelling the transaction.
   * @param template template
   */
  popUpTemplate(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  /** Method to decline the popUp. */
  declinePopup() {
    this.modalRef.hide();
  }

  /** Method to confirm cancellation of the form */
  confirmCancelBtn() {
    this.modalRef.hide();
    this.cancelBtn.emit();
  }
}
