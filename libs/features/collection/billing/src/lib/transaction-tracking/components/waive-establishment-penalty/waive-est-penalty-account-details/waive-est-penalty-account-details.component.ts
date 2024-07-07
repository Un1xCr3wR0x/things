import { Component, Input, OnInit } from '@angular/core';
import { PenalityWavier } from '../../../../shared/models';

@Component({
  selector: 'blg-waive-est-penalty-account-details',
  templateUrl: './waive-est-penalty-account-details.component.html',
  styleUrls: ['./waive-est-penalty-account-details.component.scss']
})
export class WaiveEstPenaltyAccountDetailsComponent implements OnInit {

  @Input() waiverDetails: PenalityWavier;
  @Input() isPPA: boolean;
  @Input() waiverType: string;
  @Input() socialInsuranceno: number;
  constructor() { }

  ngOnInit() { 
  }
}


