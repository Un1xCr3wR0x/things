import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BilingualText} from "@gosi-ui/core";
import {CustomerInfo} from "@gosi-ui/features/violations/lib/shared/models/appeal-on-violation";


@Component({
  selector: 'vol-customer-summary-dc',
  templateUrl: './customer-summary-dc.component.html',
  styleUrls: ['./customer-summary-dc.component.scss']
})
export class CustomerSummaryDcComponent implements OnInit {
  @Input() summary: CustomerInfo;
  @Output() routerProfile: EventEmitter<null> = new EventEmitter();
  @Input() isAppPrivate = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  onProfilePage(event) {
    this.routerProfile.emit(null);
  }
}
