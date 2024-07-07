import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'mb-mark-esign-dc',
  templateUrl: './mark-esign-dc.component.html',
  styleUrls: ['./mark-esign-dc.component.scss']
})
export class MarkEsignDcComponent implements OnInit {
  @Output() esignConfirmed: EventEmitter<null> = new EventEmitter();
  constructor(readonly modalService: BsModalService) {}

  ngOnInit(): void {}
  closeModal() {
    this.modalService.hide();
  }
  confimEsign() {
    this.esignConfirmed.emit();
  }
  decline() {
    this.modalService.hide();
  }
}
