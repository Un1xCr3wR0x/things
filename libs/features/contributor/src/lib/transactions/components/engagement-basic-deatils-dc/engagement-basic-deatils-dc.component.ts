import { Component, Input, OnInit } from '@angular/core';
import { Establishment } from '@gosi-ui/core';

@Component({
  selector: 'cnt-engagement-basic-deatils-dc',
  templateUrl: './engagement-basic-deatils-dc.component.html',
  styleUrls: ['./engagement-basic-deatils-dc.component.scss']
})
export class EngagementBasicDeatilsDcComponent implements OnInit {
  @Input() establishment: Establishment;
  @Input() engagementStatus: string;

  constructor() {}

  ngOnInit(): void {}
}
