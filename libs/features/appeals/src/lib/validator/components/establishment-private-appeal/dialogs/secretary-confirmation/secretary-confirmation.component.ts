import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'secretary-confirmation',
  templateUrl: './secretary-confirmation.component.html'
})
export class SecretaryConfirmationComponent implements OnInit {
  @Output() closeModal: EventEmitter<null> = new EventEmitter();
  @Output() confirm: EventEmitter<void> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  /** Method to close the modal.   */
  hideModal() {
    this.closeModal.emit();
  }
}
