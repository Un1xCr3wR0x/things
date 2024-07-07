/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UiBenefitsService } from '../../shared';
import { LanguageToken } from '@gosi-ui/core';
import { Location } from '@angular/common';

@Component({
  selector: 'bnt-saned-payment-details-sc',
  templateUrl: './saned-payment-details-sc.component.html',
  styleUrls: ['./saned-payment-details-sc.component.scss']
})
export class SanedPaymentDetailsScComponent implements OnInit {
  benfitsPayment = [];
  /**
   * Local variables
   */
  lang = 'en';
  /**
   * @param location
   * @param UiBenefitsService
   * @param language
   */
  constructor(
    private location: Location,
    public route: ActivatedRoute,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly uiBenefitsService: UiBenefitsService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.getPaymentDetails();
  }
  /**
   * Method to get payment details
   */
  getPaymentDetails() {
    this.uiBenefitsService.getPaymentDetails().subscribe(res => {
      this.benfitsPayment = [];
      this.benfitsPayment.push(res);
    });
  }
  /**
   * Route back to previous page
   */
  routeBack() {
    this.location.back();
  }
}
