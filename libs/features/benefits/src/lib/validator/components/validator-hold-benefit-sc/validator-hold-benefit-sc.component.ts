/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import {
  ModifyPayeeDetails,
  UITransactionType,
  bindQueryParamsToForm,
  createDetailForm,
  BenefitConstants,
  HoldBenefitDetails,
  BenefitDetailsHeading,
  EachBenefitHeading,
  HoldBenefitHeading,
  ActiveBenefits
} from '../../../shared';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeEnum, Channel, checkIqamaOrBorderOrPassport, CommonIdentity, formatDate } from '@gosi-ui/core';
import { BreadcrumbDcComponent } from '@gosi-ui/foundation-theme/src';

@Component({
  selector: 'bnt-validator-hold-benefit-sc',
  templateUrl: './validator-hold-benefit-sc.component.html',
  styleUrls: ['./validator-hold-benefit-sc.component.scss']
})
export class ValidatorHoldBenefitScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  holdBenefitDetails: HoldBenefitDetails;
  modifyHoldForm: FormGroup;
  readMore = false;
  showMoreText = 'BENEFITS.READ-FULL-NOTE';
  limitvalue: number;
  limit = 100;
  identity: CommonIdentity | null;
  eachType: string;
  holdHeading: string;
  Channel = Channel;
  @ViewChild('brdcmb', { static: false })
  holdBnftBrdcmb: BreadcrumbDcComponent;

  ngOnInit(): void {
    this.limitvalue = this.limit;
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.modifyHoldForm = createDetailForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.modifyHoldForm);
    this.intialiseTheView(this.routerData);
    super.getRejectionReason(this.modifyHoldForm);
    if (this.socialInsuranceNo && this.requestId && this.referenceNo) {
      this.getHoldDetails(this.socialInsuranceNo, this.requestId, this.referenceNo);
    }
  }

  /**
   * Method to fetch the Imprisonment details
   */
  getHoldDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    this.modifyBenefitService.getHoldBenefitDetails(sin, benefitRequestId, referenceNo).subscribe(
      res => {
        this.holdBenefitDetails = res;
        this.holdHeading = new HoldBenefitHeading(
          this.holdBenefitDetails?.pension?.annuityBenefitType?.english
        ).getHeading();
        this.heading = new EachBenefitHeading(
          this.holdBenefitDetails?.pension?.annuityBenefitType?.english
        ).getHeading();
        this.eachType = new BenefitDetailsHeading(
          this.holdBenefitDetails?.pension?.annuityBenefitType?.english
        ).getHeading();
        if (this.route.routeConfig) {
          this.route.routeConfig.data = { breadcrumb: this.holdHeading };
          this.holdBnftBrdcmb.breadcrumbs = this.holdBnftBrdcmb.buildBreadCrumb(this.route.root);
        }
        this.identity = checkIqamaOrBorderOrPassport(this.holdBenefitDetails?.contributor?.identity);
        this.fetchDocumentsForHoldBenefit();
      },
      err => {
        this.showError(err);
      }
    );
  }
  /**to fetch documents */
  fetchDocumentsForHoldBenefit() {
    this.transactionKey = UITransactionType.HOLD_RETIREMENT_PENSION_BENEFIT; // to add value in uiTransactionType
    this.transactionType =
      this.channel === Channel.FIELD_OFFICE ? UITransactionType.FO_REQUEST_SANED : UITransactionType.GOL_REQUEST_SANED;
    this.getDocumentsForHoldBenefit(this.transactionKey, this.transactionType, this.benefitRequestId);
  }

  getDocumentsForHoldBenefit(transactionKey: string, transactionType: string, benefitRequestId: number) {
    this.benefitDocumentService
      .getUploadedDocuments(benefitRequestId, transactionKey, transactionType)
      .subscribe(res => {
        this.documentList = res;
      });
  }

  navigateToEdit() {
    this.router.navigate([BenefitConstants.ROUTE_HOLD_RETIREMENT_PENSION_BENEFIT], {
      queryParams: {
        edit: true
      }
    });
  }
  confirmRejectBenefit() {
    this.confirmReject(this.modifyHoldForm);
  }
  confirmApproveBenefit() {
    this.confirmApprove(this.modifyHoldForm);
  }

  returnBenefit() {
    this.confirmReturn(this.modifyHoldForm);
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
  onViewBenefitDetails() {
    const data = new ActiveBenefits(
      this.socialInsuranceNo,
      this.requestId,
      this.holdBenefitDetails?.pension?.annuityBenefitType,
      this.referenceNo
    );
    this.coreBenefitService.setActiveBenefit(data);
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_RETIREMENT]);
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
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
