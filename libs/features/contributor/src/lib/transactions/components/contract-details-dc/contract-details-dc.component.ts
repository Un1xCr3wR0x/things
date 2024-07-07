import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cnt-contract-details-dc',
  templateUrl: './contract-details-dc.component.html',
  styleUrls: ['./contract-details-dc.component.scss']
})
export class ContractDetailsDcComponent {
  /** Output variables. */
  @Output() onViewDetailsClicked: EventEmitter<null> = new EventEmitter<null>(null);

  /** Method to handle view contract details. */
  onViewClick() {
    this.onViewDetailsClicked.emit();
  }
}
