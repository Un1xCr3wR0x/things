/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  BaseComponent,
  NIN,
  Iqama,
  NationalId,
  Passport,
  BorderNumber,
  getPersonIdentifier,
  IdentityTypeEnum
} from '@gosi-ui/core';
import { Person } from '../../../../shared/models';

//This component is to set the address details of the  person

@Component({
  selector: 'cim-identification-details-card-dc',
  templateUrl: './identification-details-card-dc.component.html',
  styleUrls: ['./identification-details-card-dc.component.scss']
})
export class IdentificationDetailsCardDcComponent extends BaseComponent implements OnInit {
  typeNin = IdentityTypeEnum.NIN;
  typeIqama = IdentityTypeEnum.IQAMA;
  typeBorder = IdentityTypeEnum.BORDER;
  typePassport = IdentityTypeEnum.PASSPORT;
  typeGcc = IdentityTypeEnum.NATIONALID;

  //Input variables
  @Input() personDetails: Person;
  @Input() isCsr = false;
  isSaudi: boolean = false;
  identityList: Array<NIN | Iqama | NationalId | Passport | BorderNumber> = [];
  index: number;
  //Output Variables
  @Output() editEvent: EventEmitter<void> = new EventEmitter();
  constructor() {
    super();
  }

  /**
   * This method handles the initialization tasks.
   */
  ngOnInit() {
    if (this.personDetails.nationality.english == 'Saudi Arabia') this.isSaudi = true;
    this.personDetails.identity = [...getPersonIdentifier(this.personDetails)];

    // this.index = this.personDetails.identity.map(x => x.idType).indexOf("GCCID");
    //   this.index != -1 ? this.identityList.push(this.personDetails.identity[this.index]) : null;
    // this.index = this.personDetails.identity.map(x => x.idType).indexOf("IQAMA");
    //   this.index != -1 ? this.identityList.push(this.personDetails.identity[this.index]) : null;
    // this.index = this.personDetails.identity.map(x => x.idType).indexOf("PASSPORT");
    //   this.index != -1 ? this.identityList.push(this.personDetails.identity[this.index]) : null;
    // this.index = this.personDetails.identity.map(x => x.idType).indexOf("NIN");
    //   this.index != -1 ? this.identityList.push(this.personDetails.identity[this.index]) : null;
  }

  // Method to emit edit details

  editEventDetails() {
    this.editEvent.emit();
  }
}
