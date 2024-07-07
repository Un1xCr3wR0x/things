/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import { Channel, BilingualText, ApplicationTypeEnum } from '@gosi-ui/core';
import { UITransactionType, BenefitType } from '../../../shared/enum';
import { BenefitConstants } from '../../../shared/constants';
import { BenefitsAdjustmentWrapper } from '../../../shared/models';
import { FormGroup } from '@angular/forms';
import { createDetailForm, reDirectUsersToApplyScreen, bindQueryParamsToForm } from '../../../shared';
@Component({
  selector: 'bnt-women-lumpsum-sc',
  templateUrl: './women-lumpsum-sc.component.html',
  styleUrls: ['./women-lumpsum-sc.component.scss']
})
export class WomenLumpsumScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /**
   * Local variables
   */

  lumpsumAdjustments: BenefitsAdjustmentWrapper;
  isValidatorScreen = true;
  requestWomenForm: FormGroup;
  // benefitDetails: BenefitDetails;
  selectedInspection: BilingualText;
  Channel = Channel;

  ngOnInit(): void {
    // this.getLumpsumBenefitAdjustment();
    this.requestWomenForm = createDetailForm(this.fb);
    this.benefitType = BenefitType.womanLumpsum;
    bindQueryParamsToForm(this.routerData, this.requestWomenForm);
    this.intialiseTheView(this.routerData);
    this.getRejectionReason(this.requestWomenForm);
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    if (this.channel === Channel.FIELD_OFFICE) {
      this.getDocuments(
        UITransactionType.REQUEST_WOMAN_LUMPSUM_BENEFIT,
        UITransactionType.FO_REQUEST_SANED,
        this.requestId,
        this.referenceNo
      );
    }
    if (this.socialInsuranceNo && this.requestId && this.referenceNo) {
      this.getAnnuityBenefitDetails(this.socialInsuranceNo, this.requestId, this.referenceNo);
    }
    this.showComments = false;
    this.trackTransaction(this.referenceNo);
    this.inspectionList = this.sanedBenefitService.getSanedInspectionType();
    this.inspectionList.subscribe(inspection => {
      this.selectedInspection = inspection.items[0].value;
    });
  }

  // BENEFIT ADJUSTMENT

  /**
   * Method to fetch Lumpsum benefits adjustments
   */
  getLumpsumBenefitAdjustment() {
    this.lumpsumAdjustments = this.uiBenefitService.getlumpsumBenefitAdjustments();
  }

  /**
   * when return to establishment action is performed, comments will be shared
   */
  returnWomenLumpsum() {
    this.confirmReturn(this.requestWomenForm);
  }
  /**
   * Approving by the validator.
   */
  confirmApproveWomenLumpsum() {
    this.confirmApprove(this.requestWomenForm);
  }

  /**
   * While rejecting from validator
   */
  confirmRejectWomenLumpsum() {
    this.confirmReject(this.requestWomenForm);
  }
  /**
   * Navigate to document scan page
   */
  navigateToEdit() {
    this.routerData.tabIndicator = 2;
    this.routerData.selectWizard = BenefitConstants.UI_DOCUMENTS;
    this.manageBenefitService.setRequestDate(this.annuityBenefitDetails.requestDate);
    this.router.navigate([BenefitConstants.ROUTE_REQUEST_RETIREMENT_LUMPSUM]);
  }
  reDirectUsersToApplyScreens() {
    reDirectUsersToApplyScreen(
      this.requestType,
      this.socialInsuranceNo,
      this.requestId,
      this.annuityBenefitDetails,
      this.coreBenefitService,
      this.router,
      this.benefitType,
      this.referenceNo
    );
  }

  /**
   *
   * This method is to perform cleanup activities when an instance of component is destroyed.
   * @memberof BaseComponent
   */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
}
