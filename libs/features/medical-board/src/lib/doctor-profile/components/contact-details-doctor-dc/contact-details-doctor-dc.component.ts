import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MobileDetails } from '@gosi-ui/core/lib/models/mobile-details';
import { MBConstants, MbProfile } from '../../../shared';
import { ContractDoctorDetails } from '../../../shared/models/contract-doctor-details';

@Component({
  selector: 'mb-contact-details-doctor-dc',
  templateUrl: './contact-details-doctor-dc.component.html',
  styleUrls: ['./contact-details-doctor-dc.component.scss']
})
export class ContactDetailsDoctorDcComponent implements OnInit,OnChanges {
  @Output() contactdetaitseditEvent = new EventEmitter<string>();
  @Input() isContactCanEdit : boolean;
  @Input() contractDoctorDetails: ContractDoctorDetails = new ContractDoctorDetails();
  @Input() person: MbProfile = new MbProfile();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.person && changes.person.currentValue) {
      this.person = changes.person.currentValue;
    }
  }
  contactdetaitsEdit() {
    const contactdetailseditUrl = this.router.url;
    this.contactdetaitseditEvent.emit(contactdetailseditUrl)
  }
  getISDCodePrefix(mobileNo: MobileDetails): string {
    let prefix;
    if (mobileNo === null || (mobileNo && mobileNo.primary === null)) {
      prefix = null;
    } else if (mobileNo && mobileNo.isdCodePrimary === null) {
      prefix = MBConstants.ISD_PREFIX_MAPPING.sa;
    } else {
      Object.keys(MBConstants.ISD_PREFIX_MAPPING).forEach(key => {
        if (mobileNo && key === mobileNo.isdCodePrimary) {
          prefix = MBConstants.ISD_PREFIX_MAPPING[key];
        }
      });
    }
    return prefix;
  }
}
