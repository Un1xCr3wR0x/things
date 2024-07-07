import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MbProfile } from '../../../shared';
import { ContractDoctorDetails } from '../../../shared/models/contract-doctor-details';

@Component({
  selector: 'mb-bank-details-doctor-dc',
  templateUrl: './bank-details-doctor-dc.component.html',
  styleUrls: ['./bank-details-doctor-dc.component.scss']
})
export class BankDetailsDoctorDcComponent implements OnInit,OnChanges {
  @Output() bankdetaitseditEvent = new EventEmitter<string>();
  @Input() contractDoctorDetails: ContractDoctorDetails = new ContractDoctorDetails();
  @Input() person: MbProfile = new MbProfile();
  @Input() isBankCanEdit : boolean;
  @Input() bankStatus : string;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.person && changes.person.currentValue) {
      this.person = changes.person.currentValue;
    }
  }
  bankdetaitsEdit() {
    const bankdetailseditUrl = this.router.url;
    this.bankdetaitseditEvent.emit(bankdetailseditUrl)
  }
}
