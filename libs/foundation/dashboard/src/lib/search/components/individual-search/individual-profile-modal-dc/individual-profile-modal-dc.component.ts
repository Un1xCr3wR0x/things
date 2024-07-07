import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dsb-individual-profile-modal-dc',
  templateUrl: './individual-profile-modal-dc.component.html',
  styleUrls: ['./individual-profile-modal-dc.component.scss']
})
export class IndividualProfileModalDcComponent implements OnInit {
  //output variables
  @Output() navigate: EventEmitter<null> = new EventEmitter();
  @Output() close: EventEmitter<null> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  navigateTo() {
    this.navigate.emit();
  }
  closeModal() {
    this.close.emit();
  }
}
