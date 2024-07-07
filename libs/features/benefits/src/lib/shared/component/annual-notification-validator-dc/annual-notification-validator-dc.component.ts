/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';
import { AnnuityResponseDto, PersonalInformation } from '../../models';
import { BenefitConstants } from '../../constants';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-annual-notification-validator-dc',
  templateUrl: './annual-notification-validator-dc.component.html',
  styleUrls: ['./annual-notification-validator-dc.component.scss']
})
export class AnnualNotificationValidatorDcComponent implements OnInit {
  loadLessNotes = true;
  lessNotes = BenefitConstants.LESS_NOTES_LENGTH;

  @Input() annuityBenefitDetails: AnnuityResponseDto;
  @Input() lang = 'en';
  @Input() personDetails: PersonalInformation;

  constructor() {}

  ngOnInit(): void {}

  loadFullNotes() {
    this.loadLessNotes = !this.loadLessNotes;
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
