/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DocumentItem,
  DocumentService,
  bindToObject,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  AlertService
} from '@gosi-ui/core';

@Component({
  selector: 'mb-add-another-document-dc',
  templateUrl: './add-another-document-dc.component.html',
  styleUrls: ['./add-another-document-dc.component.scss']
})
export class AddAnotherDocumentDcComponent implements OnInit,OnChanges {
  documentScanItem: DocumentItem[];
  isMandatoryDocsPresent = false;
  uploadDocumentForm: FormGroup;

  constructor(
    readonly fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}
  @Input() parentForm: FormGroup;
  @Input() documentScanList = [];
  @Input() documentCategoryList = [];
  @Input() referenceNo: string;
  @Input() businessKey: number;
  @Input() earlyReassessment: boolean;
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  isScan = false;

  ngOnInit() {
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isScan = true;
    }
    
  }
  /**
   *
   * @param changes Capturing changes on input
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.documentScanList && changes.documentScanList.currentValue) {
      this.documentScanList = changes.documentScanList.currentValue;
    }

    if (changes && changes.documentCategoryList) {
      this.documentCategoryList = changes.documentCategoryList.currentValue;
    }
    if (this.documentCategoryList.length > 0) {
      this.documentCategoryList.forEach(item => {
        if (item.required === true) {
          this.isMandatoryDocsPresent = true;
        }
      });
    }
    if (changes && changes.referenceNo) {
      this.referenceNo = changes.referenceNo.currentValue;
    }

  }

 

  /**
   *
   * @param index Add document
   */
  addDocument(i, items) {
    this.documentScanItem = this.documentScanList.filter(item => item.name.english === items.name.english);
    const indexs = this.documentScanList
      .slice()
      .reverse()
      .findIndex(item => item.name === items.name);
    const counter = this.documentScanList.length - 1;
    const finalIndex = indexs >= 0 ? counter - indexs : indexs;
    if (this.documentScanList[finalIndex]?.documentContent !== null) {
      i = finalIndex + 1;
      this.documentScanItem[0].required = false;
      this.documentScanList.splice(i, 0, bindToObject(new DocumentItem(), this.documentScanItem[0]));
      this.documentScanList[i].documentContent = null;
      this.documentScanList[i].contentId = null;
      this.documentScanList[i].fileName = null;
      this.documentScanList[i].isScanning = false;
      this.documentScanList[i].valid = false;
      /* Setting the first document as mandatory */
      const indexes = [];
      let count = 1;
      for (const item of this.documentScanList) {
        if (item.name.english === items.name.english) {
          item.sequenceNumber = count;
          count = count + 1;
          indexes.push(this.documentScanList.indexOf(item));
        }
      }
      // const index = indexes[0];
    }
  }

  /** Method to refresh documents after scan. */
  refreshDocument(doc: DocumentItem, index): void {
    this.refresh.emit(doc);
  }

  deleteDocuments(doc: DocumentItem, index): void {
    let count = 0;
    this.documentScanList.forEach(item => {
      if (item.name.english === doc.name.english) {
        count++;
      }
    });
    if (count > 1) {
      this.documentScanList.splice(index, 1);
    }
  }
}
