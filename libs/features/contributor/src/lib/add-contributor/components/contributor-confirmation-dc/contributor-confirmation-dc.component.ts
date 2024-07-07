/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import {
  BilingualText,
  BorderNumber,
  CalendarTypeEnum,
  CommonIdentity,
  getIdentityByType,
  getPersonNameAsBilingual,
  Iqama,
  LanguageToken,
  NationalId,
  NIN,
  Passport
} from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { EngagementPeriod, PersonalInformation } from '../../../shared';

@Component({
  selector: 'cnt-contributor-confirmation-dc',
  templateUrl: './contributor-confirmation-dc.component.html',
  styles: ['./contributor-confirmation-dc.component.scss']
})
export class ContributorConfirmationDcComponent implements OnInit {
  /**
   * Variable declarations and initialization
   */

  typeGregorian = CalendarTypeEnum.GREGORIAN;
  typeHijira = CalendarTypeEnum.HIJRI;


  @Input() person: PersonalInformation;
  @Input() engagementPeriod: EngagementPeriod[];
  @Input() isApiTriggered = false;

  lang: string;
  contributorName: BilingualText;
  selectedIdentity: CommonIdentity = new CommonIdentity();
  contributorAccount: boolean = true;

  @Output() confirmSubmission: EventEmitter<boolean> = new EventEmitter();

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>, public modalRef: BsModalRef) {}

  ngOnInit() {
    //console.log("eng peroid ",this.engagementPeriod)
    this.language.subscribe(language => (this.lang = language));
    if (this.person.identity?.length > 0 && this.person?.nationality?.english) {
      this.selectedIdentity = this.getIdentityByType(this.person.identity, this.person.nationality.english);
    }
    this.contributorName = getPersonNameAsBilingual(this.person?.name);
  }

  /**
   * This method is to fetch required identitiers by nationality
   * @param identity
   * @param nationality
   */
  getIdentityByType(
    identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber>,
    nationality: string
  ): CommonIdentity {
    if (nationality) {
      const value: CommonIdentity = getIdentityByType(identity, nationality, this.contributorAccount);
      value.idType = 'CONTRIBUTOR.' + value.idType;
      return value;
    }
  }

  confirmSubmit() {
    this.modalRef.hide();
    this.confirmSubmission.emit(true);
  }
  confirmCancel() {
    this.modalRef.hide();
    this.confirmSubmission.emit(false);
  }
}
