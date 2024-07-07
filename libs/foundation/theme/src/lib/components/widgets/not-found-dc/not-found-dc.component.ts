/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { AppConstants, ApplicationTypeEnum, ApplicationTypeToken } from '@gosi-ui/core';

@Component({
  selector: 'gosi-not-found-dc',
  templateUrl: './not-found-dc.component.html',
  styleUrls: ['./not-found-dc.component.scss']
})
export class NotFoundDcComponent implements OnInit {
  isAppPublic = false;
  unAuthorizedMsg = {
    messageKey: 'THEME.UNAUTHORIZED-ERROR',
    messageParam: {
      link1: AppConstants.ADD_ADMIN_GPT_LINK_EN,
      link2: AppConstants.ADD_ADMIN_GPT_LINK_AR
    }
  };
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}

  ngOnInit(): void {
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC ? true : false;
  }
}
