/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, SimpleChanges, OnChanges, Inject, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';
import { Months } from '../../../shared/enums';
import { PenaltyWaiverSegmentRequest } from '../../../shared/models';

@Component({
  selector: 'blg-exceptional-bulk-penalty-details-dc',
  templateUrl: './exceptional-bulk-penalty-details-dc.component.html',
  styleUrls: ['./exceptional-bulk-penalty-details-dc.component.scss']
})
export class ExceptionalBulkPenaltyDetails implements OnInit, OnChanges {
  // Input Variables
  @Input() waiverDetails: PenaltyWaiverSegmentRequest;

  // Local Variables
  allentityFlag = false;
  sameMonthFlag: boolean;
  startMonth: string;
  endMonth: string;
  lang = 'en';
  waivedPenaltyPercentage: string;
  noOfCon: number;
  vicBulkFlag: boolean;
  noOfEst: number;
  listItemEn;
  regNumberList;
  listItemAr;
  segmentHeading: string;
  modalRef: BsModalRef;
  segmentlistLength: number;
  csvDataList = [];
  segmentFlagVal: boolean;
  segmentlistLengthValue: number;
  csvEst: boolean;
  csvVic: boolean;
  segmentFlagValue: boolean;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly modalService: BsModalService
  ) {}

  /**
   * This method is toget details on intialising the task
   */
  ngOnInit() {
    this.sameMonthFlag = true;
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  /**
   * This method is to detect changes in input property.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.waiverDetails && changes.waiverDetails.currentValue) {
      this.waiverDetails = changes?.waiverDetails?.currentValue;
      this.waivedPenaltyPercentage = this.waiverDetails?.waivedPenaltyPercentage + '%';
      this.startMonth = this.getMonths(this.waiverDetails?.waiverStartDate?.gregorian);
      this.endMonth = this.getMonths(this.waiverDetails?.waiverEndDate?.gregorian);
      if (this.startMonth === this.endMonth) {
        this.sameMonthFlag = true;
      } else {
        this.sameMonthFlag = false;
      }
      if (this.waiverDetails.entityType === 'ESTABLISHMENT') {
        if (this.waiverDetails?.selectedCriteria?.registrationNo !== null) {
          this.segmentHeading = 'BILLING.ESTABLISHMENT-DETAILS';
          this.csvDataList = this.waiverDetails?.selectedCriteria?.registrationNo;
          this.getIdentityNumberDetails(this.csvDataList);
          this.csvEst = true;
          this.vicBulkFlag = false;
          this.csvVic = false;
        } else {
          this.csvEst = false;
          this.noOfEst = 100;
          this.segmentHeading = 'BILLING.ESTABLISHMENT-SEGMENT';
          this.vicBulkFlag = false;
        }
      } else if (this.waiverDetails.entityType === 'BOTH') {
        this.allentityFlag = true;
        this.segmentHeading = 'BILLING.SEGMENTATION-CRITERION';
        this.noOfCon = 500;
        this.noOfEst = 100;
      } else if (this.waiverDetails.entityType === 'VIC') {
        this.segmentHeading = 'BILLING.VIC-SEGMENT';
        this.noOfCon = 500;
        this.vicBulkFlag = true;
        if (this.waiverDetails?.selectedCriteria?.sin !== null) {
          this.segmentHeading = 'BILLING.CONTRIBUTOR-DETAILS';
          this.csvDataList = this.waiverDetails?.selectedCriteria?.sin;
          this.getIdentityNumberDetails(this.csvDataList);
          this.csvVic = true;
          this.csvEst = false;
        } else {
          this.csvVic = false;
        }
      }
      this.getsegmentlists(this.waiverDetails.selectedCriteria.segment.values);
    }
  }

  /**
   * Method to get month from a given date
   * @param date date
   */
  getMonths(date: Date): string {
    return Object.values(Months)[moment(date).toDate().getMonth()];
  }

  getIdentityNumberDetails(list) {
    if (list.length > 0) {
      if (list.length >= 3) {
        this.segmentFlagValue = true;
        this.segmentlistLengthValue = list.length - 2;
      } else {
        this.segmentFlagValue = false;
      }
      if (list)
        for (let i = 0; i <= 1; i++) {
          if (i === 0) {
            this.regNumberList = list[i];
          } else {
            this.regNumberList += ',' + ' ' + list[i];
          }
        }
    }
  }
  getsegmentlists(list) {
    if (list) {
      if (list?.length >= 3) {
        this.segmentFlagVal = true;
      } else {
        this.segmentFlagVal = false;
      }
      this.segmentlistLength = list.length - 2;
      if (list?.length > 1) {
        for (let i = 0; i <= 1; i++) {
          if (i === 0) {
            this.listItemEn = list[i]?.english;
            this.listItemAr = list[i]?.arabic;
          } else {
            this.listItemEn += ',' + ' ' + list[i]?.english;
            this.listItemAr += ',' + ' ' + list[i]?.arabic;
          }
        }
      } else {
        this.listItemEn = list[0].english;
        this.listItemAr = list[0].arabic;
      }
    }
  }
  /** Method to show modal. */
  showSegmentDetailsModel(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }

  /** Method to confirm cancellation of the form. */
  confirmCancelPopUp() {
    this.modalRef.hide();
  }
}
