/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContributorTypesEnum, LegalEntitiesEnum } from '../../../enums';

@Component({
  selector: 'cnt-contributor-type-dc',
  templateUrl: './contributor-type-dc.component.html',
  styleUrls: ['./contributor-type-dc.component.scss']
})
export class ContributorTypeDcComponent {
  /**
   * Local variable declarations & initialization
   */
  legalEntities = LegalEntitiesEnum;
  saudi = ContributorTypesEnum.SAUDI;
  nonSaudi = ContributorTypesEnum.NON_SAUDI;
  gcc = ContributorTypesEnum.GCC;
  immigratedTribe = ContributorTypesEnum.IMMIGRATED_TRIBE;
  specialForeigner = ContributorTypesEnum.SPECIAL_FOREIGNER;
  seconded = ContributorTypesEnum.SECONDED;
  specialResidents = ContributorTypesEnum.PREMIUM_RESIDENTS;

  /**
   * Input variables
   */

  @Input() legalEntity: string;
  @Input() contributorType: ContributorTypesEnum;
  @Input() isGccCountry = false;
  @Input() ppaEstablishment: boolean;

  /**
   * Output event emitters
   */
  @Output() selectType: EventEmitter<ContributorTypesEnum> = new EventEmitter();

  /**
   * Method to catch the select event of contributor type and will emit event to parent
   * @param type
   */
  selectContributorType(type: ContributorTypesEnum) {
    window.scrollTo(document.documentElement.scrollTop, document.body.scrollHeight);
    if (type) {
      // this.contributorType = type;
      this.selectType.emit(type);
    }
  }
}
