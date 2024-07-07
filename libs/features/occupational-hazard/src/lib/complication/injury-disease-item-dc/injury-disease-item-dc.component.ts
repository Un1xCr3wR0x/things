/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { OHReportTypes } from '../../shared/enums';
import { InjuryHistory } from '../../shared/models/injury-history';
import { ApplicationTypeToken, ApplicationTypeEnum } from '@gosi-ui/core';

@Component({
  selector: 'oh-injury-disease-item-dc',
  templateUrl: './injury-disease-item-dc.component.html',
  styleUrls: ['./injury-disease-item-dc.component.scss']
})
export class InjuryDiseaseItemDcComponent implements OnInit, OnChanges {
  /**
   *  Local Variables
   */
  isInjuryType: boolean;
  isAppPrivate = false;
  isIndividualApp = false;
  /**
   * Creating an instance
   */
  constructor(readonly router: Router, @Inject(ApplicationTypeToken) readonly appToken: string) {}
  /**
   * Input variables
   */
  @Input() injuryHistory: InjuryHistory;
  @Input() registrationNo: number;

  /**
   * Output variables
   */
  @Output() injurySelected: EventEmitter<InjuryHistory> = new EventEmitter();
  @Output() viewInjury: EventEmitter<InjuryHistory> = new EventEmitter();
  ngOnInit() {
    if (this.injuryHistory.type.english === OHReportTypes.Injury) {
      this.isInjuryType = true;
    } else {
      this.isInjuryType = false;
    }
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isAppPrivate = true;
    }
    if(this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP){
      this.isIndividualApp = true;
    }
  }
  /**
   *
   * @param changes Capture input on changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.injuryHistory) {
      this.injuryHistory = changes.injuryHistory.currentValue;
    }
    if (changes && changes.registrationNo) {
      this.registrationNo = Number(changes.registrationNo.currentValue);
    }
  }
  /**
   * Method to emit values to sc
   * @param injuryHistory
   */

  viewInjuryDetails(injuryHistory: InjuryHistory) {
    this.injurySelected.emit(injuryHistory);
  }
  /**
   * Method to navigate to injury details page
   * @param injuryHistory
   */
  navigateToInjuryDetails(injuryHistory: InjuryHistory) {
    this.viewInjury.emit(injuryHistory);
  }
}
