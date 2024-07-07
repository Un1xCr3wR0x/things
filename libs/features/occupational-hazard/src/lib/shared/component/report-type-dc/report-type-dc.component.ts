/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { OHReportTypes } from '../../enums';

@Component({
  selector: 'oh-report-type-dc',
  templateUrl: './report-type-dc.component.html',
  styleUrls: ['./report-type-dc.component.scss']
})
export class InjuryTypeDcComponent {
  /**
   * Local Variables
   */
  @Input() selectedValue: OHReportTypes;

  /**
   * Output event emitters
   */
  @Output() selectType: EventEmitter<OHReportTypes> = new EventEmitter();
  @Output() alert: EventEmitter<null> = new EventEmitter();

  constructor() {}

  /**
   * Method to catch the select event of report type and will emit event to parent
   * @param type
   */
  selectContributorType(type: OHReportTypes) {
    if (type) {
      this.selectedValue = type;
      this.selectType.emit(type);
      this.alert.emit();
    }
  }
}
