import { Component, Inject, OnInit } from '@angular/core';
import { AddVisitingDoctorService, AlertService, AnnuityResponseDto, AssessmentDetail, ContributorAssessmentService, CoreAdjustmentService, CoreBenefitService, DisabilityData, LanguageToken, MbAllowance, MedicalboardAssessmentService, PersonalInformation, Transaction, TransactionService, VicContributorDetails, getIdentityByType } from '@gosi-ui/core';
import { AssessmentConstants, AssessmentDetails, DisabilityAssessmentService, Injury, InjuryWrapper } from '../../shared';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mb-transaction-conveyance-sc',
  templateUrl: './transaction-conveyance-sc.component.html',
  styleUrls: ['./transaction-conveyance-sc.component.scss']
})
export class TransactionConveyanceScComponent implements OnInit {
  constructor(
    readonly disabilityAssessmentService: DisabilityAssessmentService,
    readonly coreBenefitService: CoreBenefitService,
    readonly router: Router,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly addVisitingDoctorService: AddVisitingDoctorService,
    readonly contributorService: ContributorAssessmentService,
    readonly transactionService: TransactionService,
    readonly alertService: AlertService,
    readonly medicaAssessmentService: MedicalboardAssessmentService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}
  heirDisabilityAssessment = false;
  dependentDisabilityAssessment = false;
  isNonOccContributor = false;
  transaction: Transaction;
  injuryDetailsWrapper: InjuryWrapper = new InjuryWrapper();
  injury: Injury = new Injury();
  activeBenefitDetails: AnnuityResponseDto;
  personalInformation: PersonalInformation;
  previousDisabilityDetails: DisabilityData;
  identifier: number;
  contributorDetails: VicContributorDetails = new VicContributorDetails();
  lang = 'en';  
  mbAllowanceDto: MbAllowance = new MbAllowance();
  address: string;
  geoCoder: google.maps.Geocoder;
  originLongitude: string;
  originLatitude: string;
  assessmentDetails: AssessmentDetail;


  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.transaction = this.transactionService.getTransactionDetails();
    this.getTransactionDetails();
    this.getNonOccContributorDretails(this.transaction?.params?.SIN);
    this.getInjuryDetails();
    this.getAllowance();
    this.getBenefitsDescription(this.transaction?.params?.SIN, this.transaction?.params?.BENEFIT_REQUEST_ID)
  }
  getTransactionDetails() {
    switch (this.transaction?.params?.PARTICIPANT_TYPE) {
      case '1001':
        this.isNonOccContributor = true;
        break;
      case '1003':
        this.heirDisabilityAssessment = true;
        break;
      case '1002':
        this.dependentDisabilityAssessment = true;
        // this.isNonOcc = true;
        break;
      default:
    }
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
  viewInjuryHistory() {
    this.router.navigate([`/home/oh/injury/history/${this.transaction?.params?.SIN}/true`]);
  }
  getInjuryDetails() {
    if (this.transaction?.params?.REGISTRATION_NO && this.transaction?.params?.INJURY_ID) {
      const isChangeRequired = false;
      this.addVisitingDoctorService
        .getInjuryDetails(
          this.transaction?.params?.REGISTRATION_NO,
          this.transaction?.params?.SIN,
          this.transaction?.params?.INJURY_ID,
          isChangeRequired
        )
        .subscribe(response => {
          this.injuryDetailsWrapper = response;
          this.injury = this.injuryDetailsWrapper.injuryDetailsDto;
        });
    }
  }
  getBenefitsDescription(socialInsuranceNo, benefitRequestId) {
    if (benefitRequestId && socialInsuranceNo) {
      this.addVisitingDoctorService
        .getAnnuityBenefitRequestDetail(socialInsuranceNo, benefitRequestId)
        .subscribe(response => {
          if (response) {
            this.activeBenefitDetails = response;
            this.getPersonDetails(this.activeBenefitDetails?.personId);
          }
        });
    }
  }
  getPersonDetails(heirDepPersonId) {
    this.contributorService.getPersonById(heirDepPersonId).subscribe(data => {
      this.personalInformation = data;     
    });
  }
  getPreviousDisability() {
    this.disabilityAssessmentService.getPreviousDisability(+this.transaction?.params?.IDENTIFIER).subscribe(res => {
      this.previousDisabilityDetails = res;
    });
  }
  getNonOccContributorDretails(socialInsuranceNo: number) {
    this.addVisitingDoctorService.getContirbutorDetails(socialInsuranceNo).subscribe(response => {
      if (response) {
        this.contributorDetails = response;
        this.identifier = getIdentityByType(
          this.contributorDetails?.person?.identity,
          this.contributorDetails?.person?.nationality?.english
        )?.id;
        // this.getDisabiltyAssessmentDetails(+this.transaction?.params?.MB_ASSESSMENT_REQUEST_ID);
        this.getPreviousDisability();
      }
    });
}
getAllowance() {
  this.medicaAssessmentService.getAllowanceDetails(+this.transaction?.params?.IDENTIFIER, +this.transaction?.params?.MB_ASSESSMENT_REQUEST_ID).subscribe(
    res => {
      this.mbAllowanceDto = res;
      if (this.mbAllowanceDto?.originLongitude && this.mbAllowanceDto?.originLatitude) {
        this.originLongitude = this.mbAllowanceDto?.originLongitude;
        this.originLatitude = this.mbAllowanceDto?.originLatitude;
        this.getPlaceByLocation();
      }
      this.getAssessmentDetails(this.mbAllowanceDto?.assessmentId)
    }
  );
}
getPlaceByLocation() {
  this.geoCoder = new google.maps.Geocoder();
  this.geoCoder.geocode(
    { location: { lat: Number(this.originLatitude), lng: Number(this.originLongitude) } },
    results => {
      this.address = results[5].formatted_address;
    }
  );
}
getAssessmentDetails(disabilityAssessmentId) {
  this.medicaAssessmentService.getAssessmentDetail(+this.transaction?.params?.IDENTIFIER, disabilityAssessmentId).subscribe(res => {
    this.assessmentDetails = res;
  });
}
navigateToAssessmentPage() {
  this.coreAdjustmentService.identifier = +this.transaction?.params?.IDENTIFIER;
  this.coreAdjustmentService.socialNumber = this.transaction?.params?.SIN;
  this.coreBenefitService.injuryId = this.transaction?.params?.INJURY_ID;
  this.coreBenefitService.regNo = this.transaction?.params?.REGISTRATION_NO;
  this.disabilityAssessmentService.disabilityAssessmentId = this.mbAllowanceDto.assessmentId;
  this.disabilityAssessmentService.disabilityType = this.assessmentDetails?.assessmentType;
  this.disabilityAssessmentService.contractDoctor = false;
  this.router.navigate([`/home/medical-board/disability-assessment/view`]);
}
}
