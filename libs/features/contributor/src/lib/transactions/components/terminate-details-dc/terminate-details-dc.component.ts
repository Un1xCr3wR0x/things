import { Component, OnInit, Input } from '@angular/core';
import { Establishment, TerminateContributorDetails } from '../../../shared/models';
import { BankAccount } from '@gosi-ui/core/lib/models';
@Component({
  selector: 'cnt-terminate-details-dc',
  templateUrl: './terminate-details-dc.component.html',
  styleUrls: ['./terminate-details-dc.component.scss']
})
export class TerminateDetailsDcComponent implements OnInit {
  /** Input variables */
  @Input() establishment: Establishment;
  @Input() terminationDetails: TerminateContributorDetails;
  @Input() showbankDetails = false;
  @Input() bankDetails: BankAccount;
  
  constructor() {}

  ngOnInit(): void {}
}
