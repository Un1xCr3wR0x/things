import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { statusBadgeType } from '@gosi-ui/core';
import { BankAccountList } from '../../../shared';

@Component({
  selector: 'cim-bank-details-item-dc',
  templateUrl: './bank-details-item-dc.component.html',
  styleUrls: ['./bank-details-item-dc.component.scss']
})
export class BankDetailsItemDcComponent implements OnInit {
  @Input() bankAccountList: BankAccountList;
  @Input() index = 0;
  @Input() lang;
  @Output() reverify: EventEmitter<boolean> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  statusBadgeType(txn: BankAccountList) {
    return statusBadgeType(txn.status.english);
  }
  verification() {
    this.reverify.emit(true);
  }
}
