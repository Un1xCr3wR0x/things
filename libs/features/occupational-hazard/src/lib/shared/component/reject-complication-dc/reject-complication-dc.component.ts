/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TransactionReferenceData } from '@gosi-ui/core';
import { Injury } from '../../../shared/models';
import { Complication } from '../../../shared/models/complication';

@Component({
  selector: 'oh-reject-complication-dc',
  templateUrl: './reject-complication-dc.component.html',
  styleUrls: ['./reject-complication-dc.component.scss']
})
export class RejectComplicationDcComponent implements OnInit, OnChanges {
  /**
   * Input variables
   */
  @Input() complication: Complication;
  @Input() transactionReferenceData?: TransactionReferenceData[];
  @Input() showHeading = true;

  /**
   * Output variables
   */
  @Output() complicationSelected: EventEmitter<Complication> = new EventEmitter();
  @Output() injurySelected: EventEmitter<Injury> = new EventEmitter();

  //TODO: remove unused methods
  constructor() {}

  ngOnInit(): void {}

  /**
   * Capturing input on changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.complication) {
      this.complication = changes.complication.currentValue;
    }
  }

  /**
   * Method to emit complication
   * @param complication
   */
  viewComplicationDetails(complication: Complication) {
    this.complicationSelected.emit(complication);
  }
  /**Navigate to injury details
   *
   * @param injury
   */
  viewInjuryDetails(injury: Injury) {
    this.injurySelected.emit(injury);
  }
}
