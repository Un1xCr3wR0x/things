import { Component, Inject, OnInit } from '@angular/core';
import { TransactionBaseScComponent } from '../../base';
import {
  CoreAdjustmentService,
  Transaction,
  DocumentService,
  TransactionService,
  BilingualText,
  LanguageToken,
  AlertService,
  LookupService,
  RouterData,
  RouterDataToken,
  GosiCalendar,
  DocumentItem,
  Channel,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService
} from '@gosi-ui/core';
import {
  AnnuityResponseDto,
  BankService,
  DependentDetails,
  DependentService,
  HeirBenefitService,
  HeirDetailsRequest,
  ManageBenefitService,
  BenefitDocumentService,
  BenefitDetails,
  AttorneyDetailsWrapper,
  PersonalInformation,
  DependentHistory,
  BenefitType,
  isHeirBenefit,
  BenefitValues,
  UITransactionType,
  UIPayloadKeyEnum,
  SanedBenefitService,
  UiBenefitsService,
  HeirTransactionIdValidator,
  getTransactionTypeOrId,
  HeirStatus,
  BenefitPropertyService
} from '../../../shared';
import { BehaviorSubject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'bnt-hold-heir-benefit-sc',
  templateUrl: './hold-heir-benefit-sc.component.html',
  styleUrls: ['./hold-heir-benefit-sc.component.scss']
})
export class HoldHeirBenefitScComponent extends TransactionBaseScComponent implements OnInit {
  transaction: Transaction;
  referenceNumber: number;
  transactionId: number;
  heirAccordianPresent: boolean;
  sin: number;
  channel: BilingualText;
  benReqId: number;
  heirDetailsResp: AnnuityResponseDto;
  heirDetailsData: HeirDetailsRequest;
  benefitTypes: BilingualText;
  heirList: DependentDetails[];
  lang = 'en';
  isModificationDetailsPresent: boolean;
  isHold: boolean;
  personNameEnglish: string = null;
  personNameArabic: String = null;
  notificationDate: GosiCalendar = new GosiCalendar();
  requestDate: GosiCalendar;
  benefitCalculationDetails: BenefitDetails;
  nin: number;
  preSelectedAuthperson: AttorneyDetailsWrapper[];
  authPersonId: number;
  personalDetails: PersonalInformation;
  requestType: string;
  oldBenefitDetails: BenefitDetails[];
  dependentHistory: DependentHistory;
  isStartBenefit: boolean;
  isHeirBenefit = true;
  annuityBenefitDetails: AnnuityResponseDto;
  benefitType: string;
  dependentDetails: DependentDetails[];
  businessId: number;
  reqList: DocumentItem[];
  requestId: number;
  isIndividualApp: boolean;

  constructor(
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly manageBenefitService: ManageBenefitService,
    readonly dependentService: DependentService,
    readonly alertService: AlertService,
    readonly bankService: BankService,
    readonly lookUpService: LookupService,
    readonly heirBenefitService: HeirBenefitService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly modalService: BsModalService,
    readonly adjustmentService: CoreAdjustmentService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly uiBenefitService: UiBenefitsService,
    readonly fb: FormBuilder,
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
    this.requestType = BenefitType.holdbenefit;
    this.transaction = this.transactionService.getTransactionDetails();
    this.isHeirBenefit = true;
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP;
    if (this.transaction) {
      this.referenceNumber = this.transaction.transactionRefNo;
      this.transactionId = this.transaction.transactionId;
      this.sin = this.transaction.params.SIN;
      this.benReqId = this.transaction.params.BENEFIT_REQUEST_ID;
      if (this.transactionId === Number(300364)) {
        // initially 302021
        this.heirAccordianPresent = true;
        this.isModificationDetailsPresent = true;
        this.isHold = true;
      }
      this.getAnnuityBenefitDetails(this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin, this.benReqId, this.referenceNumber);
      const transactionName = getTransactionTypeOrId(true, HeirStatus.HOLD, true);
      const transactionType = UITransactionType.FO_REQUEST_SANED;
      this.businessId = this.transaction.params.BUSINESS_ID;
      this.requestId = +this.routerData.idParams.get(UIPayloadKeyEnum.ID);
      this.getDocuments(transactionName, transactionType, this.referenceNumber);

      // this.getDocumentDetails(
      //   AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_NAME,
      //   AdjustmentConstants.ADD_THIRD_PARTY_TRANSACTION_TYPE,
      //   this.modificationId,
      //   this.referenceNumber
      // );
    }
  }
  getOldDependentDetails() {
    if (this.socialInsuranceNo && this.requestId) {
      this.dependentService.getBenefitHistory(this.isIndividualApp ? this.authTokenService.getIndividual() : this.socialInsuranceNo, this.requestId).subscribe(
        res => {
          this.oldBenefitDetails = res;
        },
        err => {
          this.showError(err);
        }
      );
    }
  }
  getDocuments(transactionKey: string, transactionType: string, referenceNumber: number) {
    transactionKey = HeirTransactionIdValidator.HOLD;
    transactionType === Channel.FIELD_OFFICE
      ? (transactionType = UITransactionType.FO_REQUEST_SANED)
      : (transactionType = UITransactionType.GOL_REQUEST_SANED);
    this.benefitDocumentService
      .getValidatorDocuments(this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin, this.businessId, referenceNumber, transactionKey, transactionType)
      .subscribe(res => {
        this.documents = res;
      });
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

            this.getHeirDetails(this.isIndividualApp ? this.authTokenService.getIndividual() : this.sin, this.benReqId, this.referenceNumber);

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
    if (this.benReqId && this.sin) {
      this.manageBenefitService.getSelectedAuthPerson(this.sin, this.benReqId).subscribe(res => {
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
    this.dependentService.getDependentHistory(this.sin, this.benReqId, personId).subscribe(history => {
      this.dependentHistory = history;
    });
  }
}
