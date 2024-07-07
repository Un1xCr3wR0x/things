/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, OnChanges, Inject, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ApplicationTypeToken, ApplicationTypeEnum } from '@gosi-ui/core';
import { InjuryHistory } from '../../shared/models';

@Component({
  selector: 'oh-view-complication-dc',
  templateUrl: './view-complication-dc.component.html',
  styleUrls: ['./view-complication-dc.component.scss']
})
export class ViewComplicationDcComponent implements OnInit, OnChanges {
  showActualStatus: boolean;
  showOtherStatus: boolean;
  color: string;
  /**
   * This method is used to initialise the component
   */
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}

  /**
   * Local Variables
   */
  isAppPrivate = false;
  /**
   * Input Variables
   */
  @Input() injuryComplication: InjuryHistory;
  /**
   * Output Variables
   */
  @Output() complicationSelected: EventEmitter<InjuryHistory> = new EventEmitter();
  ngOnInit() {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    /*Condition to show actual status in Private for Below complication status */
    if (
      this.injuryComplication.actualStatus.english === 'Cured With Disability' ||
      this.injuryComplication.actualStatus.english === 'Cured Without Disability' ||
      this.injuryComplication.actualStatus.english === 'Closed without continuing treatment' ||
      this.injuryComplication.actualStatus.english === 'Closed' ||
      this.injuryComplication.actualStatus.english === 'Resulted in Death'
    ) {
      this.showActualStatus = true;
    } else {
      this.showOtherStatus = true;
    }
  }

  /**
   * This method is to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.injuryComplication) {
      this.injuryComplication = changes.injuryComplication.currentValue;
    }
  }
  /**
   * Methode to view complication
   * @param complication
   */
  viewComplicationDetails(complication: InjuryHistory) {
    this.complicationSelected.emit(complication);
  }
  getColor(status) {
    switch (status.english) {
      case 'Approved':
        {
          this.color = 'green';
        }
        break;
      case 'In Progress':
        {
          this.color = 'orange';
        }
        break;
      case 'Resulted in Death':
        {
          this.color = 'grey';
        }
        break;
      case 'Cancelled':
      case 'Cured With Disability':
      case 'Cured Without Disability':
      case 'Closed without continuing treatment':
      case 'Closed':
      case 'Cancelled By System':
        {
          this.color = 'grey';
        }
        break;
      case 'Rejected':
        {
          this.color = 'red';
        }
        break;
    }
    return this.color;
  }
}
