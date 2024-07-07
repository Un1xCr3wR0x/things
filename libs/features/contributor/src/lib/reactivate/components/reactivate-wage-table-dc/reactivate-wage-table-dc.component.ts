import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { EngagementPeriod } from '../../../shared';
import { BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'cnt-reactivate-wage-table-dc',
  templateUrl: './reactivate-wage-table-dc.component.html',
  styleUrls: ['./reactivate-wage-table-dc.component.scss']
})
export class ReactivateWageTableDcComponent implements OnInit {
/** Input variables */
@Input() engagementPeriod: EngagementPeriod = new EngagementPeriod();
@Input() purposeOfReg: BilingualText;
@Input() showLastUpdate = false;
@Input() isVic = false;
@Input() disableSection = false; //To disable  the section in future period scenario of vic
isIndividualProfile: boolean;
@Input() joiningDate: string;

/**
 * This method creates a instance of WageTableDcComponent
 * @memberof WageTableDcComponent
 */
constructor() {}

ngOnInit() {
  if (localStorage.getItem('individualProfile') == 'true') {
    this.isIndividualProfile = true;
  }
}

/** Method to detect changes to input. */
ngOnChanges(changes: SimpleChanges) {
  //if (changes.engagementPeriod && changes.engagementPeriod.currentValue) console.log(this.engagementPeriod);
  
}
}

