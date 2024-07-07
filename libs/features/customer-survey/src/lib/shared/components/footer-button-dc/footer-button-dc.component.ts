import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'cim-footer-button-dc',
  templateUrl: './footer-button-dc.component.html',
  styleUrls: ['./footer-button-dc.component.scss']
})
export class FooterButtonDcComponent implements OnInit {
  @Input() showCancel = true;
  @Input() showPrevious = false;
  @Input() showPrimary = true;
  @Input() primaryLabel: string;
  @Input() cancelLabel = 'CUSTOMER-INFORMATION.CANCEL';
  @Input() cancelId = 'cancel';
  @Input() primaryId = 'save';
  @Input() previousId = 'previous';
  @Input() hasOnlyPrimary = false;
  @Input() noMarginTop = false;

  @Output() cancel: EventEmitter<void> = new EventEmitter();
  @Output() previous: EventEmitter<void> = new EventEmitter();
  @Output() submit: EventEmitter<void> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
