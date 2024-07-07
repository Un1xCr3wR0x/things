import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BilingualText} from "@gosi-ui/core";
import {ViolationTransaction} from "@gosi-ui/features/violations";

@Component({
  selector: 'vol-appeal-summary-dc',
  templateUrl: './appeal-summary-dc.component.html',
  styleUrls: ['./appeal-summary-dc.component.scss']
})
export class AppealSummaryDcComponent implements OnInit {
  @Input() violationDetail: ViolationTransaction;
  @Output() routeViolation: EventEmitter<null> = new EventEmitter();
  @Input() employeeComment: string;

  constructor() { }

  ngOnInit(): void {
  }

  onViolationPage(route) {
    this.routeViolation.emit(null);
  }
}
