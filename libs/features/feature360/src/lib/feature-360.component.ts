/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@gosi-ui/core';

@Component({
  selector: 'fea-feature-360-dc',
  templateUrl: './feature-360.component.html'
})
export class Feature360Component extends BaseComponent {
  constructor(readonly router: Router, readonly route: ActivatedRoute) {
    super();
  }
}
