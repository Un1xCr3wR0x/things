/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeEnum, ApplicationTypeToken, RouterConstants, RouterData, RouterDataToken } from '@gosi-ui/core';
import { OhConstants } from '../shared';

@Component({
  selector: 'oh-validator-dc',
  templateUrl: './validator-dc.component.html'
})
export class ValidatorDcComponent implements OnInit, AfterViewInit {
  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerData: RouterData
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.navigate();
  }
  /**
   * Route to todolist
   */
  navigate() {
    if (
      this.router.url === OhConstants.VALIDATOR_ROUTE &&
      this.appToken === ApplicationTypeEnum.PUBLIC &&
      !this.routerData.taskId
    ) {
      this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
    }
  }
}
