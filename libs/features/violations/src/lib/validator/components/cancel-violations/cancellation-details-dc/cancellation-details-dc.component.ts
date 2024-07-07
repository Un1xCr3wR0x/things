import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChangeViolationValidator } from '../../../../shared/models';

@Component({
  selector: 'vol-cancellation-details-dc',
  templateUrl: './cancellation-details-dc.component.html',
  styleUrls: ['./cancellation-details-dc.component.scss']
})
export class CancellationDetailsDcComponent implements OnInit {
  //Local variables
  employeeName = 'JohnDoe';
  employeeId = 'xxxxxxx';

  @Input() violationDetails: ChangeViolationValidator;
  @Input() isValidator1: boolean;
  @Input() isReopenClosingInProgress: boolean = false;
  @Output() editScreen: EventEmitter<null> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
