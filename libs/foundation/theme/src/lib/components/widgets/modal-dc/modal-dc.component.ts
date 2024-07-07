import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'gosi-modal-dc',
  templateUrl: './modal-dc.component.html',
  styleUrls: ['./modal-dc.component.scss']
})
export class ModalDcComponent implements OnInit {
  @Input() size: string;
  @Input() modalHeader: string;
  @Input() needCloseButton = false;
  @Input() isAppPublic = false;
  @Output() closeModal: EventEmitter<null> = new EventEmitter();
  @Input() isBill = false;
  @Input() maxHeight = true;

  constructor() {}

  ngOnInit() {}

  close() {
    this.closeModal.emit();
  }
}
