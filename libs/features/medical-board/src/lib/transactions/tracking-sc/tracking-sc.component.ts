import { Component, Inject, OnInit } from '@angular/core';
import {
  AddVisitingDoctorService,
  AnnuityResponseDto,
  ContributorAssessmentService,
  Contributors,
  CoreAdjustmentService,
  CoreBenefitService,
  DisabilityData,
  DisabilityDetails,
  DocumentItem,
  Injury,
  InjuryWrapper,
  LanguageToken,
  MedicalAssessmentService,
  PersonalInformation,
  TransactionService,
  VicContributorDetails,
  checkIqamaOrBorderOrPassport,
  getIdentityByType
} from '@gosi-ui/core';
import {
  AssessmentConstants,
  AssessmentDetail,
  AssessmentDetails,
  DisabilityAssessmentService,
  DoctorService,
  MBConstants,
  MedicalBoardService
} from '../../shared';
import { Router } from '@angular/router';
import { Transaction } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { ComplicationService } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'mb-tracking-sc',
  templateUrl: './tracking-sc.component.html',
  styleUrls: ['./tracking-sc.component.scss']
})
export class TrackingScComponent implements OnInit {
  heirDisabilityAssessment = false;
  dependentDisabilityAssessment = false;
  transaction: Transaction;
  contributorDetails: VicContributorDetails = new VicContributorDetails();
  contributor: Contributors;
  personalInformation: PersonalInformation;
  injuryDetailsWrapper: InjuryWrapper = new InjuryWrapper();
  injury: Injury = new Injury();
  activeBenefitDetails: AnnuityResponseDto;
  previousDisabilityDetails: DisabilityData;
  disabilityDetails: DisabilityDetails;
  isNonOcc = false;
  documents: DocumentItem[] = [];
  identifier: number;
  isNonOccContributor = false;
  assessmentDetails: AssessmentDetail;
  injuryId: number;
  lang = 'en';
  addVd = false;
  complicationWrapper;
  isComplicationTracking = false;
  isInjuryTracking = false;
  registrationNo: number;

  constructor(
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly addVisitingDoctorService: AddVisitingDoctorService,
    readonly contributorService: ContributorAssessmentService,
    readonly disabilityAssessmentService: DisabilityAssessmentService,
    readonly coreBenefitService: CoreBenefitService,
    readonly router: Router,
    readonly transactionService: TransactionService,
    readonly injuryService: AddVisitingDoctorService,
    readonly coreMedicalAssessmentService: MedicalAssessmentService,
    readonly medicalBoardService: MedicalBoardService,
    readonly doctorService: DoctorService,
    readonly complicationService: ComplicationService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.transaction = this.transactionService.getTransactionDetails();
    if (
      this.transaction?.transactionId === MBConstants.ADD_VISITING_TRANSACTION_ID ||
      this.transaction?.transactionId === MBConstants.APPEAL_TRANSACTION_ID ||
      this.transaction?.transactionId === MBConstants.REMINDER_SCHEDULE_TRANSACTION_ID
    ) {
      this.addVd = true;
    }
    this.getTransactionDetails();
    this.getNonOccContributorDretails(this.transaction?.params?.SIN);
    this.getInjuryDetails();
  }
  getTransactionDetails() {
    switch (this.transaction?.params?.PARTICIPANT_TYPE) {
      case '1001':
        this.isNonOcc = true;
        this.isNonOccContributor = true;
        break;
      case '1003':
        this.heirDisabilityAssessment = true;
        this.isNonOcc = true;
        break;
      case '1002':
        this.dependentDisabilityAssessment = true;
        this.isNonOcc = true;
        break;
      default:
    }
  }
  getNonOccContributorDretails(socialInsuranceNo: number) {
    this.addVisitingDoctorService.getContirbutorDetails(socialInsuranceNo).subscribe(response => {
      if (response) {
        this.contributorDetails = response;
        this.identifier = getIdentityByType(
          this.contributorDetails?.person?.identity,
          this.contributorDetails?.person?.nationality?.english
        )?.id;
        if (this.transaction?.params?.MB_ASSESSMENT_REQUEST_ID) {
          this.getDisabiltyAssessmentDetails(+this.transaction?.params?.MB_ASSESSMENT_REQUEST_ID);
          this.getPreviousDisability();
        }
      }
    });
  }
  getDisabiltyAssessmentDetails(mbAssessmentRequestId: number) {
    this.medicalBoardService.getDisabilityDetails(this.identifier, mbAssessmentRequestId).subscribe(res => {
      this.disabilityDetails = res;
      this.getBenefitsDescription(
        this.transaction?.params?.SIN,
        this.transaction?.params?.BENEFIT_REQUEST_ID || this.disabilityDetails?.benefitRequestId
      );
      if (this.disabilityDetails.ohType === 2 && this.transaction.transactionId === 101587) {
        this.getCompDetails(this.disabilityDetails?.injuryId, this.disabilityDetails?.injuryNumber);
        this.isComplicationTracking = true;
      }
      if (this.disabilityDetails.ohType === 0 && this.transaction.transactionId === 101587) {
        this.getInjuryDetails();
        this.isInjuryTracking = true;
      }
      this.getPersonDetails(this.disabilityDetails?.personId);
      this.getDocuments(
        this.disabilityDetails.assessmentId
          ? this.disabilityDetails?.assessmentId
          : this.transaction?.params?.MB_DISABILITY_ASSESSMENT_ID
      );
      if (
        this.transaction?.transactionId === 101510 ||
        this.transaction?.transactionId === 101508 ||
        this.transaction?.transactionId === 101514 ||
        this.transaction?.transactionId === 300372 ||
        this.transaction?.transactionId === 101590
      ) {
        this.getAssessmentDetailsView(
          this.identifier,
          this.disabilityDetails.assessmentId
            ? this.disabilityDetails?.assessmentId
            : this.transaction?.params?.MB_DISABILITY_ASSESSMENT_ID
        );
      }
    });
  }
  getPersonDetails(heirDepPersonId) {
    this.contributorService.getPersonById(heirDepPersonId).subscribe(data => {
      this.personalInformation = data;
    });
  }
  getInjuryDetails() {
    if (this.transaction?.params?.INJURY_ID && +this.transaction?.params?.INJURY_ID !== 0) {
      const isChangeRequired = false;
      this.injuryService
        .getInjuryDetail(this.transaction?.params?.SIN, this.transaction?.params?.INJURY_ID, isChangeRequired)
        .subscribe(response => {
          this.injuryDetailsWrapper = response;
          this.registrationNo = response.establishmentRegNo;
          this.injury = this.injuryDetailsWrapper.injuryDetailsDto;
        });
    }
  }
  getCompDetails(injuryId, complicationId) {
    const isChangeRequired = false;
    this.complicationService
      .getComplications(this.transaction?.params?.SIN, injuryId, complicationId, isChangeRequired)
      .subscribe(response => {
        this.complicationWrapper = response;
        this.registrationNo = response?.establishmentRegNo;
      });
  }
  getBenefitsDescription(socialInsuranceNo, benefitRequestId) {
    if (benefitRequestId && socialInsuranceNo) {
      this.addVisitingDoctorService
        .getAnnuityBenefitRequestDetail(socialInsuranceNo, benefitRequestId)
        .subscribe(response => {
          if (response) {
            this.activeBenefitDetails = response;
          }
        });
    }
  }
  getPreviousDisability() {
    this.disabilityAssessmentService.getPreviousDisability(this.identifier).subscribe(res => {
      this.previousDisabilityDetails = res;
    });
  }
  viewInjuryHistory() {
    this.router.navigate([`/home/oh/injury/history/${this.transaction?.params?.SIN}/true`]);
  }
  navigateToPreviousAssessment(assessment: AssessmentDetails) {
    this.coreAdjustmentService.identifier = +this.transaction?.assignedTo;
    this.coreAdjustmentService.socialNumber = this.transaction?.params?.SIN;
    this.coreBenefitService.injuryId = assessment?.injuryId;
    this.coreBenefitService.regNo = this.transaction?.params?.REGISTRATION_NO;
    this.disabilityAssessmentService.disabilityAssessmentId = assessment?.assessmentId;
    this.disabilityAssessmentService.disabilityType = assessment?.disabilityType;
    this.disabilityAssessmentService.contractDoctor = false;
    this.disabilityAssessmentService.assessmentTypes = assessment?.assessmentType;
    this.disabilityAssessmentService.benefitReqId = assessment?.benefitReqId;
    this.disabilityAssessmentService.referenceNo = assessment?.referenceNo;
    this.router.navigate([AssessmentConstants.ROUTE_VIEW_ASSESSMENT]);
  }
  getDocuments(disabilityAssessmentId) {
    this.coreMedicalAssessmentService
      .getMedicalBoardDocuments(this.identifier, disabilityAssessmentId)
      .subscribe(documentsResponse => {
        if (documentsResponse.length > 0) {
          this.documents = documentsResponse?.filter(item => item.documentContent !== null);
        }
      });
  }
  getAssessmentDetailsView(identifier, disabilityAssessmentId) {
    this.doctorService.getAssessmentDetails(identifier, disabilityAssessmentId).subscribe(res => {
      this.assessmentDetails = res;
      this.disabilityAssessmentService.setRegNo(this.assessmentDetails?.regNo);
    });
  }
  viewInjuryComplication(injId) {
    this.router.navigate([`home/oh/view/${this.registrationNo}/${this.transaction?.params?.SIN}/${injId}/injury/info`]);
  }
  viewComplication() {
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.transaction?.params?.SIN}/${this.disabilityDetails?.injuryId}/${this.disabilityDetails?.injuryNumber}/complication/info`
    ]);
  }
  viewInjury(val) {
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.transaction?.params?.SIN}/${this.disabilityDetails?.injuryId}/injury/info`
    ]);
  }
}
