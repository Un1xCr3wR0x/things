/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CreditBalanceDetails } from '../../../shared/models';

@Component({
  selector: 'bnt-vic-details-dc',
  templateUrl: './vic-details-dc.component.html',
  styleUrls: ['./vic-details-dc.component.scss']
})
export class VicDetailsDcComponent implements OnInit {
  @Input() creditBalanceDetails: CreditBalanceDetails;
  @Output() gotoVicViewPage: EventEmitter<null> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  viewVic() {
    this.gotoVicViewPage.emit();
  }
}
