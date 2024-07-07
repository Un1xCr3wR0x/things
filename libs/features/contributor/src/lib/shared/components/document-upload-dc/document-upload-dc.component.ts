/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationTypeEnum, ApplicationTypeToken, DocumentItem } from '@gosi-ui/core';
import { MaxLengthEnum } from '../../enums';

@Component({
  selector: 'cnt-document-upload-dc',
  templateUrl: './document-upload-dc.component.html',
  styleUrls: ['./document-upload-dc.component.scss']
})
export class DocumentUploadDcComponent implements OnInit {
  /** Local variables. */
  comments: FormGroup;
  isScan: boolean;
  commentMaxLength = MaxLengthEnum.COMMENTS;

  /** Input variables. */
  @Input() uuid: string;
  @Input() documentList: DocumentItem[];
  @Input() businessKey: number;
  @Input() transactionId: number;
  @Input() parentForm: FormGroup;
  @Input() referenceNo: number;
  @Input() showDocuments: boolean;
  @Input() showComments: boolean;
  @Input() customInfo: string;

  /** Output variables. */
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();

  /** Creates an instance of TerminateDocUploadDcComponent. */
  constructor(private fb: FormBuilder, @Inject(ApplicationTypeToken) private appToken: string) {}

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.comments = this.fb.group({ comments: [null] });
    if (this.parentForm) this.parentForm.addControl('comments', this.comments);
    this.isScan = this.appToken === ApplicationTypeEnum.PRIVATE;
  }

  /** Method to emit refresh details. */
  refreshDocument(item: DocumentItem) {
    this.changeDocumentStatus();
    this.refresh.emit(item);
  }

  /** Method to change document status. */
  changeDocumentStatus() {
    if (this.parentForm && !this.parentForm.get('docStatus.changed'))
      this.parentForm.addControl('docStatus', this.fb.group({ changed: true }));
  }
}
