/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BenefitDetails, HoldBenefitDetails } from '@gosi-ui/features/benefits/lib/shared';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'bnt-validator-benefit-details-restart-dc',
  templateUrl: './validator-benefit-details-restart-dc.component.html',
  styleUrls: ['./validator-benefit-details-restart-dc.component.scss']
})
export class ValidatorBenefitDetailsRestartDcComponent implements OnInit {
  lang = 'en';

  @Input() restartDetails: HoldBenefitDetails = new HoldBenefitDetails();
  @Input() dependentDetails: HoldBenefitDetails = new HoldBenefitDetails();
  @Input() benefitCalculation: BenefitDetails;
  @Output() showModalEvent: EventEmitter<TemplateRef<HTMLElement>> = new EventEmitter();
  @Output() onViewBenefitDetails = new EventEmitter();
  @Output() close = new EventEmitter();

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(lang => (this.lang = lang));
  }
  showModal(calculationDetails: TemplateRef<HTMLElement>) {
    this.showModalEvent.emit(calculationDetails);
  }
  hideModal() {
    this.close.emit();
  }
  viewBenefitDetails() {
    this.onViewBenefitDetails.emit();
  }
}
