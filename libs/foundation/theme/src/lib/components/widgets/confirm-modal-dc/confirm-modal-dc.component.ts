import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'gosi-confirm-modal-dc',
  templateUrl: './confirm-modal-dc.component.html',
  styleUrls: ['./confirm-modal-dc.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  private _iconName: string;
  @Input() message: string;
  @Input()
  set iconName(value: string) {
    this._iconName = `assets/icons/svg/${value}_popup.svg`;
  }
  get iconName(): string {
    return this._iconName;
  }
  @Input() customFooter: TemplateRef<HTMLElement>;
  @Input() subMessage: string;

  @Output() onConfirm = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  confirm() {
    this.onConfirm.emit();
  }

  decline() {
    this.onCancel.emit();
  }
}
