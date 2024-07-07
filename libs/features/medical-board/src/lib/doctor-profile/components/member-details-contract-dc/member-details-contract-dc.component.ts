import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Contracts } from '../../../shared';
import { ContractDoctorDetails } from '../../../shared/models/contract-doctor-details';

@Component({
  selector: 'mb-member-details-contract-dc',
  templateUrl: './member-details-contract-dc.component.html',
  styleUrls: ['./member-details-contract-dc.component.scss']
})
export class MemberDetailsContractDcComponent implements OnInit,OnChanges {
  @Output() memberdetailseditEvent = new EventEmitter<string>();
  @Input() isMemberCanEdit : boolean;
  @Input() nurse : boolean;
  @Input() contractDetails: Contracts = new Contracts();
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.contractDetails && changes.contractDetails.currentValue) {
      this.contractDetails = changes.contractDetails.currentValue;
    }
  }
  memberdetailsEdit() {
    const memberUrl = this.router.url;
    this.memberdetailseditEvent.emit(memberUrl);

  }

}
