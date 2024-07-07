/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Injury } from '../../../shared/models';

@Component({
  selector: 'oh-modified-details-dc',
  templateUrl: './modified-details-dc.component.html',
  styleUrls: ['./modified-details-dc.component.scss']
})
export class ModifiedDetailsDcComponent implements OnInit, OnChanges {
  //TODO: remove unused methods
  /**
   * creating an instance
   */
  constructor() {}
  /**Input variables
   */
  @Input() injury: Injury;
  @Input() idCode: string;
  @Input() showHeading = true;
  @Input() allowanceFlagVal: boolean;
  @Input() allowanceFlagVal2: boolean;
  @Input() allowanceFlagVal3: boolean;
  @Input() allowanceFlagVal4: boolean;
  //TODO: remove unused methods
  ngOnInit(): void {}

  //TODO: ngOnChanges is not necessary here, as no chnage is being done during the change
  /**
   *
   * @param changes Capturing changes on input
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.injury && changes.injury.currentValue) {
      this.injury = changes.injury.currentValue;
    }
    if (changes && changes.idCode) {
      this.idCode = changes.idCode.currentValue;
    }
  }
}
