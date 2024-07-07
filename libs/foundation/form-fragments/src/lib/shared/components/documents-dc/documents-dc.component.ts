/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { DocumentItem, ApplicationTypeToken, GosiCalendar } from '@gosi-ui/core';

@Component({
  selector: 'cim-documents-dc',
  templateUrl: './documents-dc.component.html',
  styleUrls: ['./documents-dc.component.scss']
})
export class DocumentsDcComponent implements OnInit, OnChanges {
  /*
   * Input variables
   */
  @Input() documents: DocumentItem[] = [];
  @Input() uuid: string;
  @Input() transactionId: number;
  @Input() businessKey: number;
  @Input() referenceNo: number;
  @Input() isScan = false;
  @Input() disableAutoDoc = false;
  /*
   * Output variables
   */
  @Output() add: EventEmitter<null> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() remove: EventEmitter<DocumentItem> = new EventEmitter();
  /**
   * local variable
   */

  /**
   * @param appToken
   */
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}
  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {
    if (!this.disableAutoDoc) this.addAnotherDocument();
    
  }

  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.documents && changes.documents.currentValue) {
        this.documents = changes.documents.currentValue;
      }
    }
  }

  /**
   * Method to get the scanned document
   * @param document
   */
  refreshDocument(document: DocumentItem) {
    this.refresh.emit(document);
  }
  /**
   * Metod to emit the added document
   */
  addAnotherDocument() {
    this.add.emit();
  }
  /**
   * Metod to emit the delete document
   */
  deleteDocument(document: DocumentItem) {
    this.remove.emit(document);
  }
}
