import { Component, OnInit } from '@angular/core';
import { AdjustmentService, BenefitDetails } from '../../../shared';
import { Router } from '@angular/router';
import { CoreAdjustmentService, CoreBenefitService } from '@gosi-ui/core';

@Component({
  selector: 'pmt-benefit-list-sc',
  templateUrl: './benefit-list-sc.component.html',
  styleUrls: ['./benefit-list-sc.component.scss']
})
export class BenefitListScComponent implements OnInit {
  identifier;
  beneficiaries: BenefitDetails[];
  sin: number;
  constructor(
    readonly adjustmentService: AdjustmentService,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly router: Router,
    readonly coreBenefitService: CoreBenefitService
  ) {}

  ngOnInit(): void {
    this.identifier = this.coreAdjustmentService.identifier;
    this.sin = this.coreAdjustmentService?.sin;
    this.getBeneficiaryList();
  }
  getBeneficiaryList() {
    this.adjustmentService.getBeneficiaryList(this.identifier, this.sin).subscribe(res => {
      this.beneficiaries = res.beneficiaryBenefitList;
    });
  }
  navigateToBenefitDetails(benefit) {
    this.coreAdjustmentService.benefitType = benefit?.benefitType?.english;
    this.coreAdjustmentService.benefitDetails = benefit;
    this.router.navigate(['/home/adjustment/benefit-details']);
  }
}
