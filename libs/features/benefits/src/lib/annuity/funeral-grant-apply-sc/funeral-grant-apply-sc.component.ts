/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, HostListener, OnInit, TemplateRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import {
  clearAlerts,
  decline,
  showErrorMessage,
  showModal,
  WorkFlowType,
  BenefitType,
  UITransactionType,
  ContributorSearchResult,
  BenefitValues,
  BenefitConstants,
  buildQueryParamForSearchPerson,
  FuneralGrantDetailsDcComponent,
  ActionType,
  getContactDetails
} from '../../shared';
import { AnnuityBaseComponent } from '../base/annuity.base-component';
import { LovList, GosiCalendar, WizardItem, ContactDetails, scrollToTop } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import moment from 'moment';
import {
  DependentDetails,
  HeirDetailsRequest,
  SearchPerson,
  PersonalInformation,
  FuneralGrantSubmit,
  BankAccountList,
  Benefits,
  EligibilityResponse
} from '../../shared/models';
import { FuneralGrantBeneficiaryResponse } from '../../shared/models/funeral-grant-beneficiary-response';

@Component({
  selector: 'bnt-funeral-grant-apply-sc',
  templateUrl: './funeral-grant-apply-sc.component.html',
  styleUrls: ['./funeral-grant-apply-sc.component.scss']
})
export class FuneralGrantApplyScComponent extends AnnuityBaseComponent implements OnInit, OnDestroy, AfterViewInit {
  isSmallScreen: boolean;
  isAppPrivate: boolean;
  funeralGrantForm: FormGroup;
  contributorDetails: ContributorSearchResult;
  beneficiaryTypeList$: Observable<LovList>;
  pensionTransactionId: string;
  deathDate: GosiCalendar;
  systemRunDate: GosiCalendar;
  minDate: Date;
  funeralDetailsForm: FormGroup;
  contactForm = new FormGroup({});
  // @Input() benefitType: string;
  // @Input() parentForm: FormGroup;

  /**
   * ViewChild components
   */
  @ViewChild('applyFuneralGrantWizard', { static: false })
  applyFuneralGrantWizard: ProgressWizardDcComponent;
  @ViewChild('funeralGrantDetailsTab', { static: false })
  funeralGrantDetailsTab: TabsetComponent;
  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;
  @ViewChild('funeralGrantDc', { static: true })
  funeralGrantDc: FuneralGrantDetailsDcComponent;
  @ViewChild('inEligibleReason', { static: true })
  inEligibleReason: TemplateRef<HTMLElement>;

  bankAccountList: BankAccountList;
  guardianDetails: PersonalInformation;
  heirSelectedInValidatorFlow: DependentDetails;
  validatorFlowBeneficiary: FuneralGrantBeneficiaryResponse;
  saveAndNextDisabled = false;
  notEligible: boolean;
  // failedRules: EligibilityResponse[];
  // passedRules: EligibilityResponse[];
  nationalityList$: Observable<LovList>;
  benefitStartDate: GosiCalendar;
  searchResult: PersonalInformation;
  heirDetails: DependentDetails[];
  currentTab = 0;
  @HostListener('window:resize', ['$event'])
  ngOnInit(): void {
    super.ngOnInit();
    // this.heirDetailsData = new HeirDetailsRequest();
    //TODO: check if bilingual required
    // this.heirDetailsData.reason = { english: BenefitValues.deathOfTheContributor } as BilingualText;
    this.initVariables();
    this.checkValidatorEditFlow();
    this.initFuneralGrantWizard();
    this.maxDate = moment(new Date()).toDate();
    this.setLocalVariables();
    // this.getScreenSize();
    // this.setValuesForValidator();
    this.initialiseCityLookup();
    this.initialiseCountryLookup();
    this.initPaymentMethod();
    this.initialisePayeeType();
    this.initialiseCityLookup();
    this.initialiseCountryLookup();
    this.nationalityList$ = this.lookUpService.getNationalityList();
    this.getSystemParam();
    this.manageBenefitService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
    });
    if (this.isAppPrivate) {
      this.getPersonDetails(false);
    }
    if (this.isValidator) {
      this.returnLumpsumService
        .getActiveBenefitDetails(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo)
        .subscribe(
          contributor => {
            if (this.isValidator && !this.routerData?.draftRequest) {
              this.benefitPropertyService
                .validatorEditCall(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo)
                .subscribe();
            }
            this.getContributorDetails(contributor.personId);
            this.benefitsForm.addControl('requestDate', this.fb.group(contributor.requestDate));
            this.funeralBenefitService
              .getBeneficiaryRequestDetails(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo)
              .subscribe(
                beneficiary => {
                  this.validatorFlowBeneficiary = beneficiary;
                  this.deathDate = beneficiary.beneficiaryDetails?.deathDate;
                  this.validatorFlowBeneficiary['lateRequestReason'] = contributor.lateRequestDetails?.reason;
                },
                error => {
                  showErrorMessage(error, this.alertService);
                }
              );
          },
          err => {
            showErrorMessage(err, this.alertService);
          }
        );
    } else {
      this.getContributorDetails(this.contributorService.personId);
    }
  }

  ngAfterViewInit() {
    // this.getBenefitStartDate(getRequestDateFromForm(this.benefitsForm));
    if (this.routerData && this.routerData.selectWizard) {
      if (this.routerData.selectWizard === BenefitConstants.UI_DOCUMENTS) {
        this.applyFuneralGrantWizard.wizardItems = this.wizardService.addWizardItem(
          this.applyFuneralGrantWizard.wizardItems,
          new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt')
        );
        this.benefitDocumentService
          .getReqDocs(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo)
          .subscribe(response => {
            if (response.length) {
              this.requiredDocs = response;
              this.applyFuneralGrantWizard.wizardItems = this.wizardService.addWizardItem(
                this.applyFuneralGrantWizard.wizardItems,
                new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt')
              );
            }
          });
      } else if (this.routerData.selectWizard === BenefitConstants.BENEFIT_DETAILS) {
        this.getAnnuityCalculation(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
      }
      this.nextForm(this.funeralGrantDetailsTab, this.applyFuneralGrantWizard, this.routerData.selectWizard);
    }
  }
  /**
   * Initialize FuneralGrant wizards
   */
  initFuneralGrantWizard() {
    this.wizardItems = this.wizardService.getFuneralWizards();
    this.wizardItems[0].isActive = true;
    this.wizardItems[0].isDisabled = false;
    if (this.wizardItems[1]) {
      this.wizardItems[1].isImage = true;
    }
  }

  getContributorDetails(personId: number) {
    this.manageBenefitService.getContributorDetails(personId).subscribe(response => {
      if (response) {
        this.contributorDetails = response;
        if (
          this.contributorDetails.person.deathDate &&
          this.contributorDetails.person.deathDate.gregorian &&
          !this.isValidator
        ) {
          this.deathDate = this.contributorDetails.person.deathDate;
          // this.heirDetailsData.eventDate = this.contributorDetails.person.deathDate;
        }
        if (this.contributorDetails.person.deathDate && this.contributorDetails.person.deathDate.gregorian) {
          this.minDate = moment(this.contributorDetails.person.deathDate.gregorian).toDate();
        }
      }
    });
  }

  setLocalVariables() {
    this.benefitType = BenefitType.funeralGrant;
    this.benefitStatus = BenefitValues.active;
    this.workflowType = WorkFlowType.REQUEST_FUNERAL_GRANT;
    this.pensionTransactionId = BenefitConstants.TRANSACTIONID_FUNERAL_GRANT;
    this.benefitPropertyService.setBenType(BenefitType.funeralGrant);
    this.transactionKey = UITransactionType.REQUEST_FUNERAL_GRANT;
  }

  getBankDetailsFromApi(id: number) {
    //For Pyament Type Heir this funciton is called
    // if (
    //   this.isValidator &&
    //   this.validatorFlowBeneficiary.beneficiaryDetails &&
    //   this.validatorFlowBeneficiary.beneficiaryDetails.personId === id
    // ) {
    //   this.bankAccountList = { bankAccountList: [this.validatorFlowBeneficiary.beneficiaryDetails.bankAccount] };
    // } else {
    this.getBankDetails(id)
    // this.bankService.getBankAccountList(id).subscribe(
    //   res => {
    //     this.bankAccountList = res;
    //   },
    //   err => {
    //     showErrorMessage(err, this.alertService);
    //   }
    // );
    // }
  }
  deathDateChanged(date: string) {
    this.minDate = moment(date).toDate();
  }

  /*
   * This method is to go to previous form
   */
  previousForm() {
    this.goToPreviousForm(this.funeralGrantDetailsTab, this.applyFuneralGrantWizard);
  }
  /*
   * This method is to select wizard
   */
  selectedWizard(index: number) {
    this.selectWizard(index, this.funeralGrantDetailsTab, this.wizardItems);
  }
  /*
   * This method is to cancel transaction
   */
  cancelTransaction() {
    clearAlerts(this.alertService, this.showOtpError);
    this.commonModalRef = showModal(this.modalService, this.confirmTemplate);
  }

  decline() {
    decline(this.commonModalRef);
  }
  showErrorMessages($event) {
    showErrorMessage($event, this.alertService);
  }

  clearAllAlerts() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
  /** Method to handle c;aring alerts before component destroyal . */
  ngOnDestroy() {
    this.clearAllAlerts();
  }

  search(data: SearchPerson) {
    this.searchPerson(data, this.benefitStartDate);
  }

  searchPerson(data: SearchPerson, benefitStartDate: GosiCalendar) {
    let queryParams = buildQueryParamForSearchPerson(data);
    if (benefitStartDate) {
      const effectiveDate = moment(benefitStartDate.gregorian).format('YYYY-MM-DD');
      queryParams = queryParams.set('effectiveDate', effectiveDate);
    }
    this.manageBenefitService.getPersonDetailsApi(queryParams.toString()).subscribe(
      personalDetails => {
        this.searchResult = personalDetails.listOfPersons[0];
        if (this.searchResult.identity) {
          this.getAttorneyList(this.searchResult.identity);
        }
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  getHeirs() {
    this.heirBenefitService
      .getHeirDetailsOldApi(this.socialInsuranceNo, {} as HeirDetailsRequest, this.benefitType, 'false')
      .subscribe(
        res => {
          this.heirDetails = res;
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
  }

  getHeirAttorneyGuardianList(heir: DependentDetails) {
    this.getBankDetailsFromApi(heir.personId);
    this.getAttorneyList(heir.identity);
    if (heir.guardianPersonId) {
      this.manageBenefitService.getPersonDetailsWithPersonId(heir.guardianPersonId.toString()).subscribe(
        personalDetails => {
          this.guardianDetails = personalDetails;
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
    }
  }

  submitFuneralGrant() {
    // if (
    //   this.funeralGrantDc.addressAndConactForm &&
    //   !this.funeralGrantDc.addressAndConactForm.addressForm.getAddressValidity()
    // ) {
    // }
    if (this.applyFuneralGrantWizard.wizardItems[this.currentTab].label === BenefitConstants.BENEFIT_DETAILS) {
      this.nextForm(this.funeralGrantDetailsTab, this.applyFuneralGrantWizard);
    } else if (
      this.funeralGrantDc.addressAndConactForm &&
      !this.funeralGrantDc.addressAndConactForm.addressForm.getAddressValidity()
    ) {
      // this.benefitsForm.markAllAsTouched();
      return;
    } else if (this.benefitsForm.valid) {
      const formValues = this.benefitsForm.getRawValue();
      const funeralGrantSubmit: FuneralGrantSubmit = {
        requestDate: formValues.requestDate,
        lateRequestReason: formValues.funeralGrant?.lateRequestReason,
        beneficiaryDetails: null
      } as FuneralGrantSubmit;
      let beneficiaryDetails: DependentDetails = {} as DependentDetails;
      beneficiaryDetails.actionType = ActionType.ADD;
      // formValues.payeeForm.personId = formValues?.payeeForm?.personId ? formValues?.payeeForm?.personId : this.searchResult?.personId;
      // formValues.payeeForm.personId = formValues?.payeeForm?.personId ? formValues?.payeeForm?.personId : formValues?.selectedHeir;
      beneficiaryDetails = this.setValuesToObject(formValues.funeralGrant, beneficiaryDetails);
      beneficiaryDetails = this.setValuesToObject(formValues.payeeForm, beneficiaryDetails);
      if (formValues.payeeForm?.guardian) {
        beneficiaryDetails = this.setValuesToObject(formValues.payeeForm?.guardian, beneficiaryDetails);
      }
      if (this.contactForm.get('contactDetail')) {
        const contactDetails: ContactDetails = getContactDetails(this.contactForm);
        if (beneficiaryDetails.authorizedPersonId) {
          beneficiaryDetails['agentContactDetails'] = contactDetails;
        } else {
          beneficiaryDetails['contactDetail'] = contactDetails;
        }
      }
      if (beneficiaryDetails.beneficiaryType?.english === BenefitConstants.HEIR_BILINGUAL_TEXT.english) {
        const selectedHeir: DependentDetails[] = this.heirDetails.filter(
          eachHeir => eachHeir.personId === beneficiaryDetails.personId
        );
        beneficiaryDetails['heirStatus'] = selectedHeir[0]?.heirStatus;
        beneficiaryDetails['relationship'] = selectedHeir[0]?.relationship;
      }

      funeralGrantSubmit.beneficiaryDetails = beneficiaryDetails;
      //TODO: death date inside ben details or not?
      this.funeralBenefitService
        .checkIfEligible(
          this.socialInsuranceNo,
          this.benefitType,
          funeralGrantSubmit.requestDate,
          this.deathDate || beneficiaryDetails.eventDate
        )
        .subscribe(
          res => {
            this.notEligible = false;
            this.eligibilityApiResponse = res;
            if (res?.eligible) {
              if (this.benefitRequestId) {
                funeralGrantSubmit.referenceNo = this.referenceNo;
                this.funeralBenefitService
                  .updateFuneralGrant(this.benefitRequestId, this.socialInsuranceNo, funeralGrantSubmit)
                  .subscribe(
                    data => {
                      this.saveAndNextDisabled = true;
                      this.benefitPropertyService.setReferenceNo(data.referenceNo);
                      // this.referenceNo = res.referenceNo;
                      this.benefitDocumentService
                        .getReqDocs(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo)
                        .subscribe(
                          response => {
                            if (response?.length) {
                              this.requiredDocs = response;
                              this.wizardItems = this.wizardService.addWizardItem(
                                this.applyFuneralGrantWizard.wizardItems,
                                new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt')
                              );
                            }
                            this.getAnnuityCalculation(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
                            this.nextForm(this.funeralGrantDetailsTab, this.applyFuneralGrantWizard);
                            this.saveAndNextDisabled = false;
                          },
                          err => {
                            this.saveAndNextDisabled = false;
                            showErrorMessage(err, this.alertService);
                          }
                        );
                    },
                    err => {
                      this.saveAndNextDisabled = false;
                      showErrorMessage(err, this.alertService);
                    }
                  );
              } else {
                this.funeralBenefitService.applyFuneralGrant(this.socialInsuranceNo, funeralGrantSubmit).subscribe(
                  data => {
                    this.saveAndNextDisabled = true;
                    this.benefitRequestId = data.benefitRequestId;
                    this.referenceNo = data.referenceNo;
                    this.benefitPropertyService.setReferenceNo(data.referenceNo);
                    this.manageBenefitService.requestId = data.benefitRequestId;
                    this.benefitDocumentService
                      .getReqDocs(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo)
                      .subscribe(
                        response => {
                          if (response.length) {
                            this.requiredDocs = response;
                            this.wizardItems = this.wizardService.addWizardItem(
                              this.applyFuneralGrantWizard.wizardItems,
                              new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt')
                            );
                          }
                          this.getAnnuityCalculation(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
                          this.nextForm(this.funeralGrantDetailsTab, this.applyFuneralGrantWizard);
                          this.saveAndNextDisabled = false;
                        },
                        err => {
                          this.saveAndNextDisabled = false;
                          showErrorMessage(err, this.alertService);
                        }
                      );
                  },
                  err => {
                    this.saveAndNextDisabled = false;
                    showErrorMessage(err, this.alertService);
                  }
                );
              }
            } else {
              //TODO; show error msg with key
              this.notEligible = true;
              scrollToTop();
              // if (this.eligibilityApiResponse) {
              //   this.failedRules = this.eligibilityApiResponse.eligibilityRules.filter(eachRule => {
              //     return !eachRule.eligible;
              //   });
              //   this.passedRules = this.eligibilityApiResponse.eligibilityRules.filter(eachRule => {
              //     return eachRule.eligible;
              //   });
              // }
            }
          },
          err => {
            showErrorMessage(err, this.alertService);
          }
        );
    } else {
      this.benefitsForm.markAllAsTouched();
      scrollToTop();
    }
  }

  viewIneligibleDetails() {
    this.commonModalRef = showModal(this.modalService, this.inEligibleReason);
  }
  docUploadSuccess(event) {
    //TODO patch api
    this.alertService.clearAlerts();
    this.funeralBenefitService
      .submitFuneralGrant(this.benefitRequestId, this.socialInsuranceNo, event, this.referenceNo)
      .subscribe(
        data => {
          if (data) {
            this.benefitResponse = data;
            if (this.role && this.role === this.rolesEnum.VALIDATOR_1 && !this.routerData.draftRequest) {
              //save work flow and navigate to inbox
              this.saveWorkflowInEdit(event);
            } else {
              if (this.benefitResponse.message != null) {
                this.showSuccessMessage(this.benefitResponse.message);
              }
              this.benefitPropertyService.setReferenceNo(this.benefitResponse.referenceNo);
              this.nextForm(this.funeralGrantDetailsTab, this.applyFuneralGrantWizard);
            }
          }
        },
        err => {
          showErrorMessage(err, this.alertService);
          this.goToTop();
        }
      );
  }

  setValuesToObject(fromObject = {}, toObject) {
    Object.keys(fromObject).forEach(key => {
      if (fromObject[key]) {
        toObject[key] = fromObject[key];
      }
    });
    return { ...toObject };
  }
}
