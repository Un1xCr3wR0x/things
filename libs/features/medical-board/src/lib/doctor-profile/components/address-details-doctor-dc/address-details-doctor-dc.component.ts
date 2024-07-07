import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MbProfile } from '../../../shared';

@Component({
  selector: 'mb-address-details-doctor-dc',
  templateUrl: './address-details-doctor-dc.component.html',
  styleUrls: ['./address-details-doctor-dc.component.scss']
})
export class AddressDetailsDoctorDcComponent implements OnInit,OnChanges {
  @Output() addressdetaitseditEvent = new  EventEmitter<string>();
  @Input() person: MbProfile = new MbProfile();
  @Input() isAddressCanEdit : boolean;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.person && changes.person.currentValue) {
      this.person = changes.person.currentValue;
    }
  }
  adddresdetaitsEdit(){
    const addressdetailseditUrl= this.router.url;
    this.addressdetaitseditEvent.emit(addressdetailseditUrl);

  }
}
