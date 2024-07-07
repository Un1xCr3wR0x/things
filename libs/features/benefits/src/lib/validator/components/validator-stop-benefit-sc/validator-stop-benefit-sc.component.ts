/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeEnum, Channel, checkIqamaOrBorderOrPassport, CommonIdentity, formatDate } from '@gosi-ui/core';
import {
  BenefitConstants,
  BenefitDetailsHeading,
  BenefitType,
  bindQueryParamsToForm,
  createDetailForm,
  EachBenefitHeading,
  HoldBenefitDetails,
  RecalculationConstants,
  StopBenefitHeading
} from '../../../shared';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import { ActiveBenefits, Contributor } from '../../../shared/models';
import { BreadcrumbDcComponent } from '@gosi-ui/foundation-theme/src';

@Component({
  selector: 'bnt-validator-stop-benefit-sc',
  templateUrl: './validator-stop-benefit-sc.component.html',
  styleUrls: ['./validator-stop-benefit-sc.component.scss']
})
export class ValidatorStopBenefitScComponent extends ValidatorBaseScComponent implements OnInit {
  stopBenefitForm: FormGroup;
  stopDetails: HoldBenefitDetails;
  stopBenefitType: string;
  contributorDetails: Contributor;
  identity: CommonIdentity | null;
  eachType: string;
  stopHeading: string;
  readMore = false;
  showMoreText = 'BENEFITS.READ-FULL-NOTE';
  limitvalue: number;
  limit = 100;
  checkBenefitType = BenefitType.stopbenefit;
  checkForm: FormGroup;
  Channel = Channel;

  @ViewChild('brdcmb', { static: false })
  stopBenefitBrdcmb: BreadcrumbDcComponent;
  directDisabled: boolean;

  ngOnInit(): void {
    this.limitvalue = this.limit;
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.checkForm = this.fb.group({
      checkBoxFlag: [false]
    });
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.stopBenefitForm = createDetailForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.stopBenefitForm);
    this.intialiseTheView(this.routerData);
    if (
      this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1 ||
      this.routerData.assignedRole === this.rolesEnum.VALIDATOR_2
    ) {
      this.directDisabled = false;
    } else if (
      this.routerData.assignedRole === this.rolesEnum.FC_APPROVER ||
      this.routerData.assignedRole === this.rolesEnum.FC_CONTROLLER ||
      this.routerData.assignedRole === this.rolesEnum.CNT_FC_APPROVER ||
      this.routerData.assignedRole === 'FC Approver'
    ) {
      this.directDisabled = true;
    }
    super.getRejectionReason(this.stopBenefitForm);
    if (this.socialInsuranceNo && this.requestId && this.referenceNo) {
      this.getStopBenefitDetails(this.socialInsuranceNo, this.requestId, this.referenceNo);
    }
  }
  // fetch stop benefit details
  getStopBenefitDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    this.modifyBenefitService.getstopDetails(sin, benefitRequestId, referenceNo).subscribe(
      res => {
        this.stopDetails = res;
        this.stopHeading = new StopBenefitHeading(this.stopDetails?.pension?.annuityBenefitType?.english).getHeading();
        if (this.route.routeConfig) {
          this.route.routeConfig.data = { breadcrumb: this.stopHeading };
          this.stopBenefitBrdcmb.breadcrumbs = this.stopBenefitBrdcmb.buildBreadCrumb(this.route.root);
        }
        this.heading = new EachBenefitHeading(this.stopDetails?.pension?.annuityBenefitType?.english).getHeading();
        this.eachType = new BenefitDetailsHeading(this.stopDetails?.pension?.annuityBenefitType?.english).getHeading();
        this.contributorDetails = res?.contributor;
        this.identity = checkIqamaOrBorderOrPassport(this.contributorDetails?.identity);
        this.fetchStopBenefitDocs();
        this.checkForm.get('checkBoxFlag').setValue(this.stopDetails?.isDirectPaymentOpted);
      },
      err => {
        this.showError(err);
      }
    );
  }

  fetchStopBenefitDocs() {
    this.transactionKey = 'STOP_BENEFIT';
    this.stopBenefitType = this.channel === Channel.FIELD_OFFICE ? 'REQUEST_BENEFIT_FO' : 'REQUEST_BENEFIT_GOL';
    this.getDocumentsForStopBenefit(
      this.socialInsuranceNo,
      this.requestId,
      this.referenceNo,
      this.transactionKey,
      this.stopBenefitType
    );
  }
  getDocumentsForStopBenefit(
    sin: number,
    benefitRequestId: number,
    referenceNo: number,
    transactionKey: string,
    modifyPayeeType: string
  ) {
    this.benefitDocumentService
      .getStopBenefitDocuments(sin, benefitRequestId, referenceNo, transactionKey, modifyPayeeType)
      .subscribe(res => {
        this.documentList = res;
      });
  }
  navigateToEdit() {
    this.router.navigate([BenefitConstants.ROUTE_STOP_BENEFIT], {
      queryParams: {
        edit: true
      }
    });
  }
  confirmApproveBenefit() {
    this.confirmApprove(this.stopBenefitForm);
  }
  confirmRejectBenefit() {
    this.confirmReject(this.stopBenefitForm);
  }
  returnBenefit() {
    this.confirmReturn(this.stopBenefitForm);
  }
  readFullNote(noteText) {
    this.readMore = !this.readMore;
    if (this.readMore) {
      this.limit = noteText.length;
      this.showMoreText = 'BENEFITS.READ-LESS-NOTE';
    } else {
      this.limit = this.limitvalue;
      this.showMoreText = 'BENEFITS.READ-FULL-NOTE';
    }
  }
  navigateToInjuryDetails() {
    this.router.navigate([
      `home/profile/contributor/${this.registrationNo}/${this.contributor.socialInsuranceNo}/info`
    ]);
  }
  navigateToPrevAdjustment() {
    this.adjustmentPaymentService.identifier = this.stopDetails?.personId;
    this.adjustmentPaymentService.sin = this.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], {
      queryParams: { from: RecalculationConstants.STOP_CONTRIBUTOR }
    });
  }

  onViewBenefitDetails() {
    const data = new ActiveBenefits(
      this.socialInsuranceNo,
      this.requestId,
      this.stopDetails?.pension?.annuityBenefitType,
      this.referenceNo
    );
    this.coreBenefitService.setActiveBenefit(data);
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
