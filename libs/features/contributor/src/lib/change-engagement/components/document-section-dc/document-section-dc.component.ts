/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DocumentItem } from '@gosi-ui/core';
//import { TransactionId } from '../../../shared/enums';

@Component({
  selector: 'cnt-document-section-dc',
  templateUrl: './document-section-dc.component.html',
  styleUrls: ['./document-section-dc.component.scss']
})
export class DocumentSectionDcComponent {
  /** Constants */
  //documentTransactionId = TransactionId.CHANGE_ENGAGEMENT;

  /** Input variables. */
  @Input() documentList: DocumentItem[];
  @Input() engagementId: number;
  @Input() parentForm: FormGroup;
  @Input() referenceNo: number;
  @Input() optionalInfo: string;
  @Input() documentTransactionId: number;

  /** Output variables. */
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<null> = new EventEmitter();

  /** Method to submit the transaction. */
  submitDetails() {
    this.submit.emit();
  }

  /** Method to cancel the transaction. */
  cancelTransaction() {
    this.reset.emit();
  }

  /** Method to emit previous form values. */

  previousSection() {
    this.previous.emit();
  }

  /** Method to emit refresh details. */
  refreshDocument(item: DocumentItem) {
    this.refresh.emit(item);
  }
}
