/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken } from '@gosi-ui/core';

@Component({
  selector: 'trn-transaction-tracing-dc',
  templateUrl: './transaction-tracing-dc.component.html'
})
export class TransactionTracingDcComponent implements OnInit {
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}
  isAppIndividual = false;
  selectedApp = ApplicationTypeEnum.PRIVATE;

  ngOnInit(): void {
    this.selectedApp = <ApplicationTypeEnum>this.appToken;
    this.isAppIndividual = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
  }
}
