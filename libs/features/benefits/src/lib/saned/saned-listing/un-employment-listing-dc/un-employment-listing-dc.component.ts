import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { RoleIdEnum, RouterData } from '@gosi-ui/core';
import { BenefitConstants, Benefits, BenefitType, BenefitValues, clearDraftUtil } from '../../../shared';
import { SanedbaseComponent } from '../../base/saned.base-component';

@Component({
  selector: 'bnt-un-employment-listing-dc',
  templateUrl: './un-employment-listing-dc.component.html',
  styleUrls: ['./un-employment-listing-dc.component.scss']
})
export class UnEmploymentListingDcComponent extends SanedbaseComponent implements OnInit, OnChanges {
  //Input
  @Input() uibenefits: Benefits;
  @Input() isIndividualApp: boolean;
  @Input() routerData: RouterData;


  isSanedReopen: Boolean;
  isSanedEligible: Boolean;
  benefitValues = BenefitValues;
  isSanedActive: Boolean;
  viewModify = [RoleIdEnum.CUSTOMER_SERVICE_REPRESENTATIVE, RoleIdEnum.SUBSCRIBER, RoleIdEnum.VIC, RoleIdEnum.BENEFICIARY];
  viewAppeal = [RoleIdEnum.CUSTOMER_SERVICE_REPRESENTATIVE, RoleIdEnum.INSURANCE_BENEFIT_OPERATIONAL_OFFICER_ONE, RoleIdEnum.INSURANCE_BENEFIT_OPERATIONAL_OFFICER_TWO];
  //Annuity types
  typeUi = BenefitType.ui;
  typeOh = BenefitType.oh;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.uibenefits?.currentValue) {
      if (this.uibenefits.benefitType?.english === BenefitType.ui) {
        this.isSanedEligible = this.checkIfEligible(this.uibenefits.status);
        this.isSanedReopen = this.checkIfReopen(this.uibenefits.status);
        this.isSanedActive = this.uibenefits?.status === BenefitValues.active;
      }
      if (this.uibenefits.requestDate !== null) {
        this.manageBenefitService.setRequestDate(this.uibenefits.requestDate);
      }
    }
  }
  isEligibleCheck() {
    if (this.isIndividualApp && this.isSanedEligible && this.uibenefits?.eligible && !this.uibenefits?.appeal) {
      return true;
    } else if (!this.isIndividualApp && this.isSanedEligible) {
      return true;
    } else {
      return false;
    }
  }
  /** Method to navigate to  View History */
  navigateToViewHistory() {
    this.manageBenefitService.socialInsuranceNo = this.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_SANED_BENEFIT_HISTORY], {
      queryParams: {
        uihistory: true
      }
    });
  }
  /** navigate to ui(saned) Details */
  navigateToUiDetails() {
    this.router.navigate([BenefitConstants.ROUTE_SANED_PAYMENT_DETAILS]);
  }
  /** navigate to Raise Appeal page */
  navigateToRaiseAppeal() {
    this.router.navigate([BenefitConstants.ROUTE_APPEAL_DETAILS]);
  }
  /** navigate to reopen the benefit */
  navigateToReopen() {
    this.router.navigate([BenefitConstants.ROUTE_REOPEN_BENEFIT]);
  }
  // Method to navigate to Contributor Visits to this page
  navigateToContributorVisit() {
    this.router.navigate([BenefitConstants.ROUTE_CONTRIBUTOR_VISITS], {
      queryParams: {
        uiBenefits: true
      }
    });
  }

  /* navigate to  apply for the benefit */
  apply() {
    if (this.isEligibleCheck()) {
      clearDraftUtil(this.routerData);
      this.router.navigate([BenefitConstants.ROUTE_APPLY_BENEFIT], {
        queryParams: {
          epr: this.uibenefits.eligibleForPensionReform
        }
      });
    }
  }
  ShowEligibilityPopup(templateRef: TemplateRef<HTMLElement>, annuitybenefits: Benefits) {
    this.uibenefits = annuitybenefits;
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
}
