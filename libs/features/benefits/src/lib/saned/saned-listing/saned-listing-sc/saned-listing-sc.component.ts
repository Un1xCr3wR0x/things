/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ApplicationTypeEnum, NationalityTypeEnum, Person, TransactionStatus } from '@gosi-ui/core';
import { SanedbaseComponent } from '../../base/saned.base-component';
import { ContributorRouteConstants, ContributorTypesEnum } from '@gosi-ui/features/contributor';
import {
  BenefitConstants,
  Benefits,
  ActiveBenefits,
  BenefitValues,
  showErrorMessage,
  UIPayloadKeyEnum
} from '../../../shared';
import { switchMap } from 'rxjs/operators';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'bnt-saned-ui-listing-sc',
  templateUrl: './saned-listing-sc.component.html',
  styleUrls: ['./saned-listing-sc.component.scss']
})
export class SanedListingScComponent extends SanedbaseComponent implements OnInit, OnDestroy {
  @ViewChild('benefitsTab', { static: false }) benefitsTab?: TabsetComponent;
  /**
   * Input Variables
   */

  uibenefits: Benefits;
  occBenefits: Benefits;
  annuitybenefits: Benefits[] = [];
  retirementBenefits: Benefits;
  activeBenefitsList: ActiveBenefits[] = [];
  nationalityType = NationalityTypeEnum;

  eligible = BenefitValues.eligible;
  active = BenefitValues.active;
  workflow = BenefitValues.workflow;
  reopen = BenefitValues.reopen;
  new = BenefitValues.new;

  socialInsuranceNo: number;
  modalRef: BsModalRef;
  person: Person;
  successMessage: string;

  //boolean flags
  annuityitemsPresent: boolean;
  isIdentity = false;
  isValidator = false;

  // adjustment related variables
  adjustments = [];
  totalAdjustment = 0;
  initialAdjustment = 0;
  // referenceNum = 0;
  saudiPerson = ContributorTypesEnum.SAUDI;
  heirSin: number;

  /**
   * This method handles initialization tasks.
   * @memberof UiListingDcComponent
   */
  ngOnInit() {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    if (this.routerData) {
      this.socialInsuranceNo = +this.routerData.idParams.get(UIPayloadKeyEnum.SIN);
      this.isValidator = this.checkIfValidator(this.routerData.assignedRole);
      this.isDoctor = this.routerData.assignedRole === this.rolesEnum.DOCTOR;
    }

    if (!this.isValidator || this.coreBenefitService.fromRecalculation) {
      if (this.contributorService.selectedSIN) {
        this.socialInsuranceNo = this.contributorService.selectedSIN;
      }
      if (this.contributorService.personId) {
        this.personId = this.contributorService.personId;
        this.getContributorPersonalDetails();
      } else if (this.socialInsuranceNo) {
        this.manageService.searchContributor(this.contributorService.registartionNo, this.socialInsuranceNo).subscribe(
          res => {
            if (res.person.personId) {
              this.manageService.setPersonId(res.person.personId);
              this.contributorService.personId = res.person.personId;
              this.personId = res.person.personId;
              this.getContributorPersonalDetails();
            }
          },
          err => {
            showErrorMessage(err, this.alertService);
          }
        );
      }
      if (!this.isValidator) {
        this.annuityitemsPresent = false;
        this.benefitPropertyService.setAnnuityStatus(BenefitConstants.NEW_BENEFIT);
        if (this.contributorService.registartionNo) {
          this.registrationNo = this.contributorService.registartionNo;
          this.manageBenefitService.registrationNo = this.registrationNo;
        }
      }
      // else if (this.coreBenefitService.fromRecalculation) {
      //   this.getBenefitsWithStatus();
      // }
      // this.setBenefitView();
    }
    this.manageBenefitService.socialInsuranceNo = this.socialInsuranceNo;
    // this.referenceNum = this.manageBenefitService.getReferenceNo();
    if (this.coreBenefitService.getBenefitAppliedMessage()) {
      this.alertService.showSuccess(this.coreBenefitService.getBenefitAppliedMessage());
      // this.loadActiveBenefits();
    }
    // else {
    //   this.loadActiveBenefits();
    // }
    // this.loadActiveBenefits();
    this.route.parent.params.subscribe(params => {
      this.heirBenefitService.getHeirActiveBenefits(params.personId).subscribe(
        res => {
          res.forEach(el => {
            this.getBenefitsWithStatus(el.contributorSin);
          });
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
    });

    this.setBenefitView(this.socialInsuranceNo);
    this.getBenefitsWithStatus(this.socialInsuranceNo);
    this.getSystemParam();
    this.getActiveEngagement();
  }

  loadActiveBenefits() {
    // to get the list of all active benefits
    if (!this.isValidator && !this.isDoctor) {
      this.getBenefitsWithStatus(this.socialInsuranceNo);
    }
  }

  ngAfterViewInit() {
    if (this.isIndividualApp) this.benefitsTab.tabs[1].active = true;
  }

  setBenefitView(sin: number) {
    this.adjustmentPaymentService.socialNumber = sin;
    this.getUIBenefits(sin);
    this.getAnnuityBenefits(sin);
    // this.getOccbenefits();
  }

  // Method to fetch UI benefits
  getUIBenefits(socialInsuranceNumber: number) {
    this.uiBenefitService.getUIBenefits(socialInsuranceNumber).subscribe(
      data => {
        this.uibenefits = data;
        if (this.uibenefits?.isReopen && this.uibenefits?.status === BenefitValues.workflow) {
          this.coreBenefitService.isReopenCase = this.uibenefits?.isReopen;
        }
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  // Method to fetch Annuity benefits
  getAnnuityBenefits(socialInsuranceNumber: number) {
    this.manageBenefitService.getAnnuityBenefits(socialInsuranceNumber).subscribe(
      data => {
        this.annuitybenefits = [...this.annuitybenefits, ...data];
        if (this.annuitybenefits && this.annuitybenefits.length > 0) {
          this.annuitybenefits.forEach(benefit => {
            if (benefit.eligibleForDependentAmount) {
              this.benefitPropertyService.setEligibleDependentAmount(benefit.eligibleForDependentAmount);
            }
          });
        }
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  getOccbenefits() {
    this.manageBenefitService.getOccBenefits().subscribe(
      data => {
        this.occBenefits = data;
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  /* this function fetch the active benefit details to display on the top */
  getBenefitsWithStatus(sin: number) {
    //get Annuity benefit details
    const status = ['Active', 'Draft', 'In Progress'];
    this.sanedBenefitService.getBenefitsWithStatus(sin, status).subscribe(
      response => {
        this.activeBenefitsList = [...this.activeBenefitsList, ...response];
        if (response && response.length > 0) this.sanedBenefitService.setStatus(response[0].status.english);
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
    // this.sanedBenefitService.getBenefitsInActiveAndDraft(this.socialInsuranceNo).subscribe((response) => {
    //   const tempAnnuityBenefitlist: ActiveBenefits[] = response;
    //   const filteredOCCBenefitList = tempAnnuityBenefitlist.filter(benefits=>{
    //     return benefits.benefitType.english === BenefitType.occLumpsum || benefits.benefitType.english === BenefitType.occPension
    //   });
    //   if (filteredOCCBenefitList.length > 0) {
    //     this.activeBenefitsList = [...filteredOCCBenefitList]
    //   }
    // })
  }

  cancelVic() {
    this.contributorService.engagementId = this.engagementId;
    this.router.navigate([ContributorRouteConstants.ROUTE_VIC_CANCEL]);
  }

  //Method to destroy
  ngOnDestroy() {
    this.benefitPropertyService.referenceNo = 0;
    this.alertService.clearAlerts();
    this.benefitPropertyService.setBenefitAppliedMessage(null);
    this.benefitPropertyService.setActiveSuccessMessage(null);
    this.coreBenefitService.setBenefitAppliedMessage(null);
  }

  /** Method to navigate to direct Payment */
  directPaymentNavigate() {
    // this.router.navigate([BenefitConstants.ROUTE_PAY_ONLINE], {
    //   queryParams: {identifier: this.contributorService.nin}
    // });
    this.router.navigate([BenefitConstants.ROUTE_DIRECT_PAYMENT_TIMELINE], {
      queryParams: { identifier: this.contributorService.nin }
    });
  }

  /** Method to navigate to adjustment details */
  adjustmentDetailsNavigate() {
    this.adjustmentPaymentService.identifier =
      this.personId || parseInt(this.storageService.getLocalValue('personId'), 10);
    this.adjustmentPaymentService.socialNumber = this.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], {
      queryParams: { from: BenefitConstants.SANED_LISTING, regNo: this.registrationNo, sinNo: this.socialInsuranceNo }
    });
  }

  get showAnnuityTab(): boolean {
    return this.person && this.annuitybenefits?.length && this.annuitybenefits[0]?.eligibleForAnnuity;
  }

  get showOHTab(): boolean {
    return this.person && this.annuitybenefits?.length && this.annuitybenefits[0]?.eligibleForOH;
  }

  /**Method to appeal assessment */
  onAppeal(assessmentValues) {
    this.sanedBenefitService.setDisabilityAssessmentId(assessmentValues.assessmentId);
    this.sanedBenefitService.setSocialInsuranceNumber(this.socialInsuranceNo);
    this.sanedBenefitService.setBenefitRequestId(assessmentValues.benefitRequestId);
    this.sanedBenefitService.setNin(assessmentValues?.nin);
    this.router.navigate(['home/benefits/saned/appealAssessment']);
    // this.bypassReaassessmentService
    //   .appealMedicalAssessment(this.socialInsuranceNo, assessmentValues.benefitRequestId, assessmentValues.assessmentId)
    //   .subscribe(
    //     res => {
    //       this.benefitResponse = res;
    //     },
    //     err => this.alertService.showError(err.error.message)
    //   );
    // if(!assessmentValues?.isAssessment){
    //   window.open('https://gositest.gosi.ins/GOSIOnline/ContactUs_Request?userType=2001&requestType=2022&locale=en_US');
    // }
    // window.open('https://www.gosi.gov.sa/GOSIOnline/ContactUs_Request?userType=2001&requestType=2022&locale=en_US');
  }

  /**
   * To get contributor details
   */
  getContributorPersonalDetails() {
    this.contributorDomainService.getContributorByPersonId(this.contributorService.personId).subscribe(res => {
      if (res?.person) {
        this.person = res.person;
      }
    });
  }

  routeToPension(assessmentValues) {
    this.bypassReaassessmentService
      .accceptMedicalAssessment(
        this.socialInsuranceNo,
        assessmentValues.benefitRequestId,
        assessmentValues.assessmentId
      )
      .subscribe(
        res => {
          this.benefitResponse = res;
          this.router.navigate([BenefitConstants.ROUTE_ASSESSMENT_DISPLAY], {
            queryParams: {
              assessmentId: assessmentValues.assessmentId
            }
          });
        },
        err => this.alertService.showError(err.error.message)
      );
  }

  navigateToTransactionView(activeBenefits) {
    if (activeBenefits?.status?.english?.toUpperCase() === TransactionStatus.DRAFT.toUpperCase()) return;
    this.sanedBenefitService.getTransaction(activeBenefits.referenceNo).subscribe(res => {
      this.router.navigate([`/home/transactions/view/${res.transactionId}/${activeBenefits.referenceNo}`]);
    });
  }

  onDisabledNinNavigation(id) {
    this.getPersonDetailsByNin(id);
  }

  getPersonDetailsByNin(id) {
    this.coreBenefitService
      .getPersonByNin(id)
      .pipe(
        switchMap(res => {
          return this.getPersonDetailsById(res?.listOfPersons[0]?.personId);
        })
      )
      .subscribe(res => {
        this.heirSin = res.socialInsuranceNo;
        this.router.navigate([BenefitConstants.ROUTE_INDIVIDUAL(this.heirSin)], {
          state: { loadPageWithLabel: 'PERSONAL-DETAILS' }
        });
      });
  }

  getPersonDetailsById(personId) {
    return this.coreBenefitService.getPersonById(personId);
  }
  getActiveEngagement() {
    this.contributorService.getEngagement(this.socialInsuranceNo).subscribe(res => {
      this.engagementId = res?.overallEngagements?.filter(eng => eng?.engagementType === 'vic')[0]?.engagementId;
    });
  }
}
