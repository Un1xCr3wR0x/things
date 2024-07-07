import { Component, HostListener, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  checkIqamaOrBorderOrPassport,
  CommonIdentity,
  CoreAdjustmentService,
  CoreBenefitService,
  DocumentItem,
  DocumentService,
  getIdentityByType,
  LanguageToken,
  MedicalAssessmentService,
  MedicalboardAssessmentService,
  RoleIdEnum,
  RouterConstants
} from '@gosi-ui/core';
import {
  AssessmentConstants,
  AssessmentDetail,
  AssessmentDetails,
  Contributor,
  DisabilityAssessmentService,
  DisabilityDetails,
  DoctorService,
  getIdentityLabel,
  InjuryWrapper,
  MbList,
  MedicalBoardAssessmentRequest
} from '../../../shared';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { OhService, RouteConstants } from '@gosi-ui/features/occupational-hazard/lib/shared';
import { map } from 'rxjs/operators';

@Component({
  selector: 'mb-view-disability-assessment-sc',
  templateUrl: './view-disability-assessment-sc.component.html',
  styleUrls: ['./view-disability-assessment-sc.component.scss']
})
export class ViewDisabilityAssessmentScComponent implements OnInit,OnDestroy {
  injuryDetailsById: InjuryWrapper;
  personDetails: Contributor;
  personId;
  socialInsuranceNo;
  injuryId;
  regNo;
  disabilityAssessmentId;
  assessmentType: string;
  assessmentDetails: AssessmentDetail;
  assessmentDocuments: DocumentItem[];
  transactionConstants: string;
  occBusinessType = 'OCC_DISAB_ASSESSMENT';
  nonOccBusinessType = 'NON_OCC_DISAB_ASSESSMENT';
  heirBusinessType = 'HEIR_DISB_ASSESSMENT';
  benefitDetail;
  heirDepIdentifier: number;
  identity: CommonIdentity | null;
  identityLabel = ' ';
  isContractDoctor: boolean;
  nationalId: number;
  lang = 'en';
  previousDisabilityDetails: DisabilityDetails;
  modalRef: BsModalRef;
  visitingDoctorDetails: MbList;
  assessmentRequestId: number;
  referenceNo: number;
  isAmb;
  documentList$: Observable<DocumentItem[]>;
  transactionId: number;
  isIndividalApp = false;
  estRegNo: number;
  isContributor = false;
  isMbo = false;
  gosiscp;
  registrationNo: number;
  identitynumber: any;
  primaryIdentity: CommonIdentity = new CommonIdentity();
  identifier: number;
  singleAssessmentDetail: AssessmentDetails;
  isReassessment = false;
  identityIdNin: number;
  isHoDoctor = false;
  isMbManager = false;
  isCSR = false;
  isOcc = false;
  injuryType;
  doctransactionId: number;
  referenceNumber: number;
  injuryBusinessType = 'CLOSE_INJURY';
  complicationBusinessType = 'CLOSE_COMPLICATION';
  reassessmentType = 'REQUEST_MB_RE_ASSESSMENT';
  assessmentview = false;
  onBackButtonClicked = false;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly authTokenService: AuthTokenService,
    readonly disabilityAssessmentService: DisabilityAssessmentService,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly coreBenefitService: CoreBenefitService,
    readonly doctorService: DoctorService,
    readonly location: Location,
    readonly documentService: DocumentService,
    private router: Router,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    readonly medicaAssessmentService: MedicalboardAssessmentService,
    readonly ohService: OhService,
    readonly medicalboardAssessmentService: MedicalboardAssessmentService,
    readonly coreMedicalAssessmentService: MedicalAssessmentService
  ) {}

  ngOnInit(): void {
    this.getUserLogin();
    this.medicaAssessmentService.setIsFromOh(false);
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.activatedRoute.queryParams.subscribe(res => {
      this.referenceNo = res?.referenceNo;
    });
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.isIndividalApp = true;
      this.nationalId = this.authTokenService.getIndividual();
    } else {
      this.nationalId = parseInt(this.disabilityAssessmentService.nationalID, 10);
    }
    this.personId = this.coreAdjustmentService.identifier;
    this.socialInsuranceNo = this.coreAdjustmentService.socialNumber || this.authTokenService.getIndividual();
    this.regNo = this.coreBenefitService.regNo;
    this.isContractDoctor = this.disabilityAssessmentService.contractDoctor;
    this.assessmentRequestId = this.coreBenefitService.assessmentRequestId;
    this.isAmb = this.disabilityAssessmentService.isAmbType;
    this.transactionId = this.disabilityAssessmentService.transactionTraceId;
    if (this.disabilityAssessmentService?.assessmentTypes) {
      if (this.disabilityAssessmentService?.assessmentTypes?.english.includes('Reassessment')) {
        this.isReassessment = true;
      }
    }
    this.initialiseData();
    this.setDisabilityTypeParams();
  }
  /**
   * Method to load initial data
   */
  initialiseData() {
    this.getContributor();
    this.benefitDetail = this.coreBenefitService.getPersonIdReqId();
    this.disabilityAssessmentId =
      this.disabilityAssessmentService.disabilityAssessmentId || this.coreBenefitService.mbAssessmentId;
    this.injuryId = this.coreBenefitService.injuryId;
    if (this.injuryId && this.injuryId !== 'NULL') this.getInjuryDetailsById();
    if (this.assessmentRequestId) this.getVisitingDoctorDetails();
  }
  setDisabilityTypeParams() {
    const disabilityType = this.disabilityAssessmentService?.disabilityType?.english
      ? this.disabilityAssessmentService?.disabilityType?.english
      : this.disabilityAssessmentService?.assessmentTypes?.english || this.coreBenefitService.assessmentType?.english;
    this.assessmentType = disabilityType;
    if (disabilityType === 'Occupational Disability' || disabilityType === 'Occupational Disability Reassessment') {
      this.transactionConstants = this.occBusinessType;
    } else if (
      disabilityType === 'Non-Occupational Disability' ||
      disabilityType === 'Non-Occupational Disability Reassessment' ||
      disabilityType === 'Dependent Disability Reassessment' ||
      disabilityType == 'Dependent Disability'
    ) {
      this.transactionConstants = this.nonOccBusinessType;
    } else {
      this.transactionConstants = this.heirBusinessType;
    }
  }
   /**
   * Catching the browser back button
   */
   @HostListener('window:popstate', ['$event'])
   onPopState() {
    this.onBackButtonClicked = true;
   }
  getAssessmentDocuments(document) {
    this.setDisabilityTypeParams();
    // this.transactionConstants commented as doc are not getting fetched for this scenario
    this.documentService.getMultipleDocuments(this.disabilityAssessmentId, this.transactionConstants).subscribe(documentsResponse => {
      const doc2 = documentsResponse?.filter(item => item.documentContent !== null);
        if (doc2.length > 0) {
          this.assessmentDocuments = [...document, ...doc2];
        } else {
          this.assessmentDocuments = [document];
        }
    });
  }
  documentFetch(referenceNo?, transactionId?, transactionType?) {
    this.documentService.getEveryDocuments(transactionId, referenceNo).subscribe(documentsResponse => {
      const doc1 = documentsResponse?.filter(item => item.documentContent !== null);
      this.assessmentDocuments = [...doc1];
      this.getAssessmentDocuments([...doc1]);
    });
  }
  getContributor() {
    this.disabilityAssessmentService.getContributorBySin(this.socialInsuranceNo).subscribe(res => {
      this.personDetails = res;
      this.getNinIqamaGccId();
      this.identity = checkIqamaOrBorderOrPassport(this.personDetails?.person?.identity);
      this.identityLabel = getIdentityLabel(this.identity);
      this.identityIdNin = this.identity.id; // get NIN or Iqama
      // for getting heir nd dependent details
      this.benefitDetail?.benefitId && this.benefitDetail?.personId
        ? this.getHeirPersonDetails(this.benefitDetail?.personId).subscribe(() => {
            this.getAssessmentDetailsById();
          })
        : this.getAssessmentDetailsById();
    });
  }
  getInjuryDetailsById() {
    this.disabilityAssessmentService.getInjuryDetailsSinById(this.socialInsuranceNo, this.injuryId).subscribe(res => {
      this.injuryDetailsById = res;
      this.regNo = res?.establishmentRegNo;
    });
  }
  getAssessmentDetailsById() {
    this.benefitDetail?.benefitId && this.benefitDetail?.personId
      ? (this.nationalId = this.heirDepIdentifier)
      : (this.nationalId = this.getPersonNinIqama());
    this.doctorService
      .getAssessmentDetails(this.nationalId, this.disabilityAssessmentId, this.transactionId)
      .subscribe(res => {
        this.assessmentDetails = res;
        this.estRegNo = res?.regNo;
        this.getPreviousDisability(false);
        if (this.assessmentDetails?.ohType === 0) {
          this.injuryType = this.injuryBusinessType;
          this.doctransactionId = this.injuryId;
          this.referenceNumber = this.assessmentDetails?.docReferenceNo;
        } else if (this.assessmentDetails?.ohType === 2) {
          this.injuryType = this.complicationBusinessType;
          this.doctransactionId = this.injuryId;
          this.referenceNumber = this.assessmentDetails?.docReferenceNo;
        } else if (this.isReassessment) {
          this.injuryType = this.reassessmentType;
          this.doctransactionId = this.assessmentRequestId;
          this.referenceNumber = this.assessmentRequestId
        } else if (this.assessmentType === 'Non-Occupational Disability' ||
        this.assessmentType === 'Non-Occupational Disability Reassessment' ||
        this.assessmentType === 'Dependent Disability Reassessment' ||
        this.assessmentType == 'Dependent Disability') {
          this.injuryType = this.nonOccBusinessType;
          this.doctransactionId = this.assessmentDetails?.benefitRequestId;
          this.referenceNumber = this.assessmentDetails?.docReferenceNo;
        } else {
          this.injuryType = this.heirBusinessType;
          this.referenceNumber = this.doctransactionId = this.assessmentDetails?.benefitRequestId;
        }
        this.getDocument()
        // this.documentFetch(this.referenceNumber,this.doctransactionId );
      });
  }
  routeBack() {
    this.assessmentview = true;
    this.location.back();
  }
  getPersonNinIqama() {
    return !isNaN(Number(this.nationalId)) ? this.nationalId : this.identifier ? this.identifier : this.identityIdNin;
  }

  getHeirPersonDetails(personId): Observable<any> {
    return this.ohService.getPersonById(personId).pipe(
      map(res => {
        const data = checkIqamaOrBorderOrPassport(res?.identity);
        this.heirDepIdentifier = data?.id;
      })
    );
  }
  getPreviousDisability(showAllAssessment?) {
    this.nationalId = !isNaN(Number(this.nationalId)) ? this.nationalId : this.identifier;
    const disabilityAssessmentId = this.disabilityAssessmentId.toString();
    // this.assessmentDetails?.disabilityAssmtId
    // ? this.assessmentDetails?.disabilityAssmtId
    // : disabilityAssessmentId
    /*
     * as discussed with anjana provide q-param as ismbo = true for csr login also
     */
    this.isMbo = this.isMbo ? true : this.isCSR ? true : false;
    const benefitsDisability = [
      'Non-Occupational Disability',
      'Heir Disability',
      'Dependent Disability',
      'Non-Occupational Disability Reassessment',
      'Heir Disability Reassessment',
      'Dependent Disability Reassessment'
    ];
    const occDisability = ['Occupational Disability', 'Occupational Disability Reassessment'];
    showAllAssessment
      ? this.disabilityAssessmentService.getPreviousDisability(this.nationalId).subscribe(data => {
          this.previousDisabilityDetails = data;
        })
      : this.disabilityAssessmentService
          .getPreviousDisability(
            this.nationalId,
            null,
            null,
            null,
            {
              isContributor: this.isContributor,
              isMbo: this.isMbo,
              isHoDoctor: this.isHoDoctor,
              isMbManager: this.isMbManager
            },
            occDisability.findIndex(val => val === this.assessmentDetails?.assessmentType?.english) >= 0 &&
            this.assessmentDetails?.injuryId ? this.assessmentDetails?.injuryId : null,
            benefitsDisability.findIndex(val => val === this.assessmentDetails?.assessmentType?.english) >= 0 &&
            this.assessmentDetails?.benefitRequestId ? this.assessmentDetails?.benefitRequestId : null
          )
          .subscribe(res => {
            this.previousDisabilityDetails = res;
            // const benefitAssessmentClick = this.coreBenefitService.getIsBenefitRoute();
            this.singleAssessmentDetail = this.previousDisabilityDetails?.data?.find(eachValue => {
              return eachValue?.assessmentId === this.disabilityAssessmentId;
            });
            // this.singleAssessmentDetail = uniqueAssessmentData[0];
            // this.singleAssessmentDetail = this.previousDisabilityDetails?.data[0];
            // if (benefitAssessmentClick) {
            //   this.singleAssessmentDetail = this.previousDisabilityDetails?.data[0];
            // }
          });
  }
  viewMBAssessmentModal(mbAssessmentTemplate: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService?.show(mbAssessmentTemplate, Object.assign({}, { class: 'modal-lg' }));
    this.getPreviousDisability(true);
  }
  viewAssessmentById(disabilityDetail: AssessmentDetails) {
    if (this.modalRef) this.modalRef.hide();
    if (this.assessmentType === 'Occupational Disability')
      this.coreBenefitService.injuryId = disabilityDetail?.injuryId;
    this.disabilityAssessmentService.disabilityAssessmentId = disabilityDetail?.assessmentId;
    this.referenceNo = disabilityDetail?.referenceNo;
    this.initialiseData();
  }
  viewContributorDetails(value) {
    if(value?.idType ==='PASSPORT') value.id = this.socialInsuranceNo;
    this.router.navigate([RouterConstants.ROUTE_INDIVIDUAL_PROFILE_INFO(value?.id)]);
  }
  viewInjuryInfo(injuryId) {
    this.router.navigate([`/home/oh/injury/view/${this.regNo}/${this.socialInsuranceNo}/${injuryId}`]);
  }
  viewInjuryId(injuryId) {
    if (this.assessmentDetails?.ohType === 0) {
      this.router.navigate([
        `home/oh/view/${this.regNo || this.estRegNo}/${this.socialInsuranceNo}/${injuryId}/injury/info`
      ]);
    } else {
      this.router.navigate([
        `home/oh/view/${this.regNo || this.estRegNo}/${this.socialInsuranceNo}/${
          this.injuryDetailsById?.injuryDetailsDto?.injuryNo
        }/${injuryId}/complication/info`
      ]);
    }
  }
  getVisitingDoctorDetails() {
    this.disabilityAssessmentService
      .getVisitingDoctorDetails(this.nationalId, this.assessmentRequestId)
      .subscribe(res => {
        this.visitingDoctorDetails = res;
      });
  }
  getUserLogin() {
    this.gosiscp = this.authTokenService.getEntitlements(); // to get login details from authToken
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.isContributor = true;
    } else if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.gosiscp[0].role.forEach(roleid => {
        if (RoleIdEnum.BOARD_OFFICER.toString() === roleid.toString()) {
          this.isMbo = true;
        }
        if (RoleIdEnum.HEAD_OFFICE_DOCTOR.toString() === roleid.toString()) {
          this.isHoDoctor = true;
        } else if (RoleIdEnum.MEDICAL_SERVICES_DEPARTMENT_MANAGER.toString() === roleid.toString()) {
          this.isMbManager = true;
        } else if (RoleIdEnum.CSR.toString() === roleid.toString()) {
          this.isCSR = true;
        }
      });
    }
  }
  navigateToApppeal(assessment: AssessmentDetails) {
    this.identitynumber = !isNaN(Number(this.nationalId))
      ? this.nationalId
      : this.identifier
      ? this.identifier
      : this.identityIdNin;
    if (!this.injuryId) {
      this.activatedRoute.paramMap.subscribe(res => {
        this.registrationNo = parseInt(res.get('registrationNo'), 10);
        this.socialInsuranceNo = parseInt(res.get('socialInsuranceNo'), 10);
        this.injuryId = parseInt(res.get('injuryId'), 10);
        this.ohService.setRegistrationNo(this.registrationNo);
        this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
        this.medicalboardAssessmentService.disabilityAssessmentId = assessment.assessmentId;
        this.ohService.setDisabilityType(assessment.assessmentType.english);
        this.ohService.setIdentifier(this.identitynumber);
        this.ohService.setAppealDate(assessment.daysCompleted);
        this.ohService.setIsComplication(false);
        this.ohService.setIsHoWorkitem(false);
        if (assessment?.canWithdraw && !assessment?.canAppeal) {
          this.medicalboardAssessmentService.isWithdraw = assessment?.canWithdraw;
        }
      });
    } else {
      this.medicalboardAssessmentService.disabilityAssessmentId = assessment.assessmentId;
      this.ohService.setRegistrationNo(this.registrationNo);
      this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
      this.ohService.setInjuryId(this.injuryId);
      this.ohService.setDisabilityType(assessment.assessmentType.english);
      this.ohService.setIdentifier(this.identitynumber);
      this.ohService.setIsComplication(false);
      this.ohService.setAppealDate(assessment.daysCompleted);
      this.ohService.setIsHoWorkitem(false);
      if (assessment?.canWithdraw && !assessment?.canAppeal) {
        this.medicalboardAssessmentService.isWithdraw = assessment?.canWithdraw;
      }
    }

    this.router.navigate([RouteConstants.ROUTE_INJURY_APPEAL]);
  }
  //For Routing to Early Reassessment
  navigateToEarlyReassessment(assessment: AssessmentDetails) {
    this.getUserLogin();
    this.getNinIqamaGccId();
    this.personId = this.personDetails?.person?.personId;
    this.socialInsuranceNo = this.socialInsuranceNo;
    this.isContributor = this.isContributor;
    this.isMbo = this.isMbo;
    const Participant = {
      ...assessment,
      socInsNo: this.socialInsuranceNo,
      isContributor: this.isContributor,
      isMBO: this.isMbo,
      identitynumber: this.identifier,
      personId: this.personId
    };
    this.ohService.setParticipantdetails(Participant);
    this.router.navigate([RouteConstants.ROUTE_EARLY_REASSESSMENT_CONTRIBUTOR]);
  }
  navigateToAppealHistory(assessment: AssessmentDetails) {
    this.identitynumber = !isNaN(Number(this.nationalId))
      ? this.nationalId
      : this.identifier
      ? this.identifier
      : this.identityIdNin;
    if (!this.injuryId) {
      this.activatedRoute.paramMap.subscribe(res => {
        this.registrationNo = parseInt(res.get('registrationNo'), 10);
        this.socialInsuranceNo = parseInt(res.get('socialInsuranceNo'), 10);
        this.injuryId = parseInt(res.get('injuryId'), 10);
        this.ohService.setRegistrationNo(this.registrationNo);
        this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
        this.ohService.setDisablilityAssessmentId(assessment.assessmentId);
        this.ohService.setAssessmentRequestId(assessment.mbAssessmentReqId);
        this.ohService.setIdentifier(this.identitynumber);
        this.ohService.setIsComplication(false);
      });
    } else {
      this.ohService.setAssessmentRequestId(assessment.mbAssessmentReqId);
      this.ohService.setDisablilityAssessmentId(assessment.assessmentId);
      this.ohService.setRegistrationNo(this.registrationNo);
      this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
      this.ohService.setInjuryId(this.injuryId);
      this.ohService.setIdentifier(this.identitynumber);
      this.ohService.setIsComplication(false);
    }
    this.router.navigate([RouteConstants.ROUTE_INJURY_APPEAL_INFO]);
  }
  getNinIqamaGccId() {
    this.primaryIdentity =
      this.personDetails?.person?.identity != null
        ? getIdentityByType(this.personDetails.person.identity, this.personDetails.person.nationality.english)
        : null;
    this.identifier = this.primaryIdentity !== null ? this.primaryIdentity.id : this.socialInsuranceNo;
    // this api should be called only if it is not  from benefit
    if (!this.benefitDetail?.benefitId && !this.benefitDetail?.personId) this.getPreviousDisability();
  }
  benefitIdClick(benefitId) {
    this.router.navigate([`home/profile/individual/internal/${this.socialInsuranceNo}/benefits`]);
  }
  getDocument() {
    this.nationalId = !isNaN(Number(this.nationalId)) ? this.nationalId : this.identifier;
    this.coreMedicalAssessmentService.getMedicalBoardDocuments(this.nationalId, this.disabilityAssessmentId).subscribe(documents => {
      this.assessmentDocuments = documents?.filter(item => item.documentContent !== null);
    });
  }
  ngOnDestroy(){
    if(!this.assessmentview && !this.onBackButtonClicked){
    this.disabilityAssessmentService.mbassessmentId = null;
    this.disabilityAssessmentService.assessmentType = null;
    this.disabilityAssessmentService.nationalID = null;
    }
  }
}
