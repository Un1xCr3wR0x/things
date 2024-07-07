/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { BenefitDetails, UnemploymentResponseDto } from '../../../shared/models';
import { Role, formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-validator-appeal-details-dc',
  templateUrl: './validator-appeal-details-dc.component.html',
  styleUrls: ['./validator-appeal-details-dc.component.scss']
})
export class ValidatorAppealDetailsDcComponent implements OnInit, OnChanges {
  @Input() appealDetails: UnemploymentResponseDto;
  @Input() selectedRequestDate;
  @Input() lang = 'en';
  @Output() showEligibilityPopups = new EventEmitter();
  @Output() onDateEditCick = new EventEmitter();
  @Input() showIneligibilityPoup;
  @Input() validatorAppealCanEdit;
  @Input() role: string;
  @Input() benefitDetails: BenefitDetails;
  rolesEnum = Role;
  constructor() {}

  ngOnInit(): void {
    //console.log(this.selectedRequestDate);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.selectedRequestDate) {
      this.selectedRequestDate = changes.selectedRequestDate.currentValue;
    }
    if (changes && changes?.showIneligibilityPoup) {
      this.showIneligibilityPoup = changes.showIneligibilityPoup.currentValue;
    }
  }

  getDateFormat(lang) {
    return formatDate(lang);
  }
}
