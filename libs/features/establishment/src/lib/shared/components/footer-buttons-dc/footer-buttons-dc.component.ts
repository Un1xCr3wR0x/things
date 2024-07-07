/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * Component to handle multiple actions for a transaction
 */
@Component({
  selector: 'est-footer-buttons-dc',
  templateUrl: './footer-buttons-dc.component.html',
  styleUrls: ['./footer-buttons-dc.component.scss']
})
export class FooterButtonsDcComponent implements OnInit {
  //Input Variables

  @Input() size = 'lg';
  @Input() showCancel = true;
  @Input() cancelLabel = 'ESTABLISHMENT.CANCEL';
  @Input() cancelId = 'cancel';

  @Input() showPrimary = true;
  @Input() primaryLabel: string;
  @Input() primaryId = 'save';
  @Input() primaryIcon = undefined;
  @Input() primaryBtnDisabled = false;

  @Input() showPrevious = true;
  @Input() previousId = 'previous';

  @Input() hasOnlyPrimary = false;
  @Input() noMarginTop = false;
  @Input() halfMargin = false;

  //Output Variables
  @Output() cancel: EventEmitter<void> = new EventEmitter();
  @Output() previous: EventEmitter<void> = new EventEmitter();
  @Output() submit: EventEmitter<void> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
