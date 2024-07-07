/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { OhService } from '../../services';
import { Injury, InjuryHistoryResponse } from '../../models';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'oh-close-injury-dc',
  templateUrl: './close-injury-dc.component.html',
  styleUrls: ['./close-injury-dc.component.scss']
})
export class CloseInjuryDcComponent implements OnInit, OnChanges {
  /**
   * creating an instance
   */
  constructor(readonly ohService: OhService) {}
  /*
   * Local variables variables
   */
  isClosed = true;
  /*
   * Input variables
   */
  @Input() injury: Injury;
  @Input() canEdit = false;
  @Input() showHeading = true;
  @Input() close = false;
  @Input() injuryClosingStatus: BilingualText;
  @Input() injuryHistoryResponse: InjuryHistoryResponse;
  @Input() complicationInjuryId: number;
  @Input() injuryComplicationID: number;
  /*
   * Output variables
   */
  @Output() injurySelected: EventEmitter<Injury> = new EventEmitter();
  @Output() onEdit: EventEmitter<null> = new EventEmitter();
  /**
   * This method is to initialise tasks
   */
  ngOnInit(): void {}
  /**
   *
   * @param changes Capturing changes on input
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.injury) {
      this.injury = changes.injury.currentValue;
    }
    if (changes && changes.canEdit) {
      this.canEdit = changes.canEdit.currentValue;
    }
  }
  /**
   * Method to emit selected injury
   * @param injury
   */
  viewInjuryDetails(injury: Injury) {
    this.injurySelected.emit(injury);
  }
  /**
   * Method to emit edit indicator
   */
  navigateToClose() {
    this.onEdit.emit();
  }
  viewComplicationDetails(injury: Injury) {
    this.injurySelected.emit(injury);
  }
}
