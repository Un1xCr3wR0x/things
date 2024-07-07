/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  AnnuityBenefitRequest,
  BenefitConstants,
  Benefits,
  BenefitStatus,
  BenefitType,
  BenefitTypeLabels,
  BenefitValues,
  buildQueryParamForSearchPerson,
  decline,
  DependentDetails,
  getIdRemoveNullValue,
  HeirDetailsRequest,
  isDependentOrHeirWizardPresent,
  PersonalInformation,
  ReasonBenefit,
  SearchPerson,
  showErrorMessage,
  showModal,
  submitError,
  UITransactionType,
  ValidateHeirBenefit,
  WorkFlowType
} from '../../shared';
import {
  ApplicationTypeEnum,
  CommonIdentity,
  GosiCalendar,
  LovList,
  RouterConstants,
  scrollToTop,
  WizardItem
} from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { AnnuityBaseComponent } from '../base/annuity.base-component';
import { Observable } from 'rxjs';

@Component({
  selector: 'bnt-apply-lumpsum-sc',
  templateUrl: './lumpsum-apply-sc.component.html',
  styleUrls: ['./lumpsum-apply-sc.component.scss']
})
export class LumpsumAppplyScComponent extends AnnuityBaseComponent implements OnInit, OnDestroy, AfterViewInit {
  /*
   *Input Variables
   */
  @ViewChild('applyLumpsumWizard', { static: false })
  applyLumpsumWizard: ProgressWizardDcComponent;
  @ViewChild('retirementDetailsTab', { static: false })
  retirementDetailsTabSet: TabsetComponent;
  //Local variables
  modalRef: BsModalRef;
  benefitType = BenefitType.retirementLumpsumType;
  paymentMethod = 1;
  isAddressOptional = true;
  // lumpsumWizards: WizardItem[] = [];
  pensionTransactionId = BenefitConstants.TRANSACTIONID_PENSION_LUMPSUM;
  isNonOcc = false;
  annuitybenefits: Benefits[] = [];
  isWomenLumpsum: boolean;
  listYesNo$: Observable<LovList>;
  nationalityList$: Observable<LovList>;
  guardianDetails: PersonalInformation;
  // isEligibleForVICRefund: boolean;
  isSmallScreen: boolean;
  savedDependents: DependentDetails[];
  savedHeirs: HeirDetailsRequest;
  // creditBalanceDetails: CreditBalanceDetails;
  showPaymentMethod = false;
  @ViewChild('cancelLumpsum', { static: false })
  private cancelLumpsum: TemplateRef<HTMLElement>;
  @ViewChild('cancelTransactionLumpsum', { static: false })
  private cancelTransactionLumpsum: TemplateRef<HTMLElement>;

  /*
   * This method is for initalisation tasks
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.currentTab = 0;
    this.alertService.clearAlerts();
    this.maxDate = moment(new Date()).toDate();
    this.route.queryParams.subscribe(params => {
      this.isNonOcc = params.nonocc === 'true' ? true : false;
      this.isJailed = params.jailed === 'true' ? true : false;
      this.isHazardous = params.hazardous === 'true' ? true : false;
      this.isWomenLumpsum = params.womenLumpsum === 'true' ? true : false;
      this.isHeir = params.heir === 'true';
      this.isRPALumpsum = params.rpa === 'true';
      this.eligibleForPensionReform = params.eligibleForPensionReform === 'true';
    });
    this.listYesNo$ = this.lookUpService.getYesOrNoList();
    this.nationalityList$ = this.lookUpService.getNationalityList();
    // this.listYesNo$ = this.lookUpService.getYesOrNoList();
    this.initVariables();
    this.getSystemParam();
    this.getSystemRunDate();
    this.checkValidatorEditFlow();
    this.getScreenSize();
    this.workflowType = WorkFlowType.REQUEST_RETIREMENT_LUMPSUM;
    this.showPaymentMethod = true; //cheque option enabled for all lumpsums story: 424580
    if (this.isIndividualApp) {
      // No requestDateChanged for individual app
      this.getBenefitCalculationByType(this.benefitType);
    }
    if (this.isNonOcc) {
      // this.benefitType = BenefitType.nonOccLumpsumBenefitType;
      // this.pensionTransactionId = BenefitConstants.TRANSACTIONID_NON_OCCUPATIONAL_LUMPSUM;
      // this.benefitPropertyService.setBenType(BenefitType.nonOccLumpsumBenefitType);
      // this.getBenefitCalculationByType(this.benefitType);
      this.headingType = new BenefitTypeLabels(this.benefitType).getHeading();
      if (this.isDisabilityBenefit || this.routerData.draftRequest) {
        this.setBenefitRequestIdForNonOcc();
        this.callPensionDocsApi = true;
      } else if (this.isDisabilityBenefit) {
        this.benefitType = BenefitType.NonOccDisabilityBenefitsType;
        this.pensionTransactionId = BenefitConstants.TRANSACTIONID_NON_OCCUPATIONAL_DISABILITY;
      } else {
        this.benefitType = BenefitType.nonOccLumpsumBenefitType;
        this.pensionTransactionId = BenefitConstants.TRANSACTIONID_NON_OCCUPATIONAL_LUMPSUM;
      }
    } else if (this.isJailed) {
      this.benefitType = BenefitType.jailedContributorLumpsum;
      this.pensionTransactionId = BenefitConstants.TRANSACTIONID_JAILED_LUMPSUM;
      this.benefitPropertyService.setBenType(BenefitType.jailedContributorLumpsum);
      // this.getBenefitCalculationByType(this.benefitType);
      // this.getImprisonmentDetails(this.socialInsuranceNo, this.benefitType);
    } else if (this.isHazardous) {
      this.benefitType = BenefitType.hazardousLumpsum;
      this.pensionTransactionId = BenefitConstants.TRANSACTIONID_HAZARDOUS_LUMPSUM;
      this.benefitPropertyService.setBenType(BenefitType.hazardousLumpsum);
      // this.getBenefitCalculationByType(this.benefitType);
    } else if (this.isWomenLumpsum) {
      this.benefitType = BenefitType.womanLumpsum;
      this.workflowType = WorkFlowType.REQUEST_WOMAN_LUMPSUM;
      this.pensionTransactionId = BenefitConstants.TRANSACTIONID_WOMEN;
      this.benefitPropertyService.setBenType(BenefitType.womanLumpsum);
      // this.getBenefitCalculationByType(this.benefitType);
    } else if (this.isHeir) {
      this.benefitType = BenefitType.heirLumpsum;
      this.pensionTransactionId = BenefitConstants.TRANSACTIONID_HEIR_LUMPSUM;
      this.benefitPropertyService.setBenType(BenefitType.heirLumpsum);
    } else if (this.isRPALumpsum) {
      this.benefitType = BenefitType.rpaBenefit;
      this.pensionTransactionId = BenefitConstants.REQUEST_RPA_LUMPSUM;
      this.benefitPropertyService.setBenType(BenefitType.rpaBenefit);
    } else {
      this.benefitType = BenefitType.retirementLumpsumType;
      this.pensionTransactionId = BenefitConstants.TRANSACTIONID_PENSION_LUMPSUM;
      this.benefitPropertyService.setBenType(BenefitType.retirementLumpsumType);
      // this.getBenefitCalculationByType(this.benefitType);
    }
    this.loadData(true);
    // if (this.isValidator) {
    //   this.getAppliedBenefitDetails(this.benefitRequestId, this.socialInsuranceNo, this.referenceNo);
    //   if (this.isJailed && this.routerData?.selectWizard !== BenefitConstants.BENEFIT_DETAILS) {
    //     this.dependentService.getImprisonmentDetails(this.socialInsuranceNo, this.benefitRequestId).subscribe(
    //       res => {
    //         if (res) {
    //           this.jailedPeriods = [res];
    //           this.imprissionmentDetails = res;
    //           this.dependentService.imprisonmentDetails = res;
    //         }
    //       },
    //       err => {
    //         this.showError(err);
    //       }
    //     );
    //   }
    // } else {
    //   this.manageBenefitService.getAnnuityBenefits(this.socialInsuranceNo).subscribe(
    //     data => {
    //       this.annuitybenefits = data;
    //       //this.annuityBenefit = data[0];
    //       // this.getPersonDetails();
    //       this.initialiseTabWizards(this.benefitType);
    //       if (Number(this.getPersonId())) {
    //         this.getPersonDetails();
    //         if (!this.isAppPrivate) {
    //           this.getBankDetails(this.getPersonId());
    //         }
    //       } else {
    //         this.manageBenefitService.getPersonIdentifier(this.socialInsuranceNo).subscribe(personId => {
    //           this.getPersonDetails(null, personId);
    //           this.id = personId.listOfPersons[0].personId;
    //           if (this.id) {
    //             this.getBankDetails(personId);
    //           }
    //         });
    //       }
    //       // this.getContirbutorRefundDetails();
    //       // Defect 483233: UI section for Return VIC contributions is missing in screen when CSR applies for Lumpsum benefit
    //       // this.getContirbutorRefundDetails();
    //       // this.currentTab = 0;
    //       if (this.isJailed) {
    //         if (!this.isValidator) {
    //           if (data && data.length > 0) {
    //             data.forEach(benefit => {
    //               if (benefit.benefitType.english === this.benefitType) {
    //                 this.jailedPeriods = benefit.jailedPeriods;
    //               }
    //             });
    //           }
    //         }
    //       }
    //     },
    //     err => {
    //       showErrorMessage(err, this.alertService);
    //     }
    //   );
    //   this.getReasonForBenefitDetails(this.socialInsuranceNo, this.benefitType);
    // }

    this.benefitStatus = BenefitValues.active;
    // seting the transaction key according to the type
    this.transactionKey = this.isNonOcc
      ? UITransactionType.REQUEST_NON_OCC_LUMPSUM_TRANSACTION
      : this.isJailed
      ? UITransactionType.REQUEST_JAILED_LUMPSUM_TRANSACTION
      : this.isHazardous
      ? UITransactionType.REQUEST_HAZARDOUS_LUMPSUM_TRANSACTION
      : this.isWomenLumpsum
      ? UITransactionType.REQUEST_WOMAN_LUMPSUM_BENEFIT
      : this.isRPALumpsum
      ? UITransactionType.REQUEST_RPA_LUMPSUM_BENEFIT
      : UITransactionType.REQUEST_PENSION_LUMPSUM_BENEFIT;

    if (this.wizardItems && this.wizardItems.length > 0) {
      this.hasDependentOrHeir = isDependentOrHeirWizardPresent(this.wizardItems);
    }
  }

  ngAfterViewInit() {
    this.isNavigatedFromInbox();
  }

  searchForGuardian(data: SearchPerson) {
    const contributorNin: CommonIdentity | null = this.personDetails?.identity.length
      ? getIdRemoveNullValue(this.personDetails?.identity)
      : null;
    const idObjGuardian: CommonIdentity | null = data?.identity.length ? getIdRemoveNullValue(data?.identity) : null;
    this.heirBenefitService.checkCustodian(idObjGuardian.id, contributorNin?.id).subscribe(
      () => {
        const queryParams = buildQueryParamForSearchPerson(data);
        this.manageBenefitService.getPersonDetailsApi(queryParams.toString()).subscribe(
          personalDetails => {
            this.guardianDetails = null;
            this.guardianDetails = personalDetails.listOfPersons[0];
          },
          err => {
            showErrorMessage(err, this.alertService);
          }
        );
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  /** Method to fetch benefit calculation details  */
  getBenefitCalculationByType(benefitType: string) {
    this.manageBenefitService.getAnnuityBenefitCalculations(this.socialInsuranceNo, benefitType).subscribe(
      response => {
        this.benefitCalculation = response;
      },
      err => this.showError(err)
    );
  }

  // requestDateChanged(date: GosiCalendar) {
  //   this.benefitRequestsService
  //     .getEligibleBenefitByBenefitType(this.socialInsuranceNo, this.benefitType, date)
  //     .subscribe(
  //       res => {
  //         if (res?.eligible) {
  //           this.eligibleForBenefit = false;
  //         } else {
  //           this.alertService.showWarningByKey('BENEFITS.NOT-ELIGIBLE-LUMPSUM');
  //         }
  //       },
  //       err => {
  //         showErrorMessage(err, this.alertService);
  //       }
  //     );
  // }

  isNavigatedFromInbox() {
    if (this.routerData && this.routerData.selectWizard) {
      if (this.routerData.selectWizard === BenefitConstants.UI_DOCUMENTS) {
        this.applyLumpsumWizard.wizardItems = this.wizardService.addWizardItem(
          this.applyLumpsumWizard.wizardItems,
          new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt')
        );
        this.benefitDocumentService
          .getReqDocs(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo)
          .subscribe(response => {
            if (response.length) {
              this.requiredDocs = response;
              this.applyLumpsumWizard.wizardItems = this.wizardService.addWizardItem(
                this.applyLumpsumWizard.wizardItems,
                new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt')
              );
            }
          });
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
      this.nextForm(this.retirementDetailsTabSet, this.applyLumpsumWizard, this.routerData.selectWizard);
    }
    // else {
    //   this.selectedWizard(0);
    // }
    if (this.routerData.selectWizard === BenefitConstants.BENEFIT_DETAILS) {
      if (this.benefitRequestId && this.referenceNo) {
        this.getAnnuityCalculation(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
      } else {
        this.getBenefitCalculationByType(this.benefitType);
      }
    }
    this.getEligibilityDetails(this.socialInsuranceNo);
  }

  /**method to get Imprisionment details*/
  getEligibilityDetails(sin: number) {
    if (this.isValidator) {
      this.manageBenefitService.getAnnuityBenefits(sin).subscribe(data => {
        this.annuitybenefits = data;
        if (this.annuitybenefits && this.annuitybenefits.length > 0) {
          this.annuitybenefits.forEach(benefit => {
            if (benefit.eligibleForDependentAmount) {
              this.benefitPropertyService.setEligibleDependentAmount(benefit.eligibleForDependentAmount);
            }
          });
        }
      });
    }
  }

  /*
   * This method is to go to previous form
   */
  previousForm() {
    this.goToPreviousForm(this.retirementDetailsTabSet, this.applyLumpsumWizard);
  }

  /*
   * This method is to select wizard
   */
  selectedWizard(index: number) {
    this.selectWizard(index, this.retirementDetailsTabSet, this.wizardItems);
  }

  /**method to get Imprisionment details*/
  // getImprisonmentDetails(sin: number, benefitType: string) {
  //   if (!this.isValidator) {
  //     this.manageBenefitService.getAnnuityBenefits(sin).subscribe(data => {
  //       this.annuitybenefits = data;
  //       if (this.annuitybenefits && this.annuitybenefits.length > 0) {
  //         this.annuitybenefits.forEach(benefit => {
  //           if (benefit.benefitType.english === benefitType) {
  //             this.jailedPeriods = benefit.jailedPeriods;
  //           }
  //         });
  //       }
  //     });
  //   } else {
  //     this.jailedPeriods.push(this.dependentService.imprisonmentDetails);
  //   }
  // }

  /**Called from HTML after entering reason for benefit*/
  goToAddHeir(heirData: HeirDetailsRequest, tabset: TabsetComponent, wiardComp: ProgressWizardDcComponent) {
    let gotToNextForm = false;
    if (
      heirData.reason.english === BenefitValues.missingContributor ||
      heirData.reason.english === BenefitValues.ohMissingContributor
    ) {
      const missingDate = moment(heirData?.eventDate.gregorian);
      const requestDate = moment(heirData.requestDate.gregorian);
      gotToNextForm = requestDate.diff(missingDate, 'months') >= this.systemParameter?.MIN_MONTHS_MISSING_CONTRIBUTOR;
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
      const validateBenefit = new ValidateHeirBenefit(heirData.reason, heirData.requestDate,heirData.isPpaOhDeath);
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
            missingDate
          )
          .subscribe(data => {
            this.eligibilityApiResponse = data;
            if (data && data.eligible) {
              this.lateRequest = data?.lateRequest;
              this.eligibleForBenefit = data?.eligible;
              if (this.benefitRequestId && this.referenceNo) {
                const requestDetails: AnnuityBenefitRequest = {
                  referenceNo: this.referenceNo,
                  requestDate: heirData.requestDate,
                  heirRequestDetails: {
                    eventDate: heirData.eventDate,
                    reason: heirData.reason
                  }
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
                      this.getHeirDetails(this.socialInsuranceNo, heirData, tabset, wiardComp);
                      this.heirDetailsData = heirData;
                    },
                    err => {
                      submitError(err, this.alertService);
                    }
                  );
              } else {
                // Validate Benefit to be called
                this.benefitRequestsService
                  .validateBenefit(this.socialInsuranceNo, this.benefitType, validateBenefit)
                  .subscribe(
                    res => {
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
                      showErrorMessage(err, this.alertService);
                    }
                  );
              }
            } else {
              this.isNotEligible = true;
            }
          });
      } else {
        this.heirDetailsData = heirData;
        this.nextForm(tabset, wiardComp);
      }
    } else {
      this.alertService.showWarningByKey('BENEFITS.MISSING-SHOULD-MORE-6-MONTHS');
      scrollToTop();
    }
  }

  /**
   * Method to initialise current tab
   * @param currentTab
   */
  // initialiseTabWizards(benefitType: string) {
  //   // jailed lumpsum is a special case which require dependent blocks and steps
  //   this.wizardItems = [];
  //   if (benefitType === BenefitType.jailedContributorLumpsum) {
  //     // this.wizardItems = this.wizardService.getJaileditems();
  //   } else if (benefitType === BenefitType.heirLumpsum) {
  //     this.wizardItems = this.heirBenefitService.getHeirPensionItems();
  //     const control = this.fb.group({
  //       requestDate: this.fb.group({
  //         gregorian: [null],
  //         hijiri: [null]
  //       })
  //     });
  //     this.benefitsForm.addControl('reportDate', control);
  //     this.wizardItems[0].isImage = true;
  //     if (this.wizardItems[2]) {
  //       this.wizardItems[2].isImage = true;
  //     }
  //   } else {
  //     this.wizardItems = this.wizardService.getLumpsumWizardItems(this.isAppPrivate);
  //     this.wizardItems[0].isActive = true;
  //     this.wizardItems[0].isDisabled = false;
  //   }
  //
  //   if (this.isJailed || this.isHeir) {
  //     this.wizardItems[this.currentTab].isActive = true;
  //     this.wizardItems[0].isImage = true;
  //     this.wizardItems[this.currentTab].isDisabled = false;
  //     if (this.currentTab === 2 || this.currentTab === 1) {
  //       this.wizardItems[0].isDone = true;
  //       this.wizardItems[2].isImage = true;
  //     }
  //   }
  //   // contact details not required for hazardous lumpsum and heir benefits
  //   if (!this.isHazardous && !this.isHeir) {
  //     this.showContactWizard(this.wizardItems);
  //   }
  // }

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
      this.saveAddress(perDetails, this.retirementDetailsTabSet, this.applyLumpsumWizard);
    } else {
      this.nextForm(this.retirementDetailsTabSet, this.applyLumpsumWizard);
    }
  }

  /**
   * method to show cancel template
   */
  showCancelTemplate() {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(this.cancelLumpsum, config);
  }

  /**
   * method to show form validation
   */
  showFormValidation() {
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.alertService.clearAlerts();
    } else {
      this.alertService.clearAlerts();
      this.alertService.showMandatoryErrorMessage();
    }
  }

  /**method to handle cancellation of transaction */
  cancelTransaction() {
    this.clearAlerts();
    this.commonModalRef = showModal(
      this.modalService,
      (!this.benefitRequestId && !this.routerData?.draftRequest) || this.routerData?.assigneeId
        ? this.cancelLumpsum
        : this.cancelTransactionLumpsum
    );
  }

  /** Method to clear alerts. */
  clearAlerts() {
    this.alertService.clearAlerts();
  }

  /** Method to show pop up. */

  /** Method to handle doc upload. */
  docUploadSuccess(event) {
    this.patchBenefitWithCommentsAndNavigate(
      event,
      this.retirementDetailsTabSet,
      this.applyLumpsumWizard,
      this.isValidator && this.annuityResponse?.status?.english !== BenefitStatus.DRAFT
        ? [RouterConstants.ROUTE_TODOLIST]
        : this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP
        ? [BenefitConstants.ROUTE_INDIVIDUAL_BENEFITS]
        : [BenefitConstants.ROUTE_BENEFIT_LIST(null, this.socialInsuranceNo)]
    );
  }

  saveDependent(dependents: DependentDetails[]) {
    this.savedDependents = dependents ? dependents : null;
    this.applyBenefit(this.retirementDetailsTabSet, this.applyLumpsumWizard, this.savedDependents);
  }

  applyForBenefitWithHier(heirData: HeirDetailsRequest) {
    this.savedHeirs = heirData ? heirData : null;
    this.savedHeirs.heirDetails = null;
    this.applyBenefit(this.retirementDetailsTabSet, this.applyLumpsumWizard, this.savedDependents, this.savedHeirs);
  }

  /*
   * This method is to submit benefit details
   */
  submitBenefitDetails() {
    if (this.benefitsForm.valid) {
      if (this.isHeir && !this.benefitCalculation?.eligibleHeirsPresent) {
        this.alertService.showErrorByKey('BENEFITS.NO-ELIGIBLE-HEIRS');
      } else {
        this.applyBenefit(this.retirementDetailsTabSet, this.applyLumpsumWizard, this.savedDependents, this.savedHeirs);
      }
    } else {
      this.alertService.showErrorByKey('BENEFITS.ENTER-MANDATORY-DETAILS');
      scrollToTop();
    }
  }

  decline() {
    decline(this.commonModalRef);
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }

  /** method to get reason for benefit*/
  getReasonForBenefitDetails(sin: number, benefitType: string) {
    this.benefitRequestsService.getEligibleBenefitByBenefitType(sin, benefitType).subscribe(data => {
      if (data) {
        this.reasonForbenefits = new ReasonBenefit(data.deathDate, data.missingDate, data.heirBenefitRequestReason);
      }
    });
  }
  showErrorMessages($event) {
    showErrorMessage($event, this.alertService);
  }

  clearAllAlerts() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
  navigateToPrevAdjustment() {
    this.adjustmentPaymentService.identifier = this.getPersonId();
    // this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT]);
    const url = `#${BenefitConstants.ROUTE_ADJUSTMENT}?identifier=${this.getPersonId()}&sin=${this.socialInsuranceNo}`;
    window.open(url, '_blank');
  }

  ShowEligibilityPopup(templateRef: TemplateRef<HTMLElement>) {
    // this.annuityBenefit = annuitybenefits;
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }

  // getSystemParam() {
  //   this.manageBenefitService.getSystemParams().subscribe(res => {
  //     this.systemParameter = new SystemParameter().fromJsonToObject(res);
  //   });
  // }
  /** Method to handle before component destroyal . */
  ngOnDestroy() {
    this.clearAllAlerts();
    if (this.routerData.draftRequest) {
      this.routerData.assignedRole = null;
    }
  }
}
