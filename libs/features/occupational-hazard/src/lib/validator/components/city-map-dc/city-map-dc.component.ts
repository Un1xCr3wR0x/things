/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NationalityTypeEnum } from '@gosi-ui/core';
import { Injury } from '../../../shared/models';

@Component({
  selector: 'oh-vtr-city-map-dc',
  templateUrl: './city-map-dc.component.html',
  styleUrls: ['./city-map-dc.component.scss']
})
export class CityMapDcComponent implements OnChanges {
  /**
   * Input variables
   */
  @Input() injuryDetails: Injury = new Injury();

  /**
   *
   * local variables
   */
  showCity: boolean;
  latitude = 24.894801;
  longitude = 46.610461;
  /**
   *
   * @param changes Method to capture inputs on changes for injuryDetails
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.injuryDetails.currentValue) {
      this.injuryDetails = changes.injuryDetails.currentValue;
      this.latitude = Number(changes.injuryDetails.currentValue.latitude);
      this.longitude = Number(changes.injuryDetails.currentValue.longitude);
      if (this.injuryDetails.country.english === NationalityTypeEnum.SAUDI_NATIONAL) {
        this.showCity = true;
      } else {
        this.showCity = false;
      }
    }
  }
}
