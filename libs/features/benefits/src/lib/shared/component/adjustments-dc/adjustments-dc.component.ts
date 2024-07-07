import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bnt-adjustments-dc',
  templateUrl: './adjustments-dc.component.html',
  styleUrls: ['./adjustments-dc.component.scss']
})
export class AdjustmentsDcComponent implements OnInit {
  @Input() adjustments;
  @Input() lang;
  @Input() totalAdjustmentAmount;
  constructor() {}

  ngOnInit(): void {}
}
