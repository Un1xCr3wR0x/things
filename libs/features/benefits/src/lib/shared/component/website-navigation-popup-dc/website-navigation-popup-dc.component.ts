/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'bnt-website-navigation-popup-dc',
  templateUrl: './website-navigation-popup-dc.component.html',
  styleUrls: ['./website-navigation-popup-dc.component.scss']
})
export class WebsiteNavigationPopupDcComponent implements OnInit {
  @Output() proceed: EventEmitter<null> = new EventEmitter(null);
  @Output() cancel: EventEmitter<null> = new EventEmitter(null);

  constructor() {}

  ngOnInit(): void {}
  /**Method to trigger approve commitment */
  cancelAction() {
    this.cancel.emit();
  }
  /**Method to trigger cancel commitment */
  proceedAction() {
    this.proceed.emit();
  }
}
