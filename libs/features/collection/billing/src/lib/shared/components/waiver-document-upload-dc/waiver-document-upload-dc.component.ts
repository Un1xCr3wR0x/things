/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { BillingConstants } from '../../../shared/constants/billing-constants';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'blg-waiver-document-upload-dc',
  templateUrl: './waiver-document-upload-dc.component.html',
  styleUrls: ['./waiver-document-upload-dc.component.scss']
})
export class WaiverDocumentUploadDcComponent implements OnInit {
  /** Constants */
  documentTransactionId = BillingConstants.PENALTY_WAVIER_DOC_TRANSACTION_ID;
  wavierDetailsForm: FormGroup;
  // Input Variables
  @Input() documents: Document;
  @Input() parentForm: FormGroup;
  @Input() isScan: boolean;
  @Input() csrFlag: boolean;
  @Input() uuid: string;
  @Input() transactionId: string;
  @Input() businessKey: number;
  @Input() isValidator: boolean;
  @Input() referenceNumber: number;
  // Output Variables
  @Output() doc: EventEmitter<null> = new EventEmitter();

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.wavierDetailsForm = this.createWavierDetailForm();
    if (this.parentForm) {
      this.parentForm.addControl('wavierDetailForm', this.wavierDetailsForm);
    }
  }
  createWavierDetailForm(): FormGroup {
    return this.fb.group({
      comments: [null]
    });
  }

  refreshDocuments(item) {
    this.doc.emit(item);
  }
}
