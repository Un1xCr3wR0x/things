/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Injury } from '../../../shared/models';

@Component({
  selector: 'oh-vtr-injury-details-dc',
  templateUrl: './injury-details-dc.component.html',
  styleUrls: ['./injury-details-dc.component.scss']
})
export class InjuryDetailsDcComponent {
  /**
   * Input variables
   */

  @Input() Injury: Injury = new Injury();
  /**
   * Output variables
   */
  @Output() injurySelected: EventEmitter<Injury> = new EventEmitter();
  /**
   * Method to emit selected injury
   * @param injury
   */
  viewInjuryDetails(injury: Injury) {
    this.injurySelected.emit(injury);
  }
}
