/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Inject, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { LanguageToken, ContactDetails, AddressTypeEnum } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'bnt-person-contact-details-dc',
  templateUrl: './person-contact-details-dc.component.html',
  styleUrls: ['./person-contact-details-dc.component.scss']
})
export class PersonContactDetailsDcComponent implements OnInit, OnChanges {
  lang: string;

  //Input Variables
  @Input() contactDetail: ContactDetails;
  @Input() isIbanVerified = false;
  @Input() isCsr = false;

  //local variables
  isGCC = true;
  hasPOAddress = false;
  hasNationalAddress = false;
  hasOverseasAddress = false;

  /**
   * Creates an instance of PersonContactDetailsDcComponent
   * @memberof  PersonContactDetailsDcComponent
   *
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   * This method handles the initialization tasks.
   *
   */
  ngOnInit() {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.contactDetail.currentValue){
      this.contactDetail = changes.contactDetail.currentValue;
      this.checkForAddresstype();
    }
  }

  checkForAddresstype() {
    if (this.contactDetail.currentMailingAddress === AddressTypeEnum.POBOX) {
      this.hasPOAddress = true;
    }
    if (this.contactDetail.currentMailingAddress === AddressTypeEnum.NATIONAL) {
      this.hasNationalAddress = true;
    }
    if (this.contactDetail.currentMailingAddress === AddressTypeEnum.OVERSEAS) {
      this.hasOverseasAddress = true;
    }
  }
}
