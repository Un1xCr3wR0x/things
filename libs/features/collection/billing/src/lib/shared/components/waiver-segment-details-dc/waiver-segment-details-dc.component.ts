/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnChanges, Input, Inject, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LanguageToken } from '@gosi-ui/core';
import { BulkPenaltyEntityCountDetails, PenaltyWaiverSegmentRequest } from '../../models';

@Component({
  selector: 'blg-waiver-segment-details-dc',
  templateUrl: './waiver-segment-details-dc.component.html',
  styleUrls: ['./waiver-segment-details-dc.component.scss']
})
export class WaiverSegmentDetailsDcComponent implements OnChanges, OnInit {
  // Input Variables
  @Input() establishmentSegment;
  @Input() establishmentSegmentMultiSelect;
  @Input() vicExceptionalFlag: boolean;
  @Input() entityFlag: boolean;
  @Input() csvUploadFlag?: string;
  @Input() csvDataList? = [];
  @Input() bulkpenaltyCount: BulkPenaltyEntityCountDetails;
  @Input() segmentDetailsOnEdit: PenaltyWaiverSegmentRequest;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly modalService: BsModalService
  ) {}
  // local variable
  lang = 'en';
  listItemEnglish;
  listItemArabic;
  regNumberList;
  segmentlistLengthValue: number;
  segmentFlagValue: boolean;
  modalRef: BsModalRef;
  /* Method to instantiate the component. */

  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes?.establishmentSegment?.currentValue) {
      this.establishmentSegment = changes?.establishmentSegment?.currentValue;
    }
    if (changes && changes?.establishmentSegmentMultiSelect?.currentValue) {
      this.establishmentSegmentMultiSelect = changes?.establishmentSegmentMultiSelect?.currentValue;
      this.getsegmentlistDetails(this.establishmentSegmentMultiSelect);
    }
    if (changes?.csvUploadFlag?.currentValue) {
      this.csvUploadFlag = changes?.csvUploadFlag?.currentValue;
    }
    if (changes?.csvDataList?.currentValue) {
      this.csvDataList = changes?.csvDataList?.currentValue;
      if (this.csvDataList.length > 0) this.getRegNumberDetails(this.csvDataList);
    }
    if (changes?.segmentDetailsOnEdit?.currentValue) {
    }
  }
  getRegNumberDetails(list) {
    if (list.length > 0) {
      if (list.length >= 3) {
        this.segmentFlagValue = true;
      } else {
        this.segmentFlagValue = false;
      }
      this.segmentlistLengthValue = list.length - 2;
      if (this.csvDataList) {
        if (list.length === 1) {
          this.regNumberList = list[0];
        } else {
          for (let i = 0; i <= 1; i++) {
            if (i === 0) {
              this.regNumberList = list[i];
            } else {
              this.regNumberList += ',' + ' ' + list[i];
            }
          }
        }
      }
    }
  }
  getsegmentlistDetails(list) {
    if (list.length >= 3) {
      this.segmentFlagValue = true;
    } else {
      this.segmentFlagValue = false;
    }
    this.segmentlistLengthValue = list.length - 2;
    if (list.length > 1) {
      for (let i = 0; i <= 1; i++) {
        if (i === 0) {
          this.listItemEnglish = list[i]?.english;
          this.listItemArabic = list[i]?.arabic;
        } else {
          this.listItemEnglish += ',' + ' ' + list[i]?.english;
          this.listItemArabic += ',' + ' ' + list[i]?.arabic;
        }
      }
    } else {
      this.listItemEnglish = list[0].english;
      this.listItemArabic = list[0].arabic;
    }
  }

  /** Method to show modal. */
  showSegmentDetModel(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }

  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
  }
}
