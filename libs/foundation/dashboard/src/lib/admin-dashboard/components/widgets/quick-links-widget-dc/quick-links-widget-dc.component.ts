/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuickLinkResponse } from '../../../models';
import { BilingualText } from '@gosi-ui/core';
import { DashboardConstants } from '../../../constants';

@Component({
  selector: 'dsb-quick-links-widget-dc',
  templateUrl: './quick-links-widget-dc.component.html',
  styleUrls: ['./quick-links-widget-dc.component.scss']
})
export class QuickLinksWidgetDcComponent implements OnInit, OnChanges {
  //local variables
  quickLinkForm: FormGroup;
  quickLinkList = [];
  selectedQuickLink: BilingualText[] = [];
  minHeight = DashboardConstants.CARD_MIN_HEIGHT;
  // input variables
  @Input() list: QuickLinkResponse;

  constructor() {}

  ngOnInit(): void {}
  /**
   * This method is used to handle the changes in the input variables
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.list && changes.list.currentValue) {
      this.list = changes.list.currentValue;
    }
  }
}
