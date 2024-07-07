/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit } from '@angular/core';
import { ValidatorRoutingService } from '../shared/services';

@Component({
  selector: 'ces-validator-dc',
  templateUrl: './validator-dc.component.html',
  styles: []
})
export class ValidatorDcComponent implements OnInit {
  /**
   *
   * @param validatorRoutingService
   */
  constructor(readonly validatorRoutingService: ValidatorRoutingService) {}

  //Method to initialise tasks
  ngOnInit(): void {
    this.validatorRoutingService.navigateTo();
  }
}
