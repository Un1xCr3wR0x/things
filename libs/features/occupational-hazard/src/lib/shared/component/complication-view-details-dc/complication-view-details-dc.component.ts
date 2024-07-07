/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Complication } from '../../models/complication';
import { ApplicationTypeEnum } from '@gosi-ui/core';

@Component({
  selector: 'oh-complication-view-details-dc',
  templateUrl: './complication-view-details-dc.component.html',
  styleUrls: ['./complication-view-details-dc.component.scss']
})
export class ComplicationViewDetailsDcComponent implements OnInit {
  @Input() complicationDetails: Complication;
  @Input() idCode: string;
  @Input() isAppPrivate: boolean;
  showReopenReason: boolean;
  isIndividualApp: boolean;
  @Input() isContributor : boolean;

  //TODO: remove unused methods
  constructor() {}

  ngOnInit() {
    this.checkWorkFlowStatus();
    this.isIndividualApp = ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    if (this.complicationDetails?.initiatedBy === 'taminaty') {
      this.isContributor = true;
    } else {
      this.isContributor = false;
    }
  }
  
  

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.complicationDetails) {
      this.complicationDetails = changes.complicationDetails.currentValue;
      if (this.complicationDetails?.initiatedBy === 'taminaty') {
        this.isContributor = true;
      } else {
        this.isContributor = false;
      }
    }
  }

  /*To check Reopen workflow Status is approved*/
  checkWorkFlowStatus() {
    if (
      this.complicationDetails?.workFlowStatus === 2033 ||
      this.complicationDetails?.workFlowStatus === 2034 ||
      this.complicationDetails?.workFlowStatus === 2035 ||
      this.complicationDetails?.workFlowStatus === 2036
    ) {
      this.showReopenReason = true;
    }
  }
}
