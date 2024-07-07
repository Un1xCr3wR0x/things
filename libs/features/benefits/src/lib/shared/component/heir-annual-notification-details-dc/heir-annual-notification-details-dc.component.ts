/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit } from '@angular/core';
import { AnnualNotificationDetails } from '../../models';
import { BenefitConstants } from '../../constants/benefit-constants';
import { DateTypePipe } from '@gosi-ui/foundation-theme';

@Component({
  selector: 'bnt-heir-annual-notification-details-dc',
  templateUrl: './heir-annual-notification-details-dc.component.html',
  styleUrls: ['./heir-annual-notification-details-dc.component.scss']
})
export class HeirAnnualNotificationDetailsDcComponent implements OnInit {
  loadLessNotes = true;
  lessNotes = BenefitConstants.LESS_NOTES_LENGTH;
  @Input() annualNotificationDetails: AnnualNotificationDetails;
  constructor() {}

  ngOnInit(): void {}

  loadFullNotes() {
    this.loadLessNotes = !this.loadLessNotes;
  }
}
