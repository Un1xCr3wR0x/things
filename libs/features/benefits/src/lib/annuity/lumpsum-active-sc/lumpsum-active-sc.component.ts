/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, TemplateRef, Inject, ViewChild, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import {
  ActiveBenefits,
  BenefitConstants,
  BenefitDetails,
  ManageBenefitService,
  PaymentHistoryDcComponent,
  AnnuityResponseDto
} from '../../shared';
import { ReturnLumpsumService } from '../../shared/services/return-lumpsum.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertService, BenefitsGosiShowRolesConstants, LanguageToken, formatDate } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { ReturnBenefitTypeLabels } from '../../shared/models/return-benefit-type-heading';

@Component({
  selector: 'bnt-lumpsum-active-sc',
  templateUrl: './lumpsum-active-sc.component.html',
  styleUrls: ['./lumpsum-active-sc.component.scss']
})
export class LumpsumActiveScComponent implements OnInit, OnDestroy {
  benefitType: string;
  benefitRequestId: number;
  refereceNo: number;
  sin: number;
  lang = 'en';
  //isBenefitDetails = true;
  heading: string;
  commonModalRef: BsModalRef;
  savedLumpsumBenfitDetails: ActiveBenefits;
  activeBenefits: AnnuityResponseDto;

  @ViewChild('paymentTimeline', { static: false })
  paymentTimeline: PaymentHistoryDcComponent;
  benefitCalculationDetails: BenefitDetails;
  returnLumpsumAccess = BenefitsGosiShowRolesConstants.VIEW_DETAILS;
  restoreLumpsumAccess = BenefitsGosiShowRolesConstants.CREATE_PRIVATE;

  constructor(
    private location: Location,
    readonly router: Router,
    readonly alertService: AlertService,
    readonly returnLumpsumService: ReturnLumpsumService,
    readonly manageBenefitService: ManageBenefitService,
    readonly modalService: BsModalService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.savedLumpsumBenfitDetails = this.returnLumpsumService.getSavedActiveBenefit();
    //this.getPaymentDetails(this.sin);
    if (this.savedLumpsumBenfitDetails) {
      this.sin = this.savedLumpsumBenfitDetails.sin;
      this.benefitRequestId = this.savedLumpsumBenfitDetails.benefitRequestId;
      this.refereceNo = this.savedLumpsumBenfitDetails.referenceNo;
      this.benefitType = this.savedLumpsumBenfitDetails.benefitType.english;
      this.heading = new ReturnBenefitTypeLabels(this.benefitType).getHeading();
      this.getActiveBenefitDetails(this.sin, this.benefitRequestId, this.refereceNo);
      this.getAnnuityCalculation(this.sin, this.benefitRequestId, this.refereceNo);
    }
  }
  /** Method to fetch active benefits */
  getActiveBenefitDetails(sin: number, benefitRequestId: number, refereceNo: number) {
    this.returnLumpsumService.getActiveBenefitDetails(sin, benefitRequestId, refereceNo).subscribe(res => {
      this.activeBenefits = res;
    });
  }
  /** Method to fetch calculate details when benefit request id is available */
  getAnnuityCalculation(sin: number, benefitRequestId: number, referenceNo: number) {
    this.manageBenefitService
      .getBenefitCalculationDetailsByRequestId(sin, benefitRequestId, referenceNo)
      .subscribe(calculation => {
        this.benefitCalculationDetails = calculation;
      });
  }
  /** Route back to previous page */
  routeBack() {
    const isTransactionCompleted = this.returnLumpsumService.getIsUserSubmitted();
    if (isTransactionCompleted) {
      this.router.navigate([BenefitConstants.ROUTE_SANED_BENEFIT_HISTORY], {
        queryParams: {
          annuity: true
        }
      });
    } else {
      this.location.back();
    }
  }
  /** This method is to hide the modal reference. */
  hideModal() {
    this.commonModalRef.hide();
  }
  /** This method is to show Modal */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
  }
  /** this function will redirect you to the return lumpsum page*/
  navigateToReturnLumpsum() {
    this.router.navigate([BenefitConstants.ROUTE_RETURN_LUMPSUM_BENEFIT]);
  }
  /** this function will redirect you to the restore lumpsum page*/
  navigateToRestoreLumpsum() {
    this.router.navigate([BenefitConstants.ROUTE_RESTORE_LUMPSUM_BENEFIT]);
  }
  /** Method to handle before component destroyal . */
  ngOnDestroy() {
    this.alertService.clearAlerts();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
