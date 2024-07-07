import { Directive, OnInit, ViewChild, TemplateRef, OnDestroy, AfterViewInit } from '@angular/core';
import {
  BenefitBaseScComponent,
  clearAlerts,
  showModal,
  submitError,
  BenefitConstants,
  UITransactionType,
  showErrorMessage,
  Benefits,
  UiApply,
  PatchPersonBankDetails,
  EligiblePeriods,
  UIPayloadKeyEnum,
  BenefitType,
  getServiceType,
  PersonBankDetails,
  PersonConstants,
  deepCopy,
  ActiveSanedAppeal,
  getEligiblePeriodLov,
  BenefitDetails,
  PersonalInformation,
  AnnuityResponseDto,
  BenefitValues,
  UnemploymentResponseDto,
  BankAccountList
} from '../../shared';
import {
  WizardItem,
  LovList,
  Lov,
  convertToStringDDMMYYYY,
  GosiCalendar,
  BilingualText,
  SamaVerificationStatus,
  TransactionStatus,
  Channel
} from '@gosi-ui/core';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import moment from 'moment';

@Directive()
export abstract class SubmitSanedHelperComponent extends BenefitBaseScComponent {
  wizardItems: WizardItem[];

  @ViewChild('appealTabs', { static: false })
  appealTabs: TabsetComponent;
  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;
  @ViewChild('confirmTransactionTemplate', { static: true })
  confirmTransactionTemplate: TemplateRef<HTMLElement>;
  @ViewChild('appealWizard', { static: false })
  appealWizard: ProgressWizardDcComponent;
  @ViewChild('submitRequestTabs', { static: false })
  submitRequestTabs: TabsetComponent;
  @ViewChild('submitRequestWizard', { static: false })
  submitRequestWizard: ProgressWizardDcComponent;

  appealForm: FormGroup;
  eligiblePeriod$: Observable<LovList> = new Observable<LovList>(null);
  eligiblePeriods: EligiblePeriods[];
  reasonForAppeal$: Observable<LovList> = new Observable<LovList>(null);
  commonModalRef: BsModalRef;
  sanedAppealDocTransactionId: string;
  activeBenefit: ActiveSanedAppeal;
  isValidator: boolean;
  systemRunDate: GosiCalendar;
  bankDetails;
  benefitCalculation: BenefitDetails;
  bankName: BilingualText;
  draftRequest: boolean;
  personDetails: PersonalInformation;
  annuityResponse = new AnnuityResponseDto();
  savedPayeType: BilingualText;
  savedPayMethod: BilingualText;
  payeeForm: FormGroup;
  uibenefits: Benefits;
  ibanBankAccountNo;
  requestDate: GosiCalendar;
  unemploymentDto: UnemploymentResponseDto;
  appealLateRequest = false;
  eligibleForPensionReform: boolean;

  initialiseAppeal() {
    this.isAppPrivate
      ? (this.transactionType = UITransactionType.FO_REQUEST_SANED)
      : (this.transactionType = UITransactionType.GOL_REQUEST_SANED);
    if (this.routerData?.payload) {
      const payload = JSON.parse(this.routerData?.payload);
      this.appealLateRequest = payload?.appealLateRequest;
      if (payload?.channel === Channel.TAMINATY) {
        this.transactionType = UITransactionType.GOL_REQUEST_SANED;
      }
    }

    this.language.subscribe(language => {
      this.lang = language;
    });
    this.manageBenefitService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
    });
    this.wizardItems = this.sanedBenefitService.getAppealWizardItems();
    if (this.contributorService.selectedSIN) this.socialInsuranceNo = this.contributorService.selectedSIN;
    this.appealForm = this.fb.group({});
    this.appealForm.addControl('appealDetails', this.getForm());
    // this.appealForm.addControl(
    //   'otherReason',
    //   new FormControl('', { validators: Validators.required, updateOn: 'blur' })
    // );
    this.initializeAppealForm();
    this.sanedAppealDocTransactionId = BenefitConstants.TRANSACTIONID_RAISE_APPEAL;
    this.reasonForAppeal$ = this.lookUpService.getAppealReasonList();
    this.selectedWizard(0);
    if (this.routerData.idParams.get(UIPayloadKeyEnum.ID))
      this.benefitRequestId = this.routerData.idParams.get(UIPayloadKeyEnum.ID);
  }

  onAppealConfirm(date: GosiCalendar) {
    if (date) {
      this.requestDate = date;
      this.getUIAppealBenefits();
      this.getCalculationDetails(date);
    }
  }

  getUIAppealBenefits() {
    this.uiBenefitService
      .getUIBenefits(
        this.socialInsuranceNo,
        moment(this.requestDate.gregorian, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        this.isReopenCase
      )
      .subscribe(data => {
        this.uibenefits = data;
        if (data?.warningMessages && data?.warningMessages.length > 0) {
          this.alertService.showWarning(data.warningMessages[0]);
        }
        this.benefitType = data.benefitType.english;
        this.eligiblePeriod$ = this.getEligiblePeriod(data);
        this.getBankDetails();
        if (this.routerData && this.routerData.assignedRole) {
          this.isValidator = true;
          this.activeBenefit = this.uiBenefitService.getActiveSanedAppeal();
          this.benefitPropertyService.setAnnuityStatus(BenefitConstants.VAL_EDIT_BENEFIT);
          this.benefitRequestId = +this.routerData.idParams.get(UIPayloadKeyEnum.ID);
          this.socialInsuranceNo = +this.routerData.idParams.get(UIPayloadKeyEnum.SIN);
          this.appealForm = this.fb.group({ appealDetails: this.getForm() });
          this.sanedBenefitService
            .getBenefitRequestDetails(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo)
            .subscribe(
              res => {
                if (res.requestDate) this.appealForm.addControl('requestDate', new FormControl(res.requestDate));
                if (this.activeBenefit && this.activeBenefit.appealDetails) {
                  this.activeBenefit.appealDetails = {
                    eligiblePeriod: res.selectedEligiblePeriod
                      ? getEligiblePeriodLov(res.selectedEligiblePeriod)
                      : null,
                    reasonForAppeal: res.appealReason,
                    otherReason: res.reasonDescription
                  };
                  //prefill forms
                  // this.benefitRequestId = this.activeBenefit.benefitRequestId;
                  this.eligiblePeriod$.subscribe(resp => {
                    resp.items.forEach((each, index) => {
                      if (each?.value?.english === this.activeBenefit?.appealDetails?.eligiblePeriod?.english) {
                        this.activeBenefit.appealDetails.periodSelected = index;
                      }
                    });
                  });

                  this.appealForm.get('appealDetails').patchValue(this.activeBenefit.appealDetails);
                  if (this.appealForm.get('appealDetails.otherReason')) {
                    this.appealForm.get('appealDetails.otherReason').patchValue(res.reasonDescription);
                  } else {
                    (this.appealForm.get('appealDetails') as FormGroup).addControl(
                      'otherReason',
                      new FormControl(res?.reasonDescription ? res?.reasonDescription : '')
                    );
                  }

                  if (this.appealForm.get('appealDetails').get('reasonForAppeal').get('english').value === 'Other') {
                    this.appealForm.get('appealDetails').get('otherReason').setValidators([Validators.required]);
                    this.appealForm.get('appealDetails').updateValueAndValidity();
                  }
                }
              },
              err => {
                showErrorMessage(err, this.alertService);
              }
            );

          // this.sin = this.socialInsuranceNo;
          this.referenceNo = +this.routerData.idParams.get(UIPayloadKeyEnum.REFERENCE_NO);
        }
        if (this.uibenefits?.eligible) {
          this.getCalculationDetails(this.requestDate);
        }
      });
  }

  getForm(): FormGroup {
    return this.fb.group({
      eligiblePeriod: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      reasonForAppeal: this.fb.group({
        english: [null, { validators: Validators.required, updateOn: 'blur' }],
        arabic: [null]
      }),
      periodSelected: null //To get the id of eligibleperiod selected here
    });
  }

  getEligiblePeriod(uiEligibility: Benefits): Observable<LovList> {
    const lovItems: Lov[] = [];
    if (uiEligibility.eligiblePeriods) {
      this.eligiblePeriods = uiEligibility.eligiblePeriods;
      uiEligibility.eligiblePeriods.forEach((periods, index) => {
        if (periods.startDate && periods.endDate) {
          lovItems.push({
            value: {
              english: `${convertToStringDDMMYYYY(moment(periods.startDate.gregorian).toString())}
                  → ${convertToStringDDMMYYYY(moment(periods.endDate.gregorian).toString())} `,
              arabic: `${convertToStringDDMMYYYY(moment(periods.startDate.gregorian).toString())}
                  ← ${convertToStringDDMMYYYY(moment(periods.endDate.gregorian).toString())} `
            },
            code: index,
            sequence: index
          });
        } else if (periods.startDate) {
          lovItems.push({
            value: {
              english: `${convertToStringDDMMYYYY(moment(periods.startDate.gregorian).toString())}
                    → onwards `,
              arabic: `${convertToStringDDMMYYYY(moment(periods.startDate.gregorian).toString())}
                    ← حتى الآن `
            },
            code: index,
            sequence: index
          });
        }
      });
    }
    const lovValues = new BehaviorSubject(new LovList(lovItems));
    return lovValues.asObservable();
  }

  /** Method to handle cancellation of transaction. */
  cancelTransaction() {
    clearAlerts(this.alertService, this.showOtpError);
    this.commonModalRef = showModal(
      this.modalService,
      (!this.benefitRequestId && !this.routerData?.draftRequest) || this.routerData?.assigneeId
        ? this.confirmTemplate
        : this.confirmTransactionTemplate
    );
  }

  onKeepDraft() {
    this.location.back();
    this.hideModal();
  }

  onDiscard() {
    this.uiBenefitService.deleteTransaction(this.socialInsuranceNo, this.benefitRequestId).subscribe(() => {
      this.hideModal();
      this.location.back();
    });
  }

  /*
   * This method is to select wizard
   */
  selectedWizard(index: number) {
    this.selectWizard(index, this.appealTabs, this.wizardItems);
  }

  confirm() {
    clearAlerts(this.alertService, this.showOtpError);
    this.commonModalRef.hide();
    this.routeBack();
  }

  decline() {
    this.commonModalRef.hide();
  }

  saveAndNext() {
    this.appealForm.markAllAsTouched();
    if (this.appealForm.valid) {
      //TODO: post payload
      const uiPayload: UiApply = new UiApply();
      if (
        this.payeeForm.get('payeeForm').get('bankAccount') &&
        this.payeeForm.get('payeeForm').get('bankAccount.ibanBankAccountNo') &&
        this.payeeForm.get('payeeForm').get('bankAccount.ibanBankAccountNo').value
      ) {
        const savedBankDetails = new PatchPersonBankDetails();
        savedBankDetails.bankCode = this.payeeForm.get('payeeForm').get('bankAccount.bankCode').value;
        savedBankDetails.bankName = this.payeeForm.get('payeeForm').get('bankAccount.bankName').value;
        savedBankDetails.ibanBankAccountNo = this.payeeForm.get('payeeForm').get('bankAccount.ibanBankAccountNo').value;
        savedBankDetails.isNewlyAdded = this.payeeForm.get('payeeForm').get('bankAccount.bankType')
          ? this.payeeForm.get('payeeForm').get('bankAccount.bankType').value === 'addNewIBAN'
          : false;
        uiPayload.bankAccount = savedBankDetails;
      }
      if (this.appealForm.get('appealDetails')) {
        // uiPayload.eligiblePeriod =
        //   this.appealForm.get('appealDetails.periodSelected') && this.eligiblePeriods.length
        //     ? this.eligiblePeriods[this.appealForm.get('appealDetails.periodSelected').value]
        //     : null;
        uiPayload.eligiblePeriod = {
          startDate: { gregorian: new Date(this.benefitCalculation.uiEligibilityPeriods.periodStartDate) },
          endDate: { gregorian: new Date(this.benefitCalculation.uiEligibilityPeriods.periodStopDate) }
        };
        uiPayload.appealReason = this.appealForm.get('appealDetails.reasonForAppeal').value;
        uiPayload.reasonDescription = this.appealForm.get('appealDetails.otherReason')
          ? this.appealForm.get('appealDetails.otherReason').value
          : null;
      }
      // uiPayload.requestDate.gregorian = convertToStringDDMMYYYY(moment().toString());
      uiPayload.requestDate = this.requestDate;
      if (this.activeBenefit) {
        uiPayload.referenceNo = this.activeBenefit.referenceNo;
        this.sanedBenefitService
          .updateBenefit(
            this.socialInsuranceNo,
            this.activeBenefit.benefitRequestId || this.benefitRequestId,
            uiPayload
          )
          .subscribe(
            data => {
              if (data) {
                // this.benefitRequestId = data.benefitRequestId;
                // this.referenceNo = data.referenceNo;
                if (this.isIndividualApp) {
                  const comment = { comments: null };
                  this.setSuccessNavigation(data, comment);
                } else {
                  if (this.wizardService.isWizardItemAvailable(BenefitConstants.UI_DOCUMENTS, this.wizardItems)) {
                    this.documentService
                      .getDocuments(
                        UITransactionType.APPEAL_UNEMPLOYMENT_INSURANCE,
                        this.transactionType,
                        this.benefitRequestId,
                        this.referenceNo
                      )
                      .subscribe(
                        res => {
                          this.requiredDocs = res;
                          // this.nextForm(this.appealTabs, this.appealWizard);
                          this.nextForm(this.submitRequestTabs, this.submitRequestWizard);
                        },
                        err => {
                          submitError(err, this.alertService);
                        }
                      );
                  } else {
                    //   this.nextForm(this.appealTabs, this.appealWizard);
                    this.nextForm(this.submitRequestTabs, this.submitRequestWizard);
                  }
                }
              }
            },
            err => {
              submitError(err, this.alertService);
            }
          );
      } else {
        this.sanedBenefitService.applySanedBenefit(this.socialInsuranceNo, uiPayload).subscribe(
          data => {
            if (data) {
              this.benefitRequestId = data.benefitRequestId;
              this.referenceNo = data.referenceNo;
              if (this.isIndividualApp) {
                const comment = { comments: null };
                this.setSuccessNavigation(data, comment);
              } else {
                if (this.wizardService.isWizardItemAvailable(BenefitConstants.UI_DOCUMENTS, this.wizardItems)) {
                  this.documentService
                    .getDocuments(
                      UITransactionType.APPEAL_UNEMPLOYMENT_INSURANCE,
                      this.transactionType,
                      this.benefitRequestId,
                      this.referenceNo
                    )
                    .subscribe(
                      res => {
                        this.requiredDocs = res;
                        //   this.nextForm(this.appealTabs, this.appealWizard);
                        this.nextForm(this.submitRequestTabs, this.submitRequestWizard);
                      },
                      err => {
                        submitError(err, this.alertService);
                      }
                    );
                } else {
                  // this.nextForm(this.appealTabs, this.appealWizard);
                  this.nextForm(this.submitRequestTabs, this.submitRequestWizard);
                }
              }
            }
          },
          err => {
            submitError(err, this.alertService);
          }
        );
      }
    } //TODO: show bank validation
  }

  setSuccessNavigation(data, comment) {
    if (
      this.routerData?.assignedRole === this.rolesEnum.VALIDATOR_1 ||
      this.routerData?.assignedRole === this.rolesEnum.CUSTOMER_SERVICE_REPRESENTATIVE ||
      this.routerData?.assignedRole === 'Contributor'
    ) {
      //save work flow and navigate to inbox
      this.saveWorkflowInEdit(comment);
    } else {
      const navigateToPage = [`/home/benefits/individual`];
      this.nextForm(this.submitRequestTabs, this.submitRequestWizard, null, navigateToPage);
      if (data.message != null) {
        this.showSuccessMessage(data.message);
        this.coreBenefitService.setBenefitAppliedMessage(data.message);
      }
    }
  }

  showErrorMessages($event) {
    showErrorMessage($event, this.alertService);
  }

  /** Method to show success message and patch benefit with comments. */
  docUploadSuccess(comment: { comments: string }) {
    this.alertService.clearAlerts();
    this.sanedBenefitService
      .patchBenefit(this.socialInsuranceNo, this.benefitRequestId, comment, this.referenceNo)
      .subscribe(
        data => {
          if (
            this.routerData?.assignedRole &&
            (this.routerData?.assignedRole === this.rolesEnum.VALIDATOR_1 ||
              this.routerData?.assignedRole === this.rolesEnum.CUSTOMER_SERVICE_REPRESENTATIVE ||
              this.routerData?.assignedRole === 'Contributor') &&
            !this.routerData.draftRequest
          ) {
            //save work flow and navigate to inbox
            this.saveWorkflowInEdit(comment);
          } else {
            const navigateToPage = [`home/profile/individual/internal/${this.socialInsuranceNo}/benefits`];
            // this.nextForm(this.appealTabs, this.appealWizard, null, navigateToPage);
            this.nextForm(this.submitRequestTabs, this.submitRequestWizard, null, navigateToPage);
            if (data.message != null) {
              this.showSuccessMessage(data.message);
              this.coreBenefitService.setBenefitAppliedMessage(data.message);
            }
          }
        },
        err => {
          submitError(err, this.alertService);
          this.goToTop();
        }
      );
  }

  previousForm() {
    this.goToPreviousForm(this.appealTabs, this.appealWizard);
  }

  getBankDetails(personId = null, bankAccount?: PersonBankDetails) {
    // this.bankDetails = new PersonBankDetails();
    const contrId = this.getPersonId();
    if (personId && personId !== contrId) {
      this.authPersonId = +personId;
    } else {
      this.authPersonId = null;
    }
    let identifier;
    if (personId?.listOfPersons && personId?.listOfPersons[0]?.personId) {
      identifier = personId?.listOfPersons[0]?.personId;
    } else if (personId) {
      identifier = personId;
    } else {
      identifier = contrId;
    }
    this.bankService.getBankAccountList(+identifier, null, null).subscribe(res => {
      const bankList = res || new BankAccountList();
      if (bankAccount) {
        const duplicate = bankList?.bankAccountList.findIndex(
          item => item.ibanBankAccountNo === bankAccount.ibanBankAccountNo
        );
        if (duplicate >= 0) {
          bankList.bankAccountList[duplicate].savedAccount = true;
        } else {
          bankAccount.savedAccount = true;
          bankList?.bankAccountList.push(bankAccount);
        }
      } else if (this.unemploymentDto?.bankAccount?.ibanBankAccountNo) {
        const duplicate = bankList?.bankAccountList.findIndex(
          item => item.ibanBankAccountNo === this.unemploymentDto.bankAccount.ibanBankAccountNo
        );
        if (duplicate >= 0) {
          bankList.bankAccountList[duplicate].savedAccount = true;
        } else {
          this.unemploymentDto.bankAccount.savedAccount = true;
          bankList?.bankAccountList.push(this.unemploymentDto.bankAccount);
        }
      }
      // bankList.bankAccountList = bankList.bankAccountList.filter((item, index, self) => self.indexOf(item) === index);
      this.bankAccountList = deepCopy(bankList);
    });
  }

  // /** Method to fetch bank details of a person*/
  // getBankDetails(personId?: string, isModifyBenefit?: boolean, isUI?: boolean) {
  //   // this.bankDetails = new PersonBankDetails();
  //   const contrId = this.getPersonId();
  //   if (personId && personId !== contrId) {
  //     this.authPersonId = +personId;
  //   } else {
  //     this.authPersonId = null;
  //   }
  //   const id = personId ? personId : contrId;
  //   if (isUI) {
  //     this.benefitType = BenefitType.ui;
  //   }
  //   const serviceType = this.benefitType ? getServiceType(this.benefitType) : null;
  //   // CLM BANK API INTEGRATION CHANGED
  //   this.bankService.getSanedBankDetails(+id, this.referenceNo, serviceType, isModifyBenefit).subscribe(bankRes => {
  //     if (bankRes) this.setBankDetails(bankRes);
  //   });
  //   // CLM BANK API INTEGRATION CHANGED
  //   this.getPersonDetailsWithPersonId(Number(this.getPersonId()));
  // }
  // // CLM BANK API INTEGRATION CHANGED
  // setBankDetails(bankRes: PersonBankDetails[] = [new PersonBankDetails()]) {
  //   // setBankDetails(bankRes: PersonBankDetails) {
  //   const verifiedBankDetails: PersonBankDetails = bankRes[0].verificationStatus === SamaVerificationStatus.VERIFIED ? bankRes[0] : null;
  //   if(verifiedBankDetails)
  //   this.bankDetails = deepCopy(verifiedBankDetails);
  //   if(this.bankDetails && this.bankDetails.ibanBankAccountNo){
  //   if (this.bankDetails.isNonSaudiIBAN === false) {
  //     if (this.bankDetails.approvalStatus === PersonConstants.SAUDI_IBAN_VERIFICATION_STATUS) {
  //       this.bankDetails.isIbanVerified = false;
  //     }
  //     if (this.bankDetails.ibanBankAccountNo !== null) {
  //       this.getBank(this.bankDetails.ibanBankAccountNo.slice(4, 6));
  //     }
  //   } else {
  //     if (this.bankDetails.approvalStatus === PersonConstants.NONSAUDI_IBAN_VERIFICATION_STATUS) {
  //       this.bankDetails.isIbanVerified = false;
  //     }
  //   }
  //  } else if(this.sanedBenefitService.getStatus() === TransactionStatus.DRAFT || this.referenceNo) {
  //   this.ibanBankAccountNo = bankRes[0].ibanBankAccountNo;
  //   this.bankName = bankRes[0].bankName;
  //   if(this.payeeForm &&  this.payeeForm.get('payeeForm') && this.payeeForm.get('payeeForm').get('bankAccount')) {
  //   this.payeeForm.get('payeeForm.bankAccount.bankCode').setValue(bankRes[0].bankCode);
  //   this.payeeForm.get('payeeForm.bankAccount.ibanBankAccountNo').setValue(this.ibanBankAccountNo);
  //   this.payeeForm.get('payeeForm.bankAccount.isNewlyAdded').setValue(true);
  //   }
  // }
  // }
  // requestDate not required in individualApp
  getCalculationDetails(requestDate?: GosiCalendar) {
    this.sanedBenefitService.getBenefitCalculationsForSaned(this.socialInsuranceNo, requestDate).subscribe(
      resp => {
        this.benefitCalculation = resp;
        this.benefitCalculation.isReopen = this.isReopenCase;
        if (this.benefitCalculation.remainingMonths) {
          this.benefitCalculation.remainingMonths.noOfMonths = this.benefitCalculation.availedMonths + 1;
          if (this.benefitCalculation.initialMonths) {
            this.benefitCalculation.remainingMonths.noOfMonths += this.benefitCalculation.initialMonths.noOfMonths;
          }
        }
      },
      err => showErrorMessage(err, this.alertService)
    );
  }

  /** Method to Clear success message*/
  clearSuccessMessage() {
    this.saveApiResp = null;
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

  getPersonDetailsWithPersonId(personId: number) {
    this.manageBenefitService.getPersonDetailsWithPersonId(personId.toString()).subscribe(res => {
      this.personDetails = res;
    });
  }

  /*
   * This method is to create payee form
   */
  createPayeeForm() {
    return this.fb.group({
      payeeType: this.fb.group({
        english: [BenefitValues.contributor, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      paymentMode: this.fb.group({
        english: [BenefitValues.BANK, { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      authorizedPersonId: [null],
      personId: [null],
      authorizationDetailsId: [''],
      guardianSource: [null]
    });
  }

  initializeAppealForm() {
    if (!this.payeeForm) {
      this.payeeForm = this.createPayeeForm();
      if (this.appealForm) {
        if (this.appealForm.get('payeeForm')) this.appealForm.removeControl('payeeForm');
        this.appealForm.addControl('payeeForm', this.payeeForm);
      }
    }
  }

  clearAllAlerts() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }
}
