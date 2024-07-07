/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, Input, OnInit } from '@angular/core';
import { LanguageToken, formatDate } from '@gosi-ui/core';
import { HoldBenefitDetails } from '../../../../shared/models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'bnt-stop-adjustment-details-dc',
  templateUrl: './stop-adjustment-details-dc.component.html',
  styleUrls: ['./stop-adjustment-details-dc.component.scss']
})
export class StopAdjustmentDetailsDcComponent implements OnInit {
  @Input() stopDetails: HoldBenefitDetails = new HoldBenefitDetails();
  adjustments = [];
  lang = 'en';
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
