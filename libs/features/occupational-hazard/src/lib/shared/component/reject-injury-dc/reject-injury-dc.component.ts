/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, OnChanges, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Injury } from '../../models';
import { TransactionReferenceData } from '@gosi-ui/core';
import { OhConstants } from '../../constants';

@Component({
  selector: 'oh-reject-injury-dc',
  templateUrl: './reject-injury-dc.component.html',
  styleUrls: ['./reject-injury-dc.component.scss']
})
export class RejectInjuryDcComponent implements OnInit, OnChanges {
  /**
   * Input variables
   */
  @Input() injury: Injury;
  @Input() transactionReferenceData: TransactionReferenceData[];
  @Input() resourceType: string;
  @Input() role: string;
  @Input() showHeading = true;

  /**
   * Output variables
   */
  @Output() injurySelected: EventEmitter<Injury> = new EventEmitter();

  /**
   * Local variables
   */
  showDescription: boolean;

  //TODO: remove unused methods
  constructor() {}

  ngOnInit(): void {}

  /**
   *Capturing input on changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.injury) {
      this.injury = changes.injury.currentValue;
    }
    if (changes && changes.showHeading) {
      this.showHeading = changes.showHeading.currentValue;
    }
    if (changes && changes.resourceType) {
      this.resourceType = changes.resourceType.currentValue;
      if (this.resourceType === OhConstants.TRANSACTION_REJECT_INJURY_TPA) {
        this.showDescription = true;
      } else {
        this.showDescription = false;
      }
    }
  }
}
