/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent, TransactionReferenceData, CsvFile } from '@gosi-ui/core';
import { AutoValidationComments } from '@gosi-ui/core/lib/models/auto-validation';

@Component({
  selector: 'mb-assessment-content-dc',
  templateUrl: './assessment-content-dc.component.html',
  styleUrls: ['./assessment-content-dc.component.scss']
})
export class AssessmentContentDcComponent extends BaseComponent implements OnInit, OnChanges {
  //Local Variables
  collapseView = false;

  //Input Variables
  @Input() comments: TransactionReferenceData[];
  @Input() documents: Document[];
  @Input() showDocumentBusinessKey = false;
  @Input() canEdit: boolean;
  @Input() transactionType;
  @Input() showComments: boolean;
  @Input() autoValidationComments?: AutoValidationComments[] = [];
  @Input() csvDocument: CsvFile;

  //Output Variables
  @Output() onEdit: EventEmitter<boolean> = new EventEmitter();
  @Output() collapse: EventEmitter<boolean> = new EventEmitter();
  @Output() onDownload: EventEmitter<null> = new EventEmitter();

  /**
   * Creates an instance of MainContentDcComponent
   * @memberof  MainContentDcComponent
   *
   */
  constructor() {
    super();
  }

  ngOnInit() {
    if ((this.documents && this.documents.length > 0) || this.csvDocument) {
      this.collapseView = false;
    } else {
      this.collapseView = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.documents) {
      if (this.documents && this.documents.length > 0) {
        this.collapseView = false;
      } else {
        this.collapseView = true;
      }
    }
    if (changes.csvDocument && changes.csvDocument.currentValue) this.collapseView = false;
  }
  onCollapse() {
    this.collapseView = !this.collapseView;
    this.collapse.emit(this.collapseView);
  }

  /** Method to handle csv fle download. */
  downloadCsvFile() {
    this.onDownload.emit();
  }
}
