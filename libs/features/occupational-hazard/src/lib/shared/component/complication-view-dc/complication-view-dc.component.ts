/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MobileDetails, AppConstants } from '@gosi-ui/core';
import { Complication, Injury } from '../../models';

@Component({
  selector: 'oh-complication-view-dc',
  templateUrl: './complication-view-dc.component.html',
  styleUrls: ['./complication-view-dc.component.scss']
})
export class ComplicationViewDcComponent implements OnChanges {
  isContributor: boolean = false;
  /**
   * Input variables
   */
  @Input() complication: Complication;
  @Input() reopen: Complication;
  @Input() canEdit = false;
  @Input() idCode: string;
  @Input() modify = false;
  @Input() showHeading = true;
  @Input() transactionId = 0;
  @Input() status = '';
  /**
   * Output variables
   */
  @Output() complicationSelected: EventEmitter<Complication> = new EventEmitter();
  @Output() injurySelected: EventEmitter<Injury> = new EventEmitter();
  @Output() onEdit: EventEmitter<null> = new EventEmitter();

  /**
   * Capturing input on changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.complication) {
      this.complication = changes.complication.currentValue;
    }
    if(this.complication.initiatedBy === 'taminaty'){
      this.isContributor=true;
    }

    if (changes && changes.reopen) {
      this.reopen = changes.reopen.currentValue;
    }
    if (changes && changes.idCode) {
      this.idCode = changes.idCode.currentValue;
    }
    if (changes && changes.canEdit) {
      this.canEdit = changes.canEdit.currentValue;
    }
  }
  ngOnInit() {
    if(this.complication.initiatedBy === 'taminaty'){
      this.isContributor=true;
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
  /**
   * Edit option for complication details
   */
  complicationOnEdit() {
    this.onEdit.emit();
  }

  getISDCodePrefix(emergencyNo: MobileDetails): string {
    let prefix;
    if (emergencyNo === null || (emergencyNo && emergencyNo.primary === null)) {
      prefix = null;
    } else {
      Object.keys(AppConstants.ISD_PREFIX_MAPPING).forEach(key => {
        if (emergencyNo && key === emergencyNo.isdCodePrimary) {
          prefix = AppConstants.ISD_PREFIX_MAPPING[key];
        }
      });
    }
    return prefix;
  }
}

