/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { LanguageToken, formatDate } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { ImprisonmentDetails } from '../../models';

@Component({
  selector: 'bnt-imprisonment-adjustment-dc',
  templateUrl: './imprisonment-adjustment-dc.component.html',
  styleUrls: ['./imprisonment-adjustment-dc.component.scss']
})
export class ImprisonmentAdjustmentDcComponent implements OnInit {
  @Input() imprisonmentAdjustments: ImprisonmentDetails = new ImprisonmentDetails();
  @Output() onPreviousAdjustmentsClicked = new EventEmitter();
  @Output() onViewPaymentHistory = new EventEmitter();
  adjustments = [];
  lang = 'en';
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  onViewPreviousDetails() {
    this.onPreviousAdjustmentsClicked.emit();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
  onViewHistoryDetails() {
    this.onViewPaymentHistory.emit();
  }
}
