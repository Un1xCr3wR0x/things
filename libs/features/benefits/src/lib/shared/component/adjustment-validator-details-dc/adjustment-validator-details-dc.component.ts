/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LanguageToken, formatDate } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BenefitType } from '../../enum';
import { HoldBenefitDetails } from '../../models';

@Component({
  selector: 'bnt-adjustment-validator-details-dc',
  templateUrl: './adjustment-validator-details-dc.component.html',
  styleUrls: ['./adjustment-validator-details-dc.component.scss']
})
export class AdjustmentValidatorDetailsDcComponent implements OnInit, OnChanges {
  BenefitType = BenefitType;
  @Input() adjustmentDetails: HoldBenefitDetails = new HoldBenefitDetails();
  @Input() checkBenefitType: BenefitType;
  @Input() directDisabled: Boolean;
  @Input() parentForm: FormGroup;
  @Output() onPreviousAdjustmentsClicked = new EventEmitter();
  @Output() navigateToAdjustmentDetails: EventEmitter<number> = new EventEmitter();

  lang = 'en';
  readonly Math = Math;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  //Method to detect changes in input property
  ngOnChanges(changes: SimpleChanges) {}
  onViewPreviousDetails() {
    this.onPreviousAdjustmentsClicked.emit();
  }
  viewAdjustmentDetails() {
    this.navigateToAdjustmentDetails.emit();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
