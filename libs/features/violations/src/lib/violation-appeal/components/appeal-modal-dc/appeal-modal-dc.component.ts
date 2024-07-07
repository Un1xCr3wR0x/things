import {Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'vol-appeal-modal-dc',
  templateUrl: './appeal-modal-dc.component.html',
  styleUrls: ['./appeal-modal-dc.component.scss']
})
export class AppealModalDcComponent implements OnInit, OnChanges {

  @Output() actionUserAppeal: EventEmitter<boolean> = new EventEmitter();
  @Output() closeModal: EventEmitter<null> = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }


  esclateAppeal(appealRequest: boolean) {
    this.actionUserAppeal.emit(appealRequest);
  }

  onCloseModal() {
    this.closeModal.emit()
  }
}
