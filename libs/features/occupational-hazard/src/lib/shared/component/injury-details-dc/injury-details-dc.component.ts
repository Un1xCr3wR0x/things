/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Injury } from '../../models';
import { NationalityTypeEnum } from '@gosi-ui/core';

@Component({
  selector: 'oh-injury-details-dc',
  templateUrl: './injury-details-dc.component.html',
  styleUrls: ['./injury-details-dc.component.scss']
})
export class InjuryDetailsDcComponent implements OnChanges {
  /**
   * Input variables
   */
  @Input() injury: Injury;
  @Output() injurySelected: EventEmitter<number> = new EventEmitter();

  /**
   * Local variables
   */
  latitude = 24.894801;
  longitiude = 46.610461;
  showCity: boolean;

  /**
   *Method to detect changes in input
   * @param changes Capturing input on changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.injury && changes.injury.currentValue) {
      this.latitude = Number(changes.injury.currentValue.latitude);
      this.longitiude = Number(changes.injury.currentValue.longitude);
      if (this.injury?.country?.english === NationalityTypeEnum.SAUDI_NATIONAL) {
        this.showCity = true;
      } else {
        this.showCity = false;
      }
    }
  }
  /**
   * Method to emit the selected injury id
   * @param injuryId
   */
  viewInjuryId(injuryId: number) {
    this.injurySelected.emit(injuryId);
  }
}
