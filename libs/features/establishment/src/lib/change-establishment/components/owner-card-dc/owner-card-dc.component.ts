/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Inject } from '@angular/core';
import { Owner } from '../../../shared';
import { CommonIdentity, getIdentityByType, getArabicName, GenderEnum, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'est-owner-card-dc',
  templateUrl: './owner-card-dc.component.html',
  styleUrls: ['./owner-card-dc.component.scss']
})
export class OwnerCardDcComponent implements OnInit {
  @Input() owner: Owner;
  @Input() translateFromModule = 'ESTABLISHMENT.';
  @Input() index = 0;
  identity: CommonIdentity;
  maleGender = GenderEnum.MALE;
  femaleGender = GenderEnum.FEMALE;
  lang = 'en';

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.identity = getIdentityByType(this.owner.person.identity, this.owner.person.nationality.english);
    this.identity.idType = this.translateFromModule + this.identity.idType;
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  getOwnerName() {
    let ownerName = null;
    if (this.owner && this.owner.person.name.arabic.firstName) {
      ownerName = getArabicName(this.owner.person.name.arabic);
    }

    return ownerName;
  }
}
