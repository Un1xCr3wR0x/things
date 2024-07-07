/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, OnDestroy, AfterViewInit, Input, TemplateRef } from '@angular/core';
import { WizardItem, LovList, GosiCalendar, scrollToTop, BilingualText } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import {
  BenefitValues,
  MonthYearLabel,
  BenefitResponse,
  UITransactionType,
  PersonalInformation,
  BenefitConstants,
  BenefitType,
  WorkFlowType,
  HeirDetailsRequest,
  isDependentOrHeirWizardPresent,
  showErrorMessage,
  Benefits,
  ValidateHeirBenefit,
  submitError,
  AnnuityBenefitRequest,
  isHeirBenefit,
  setHeirDebitDetails,
  ActiveBenefits,
  isHeirReasonForBenefitChanged,
  BenefitStatus,
  getRequestDateFromForm,
  ReasonBenefit,
  isNonoccBenefit,
  BenefitTypeLabels
} from '../../shared';
import { FormGroup, Validators, FormArray } from '@angular/forms';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import moment from 'moment-timezone';
import { AttorneyDetailsWrapper } from '../../shared/models/attorney-details-wrapper';
import { DependentDetails } from '../../shared/models/dependent-details';
import { PensionApplyHelperComponent } from './pension-apply-helper';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'bnt-pension-apply-sc',
  templateUrl: './pension-apply-sc.component.html',
  styleUrls: ['./pension-apply-sc.component.scss']
})
export class PensionApplyScComponent extends PensionApplyHelperComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() bankName: BilingualText;

  /**
   * local variables
   */
  benefitResponse: BenefitResponse;
  benefitStatus: string;
  benefitType: string;
  currentTab = 0;
  deductionPlanList$: Observable<LovList>;
  isAddressOptional = true;
  isFormValid = false;
  isIbanVerified = true;
  lang = 'en';
  requestpensionForm: FormGroup;
  socialInsuranceNo: number;
  annuityRelationShip$: Observable<LovList>;
  totalTabs = 3;
  searchResult: PersonalInformation;
  queryParams: string;
  page: string;
  annuitybenefits: Benefits[] = [];
  savedDependents: DependentDetails[];
  savedHeirs: HeirDetailsRequest;
  showPaymentMethod = false;
  disableSaveAndNext: boolean;
  acitveBenefit: ActiveBenefits;
  annuityBenefit: Benefits;
  eligibilityResponse: Benefits;
  benefitInfo: Benefits;
  listYesNo$: Observable<LovList>;

  /**
   * This method is for initialization tasks
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.getBenefitValues();
    // this.getBenefitsWithStatus();
    this.listYesNo$ = this.lookUpService.getYesOrNoList();
  }

  getBenefitValues() {
    if (
      this.benefitType === BenefitType.heirMissingPension ||
      this.benefitType === BenefitType.heirDeathPension ||
      this.benefitType === BenefitType.heirDeathPension2 ||
      this.benefitType === BenefitType.heirPension ||
      this.benefitType === BenefitType.funeralGrant
    ) {
      this.showPaymentMethod = true;
    }
    //getting the earlyretirement param value to assess the  early retirement or normal pension
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.isEarlyRetirement = params.earlyretirement === 'true';
        this.isNonOcc = params.nonocc === 'true';
        this.isJailed = params.jailed === 'true';
        this.isHazardous = params.hazardous === 'true';
        this.isHeir = params.heir === 'true';
        this.isDisabilityBenefit = params.isDisabilityBenefit === 'true';
        this.eligibleForPensionReform = params.eligibleForPensionReform === 'true';
      }
    });

    this.getScreenSize();
    this.requestpensionForm = this.createRequestPensionForm();
    this.callPensionDocsApi = true;
    this.initAdditionalContributionPlanLookup();
    this.workflowType = WorkFlowType.REQUEST_RETIREMENT_PENSION;
    this.benefitStatus = BenefitValues.active;
    this.initVariables(true);
    this.getSystemParam();
    this.getSystemRunDate();
    this.checkValidatorEditFlow();
    this.setValues();
    if (this.isNonOcc) {
      //TODO: use async functionality to enable/disable user actions
      // pensionTransactionId is set in setBenefitRequestIdForNonOcc for non Occ
      this.setBenefitRequestIdForNonOcc();
    }
    // Check if eligible for dependent addition
    this.loadData();
    if (this.isEarlyRetirement) {
      this.transactionKey = UITransactionType.REQUEST_EARLY_RETIREMENT_PENSION;
    } else if (this.isNonOcc) {
      this.transactionKey = UITransactionType.REQUEST_NON_OCC_PENSION_TRANSACTION;
      if (this.benefitType === BenefitType.NonOccDisabilityBenefitsType) {
        this.transactionKey = UITransactionType.REQUEST_NON_OCC_DISABILITY_TRANSACTION;
      }
    } else if (this.isJailed) {
      this.transactionKey = UITransactionType.REQUEST_JAILED_PENSION_TRANSACTION;
    } else if (this.isHazardous) {
      this.transactionKey = UITransactionType.REQUEST_HAZARDOUS_PENSION_TRANSACTION;
    } else {
      this.transactionKey = UITransactionType.REQUEST_PENSION_BENEFIT;
    }
  }

  ngAfterViewInit() {
    if (this.routerData && this.routerData.selectWizard) {
      if (this.routerData.selectWizard === BenefitConstants.UI_DOCUMENTS) {
        this.applyretirementWizard.wizardItems = this.wizardService.addWizardItem(
          this.applyretirementWizard.wizardItems,
          new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt')
        );
        this.benefitDocumentService
          .getReqDocs(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo)
          .subscribe(response => {
            if (response.length) {
              this.requiredDocs = response;
              this.applyretirementWizard.wizardItems = this.wizardService.addWizardItem(
                this.applyretirementWizard.wizardItems,
                new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt')
              );
            }
          });
      } else if (this.routerData.selectWizard === BenefitConstants.BENEFIT_DETAILS) {
        if (this.benefitRequestId && this.referenceNo) {
          this.getAnnuityCalculation(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
        } else {
          this.getBenefitCalculationByType(this.benefitType);
        }
      } else if (this.routerData.selectWizard === BenefitConstants.DEPENDENTS_DETAILS) {
        //For validator there wont be any confirm button, so click it
        if (this.isValidator) {
          this.dependentService.getImprisonmentDetails(this.socialInsuranceNo, this.benefitRequestId).subscribe(
            res => {
              if (res) {
                this.jailedPeriods = [res];
                this.imprissionmentDetails = res;
                this.dependentService.imprisonmentDetails = res;
                this.getDependentsBackdated(
                  this.benefitsForm.get('requestDate')?.value,
                  this.benefitRequestId,
                  this.referenceNo
                );
              }
            },
            err => {
              this.showError(err);
            }
          );
        }
      }
      this.nextForm(this.retirementDetailsTab, this.applyretirementWizard, this.routerData.selectWizard);
    }
  }

  setValues() {
    //setting the benefitType amd transaction id according to the queryparam received
    // pensionTransactionId is set in setBenefitRequestIdForNonOcc for non Occ

    if (this.isEarlyRetirement) {
      this.benefitType = BenefitType.earlyretirement;
      this.pensionTransactionId = BenefitConstants.TRANSACTIONID_EARLY_PENSION;
    } else if (this.isNonOcc) {
      if (this.isDisabilityBenefit) {
        this.benefitType = BenefitType.NonOccDisabilityBenefitsType;
        this.pensionTransactionId = BenefitConstants.TRANSACTIONID_NON_OCCUPATIONAL_DISABILITY;
      } else {
        this.benefitType = BenefitType.nonOccPensionBenefitType;
        this.pensionTransactionId = BenefitConstants.TRANSACTIONID_NON_OCCUPATIONAL_PENSION;
      }
      this.headingType = new BenefitTypeLabels(this.benefitType).getHeading();
    } else if (this.isJailed) {
      this.benefitType = BenefitType.jailedContributorPension;
      this.pensionTransactionId = BenefitConstants.TRANSACTIONID_JAILED_PENSION;
    } else if (this.isHazardous) {
      this.benefitType = BenefitType.hazardousPension;
      this.pensionTransactionId = BenefitConstants.TRANSACTIONID_HAZARDOUS_PENSION;
    } else if (this.isHeir) {
      this.benefitType = BenefitType.heirPension;
      this.workflowType = WorkFlowType.REQUEST_HEIR_PENSION;
      this.pensionTransactionId = BenefitConstants.TRANSACTIONID_HEIR_PENSION;
    } else {
      this.benefitType = BenefitType.retirementPensionType;
      this.pensionTransactionId = BenefitConstants.TRANSACTIONID_PENSION;
    }
    this.benefitPropertyService.setBenType(this.benefitType);
  }

  /*
   * This method is to go to previous form
   */
  previousForm() {
    this.goToPreviousForm(this.retirementDetailsTab, this.applyretirementWizard);
  }

  /*
   * This method is to select wizard
   */
  selectedWizard(index: number) {
    this.selectWizard(index, this.retirementDetailsTab, this.wizardItems);
  }

  showAddContactWizard(event: boolean) {
    this.wizardItems = this.hideShowContactDtls(event, this.wizardItems);
  }

  /**method to get Imprisionment details*/
  getImprisonmentDetails(sin: number, benefitType: string) {
    this.manageBenefitService.getAnnuityBenefits(sin).subscribe(data => {
      this.annuitybenefits = data;
      if (this.annuitybenefits && this.annuitybenefits.length > 0) {
        this.annuitybenefits.forEach(benefit => {
          if (benefit.benefitType.english === benefitType) {
            this.jailedPeriods = benefit.jailedPeriods;
          }
        });
      }
    });
  }

  /**Called from HTML after entering reason for benefit*/
  goToAddHeir(heirData: HeirDetailsRequest, tabset: TabsetComponent, wiardComp: ProgressWizardDcComponent) {
    this.alertService.clearAlerts();
    let gotToNextForm = false;
    if (
      heirData.reason.english === BenefitValues.missingContributor ||
      heirData.reason.english === BenefitValues.ohMissingContributor
    ) {
      const missingDate = moment(heirData.eventDate.gregorian);
      const requestDay = moment(heirData.requestDate.gregorian);
      gotToNextForm = requestDay?.diff(missingDate, 'months') >= this.systemParameter?.MIN_MONTHS_MISSING_CONTRIBUTOR;
      if (this.isIndividualApp) {
        // no request date for individual app
        gotToNextForm = true;
      }
    } else {
      gotToNextForm = true;
    }
    if (gotToNextForm) {
      let missingDate: GosiCalendar;
      let deathDate: GosiCalendar;
      const validateBenefit = new ValidateHeirBenefit(heirData.reason, heirData.requestDate, heirData.isPpaOhDeath);
      if (
        heirData.reason.english === BenefitValues.missingContributor ||
        heirData.reason.english === BenefitValues.ohMissingContributor
      ) {
        missingDate = heirData.eventDate;
        validateBenefit['missingDate'] = heirData.eventDate;
      } else if (
        heirData.reason.english === BenefitValues.deathOfTheContributor ||
        heirData.reason.english === BenefitValues.ohDeathOfTheContributor
      ) {
        deathDate = heirData.eventDate;
        validateBenefit['deathDate'] = heirData.eventDate;
      }
      if (this.isAppPrivate) {
        this.benefitRequestsService
          .getEligibleBenefitByBenefitType(
            this.socialInsuranceNo,
            this.benefitType,
            heirData.requestDate,
            deathDate,
            missingDate,
            null,
            heirData.isPpaOhDeath
          )
          .subscribe(
            data => {
              // if (data?.retirementEligibility?.eligibleForRetirementBenefit) {
              //   this.alertService.showWarning(data?.retirementEligibility?.message);
              //   this.disableSaveAndNext = true;
              //   return;
              // }
              this.eligibilityApiResponse = data;
              if (data && data?.eligible) {
                this.lateRequest = data?.lateRequest;
                this.eligibleForBenefit = data?.eligible;
                this.disableSaveAndNext = true;
                if (this.benefitRequestId && this.referenceNo) {
                  const requestDetails: AnnuityBenefitRequest = {
                    referenceNo: this.referenceNo,
                    requestDate: heirData.requestDate,
                    heirRequestDetails: {
                      eventDate: heirData.eventDate,
                      reason: heirData.reason
                    },
                    isPpaOhDeath: heirData.isPpaOhDeath
                  };
                  this.manageBenefitService
                    .updateForAnnuityBenefit(
                      this.socialInsuranceNo,
                      this.benefitRequestId,
                      this.benefitType,
                      requestDetails
                    )
                    .subscribe(
                      () => {
                        this.disableSaveAndNext = false;
                        // if (isHeirReasonForBenefitChanged(this.heirDetailsData, heirData)) {
                        this.getHeirDetails(this.socialInsuranceNo, heirData, tabset, wiardComp);
                        // } else {
                        //   this.nextForm(tabset, wiardComp);
                        // }
                        this.heirDetailsData = heirData;
                      },
                      err => {
                        this.disableSaveAndNext = false;
                        submitError(err, this.alertService);
                      }
                    );
                } else {
                  // Validate Benefit to be called
                  this.benefitRequestsService
                    .validateBenefit(this.socialInsuranceNo, this.benefitType, validateBenefit)
                    .subscribe(
                      res => {
                        this.disableSaveAndNext = false;
                        this.benefitRequestId = res.benefitRequestId;
                        this.referenceNo = res.referenceNo;
                        // if (isHeirReasonForBenefitChanged(this.heirDetailsData, heirData)) {
                        this.getHeirDetails(this.socialInsuranceNo, heirData, tabset, wiardComp);
                        // } else {
                        //   this.nextForm(tabset, wiardComp);
                        // }
                        this.heirDetailsData = heirData;
                      },
                      err => {
                        this.disableSaveAndNext = false;
                        showErrorMessage(err, this.alertService);
                        scrollToTop();
                      }
                    );
                }
              } else {
                this.isNotEligible = true;
                scrollToTop();
              }
            },
            err => {
              this.disableSaveAndNext = false;
              submitError(err, this.alertService);
            }
          );
      } else {
        this.heirDetailsData = heirData;
        this.nextForm(tabset, wiardComp);
      }
    } else {
      this.alertService.showWarningByKey('BENEFITS.MISSING-SHOULD-MORE-6-MONTHS');
      scrollToTop();
    }
  }
  //  This method is to call eligibility api for manually entering death date 
  getEligibilityDeath(deathDate) {
    const date = new GosiCalendar();
    date.gregorian = deathDate;
    this.benefitRequestsService
      .getEligibleBenefitByBenefitType(
        this.socialInsuranceNo,
        this.benefitType,
        null,
        date,
        null,
        null,
        null
      )
      .subscribe(data => {
        this.eligibilityApiResponse = data;
      });
  }

  /*
   * This method is to get deduction plan.
   */
  initAdditionalContributionPlanLookup() {
    this.deductionPlanList$ = this.lookUpService.getAdditionalContributionPlan();
  }

  /**
   * method to save address and contact details
   */
  saveContactDetails(personalDetails) {
    if (
      personalDetails &&
      personalDetails.contactDetail &&
      personalDetails.contactDetail.addresses &&
      personalDetails.contactDetail.addresses.length > 0
    ) {
      const perDetails = this.personDetails;
      perDetails.contactDetail = personalDetails.contactDetail;
      this.saveAddress(perDetails, this.retirementDetailsTab, this.applyretirementWizard);
    } else {
      this.nextForm(this.retirementDetailsTab, this.applyretirementWizard);
    }
  }

  /*
   * This method is to initialise  request pension form
   */
  createRequestPensionForm() {
    return this.fb.group({
      checkBoxFlag: [, { validators: Validators.requiredTrue }],
      deductionPlan: this.fb.group({
        english: [BenefitValues.plan10, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      })
    });
  }

  /*
   * This method is to show cancel template
   */
  showCancelTemplate() {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.commonModalRef = this.modalService.show(
      this.benefitRequestId ? this.confirmTransactionTemplate : this.confirmTemplate,
      config
    );
  }

  /* This method is for setting deduction percentage */
  setDeductionPercentage(percentage: number) {
    this.deductionPercentage = percentage;
  }

  /* This method is for getting month labels to display */
  geMonthForTrans(date: GosiCalendar) {
    let monthLabel = '';
    if (date.gregorian) {
      monthLabel = Object.values(MonthYearLabel)[moment(date.gregorian).toDate().getMonth()];
    }
    return monthLabel;
  }

  saveDependent(dependents: DependentDetails[]) {
    this.savedDependents = dependents ? dependents : null;
    this.applyBenefit(this.retirementDetailsTab, this.applyretirementWizard, this.savedDependents);
  }

  applyForBenefitWithHier(heirData: HeirDetailsRequest) {
    this.savedHeirs = heirData ? heirData : null;
    this.savedHeirs.heirDetails = null;
    this.applyBenefit(this.retirementDetailsTab, this.applyretirementWizard, this.savedDependents, this.savedHeirs);
  }

  /*
   * This method is to submit benefit details
   */
  submitBenefitDetails() {
    if (this.benefitsForm.valid) {
      this.requestDetails.deductionPercentage = this.deductionPercentage;
      //For backdated Heir
      if (this.savedHeirs) {
        this.savedHeirs.heirDetails = null;
        this.savedHeirs.heirDebitDetails = setHeirDebitDetails(
          this.benefitsForm?.get('heirAdjustmentForm') as FormArray
        );
      }
      if (this.isHeir && !this.benefitCalculation?.eligibleHeirsPresent) {
        this.alertService.showErrorByKey('BENEFITS.NO-ELIGIBLE-HEIRS');
      } else {
        this.applyBenefit(this.retirementDetailsTab, this.applyretirementWizard, this.savedDependents, this.savedHeirs);
      }
    } else {
      this.benefitsForm.markAllAsTouched();
      if (
        !this.benefitsForm?.get('payeeForm')?.get('paymentMode')?.valid &&
        this.benefitsForm?.get('payeeForm')?.get('payeeType.english')?.value === BenefitValues.authorizedPerson
      ) {
        this.alertService.showErrorByKey('BENEFITS.AUTHORISED-PERSON-INFO');
      }
      if (
        !this.benefitsForm?.get('payeeForm')?.get('paymentMode')?.valid &&
        this.benefitsForm?.get('payeeForm')?.get('payeeType.english')?.value === BenefitValues.guardian
      ) {
        this.alertService.showErrorByKey('BENEFITS.NO-GUARDIAN-DETAILS FOUND');
      }
    }
  }

  /** Method to handle c;aring alerts before component destroyal . */
  ngOnDestroy() {
    this.clearAllAlerts();
    if (this.routerData.draftRequest) {
      this.routerData.assignedRole = null;
    }
  }

  routeBack() {
    if (this.routerData.draftRequest) {
      this.routerData.assignedRole = undefined;
      this.routerData.idParams = new Map();
      this.routerData.draftRequest = false;
    }
    this.location.back();
  }

  showEligibilityPopup(templateRef: TemplateRef<HTMLElement>) {
    // this.manageBenefitService.getAnnuityBenefits(this.socialInsuranceNo).subscribe(data => {
    //   this.annuityBenefit = data.filter(benefit => benefit?.benefitType?.english === this.benefitType)[0] || null;
    // });
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
}
