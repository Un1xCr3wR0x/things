import { Directive, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  CommonIdentity,
  checkIqamaOrBorderOrPassport,
  scrollToTop,
  GosiCalendar,
  NationalityTypeEnum,
  WizardItem,
  ContactDetails,
  BilingualText,
  LovList,
  RouterConstants
} from '@gosi-ui/core';
import {
  BenefitBaseScComponent,
  isOverSeas,
  setStatusForNicDependents,
  getServiceType,
  deepCopy,
  populateHeirDropDownValues,
  getImprissionmentDetailsFromForm,
  BenefitConstants,
  PersonalInformation,
  clearAlerts,
  showErrorMessage,
  ReasonBenefit,
  Benefits,
  DependentDetails,
  BankAccountList,
  BenefitStartDate,
  BenefitDetails,
  CreditBalanceDetails,
  BenefitStatus,
  isNonoccBenefit,
  AnnuityResponseDto,
  LateRequestedDetails,
  isDependentOrHeirWizardPresent,
  getRequestDateFromForm
} from '../../shared';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import moment from 'moment-timezone';
import { Observable } from 'rxjs';
import { ProfileWrapper } from '@gosi-ui/foundation-dashboard/lib/individual-app/models/profile-wrapper';

@Directive()
export abstract class AnnuityBaseHelperComponent extends BenefitBaseScComponent {
  contactDetails: ContactDetails = new ContactDetails();
  personDetails: PersonalInformation;
  isAddressPresent = false;
  benefitStatus: string;
  isContributorNonSaudi: boolean;
  isOverSeasContributor: boolean;
  isValidator: boolean;
  bankName: BilingualText;
  benefitEligibilty: Benefits;
  isHeir: boolean;
  isRPALumpsum: boolean;
  reasonForbenefits: ReasonBenefit;
  isBackDated = true;
  dependentDetails: DependentDetails[] = [];
  eligibleForBenefit: boolean;
  benefitEligibilityAndStartDate: BenefitStartDate;
  creditBalanceDetails: CreditBalanceDetails;
  historyBenefitDetails: BenefitDetails[] = [];
  heirDetails: DependentDetails[] = [];
  $heirList: Observable<LovList>;
  lateRequest = false;
  isNotEligible = false;
  hasDependentOrHeir = false;
  disableSaveAndNext = false;
  lateRequestDetails: LateRequestedDetails;
  id: number;
  eligibilityApiResponse: Benefits;
  requestDateChangedByValidator: boolean;
  profileDetails: ProfileWrapper;

  /* This method is to set payment request details */
  hideShowContactDtls(show: boolean, wizardItems: WizardItem[]): WizardItem[] {
    if (show) {
      if (this.authPersonId) {
        this.manageBenefitService
          .getPersonDetailsWithPersonId(this.authPersonId.toString())
          .subscribe(personalDetails => {
            this.personDetails = personalDetails;
            if (this.personDetails.contactDetail) {
              this.contactDetails = this.personDetails.contactDetail;
            }
          });
      } else {
        if (this.getPersonId()) {
          this.manageBenefitService.getPersonDetailsWithPersonId(this.getPersonId()).subscribe(personalDetails => {
            this.personDetails = personalDetails;
            if (this.personDetails.contactDetail) {
              this.contactDetails = this.personDetails.contactDetail;
            }
          });
        }
      }
      this.initialiseCityLookup();
      this.initialiseCountryLookup();

      if (
        wizardItems &&
        wizardItems.findIndex(wizardItem => wizardItem.key === BenefitConstants.CONTACT_DETAILS) === -1
      ) {
        this.isAddressPresent = true;
        const benftDtlIndex = wizardItems.findIndex(wizardItem => wizardItem.key === BenefitConstants.BENEFIT_DETAILS);
        return this.wizardService.addWizardToPosition(
          wizardItems,
          new WizardItem(BenefitConstants.CONTACT_DETAILS, 'building'),
          benftDtlIndex + 1
        );
      }
    } else {
      this.isAddressPresent = false;
      return this.wizardService.removeWizardItem(BenefitConstants.CONTACT_DETAILS, wizardItems);
    }
  }

  getPersonContactDetails(nin: number) {
    const queryParams = `NIN=${nin}`;
    this.manageBenefitService.getPersonDetailsApi(queryParams).subscribe(personalDetails => {
      this.personDetails = personalDetails.listOfPersons[0];
      if (this.personDetails.contactDetail) {
        this.contactDetails = this.personDetails.contactDetail;
      }
    });
  }
  getProfileContactDetails(identifier: number) {
    this.manageBenefitService.getProfileDetails(identifier).subscribe(res => {
      this.profileDetails = res;
      if (this.profileDetails.contactDetails) {
        this.contactDetails = this.profileDetails.contactDetails;
      }
    });
  }

  getPersonDetails(getAuthPersons = true, identifier?, agentId?: number) {
    const personId = identifier ? identifier?.listOfPersons[0]?.personId : this.getPersonId();
    this.manageBenefitService.getPersonDetailsWithPersonId(personId).subscribe(personalDetails => {
      this.personDetails = personalDetails;
      if (this.personDetails.contactDetail) {
        this.contactDetails = this.personDetails.contactDetail;
      }
      this.isContributorNonSaudi = this.personDetails.nationality?.english !== NationalityTypeEnum.SAUDI_NATIONAL;
      this.isOverSeasContributor = isOverSeas(this.personDetails.contactDetail);
      const idObj: CommonIdentity | null = checkIqamaOrBorderOrPassport(this.personDetails.identity);
      // const id = this.manageBenefitService.getNin() ? this.manageBenefitService.getNin() : idObj.id;
      this.manageBenefitService.setNin(idObj?.id);
      // Defect 483233: UI section for Return VIC contributions is missing in screen when CSR applies for Lumpsum benefit
      if (this.isIndividualApp) {
        this.getContributorIndividual(idObj?.id);
      } else {
        this.getContirbutorRefundDetails(idObj?.id, personId);
      }
      if (getAuthPersons) {
        this.getAttorneyByIdentifier(idObj.id, agentId);
      }
    });
  }

  // getAttorneyDetails(id: number, status: string) {
  //   this.manageBenefitService.getAttorneyDetailsForId(id, status).subscribe(response => {
  //     this.attorneyDetailsWrapper = response;
  //   });
  // }

  getDependentForPrisoners(form: FormGroup, tabset: TabsetComponent, wiardComp: ProgressWizardDcComponent) {
    if (form.valid) {
      this.imprissionmentDetails = getImprissionmentDetailsFromForm(form);
      if (this.imprissionmentDetails.enteringDate === null) {
        if (this.dependentService.imprisonmentDetails && this.dependentService.imprisonmentDetails.enteringDate) {
          this.imprissionmentDetails.enteringDate = this.dependentService.imprisonmentDetails.enteringDate;
        }
      }
      if (this.isValidator) {
        //No Confirm in Validator
        this.getDependentsBackdated(
          (this.benefitsForm.get('requestDate') as FormGroup).getRawValue(),
          this.benefitRequestId,
          this.referenceNo
        );
      }
      this.nextForm(tabset, wiardComp);
    } else {
      this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
      this.alertService.showWarningByKey('BENEFITS.SELECT-IMPRISONMENT-PERIOD');
      scrollToTop();
    }
  }

  getBankName(bankCode: number) {
    this.lookUpService.getBank(bankCode).subscribe(
      res => {
        if (res.items[0]) {
          this.bankName = res.items[0].value;
        }
      },
      err => showErrorMessage(err, this.alertService)
    );
  }

  /** method to get reason for benefit*/
  // getBenefitEligibility(sin: number, benefitType: string) {
  //   //To get benefit eligibility and reason for late request
  //   this.benefitRequestsService.getEligibleBenefitByBenefitType(sin, benefitType).subscribe(data => {
  //     //For Pension late request
  //     this.benefitEligibilty = data;
  //     if (this.isHeir) {
  //       this.reasonForbenefits = new ReasonBenefit(
  //         this.benefitEligibilty.deathDate,
  //         this.benefitEligibilty.missingDate,
  //         this.benefitEligibilty.heirBenefitRequestReason
  //       );
  //     }
  //   });
  // }

  getDependents(
    sin: number,
    benefitType: string,
    benefitRequestId?: number,
    referenceNo?: number,
    status?: string[],
    requestDateChangedByValidator = false
  ) {
    const today = moment(this.systemRunDate?.gregorian).toDate();
    const reqDate = this.isIndividualApp ? today : (this.benefitsForm.get('requestDate') as FormGroup).getRawValue();
    if (reqDate) {
      if (moment(reqDate.gregorian).isBefore(today, 'day')) {
        this.isBackDated = true;
      }
    }

    this.dependentService
      .getDependentDetails(
        sin,
        benefitType,
        reqDate,
        this.imprissionmentDetails,
        benefitRequestId,
        referenceNo,
        status,
        this.isBackDated
      )
      .subscribe(
        response => {
          this.hasDependentOrHeir = true;
          this.dependentDetails = setStatusForNicDependents(
            response,
            this.isValidator,
            false,
            this.benefitStatus,
            null,
            null,
            requestDateChangedByValidator
          );
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
  }

  /** Method to fetch bank details of a person*/
  // getBankDetails(personId?) {
  //   // this.bankDetails = new PersonBankDetails();
  //   const contrId = this.getPersonId();
  //   if (personId && personId !== contrId) {
  //     this.authPersonId = +personId;
  //   } else {
  //     this.authPersonId = null;
  //   }
  //   let identifier;
  //   if (personId?.listOfPersons && personId.listOfPersons[0]?.personId) {
  //     identifier = personId?.listOfPersons[0]?.personId;
  //   } else if (personId) {
  //     identifier = personId;
  //   } else {
  //     identifier = contrId;
  //   }
  //   // const identifier = personId ? personId : contrId;
  //   // let identifier = identifier ? identifier : personId?.listOfPersons[0]?.personId;
  //   const serviceType = this.benefitType ? getServiceType(this.benefitType) : null;

  //   //Defect 495926
  //   if (this.referenceNo) {
  //     //service type only for bank with refno
  //     this.bankService.getBankAccountList(+identifier, this.referenceNo, serviceType).subscribe(bankRes => {
  //       let savedBankDetails = null;
  //       if (bankRes?.bankAccountList?.length) {
  //         savedBankDetails = bankRes;
  //         savedBankDetails.bankAccountList[0].savedAccount = true;
  //       }
  //       this.bankService.getBankAccountList(+identifier, null, serviceType).subscribe(res => {
  //         const bankList = res;
  //         if (savedBankDetails?.bankAccountList[0]) {
  //           const duplicate = bankList.bankAccountList.findIndex(
  //             item => item.ibanBankAccountNo === savedBankDetails?.bankAccountList[0].ibanBankAccountNo
  //           );
  //           if (duplicate >= 0) {
  //             bankList.bankAccountList[duplicate].savedAccount = true;
  //           } else {
  //             bankList.bankAccountList.push(savedBankDetails.bankAccountList[0]);
  //           }
  //         }
  //         // bankList.bankAccountList = bankList.bankAccountList.filter((item, index, self) => self.indexOf(item) === index);
  //         this.bankDetails = deepCopy(bankList);
  //       });
  //     });
  //   } else {
  //     this.bankService.getBankAccountList(+identifier, null, serviceType).subscribe(bankList => {
  //       this.bankDetails = bankList;
  //     });
  //   }
  // }

  addNewRequest() {
    this.dependentService
      .cancelBenefitRequest(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo)
      .subscribe(() => {
        this.alertService.clearAlerts();
      });
    if (this.isValidator && !this.routerData.draftRequest) {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    } else {
      this.router.navigate([
        BenefitConstants.ROUTE_BENEFIT_LIST(
          this.manageBenefitService.registrationNo,
          this.manageBenefitService.socialInsuranceNo
        )
      ]);
    }
    this.commonModalRef.hide();
  }

  //TODO : Show ineligibility details popup
  getDependentsBackdated(
    requestDate: GosiCalendar,
    benefitRequestId?: number,
    referenceNo?: number,
    templateRef?: TemplateRef<HTMLElement>,
    status?: string[]
  ) {
    this.benefitRequestsService
      .getEligibleBenefitByBenefitType(
        this.socialInsuranceNo,
        this.benefitType,
        requestDate,
        null,
        null,
        this.benefitRequestId
      )
      .subscribe(
        res => {
          this.eligibilityApiResponse = res;
          if (res?.eligible) {
            this.isLateRequest(res, templateRef);
            this.eligibleForBenefit = res.eligible;
            this.dependentService
              .getBenefitStartAndEligibilityDate(
                this.socialInsuranceNo,
                this.benefitType,
                this.imprissionmentDetails,
                this.heirDetailsData,
                requestDate
              )
              .subscribe(
                benefitEligibilityStartDate => {
                  this.benefitEligibilityAndStartDate = benefitEligibilityStartDate;
                  this.requestDateChangedByValidator =
                    this.isValidator &&
                    this.annuityResponse?.requestDate?.gregorian &&
                    requestDate.gregorian &&
                    !moment(requestDate.gregorian).isSame(this.annuityResponse.requestDate.gregorian)
                      ? true
                      : false;
                  this.getDependents(
                    this.socialInsuranceNo,
                    this.benefitType,
                    benefitRequestId,
                    referenceNo,
                    status,
                    this.requestDateChangedByValidator
                  );
                },
                err => {
                  showErrorMessage(err, this.alertService);
                }
              );
          } else {
            this.isNotEligible = true;
            this.eligibleForBenefit = false;
          }
        },
        err => {
          this.eligibleForBenefit = false;
          showErrorMessage(err, this.alertService);
        }
      );
    this.isNotEligible = false;
  }

  /**
   * Only used for pension modify
   */
  getBenefitHistoryDetails(sin: number, benefitRequestId: number) {
    this.dependentService.getBenefitHistory(sin, benefitRequestId).subscribe(
      response => {
        this.historyBenefitDetails = response;
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  /** Method to fetch benefit calculation details  */
  getContirbutorRefundDetails(id: number, personId: number) {
    this.contributorDomainService.getContributorByPersonId(personId).subscribe(
      res => {
        if (res.hasVICEngagement) {
          // this.manageBenefitService.getContirbutorRefundDetails(this.socialInsuranceNo, true).subscribe(
          this.manageBenefitService.getContributorCreditBalance(id).subscribe(
            response => {
              this.creditBalanceDetails = response;
            },
            err => this.showError(err)
          );
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  getContributorIndividual(sin: number) {
    this.contributorDomainService.getContributorIndividual(sin).subscribe(
      res => {
        if (res.hasVICEngagement) {
          // this.manageBenefitService.getContirbutorRefundDetails(this.socialInsuranceNo, true).subscribe(
          this.manageBenefitService.getContributorCreditBalance(sin).subscribe(
            response => {
              this.creditBalanceDetails = response;
            },
            err => this.showError(err)
          );
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  getHeirDetails(sin: number, heirDetailsData, tabset?: TabsetComponent, wizardComp?: ProgressWizardDcComponent) {
    this.heirBenefitService
      .getAllHeirDetails(sin, heirDetailsData, this.benefitType, 'true', this.benefitRequestId, this.referenceNo)
      .subscribe(
        res => {
          this.hasDependentOrHeir = true;
          if (res.length) {
            this.heirDetails = setStatusForNicDependents(res, this.isValidator, true, this.benefitStatus);
            this.$heirList = populateHeirDropDownValues(this.heirDetails);
          }
          if (tabset && wizardComp) {
            this.nextForm(tabset, wizardComp);
          }
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
  }

  getPersonDetailsWithPersonId(personId: number) {
    this.manageBenefitService.getPersonDetailsWithPersonId(personId.toString()).subscribe(res => {
      this.personDetails = res;
    });
  }

  showContactWizard(wizardItems: WizardItem[]): WizardItem[] {
    // if (
    //   wizardItems &&
    //   wizardItems.findIndex(wizardItem => wizardItem.key === BenefitConstants.CONTACT_DETAILS) === -1
    // ) {
    this.isAddressPresent = true;
    const benftDtlIndex = wizardItems.findIndex(wizardItem => wizardItem.key === BenefitConstants.BENEFIT_DETAILS);
    return this.wizardService.addWizardToPosition(
      wizardItems,
      new WizardItem(BenefitConstants.CONTACT_DETAILS, 'building'),
      benftDtlIndex + 1
    );
    // }
  }
  //Defect 613606 - isBenefitDetailsPage param added(cancel poup showing on benefitdetails req date confirm)
  isLateRequest(res: Benefits, templateRef?: TemplateRef<HTMLElement>, isBenefitDetailsPage?:boolean) {
    if (isNonoccBenefit(this.benefitType) && templateRef) {
      // confirm button clicked

      if (this.lateRequest !== res.lateRequest && !isBenefitDetailsPage) {
        this.disableSaveAndNext = true;
        this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
      } else if (this.lateRequest === res.lateRequest) {
        this.disableSaveAndNext = false;
      }
    } else {
      // Other benefits (not NON-OCC) can change the late request
      this.lateRequest = res?.lateRequest;
    }
  }
}
