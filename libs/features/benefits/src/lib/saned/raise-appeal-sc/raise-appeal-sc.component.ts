/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, AfterViewInit } from '@angular/core';
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
  BenefitValues
} from '../../shared';
import {
  WizardItem,
  LovList,
  Lov,
  convertToStringDDMMYYYY,
  GosiCalendar,
  BilingualText,
  SamaVerificationStatus,
  TransactionStatus
} from '@gosi-ui/core';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import moment from 'moment';

@Component({
  selector: 'bnt-raise-appeal-sc',
  templateUrl: './raise-appeal-sc.component.html',
  styleUrls: ['./raise-appeal-sc.component.scss']
})
export class RaiseAppealScComponent extends BenefitBaseScComponent implements OnInit, OnDestroy, AfterViewInit {
  wizardItems: WizardItem[];

  @ViewChild('appealTabs', { static: false })
  appealTabs: TabsetComponent;
  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;
  @ViewChild('confirmTransactionTemplate', { static: true })
  confirmTransactionTemplate: TemplateRef<HTMLElement>;
  @ViewChild('appealWizard', { static: false })
  appealWizard: ProgressWizardDcComponent;

  appealForm: FormGroup;
  eligiblePeriod$: Observable<LovList> = new Observable<LovList>(null);
  eligiblePeriods: EligiblePeriods[];
  reasonForAppeal$: Observable<LovList> = new Observable<LovList>(null);
  commonModalRef: BsModalRef;
  sanedDocTransactionId: string;
  activeBenefit: ActiveSanedAppeal;
  isValidator: boolean;
  systemRunDate: GosiCalendar;
  bankDetails;
  benefitCalculation: BenefitDetails;
  bankName: BilingualText;
  personDetails: PersonalInformation;
  annuityResponse = new AnnuityResponseDto();
  savedPayeType: BilingualText;
  savedPayMethod: BilingualText;
  payeeForm: FormGroup;
  uibenefits: Benefits;
  ibanBankAccountNo;
  requestDate: Date;
  ngOnInit(): void {
    super.ngOnInit();
    this.isAppPrivate
      ? (this.transactionType = UITransactionType.FO_REQUEST_SANED)
      : (this.transactionType = UITransactionType.GOL_REQUEST_SANED);
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.manageBenefitService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
      // this.getCalculationDetails(res);
    });
    this.wizardItems = this.sanedBenefitService.getAppealWizardItems();
    this.socialInsuranceNo = this.isIndividualApp ? this.authTokenService.getIndividual() : this.contributorService.selectedSIN;
    this.appealForm = this.fb.group({});
    this.appealForm.addControl('appealDetails', this.getForm());
    this.initializeForm();
    this.initVariables();
    this.sanedDocTransactionId = BenefitConstants.TRANSACTIONID_RAISE_APPEAL;
    this.reasonForAppeal$ = this.lookUpService.getAppealReasonList();
    this.selectedWizard(0);
    if (this.routerData.idParams.get(UIPayloadKeyEnum.ID))
      this.benefitRequestId = this.routerData.idParams.get(UIPayloadKeyEnum.ID);
  }
  onConfirm(date: GosiCalendar) {
    if (date) {
      this.requestDate = date.gregorian;
      this.getUIBenefits();
      this.getCalculationDetails(date);
    }
  }
  getUIBenefits() {
    this.uiBenefitService
      .getUIBenefits(this.socialInsuranceNo, moment(this.requestDate, 'YYYY-MM-DD').format('YYYY-MM-DD'))
      .subscribe(data => {
        this.uibenefits = data;
        this.benefitType = data.benefitType.english;
        this.eligiblePeriod$ = this.getEligiblePeriod(data);
        this.getBankDetails();
        if (this.routerData && this.routerData.assignedRole) {
          this.isValidator = true;
          this.activeBenefit = this.uiBenefitService.getActiveSanedAppeal();
          this.benefitPropertyService.setAnnuityStatus(BenefitConstants.VAL_EDIT_BENEFIT);
          this.benefitRequestId = +this.routerData.idParams.get(UIPayloadKeyEnum.ID);
          this.socialInsuranceNo = +this.routerData.idParams.get(UIPayloadKeyEnum.SIN);
          this.sanedBenefitService
            .getBenefitRequestDetails(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo)
            .subscribe(
              res => {
                this.activeBenefit.appealDetails = {
                  eligiblePeriod: res.selectedEligiblePeriod ? getEligiblePeriodLov(res.selectedEligiblePeriod) : null,
                  reasonForAppeal: res.appealReason,
                  otherReason: res.reasonDescription
                };
                //prefill forms
                // this.benefitRequestId = this.activeBenefit.benefitRequestId;
                this.appealForm = this.fb.group({});
                this.eligiblePeriod$.subscribe(resp => {
                  resp.items.forEach((each, index) => {
                    if (each.value.english === this.activeBenefit.appealDetails.eligiblePeriod.english) {
                      this.activeBenefit.appealDetails.periodSelected = index;
                    }
                  });
                });
                this.appealForm.addControl('appealDetails', this.getForm());
                this.appealForm.get('appealDetails').patchValue(this.activeBenefit.appealDetails);
                // this.appealForm.addControl('bankDetails', new FormControl(this.activeBenefit.bankDetails));
                if (res.requestDate) this.appealForm.addControl('requestDate', new FormControl(res.requestDate));
              },
              err => {
                showErrorMessage(err, this.alertService);
              }
            );

          // this.sin = this.socialInsuranceNo;
          this.referenceNo = +this.routerData.idParams.get(UIPayloadKeyEnum.REFERENCE_NO);
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

  ngAfterViewInit() {}

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
      uiPayload.requestDate = { gregorian: this.requestDate };
      if (this.activeBenefit) {
        uiPayload.referenceNo = this.activeBenefit.referenceNo;
        this.sanedBenefitService
          .updateBenefit(this.socialInsuranceNo, this.activeBenefit.benefitRequestId, uiPayload)
          .subscribe(
            data => {
              if (data) {
                // this.benefitRequestId = data.benefitRequestId;
                // this.referenceNo = data.referenceNo;
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
                        this.nextForm(this.appealTabs, this.appealWizard);
                      },
                      err => {
                        submitError(err, this.alertService);
                      }
                    );
                } else {
                  this.nextForm(this.appealTabs, this.appealWizard);
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
                      this.nextForm(this.appealTabs, this.appealWizard);
                    },
                    err => {
                      submitError(err, this.alertService);
                    }
                  );
              } else {
                this.nextForm(this.appealTabs, this.appealWizard);
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
          if (this.routerData?.assignedRole === this.rolesEnum.VALIDATOR_1) {
            //save work flow and navigate to inbox
            this.saveWorkflowInEdit(comment);
          } else {
            const navigateToPage = [`home/profile/individual/internal/${this.socialInsuranceNo}/benefits`];
            this.nextForm(this.appealTabs, this.appealWizard, null, navigateToPage);
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

  /** Method to fetch bank details of a person*/
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
  //   //if(this.annuityResponse?.bankAccount) this.setBankDetails(this.annuityResponse?.bankAccount);
  //   this.getPersonDetailsWithPersonId(Number(this.getPersonId()));
  // }
  // CLM BANK API INTEGRATION CHANGED
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
  getCalculationDetails(requestDate: GosiCalendar) {
    this.sanedBenefitService.getBenefitCalculationsForSaned(this.socialInsuranceNo, requestDate).subscribe(resp => {
      this.benefitCalculation = resp;
      this.benefitCalculation.isReopen = this.isReopenCase;
      if (this.benefitCalculation.remainingMonths) {
        this.benefitCalculation.remainingMonths.noOfMonths = this.benefitCalculation.availedMonths + 1;
        if (this.benefitCalculation.initialMonths) {
          this.benefitCalculation.remainingMonths.noOfMonths += this.benefitCalculation.initialMonths.noOfMonths;
        }
      }
    });
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
  initializeForm() {
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
  ngOnDestroy() {
    this.clearAllAlerts();
  }
}
