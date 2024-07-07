/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {RegistrationPurpose, VicEngagementDetails} from '../../../../shared/models';
import {CalendarTypeEnum} from "@gosi-ui/core";

@Component({
  selector: 'cnt-view-engagement-details-dc',
  templateUrl: './view-engagement-details-dc.component.html',
  styleUrls: ['./view-engagement-details-dc.component.scss']
})
export class ViewEngagementDetailsDcComponent implements OnInit, OnChanges{

  //Local variables
  typeGregorian = CalendarTypeEnum.GREGORIAN;
  typeHijira = CalendarTypeEnum.HIJRI;

  /** Input variables */
  @Input() engagementDetails: VicEngagementDetails;
  @Input() isAccordianView: boolean;
  @Input() canEdit: boolean;
  @Input() purposeOfEngagement: RegistrationPurpose;

  /** Output variables */
  @Output() onEdit: EventEmitter<null> = new EventEmitter();


  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  /** Method to handle edit. */
  onEditEngagementDetails() {
    this.onEdit.emit();
  }
}
