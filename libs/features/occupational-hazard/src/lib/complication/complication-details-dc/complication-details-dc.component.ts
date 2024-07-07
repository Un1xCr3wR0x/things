/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, Inject, OnInit } from '@angular/core';
import { InjuryHistory } from '../../shared/models';
import { ApplicationTypeToken, ApplicationTypeEnum } from '@gosi-ui/core';


@Component({
  selector: 'oh-complication-details-dc',
  templateUrl: './complication-details-dc.component.html',
  styleUrls: ['./complication-details-dc.component.scss']
})
export class ComplicationDetailsDcComponent implements OnChanges, OnInit {
  /**
   *
   * @param fb  creating an instance
   * @param router
   */
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}

  /**
   * Input variables
   */
  @Input() injuryHistory: InjuryHistory;
  @Input() registrationNo: number;
  @Input() establishmentRegNo: number;
  @Input() socialInsuranceNo: number;

  /**
   * Output variables
   */
  @Output() viewInjury: EventEmitter<number> = new EventEmitter();
  isAppPrivate = false;
  isAppPublic = false;
  isAppIndividual = false;  
  url='';
  /**This method is for initialization tasks */
  ngOnInit() {
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isAppPrivate = true;
    }
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC ? true : false;
    this.isAppIndividual = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
  }
  /**
   *Method to detect changes in input
   * @param changes Capturing input on changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.injuryHistory && changes.injuryHistory.currentValue) {
      this.injuryHistory = changes.injuryHistory.currentValue;
    }
    if (changes && changes.registrationNo) {
      this.registrationNo = Number(changes.registrationNo.currentValue);
    }
    if (changes && changes.establishmentRegNo) {
      this.establishmentRegNo = Number(changes.establishmentRegNo.currentValue);
    }
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.url =
        '/establishment-private/#/home/oh/view/' +
        this.establishmentRegNo +
        '/' +
        this.socialInsuranceNo +
        '/' +
        this.injuryHistory?.injuryId +
        '/injury/detail';
    } else if(this.isAppPublic) {
      this.url =
        '/establishment-public/#/home/oh/view/' +
        this.establishmentRegNo +
        '/' +
        this.socialInsuranceNo +
        '/' +
        this.injuryHistory?.injuryId +
        '/injury/detail';
    }
    else if(this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP){
      this.url =
        '/individual/#/home/oh/view/' +
        this.establishmentRegNo +
        '/' +
        this.socialInsuranceNo +
        '/' +
        this.injuryHistory?.injuryId +
        '/injury/detail';
    }
  }
  /**
   * Method to navigate to injury details page
   * @param injuryHistory
   */
  navigateToInjuryDetails(injuryHistory: InjuryHistory) {
    this.viewInjury.emit(injuryHistory.injuryId);
  }
  /**
   * Navigate to Injury History
   */
  goToInjuryHistory() {
    window.open(this.url, '_blank');
  }
}
