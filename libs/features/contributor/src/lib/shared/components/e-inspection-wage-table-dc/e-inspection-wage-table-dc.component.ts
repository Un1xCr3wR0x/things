import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ViolationRequest } from '../../models';
import { CalendarTypeEnum } from '@gosi-ui/core';

@Component({
  selector: 'cnt-e-inspection-wage-table-violation-dc',
  templateUrl: './e-inspection-wage-table-dc.component.html',
  styleUrls: ['./e-inspection-wage-table-dc.component.scss']
})
export class EInspectionWageTableDcComponent implements OnChanges {
  SystemTotalWage: number;
  ContributorTotalWage: number;
  ContributorValidatorTotalWage: number;
  isRouterDataToken = false;
  @Input() violationDetails : ViolationRequest = new ViolationRequest();
  @Input() isValidator = false;
  @Input() routerDataToken?;

  typeGregorian = CalendarTypeEnum.GREGORIAN;
  typeHijira = CalendarTypeEnum.HIJRI;
  // @Input() engagement;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.violationDetails?.currentValue) {
      this.SystemTotalWage =
        this.violationDetails.wage?.currentWage.basicWage +
        this.violationDetails.wage?.currentWage.commission +
        this.violationDetails.wage?.currentWage.housingBenefit +
        this.violationDetails.wage?.currentWage.otherAllowance;
      this.ContributorTotalWage =
        this.violationDetails.wage?.requestedWage.basicWage +
        this.violationDetails.wage?.requestedWage.commission +
        this.violationDetails.wage?.requestedWage.housingBenefit +
        this.violationDetails.wage?.requestedWage.otherAllowance;
    }
    if (changes?.routerDataToken?.currentValue) {
      // if (this.routerDataToken.assignedRole === 'Validator2') {
      //   this.isRouterDataToken = true;
      //   this.ContributorValidatorTotalWage =
      //     this.violationDetails.validatorData?.basicWage +
      //     this.violationDetails.validatorData?.commission +
      //     this.violationDetails.validatorData?.housingBenefit +
      //     this.violationDetails.validatorData?.otherAllowance;
      // }
    }
  }
}
