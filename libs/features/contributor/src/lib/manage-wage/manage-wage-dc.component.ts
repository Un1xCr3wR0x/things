/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { ApplicationTypeToken } from '@gosi-ui/core';

@Component({
  selector: 'cnt-manage-wage-dc',
  templateUrl: './manage-wage-dc.component.html'
})
export class ManageWageDcComponent implements OnInit {
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}

  ngOnInit(): void {}
}
