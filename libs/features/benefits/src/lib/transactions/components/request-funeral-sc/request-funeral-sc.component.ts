/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  checkIqamaOrBorderOrPassport,
  CommonIdentity,
  CoreAdjustmentService,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LookupService,
  LovList,
  Name,
  RouterData,
  RouterDataToken,
  Transaction,
  TransactionService
} from '@gosi-ui/core';
import { SystemParameter } from '@gosi-ui/features/contributor';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AnnuityResponseDto,
  BankService,
  BeneficiaryBenefitDetails,
  BenefitDocumentService,
  BenefitType,
  BenefitValues,
  createDetailForm,
  DependentService,
  FuneralBenefitService,
  HeirBenefitService,
  isDocumentsValid,
  isHeirBenefit,
  ManageBenefitService,
  PersonalInformation,
  UIPayloadKeyEnum,
  UITransactionType,
  SanedBenefitService,
  UiBenefitsService,
  BenefitPropertyService
} from '../../../shared';
import { FuneralGrantBeneficiaryResponse } from '../../../shared/models/funeral-grant-beneficiary-response';
import { TransactionBaseScComponent } from '../../base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'bnt-txn-request-funeral-sc',
  templateUrl: './request-funeral-sc.component.html',
  styleUrls: ['./request-funeral-sc.component.scss']
})
export class RequestFuneralScComponent extends TransactionBaseScComponent implements OnInit {
  transaction: Transaction;
  referenceNumber: number;
  transactionId: number;
  funeralGrantHeirDetails: BeneficiaryBenefitDetails;
  contributorDetails: AnnuityResponseDto;
  sin: number;
  benefitRequestId: number;
  benefitAmount: number;
  identity: CommonIdentity | null;
  heirArabicName: string;
  businessId: number;
  transactionKey: string;
  transactionType: string;
  personalDetails: PersonalInformation;
  funeralBeneficiaryDetails: FuneralGrantBeneficiaryResponse;
  reqList: DocumentItem[];
  requestId: number;
  isDoctor = false;
  funeralGrantForm: FormGroup;
  listYesNo$: Observable<LovList>;
  systemParameter: SystemParameter;
  isIndividualApp: boolean;

  constructor(
    readonly documentService: DocumentService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly transactionService: TransactionService,
    readonly manageBenefitService: ManageBenefitService,
    readonly dependentService: DependentService,
    readonly alertService: AlertService,
    readonly bankService: BankService,
    readonly lookUpService: LookupService,
    readonly heirBenefitService: HeirBenefitService,
    readonly funeralBenefitService: FuneralBenefitService,
    readonly fb: FormBuilder,
    readonly modalService: BsModalService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly uiBenefitService: UiBenefitsService,
    readonly router: Router,
    readonly authTokenService: AuthTokenService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly benefitPropertyService: BenefitPropertyService,
    readonly ohService: OhService
  ) {
    super(
      documentService,
      manageBenefitService,
      dependentService,
      alertService,
      bankService,
      lookUpService,
      heirBenefitService,
      adjustmentService,
      sanedBenefitService,
      uiBenefitService,
      modalService,
      router,
      fb,
      routerData,
      benefitPropertyService,
      ohService
    );
  }

  ngOnInit(): void {
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    this.requestType = BenefitType.funeralGrant;
    this.transaction = this.transactionService.getTransactionDetails();
    this.isHeirBenefit = true;
    this.listYesNo$ = this.lookUpService.getYesOrNoList();
    this.funeralGrantForm = createDetailForm(this.fb);
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.transaction = this.transactionService.getTransactionDetails();
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.sin = this.transaction.params.SIN;
      this.benefitRequestId = this.transaction.params.BENEFIT_REQUEST_ID;
      this.businessId = this.transaction.params.BUSINESS_ID;
      this.requestId = +this.routerData.idParams.get(UIPayloadKeyEnum.ID);
      this.transactionKey = 'REQ_FUNERAL_GRANT';
      this.isDoctor = this.routerData.assignedRole === 'Doctor';
      this.setParams(this.sin, this.benefitRequestId, this.referenceNumber);
      if (this.sin && this.benefitRequestId && this.referenceNumber) {
        this.getAnnuityBenefitDetails(this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin, this.benefitRequestId, this.referenceNumber);
        this.getBeneficiaryDetails(this.sin, this.benefitRequestId, this.referenceNumber);
        this.fetchDocuments();
        this.getAnnuityCalculation(this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin, this.benefitRequestId, this.referenceNumber);
      }
      this.manageBenefitService
        .getAnnuityBenefitRequestDetail(this.sin, this.benefitRequestId, this.referenceNumber)
        .subscribe(res => {
          this.contributorDetails = res;
          this.benefitAmount = this.contributorDetails.benefitAmount;
        });
      this.manageBenefitService
        .getAnnuityBenefitBeneficiaryRequestDetail(this.sin, this.benefitRequestId, this.referenceNumber)
        .subscribe(res => {
          this.funeralGrantHeirDetails = res;
          this.identity = checkIqamaOrBorderOrPassport(this.funeralGrantHeirDetails?.beneficiaryDetails?.identity);
          this.heirArabicName = this.getArabicFullName(this.funeralGrantHeirDetails.beneficiaryDetails.name);
        });
    }
  }
  getDocuments(transactionKey: string, transactionType: string, benefitRequestId: number, referenceNo: number) {
    this.benefitDocumentService
      .getValidatorDocuments(this.sin, this.benefitRequestId, referenceNo, transactionKey, transactionType)
      .subscribe(res => {
        this.reqList = res;
        if (isDocumentsValid(this.reqList)) {
          this.documents = this.reqList;
        }
      });
  }
  fetchDocuments() {
    this.transactionKey = UITransactionType.REQUEST_FUNERAL_GRANT;
    this.transactionType = UITransactionType.FO_REQUEST_SANED;
    this.getDocuments(this.transactionKey, this.transactionType, this.requestId, this.referenceNumber);
  }
  // fetch heir details
  getHeirDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    this.heirBenefitService
      .getHeirForValidatorScreen(sin, benefitRequestId?.toString(), referenceNo, this.benefitType, null)
      .subscribe(res => {
        this.dependentDetails = res;
        this.dependentService.setDependents(this.dependentDetails);
      });
  }
  //Method to fetch the annuity request details  /
  getAnnuityBenefitDetails(socialInsuranceNo: number, benefitrequestId: number, referenceNo: number) {
    this.manageBenefitService
      .getAnnuityBenefitRequestDetail(socialInsuranceNo, benefitrequestId, referenceNo)
      .subscribe(
        res => {
          if (res) {
            const isModifyBenefit = false;
            this.annuityBenefitDetails = res;

            this.benefitType = this.annuityBenefitDetails.benefitType.english;
            this.isHeirBenefit = isHeirBenefit(this.benefitType);

            this.dependentService.setDependents([]);
            if (this.annuityBenefitDetails.heirBenefitReason) {
              this.dependentService.setReasonForBenefit(null, null, null);
              if (this.annuityBenefitDetails.deathDate) {
                this.dependentService.setReasonForBenefit(
                  this.annuityBenefitDetails.deathDate,
                  null,
                  this.annuityBenefitDetails.heirBenefitReason
                );
              } else {
                this.dependentService.setReasonForBenefit(
                  null,
                  this.annuityBenefitDetails.missingDate,
                  this.annuityBenefitDetails.heirBenefitReason
                );
              }
            }
            this.personNameEnglish = this.annuityBenefitDetails.contributorName.english;
            this.personNameArabic = this.annuityBenefitDetails.contributorName.arabic;
            this.requestDate = this.annuityBenefitDetails.requestDate;
            this.notificationDate = this.annuityBenefitDetails.notificationDate;
            this.benefitPropertyService.setPaymentMethod(this.annuityBenefitDetails?.paymentMethod?.english);
            this.getAnnuityCalculation(this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin, benefitrequestId, this.referenceNumber);
            this.nin = this.annuityBenefitDetails.nin;
            this.benefitPropertyService.setNin(this.nin);
            this.benefitPropertyService.setPayeeType(this.annuityBenefitDetails?.payeeType?.english);
            this.benefitPropertyService.setPersonId(this.annuityBenefitDetails.personId);
            this.benefitPropertyService.setPaymentMethod(this.annuityBenefitDetails?.paymentMethod?.english);
            if (this.annuityBenefitDetails?.payeeType?.english === BenefitValues.authorizedPerson) {
              this.getAuthorizedPersonDetails(isModifyBenefit);
            } else {
              if (this.nin) {
                this.getPersonContactDetails(BenefitValues.contributor);
              } else {
                this.getContDetailWithPerid(this.annuityBenefitDetails.personId, BenefitValues.contributor);
              }
              if (this.annuityBenefitDetails.personId) {
                this.benefitPropertyService.setPersonId(this.annuityBenefitDetails.personId);
                //   this.getBankDetails(this.annuityBenefitDetails?.personId?.toString(), isModifyBenefit);
              }
            }
          }
        }
        // err => {
        //   this.showError(err);
        // }
      );
  }
  /** Method to fetch calculate details when benefit request id is available */
  getAnnuityCalculation(sin: number, benefitRequestId: number, referenceNo: number) {
    if (sin && benefitRequestId && referenceNo) {
      this.manageBenefitService
        .getBenefitCalculationDetailsByRequestId(sin, benefitRequestId, referenceNo)
        .subscribe(calculation => {
          this.benefitCalculationDetails = calculation;
        });
    }
  }

  getBeneficiaryDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    if (sin && benefitRequestId && referenceNo) {
      this.funeralBenefitService.getBeneficiaryRequestDetails(sin, benefitRequestId, referenceNo).subscribe(
        res => {
          this.funeralBeneficiaryDetails = res;
        },
        err => {
          this.showError(err);
        }
      );
    }
  }
  getPersonContactDetails(type: string) {
    const queryParams = `NIN=${this.nin}`;
    this.manageBenefitService.getPersonDetailsApi(queryParams).subscribe(personalDetails => {
      this.personalDetails = personalDetails.listOfPersons[0];
      this.personalDetails.personType = type;
      this.benefitPropertyService.setPayeeNationality(this.personalDetails.nationality.english);
    });
  }
  getContDetailWithPerid(id: number, type: string) {
    this.manageBenefitService.getPersonDetailsWithPersonId(id.toString()).subscribe(personalDetails => {
      this.personalDetails = personalDetails;
      this.personalDetails.personType = type;
      this.benefitPropertyService.setPayeeNationality(this.personalDetails.nationality.english);
    });
  }
  getAuthorizedPersonDetails(isModifyBenefit: boolean) {
    if (this.benefitRequestId && this.sin) {
      this.manageBenefitService.getSelectedAuthPerson(this.sin, this.benefitRequestId).subscribe(res => {
        this.preSelectedAuthperson = res;
        if (this.preSelectedAuthperson[0]) {
          if (this.preSelectedAuthperson[0].personId) {
            this.authPersonId = this.preSelectedAuthperson[0].personId;
            // this.getBankDetails(this.authPersonId?.toString(), isModifyBenefit);
            this.getContDetailWithPerid(this.authPersonId, BenefitValues.authorizedPerson);
            this.benefitPropertyService.setPersonId(this.authPersonId);
          }
        }
      });
    }
  }
  getDependentHistory(personId: number) {
    this.dependentService.getDependentHistory(this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin, this.benefitRequestId, personId).subscribe(history => {
      this.dependentHistory = history;
    });
  }
  getArabicFullName(name: Name) {
    let arabicName = '';
    if (name.arabic) {
      if (name.arabic.firstName) {
        arabicName += name.arabic.firstName + ' ';
      }
      if (name.arabic.secondName) {
        arabicName += name.arabic.secondName + ' ';
      }
      if (name.arabic.thirdName) {
        arabicName += name.arabic.thirdName + ' ';
      }
      if (name.arabic.familyName) {
        arabicName += name.arabic.familyName;
      }
    }
    return arabicName;
  }
}
