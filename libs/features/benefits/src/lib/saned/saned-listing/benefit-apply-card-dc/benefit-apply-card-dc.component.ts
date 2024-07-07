/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { BenefitValues } from '@gosi-ui/features/payment/lib/shared/enums/benefit-values';
import { SystemParameter } from '@gosi-ui/features/contributor';
import { convertToStringDDMMYYYY, convertToYYYYMMDD } from '@gosi-ui/core/lib/utils/date';
import { BenefitType, Benefits, isHeirBenefit } from '../../../shared';
import moment from 'moment';
import { RoleIdEnum } from '@gosi-ui/core';

@Component({
  selector: 'bnt-benefit-apply-card-dc',
  templateUrl: './benefit-apply-card-dc.component.html',
  styleUrls: ['./benefit-apply-card-dc.component.scss']
})
export class BenefitApplyCardDcComponent implements OnInit, OnChanges {

  benefitValues = BenefitValues;
  oldLawDateValue: string;
  benefitTypes = BenefitType;
  viewModify = [RoleIdEnum.CSR, RoleIdEnum.CUSTOMER_SERVICE_REPRESENTATIVE, RoleIdEnum.SUBSCRIBER, RoleIdEnum.VIC, RoleIdEnum.BENEFICIARY];


  /**
   * Input
   */
  @Input() eligible = true;
  @Input() benefit: Benefits;
  @Input() benefitStatus: string;
  @Input() eligibleLabel: string;
  @Input() notEligibleLabel: string;
  @Input() activeLabel: string;
  // @Input() benefitType: string;
  @Input() lang: string;
  @Input() benefitDescriptionLabel: string;
  @Input() systemParameter: SystemParameter;
  @Input() isIndividualApp: boolean;

  /**
   * Output
   */
  @Output() applyForBenefit = new EventEmitter();
  isHeir: boolean;
  constructor() {}

  ngOnInit(): void {
    this.isHeir = isHeirBenefit(this.benefit.benefitType.english);
  }
  ngOnChanges(changes: SimpleChanges){
    if(changes && changes.systemParameter && changes.systemParameter.currentValue){
      if(this.lang === 'en'){
        this.oldLawDateValue = moment(this.systemParameter.OLD_LAW_DATE).format('DD-MM-YYYY');
      }else{
        this.oldLawDateValue = convertToYYYYMMDD(this.systemParameter.OLD_LAW_DATE.toString());
      }
    }
  }

  apply() {
    // if(this.isHeir && this.benefit.retirementEligibility?.eligibleForRetirementBenefit){
    //   return;
    // } else {
      this.applyForBenefit.emit();
    // }
  }
}
