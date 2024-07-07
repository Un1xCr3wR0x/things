import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { RoleIdEnum } from '@gosi-ui/core';
import { BenefitConstants, Benefits } from '../../../shared';
import { SanedbaseComponent } from '../../base/saned.base-component';

@Component({
  selector: 'bnt-occupational-benefits-listing-dc',
  templateUrl: './occupational-benefits-listing-dc.component.html',
  styleUrls: ['./occupational-benefits-listing-dc.component.scss']
})
export class OccupationalBenefitsListingDcComponent extends SanedbaseComponent implements OnInit {
  @Input() occBenefits: Benefits;
  @Input() isIndividualApp: boolean;

  viewModify = [RoleIdEnum.CSR, RoleIdEnum.CUSTOMER_SERVICE_REPRESENTATIVE, RoleIdEnum.SUBSCRIBER, RoleIdEnum.VIC, RoleIdEnum.BENEFICIARY];
  benefitGroup = {
    "arabic": "مستحقات العجز المهني",
    "english": "Occupational Disability Benefits"
  };

  ngOnInit(): void {}

  //Method to navigate to  View History
  navigateToViewHistory() {
    this.manageBenefitService.socialInsuranceNo = this.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_SANED_BENEFIT_HISTORY], {
      queryParams: {
        occ: true
      }
    });
  }
  ShowEligibilityPopup(templateRef: TemplateRef<HTMLElement>, annuitybenefits: Benefits) {
    this.occBenefits = annuitybenefits;
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
}
