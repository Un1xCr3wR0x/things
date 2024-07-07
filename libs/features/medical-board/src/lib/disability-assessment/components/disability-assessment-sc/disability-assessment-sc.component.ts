import { Component, Inject, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  AddressDetails,
  AlertService,
  BilingualText,
  CommonIdentity,
  CoreAdjustmentService,
  CoreBenefitService,
  CoreContributorService,
  DisabilityData,
  DisabilityDetails,
  DocumentItem,
  DocumentService,
  DropdownItem,
  getIdentityByType,
  InjuredPerson,
  LanguageToken,
  LookupService,
  Lov,
  LovList,
  MedicalAssessmentService,
  Role,
  RoleIdEnum,
  RouterConstants,
  RouterData,
  RouterDataToken,
  scrollToTop,
  startOfDay,
  TransactionReferenceData,
  WizardItem,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';
import {
  Contributor,
  Injury,
  DisabilityAssessmentService,
  InjuryWrapper,
  AssessmentConstants,
  MbList,
  VisitingDoctor,
  CreateSessionBaseScComponent,
  SessionStatusService,
  CreateSessionService,
  SessionConfigurationService,
  AssessmentSuccessResponse,
  DoctorService,
  OriginLocation,
  MedicalBoardService,
  ComplicationWrapper,
  Person,
  AssessmentResponseDateDto,
  ValidateDateDto,
  MBConstants
} from '../../../shared';
import { AssessmentDetail } from '../../../shared/models/assessment-details';

@Component({
  selector: 'mb-disability-assessment-sc',
  templateUrl: './disability-assessment-sc.component.html',
  styleUrls: ['./disability-assessment-sc.component.scss']
})
export class DisabilityAssessmentScComponent extends CreateSessionBaseScComponent implements OnInit, OnDestroy {
  @ViewChild('assessmentWizard', { static: false })
  assessmentWizard: ProgressWizardDcComponent;

  // assessmentDetails: AssessmentDetailsResponse;
  assessmentDetails: DisabilityDetails;
  assessmentResponse: AssessmentSuccessResponse = new AssessmentSuccessResponse();
  personDetails: Contributor;
  heirPersonDetails: Person;
  personId;
  injuryDetails: Injury;
  bodyPartsCategoryList: LovList;
  injuredPersonDetails: InjuredPerson[] = [];
  injuryDetailsById: InjuryWrapper;
  socialInsuranceNo;
  injuryId;
  transactionNumber = 78779899;
  parentForm: FormGroup;
  previousDisabilityDetails: DisabilityData;
  complicationDetails: ComplicationWrapper;
  assessmentRequestId: number;
  assessmentType: string;
  modalRef: BsModalRef;
  regNo: number;
  selectedVistingDr: MbList;
  listYesNo$ = new Observable<LovList>();
  visitingDoctorDetails: MbList;
  assessmentWizards: WizardItem[] = [];
  currentTab = 0;
  previousDisabilityDetailsById: DisabilityData;
  dropdownList: DropdownItem[];
  lang = 'en';
  helperReasonList: LovList;
  hospital$: Observable<LovList>;
  documentList$: Observable<DocumentItem[]>;
  occBusinessType = 'OCC_DISAB_ASSESSMENT';
  occBusinessKey = 101508;
  nonOccBusinessType = 'NON_OCC_DISAB_ASSESSMENT';
  nonOccBusinessKey = 101510;
  heirBusinessKey = 101514;
  heirBusinessType = 'HEIR_DISB_ASSESSMENT';
  reassessmentType = 'REQUEST_MB_RE_ASSESSMENT';
  assessmentTypeText: BilingualText;
  mainReasonList: LovList;
  otherSpecialityList: LovList;
  secondaryReasonList: LovList;
  businessType;
  assessmentBusinessType;
  benefitReqId: number;
  offices: LovList;
  originLongitude: string;
  originLatitude: string;
  destinationLongitude: string;
  destinationLatitude: string;
  isEdit = false;
  gosiDoctorAssessDetails: AssessmentDetail;
  disabilityAssessmentId: number;
  supportingDocuments: DocumentItem[] = [];
  injuredParts;
  isGosiDoctor = false;
  isCompleted = false;
  complicationDocumentList: DocumentItem[] = [];
  documents: DocumentItem[] = [];
  doctorSequence: number;
  transactionTraceId: number;
  commentAlert = false;
  nationalId: any;
  docsLists: LovList = new LovList([]);
  businessTransaction;
  identifier: number;
  assessmentReqId: number;
  mbSessionId: number;
  disbAssessmentId: number;
  requestDocumentList: LovList;
  isReturn = false;
  referenceNo: number;
  businessId: number;
  isReassessment = false;
  heading: string;
  isHeir = false;
  maxCharLimit = 1000;
  conveyanceRequired = false;
  prevReferenceNo: number;
  isAmbo = false;
  assessmentRefNo: number;
  transactionId: number;
  amboDocuments: DocumentItem[];
  assessmentResponseDateDto: AssessmentResponseDateDto;
  validateDateDto?: ValidateDateDto = new ValidateDateDto();
  docsForambo = [];
  docs: DocumentItem[] = [];
  isSaudi = false;
  city: string;
  addressText: string;
  reqAssessmentDetails = false;
  locationChanged = false;
  modifiedByGosiDoc = false;
  ambReturn = false;
  isOcc = false;
  isHoReturn = false;
  returnComments: TransactionReferenceData[];
  viewPrevAssessment = false;
  constructor(
    readonly lookupService: LookupService,
    readonly fb: FormBuilder,
    readonly disabilityAssessmentService: DisabilityAssessmentService,
    readonly coreBenefitService: CoreBenefitService,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    readonly doctorService: DoctorService,
    modalService: BsModalService,
    private coreContributorService: CoreContributorService,
    statusService: SessionStatusService,
    alertService: AlertService,
    sessionService: CreateSessionService,
    configurationService: SessionConfigurationService,
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly documentService: DocumentService,
    readonly location: Location,
    readonly workflowService: WorkflowService,
    readonly medicalBoardService: MedicalBoardService,
    readonly coreMedicalAssessmentService: MedicalAssessmentService
  ) {
    super(
      router,
      activatedRoute,
      lookupService,
      modalService,
      statusService,
      alertService,
      sessionService,
      workflowService,
      configurationService
    );
  }

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.isGosiDoctor = this.disabilityAssessmentService.isGosiDr;
    this.isSaudi = this.disabilityAssessmentService.isSaudi;
    this.isHoReturn = this.disabilityAssessmentService.isHoReturn;
    this.returnComments = this.routerData?.comments;
    if (this.routerData?.payload) {
      const payload = JSON.parse(this.routerData.payload);
      this.identifier = payload.identifier;
      if (payload.assessmentRequestId !== 'NULL') this.assessmentReqId = payload.assessmentRequestId;
      this.mbSessionId = payload.mbSessionId;
      this.disbAssessmentId = payload.disabilityAssessmentId;
      this.referenceNo = payload.referenceNo;
      this.assessmentRefNo = payload?.assessmentRefNo;
      this.injuryId = this.coreBenefitService.injuryId
        ? this.coreBenefitService.injuryId
        : payload?.injuryId !== 'NULL'
        ? payload?.injuryId
        : null;
      this.benefitReqId = this.coreBenefitService.benefitRequestId
        ? this.coreBenefitService.benefitRequestId
        : payload?.benefitRequestId !== 'NULL'
        ? payload?.benefitRequestId
        : null;
      this.assessmentRequestId = this.isGosiDoctor
        ? payload?.assessmentReqId || payload?.assessmentRequestId
        : this.coreBenefitService.assessmentRequestId;
    }
    if (
      (this.routerData.assignedRole === Role.MBO ||
        this.routerData.assignedRole === Role.MS_OFFICER ||
        this.routerData.assignedRole === Role.MEDICAL_BOARD_OFFICER ||
        this.routerData.assignedRole === Role.MB_OFFICER) &&
      this.routerData.resourceType === RouterConstants.TRANSACTION_MB_ASSIGN_SESSION_GOSI_DOCTOR
      // this.routerData.resourceType === RouterConstants.MB_CONVEYANCE_ALLOWANCE)
    ) {
      this.isReturn = true;
    }
    if (this.routerData.resourceType === RouterConstants.TRANSACTION_ASSIGN_TO_HO) {
      this.ambReturn = true;
    }
    if (this.routerData.resourceType === RouterConstants.MB_CONVEYANCE_ALLOWANCE) {
      this.conveyanceRequired = true;
    }
    if (
      this.routerData.assignedRole === Role.MBO ||
      this.routerData.assignedRole === Role.MS_OFFICER ||
      this.routerData.assignedRole === Role.MEDICAL_BOARD_OFFICER
    )
      this.initializeWizard();
    this.assessmentTypeText = this.disabilityAssessmentService.assessmentType;
    this.language.subscribe(res => (this.lang = res));
    this.sessionId = this.disabilityAssessmentService.sessionIdMb;
    this.parentForm = this.fb.group({});
    this.listYesNo$ = this.lookupService.getYesOrNoList();
    this.socialInsuranceNo = this.coreAdjustmentService.socialNumber;

    this.regNo = this.coreBenefitService.regNo || this.disabilityAssessmentService.getRegistrationNo();

    this.isCompleted = this.disabilityAssessmentService.isCompleted;
    this.disabilityAssessmentId = this.disabilityAssessmentService.mbassessmentId;
    this.transactionTraceId = this.disabilityAssessmentService.transactionTraceId;
    if (
      this.routerData.assignedRole === Role.APPEAL_OFFICER ||
      this.routerData.assignedRole === Role.APPEAL_MEDICAL_BOARD_OFFICER
    ) {
      this.isAmbo = true;
    }
    this.nationalId = !this.isGosiDoctor
      ? this.disabilityAssessmentService.nationalID
      : this.disabilityAssessmentService.personIdentifier;
    this.activatedRoute.paramMap.subscribe(res => {
      this.socialInsuranceNo = Number(res.get('sin'));
      this.personId = Number(res.get('personId'));
      // this.injuryId = Number(res.get('injuryId'));
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.assessmentType = params.disabilityType;
      if (
        this.assessmentType === 'Occupational Disability' ||
        this.assessmentType === 'Occupational Disability Assessment' ||
        this.assessmentType === 'Reassessment Occupational Disability' ||
        this.assessmentType === 'Occupational Disability Reassessment'
      ) {
        this.isOcc = true;
        this.businessType = this.occBusinessType;
        this.businessTransaction = AssessmentConstants.CLOSE_INJURY;
        this.businessId = this.occBusinessKey;
        this.lookupService.getMBOccReasonForDisabilityList().subscribe(res => {
          this.setReasons(res);
        });
      } else if (
        this.assessmentType === 'Non-Occupational Disability' ||
        this.assessmentType === 'Non-Occupational Disability Assessment' ||
        this.assessmentType === 'Non - Occupational Disability Assessment' ||
        this.assessmentType === 'Non - Occupational Disability Reassessment' ||
        this.assessmentType === 'Reassessment Non-Occupational Disability' ||
        this.assessmentType === 'Reassessment Dependent Disability' ||
        this.assessmentType === 'Non-Occupational Disability Reassessment' ||
        this.assessmentType === 'Dependent Disability Reassessment' ||
        this.assessmentType === 'Dependent Disability' ||
        this.assessmentType === 'Dependent Disability Assessment'
      ) {
        this.businessType = this.nonOccBusinessType;
        this.businessTransaction = AssessmentConstants.NON_OCC_DOCUMENT;
        this.businessId = this.nonOccBusinessKey;
        this.disabilityAssessmentService.getNonOccDisabilityReasons().subscribe(res => {
          this.setReasons(res);
        });
      } else {
        this.businessType = this.heirBusinessType;
        this.businessTransaction = AssessmentConstants.NON_OCC_DOCUMENT;
        this.businessId = this.heirBusinessKey;
        this.disabilityAssessmentService.getNonOccDisabilityReasons().subscribe(res => {
          this.setReasons(res);
        });
      }
      if (this.assessmentType.includes('Reassessment')) {
        this.assessmentBusinessType = this.reassessmentType;
        this.isReassessment = true;
        this.getHeading(this.assessmentType);
        // this.getAssessmentDocuments(this.assessmentRequestId, this.assessmentBusinessType);
      } else {
        this.assessmentBusinessType = this.businessType;
        // this.getAssessmentDocuments( this.nationalId || this.identifier, this.disabilityAssessmentService.prevDisabilityAssmntId || this.disbAssessmentId);
      }
      if (!this.isAmbo) {
        this.assessmentBusinessType = this.businessType;
        this.getAssessmentDocuments(
          this.nationalId || this.identifier,
          this.disabilityAssessmentService.prevDisabilityAssmntId || this.disbAssessmentId
        );
      }
      // if (this.isAmbo) {
      //   this.getSupportingDocuments(this.disabilityAssessmentService.prevDisabilityAssmntId, this.businessType);
      // }
      if (this.assessmentType.includes('Heir')) {
        this.isHeir = true;
      }
    });
    // this.requestDocumentList.forEach((result, i) =>
    //   this.docsLists.items.push({ ...new Lov(), value: result, sequence: i + 1 })
    // );
    this.getContributor();

    if (
    this.isGosiDoctor ||
    this.routerData.resourceType === RouterConstants.TRANSACTION_MB_ASSIGN_SESSION_GOSI_DOCTOR ||
    this.routerData.resourceType === RouterConstants.TRANSACTION_ASSIGN_TO_HO ||
    this.routerData.resourceType === RouterConstants.MB_CONVEYANCE_ALLOWANCE ||
      this.disabilityAssessmentService.assessmentStatus?.english === 'Draft'
    ) {
      this.reqAssessmentDetails = true;
      this.getGosiDoctorAssessment();
    }
    this.getClarificationDocuments();
    this.getBodyPartsList();
    this.getPreviousDisability();
    this.getVisitingDoctorDetails();
    this.getSessionData(this.sessionId || this.mbSessionId);
    this.getPreviousDisabilityById();
    this.getAssessmentDetails();
    this.getAssessmentById();
    this.getOriginLocation();
    this.getHelperReason();
    this.getHospitals();
    this.getSpecialities();
    this.getFieldOfficeLocation();
    this.getDisabledPartsById();
    if (
      this.assessmentTypeText?.english === 'Occupational Disability' ||
      this.assessmentType === 'Reassessment Occupational Disability' ||
      this.assessmentType === 'Occupational Disability Reassessment'
    ) {
      this.getDisability();
      this.getInjuryDetailsById();
    }

    if (this.documentList$) this.documentList$.subscribe(res => res.forEach(doc => (doc.canDelete = true)));
    console.log(this.isGosiDoctor, this.isReturn, this.isReassessment);
    this.modifiedByGosiDoc = this.disabilityAssessmentService.modifyAssessmentDetails;
  }
  /* Method to get disabled body parts by injury id */
  getDisabledPartsById() {
    this.disabilityAssessmentService.getDisabledPartsById(this.nationalId || this.identifier, this.injuryId).subscribe(
      res => {
        this.injuredParts = { injuredPerson: res };
      },
      err => (this.injuredParts = [])
    );
  }
  /* Method to get field office lov */
  getFieldOfficeLocation() {
    this.lookupService.getFieldOfficeList().subscribe(offices => (this.offices = offices));
  }
  /* Method to get required docs for assessment */
  getDocuments() {
    this.documentList$ = this.documentService.getDocuments(
      this.businessType,
      AssessmentConstants.MEDICAL_BOARD,
      this.assessmentResponse.disabilityAssessmentId,
      this.assessmentResponse.transactionTraceId
    );
  }
  /* Method to get city lov */
  getOriginLocation() {
    this.disabilityAssessmentService.getCityList().subscribe(res => {
      this.dropdownList = res.map(item => {
        return { id: item.sequence, value: item.value, icon: 'map-marker-alt' };
      });
    });
  }
  /* Method to get helper reason lov */
  getHelperReason() {
    return this.disabilityAssessmentService.getHelperReason().subscribe(res => {
      this.helperReasonList = res;
    });
  }
  /* Method to get hospitals lov */
  getHospitals() {
    this.hospital$ = this.lookupService.getHospitalList();
  }
  /* Method to get assessment details by nin/iqama */
  getAssessmentDetails() {
    this.disabilityAssessmentService.getAssessmentDetails(this.nationalId || this.identifier).subscribe(res => {});
  }
  /* Method to get assessment details by assessment request id */
  getAssessmentById() {
    this.medicalBoardService
      .getDisabilityDetails(this.nationalId || this.identifier, this.assessmentRequestId || this.assessmentReqId)
      .subscribe(res => {
        this.assessmentDetails = res;
        if (this.isAmbo) {
          this.getSupportingDocuments(
            this.assessmentDetails?.primaryAssessmentDetails?.disabilityAssessmentId,
            AssessmentConstants.APPEAL
          );
        }
        if (this.assessmentDetails.ohType === 2) this.getComplicationDetailsById(res.injuryNumber, res.injuryId);
      });
  }
  /* Method to get previous disability by injury id/ benefit request id */
  getPreviousDisabilityById() {
    this.disabilityAssessmentService
      .getPreviousDisability(
        this.nationalId || this.identifier,
        null,
        this.assessmentType,
        null,
        null,
        this.isOcc ? this.injuryId : null,
        !this.isOcc ? this.benefitReqId : null,
        true
      )
      .subscribe(res => {
        this.previousDisabilityDetailsById = res;
        // if (this.isAmbo) {
        //   this.previousDisabilityDetailsById?.data.forEach(data => {
        //     let disbAssmntId = data?.disabilityAssessmentId;
        //     this.getSupportingDocuments(disbAssmntId, this.businessType);
        //   });
        // }
      });
  }
  /* Method to get visiting doctor details */
  getVisitingDoctorDetails() {
    this.disabilityAssessmentService
      .getVisitingDoctorDetails(this.nationalId || this.identifier, this.assessmentRequestId || this.assessmentReqId)
      .subscribe(res => {
        this.visitingDoctorDetails = res;
      });
  }
  /* Method to get complication id */
  getComplicationDetailsById(injuryId, complicationId, isChangeRequired = false) {
    this.disabilityAssessmentService
      .getComplicationDetailsById(this.socialInsuranceNo, injuryId, complicationId, isChangeRequired)
      .subscribe(res => {
        this.complicationDetails = res;
      });
  }
  /* Method to get injury details by injury id */
  getInjuryDetailsById() {
    this.disabilityAssessmentService
      .getInjuryDetailsById(this.regNo, this.socialInsuranceNo, this.injuryId)
      .subscribe(res => {
        this.injuryDetailsById = res;
      });
  }
  /* Method to get contributor details */
  getContributor() {
    if (this.isGosiDoctor) {
      this.disabilityAssessmentService.getContributorBySin(this.socialInsuranceNo).subscribe(res => {
        this.personDetails = res;
        this.setAddressText(res?.person?.contactDetail?.addresses);
      });
    } else {
      this.disabilityAssessmentService.getContributorBySin(this.socialInsuranceNo).subscribe(res => {
        this.personDetails = res;
        this.setAddressText(res?.person?.contactDetail?.addresses);
      });
    }
    this.doctorService.getPerson(this.disabilityAssessmentService.identifier || this.identifier).subscribe(res => {
      this.heirPersonDetails = res.listOfPersons[0];
    });
  }
  /* Method to set address text */
  setAddressText(addresses: AddressDetails[]) {
    if (addresses && addresses?.length > 0)
      addresses.map(address => {
        if (address?.type === 'NATIONAL') {
          console.log(
            `${address.streetName ?? ''}${
              address?.city?.arabic ? address?.city?.arabic : address?.city?.english ? address?.city?.english : ''
            }${address.district ?? ''}`
          );
          this.addressText = `${address.streetName ?? ''}${
            address?.city?.arabic ? address?.city?.arabic : address?.city?.english ? address?.city?.english : ''
          }${address.district ?? ''}`;
        }
      });
  }
  /* Method to get body parts lov */
  getBodyPartsList() {
    this.lookupService.getBodyPartsList().subscribe(res => {
      this.bodyPartsCategoryList = res;
    });
  }
  /* Method to show cancel confirm modal */
  showCancelTemplate(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-md' }));
  }
  previousSection() {}
  /* Method to set origin location */
  setOrigin(location: OriginLocation) {
    this.originLongitude = location.originLongitude.toString();
    this.originLatitude = location.originLatitude.toString();
    if ((this.isReturn || this.ambReturn) && this.originLatitude !== this.gosiDoctorAssessDetails?.originLatitude) {
      this.locationChanged = true;
    }
  }
  /* Method to set city */
  setCity(city) {
    this.city = city;
  }
  getBodyPartsRawForm() {
    return (this.parentForm.get('bodyPartsList') as FormArray).getRawValue();
  }
  /* Method to save assessment details */
  saveAssessmentDetails() {
    const data = (this.parentForm.get('disabilityDetails') as FormGroup).getRawValue();
    let bodyParts;
    if (
      this.parentForm?.get('disabilityDetails')?.get('assessmentResult')?.value?.english === 'Cured With Disability' &&
      // this.parentForm.get('bodyPartsList')?.value
      this.getBodyPartsRawForm()
    ) {
      bodyParts = this.getBodyPartsRawForm().map(res => {
        return {
          bodypartCategory: res.category,
          bodyParts: res?.bodyParts?.english?.map(part => {
            return {
              english: part.english,
              arabic: this.bodyPartsCategoryList.items[res.bodyPartsIndex]?.items[part?.sequence - 1]?.value.arabic
            };
          })
        };
      });
    }
    if (
      (this.parentForm.get('disabilityDetails').valid && !this.isReturn) ||
      this.conveyanceRequired ||
      this.locationChanged
    ) {
      const caseDescriptionArray = [];
      if (
        this.parentForm.get('disabilityDetails.caseDescription') &&
        this.parentForm.get('disabilityDetails.caseDescription').value
      ) {
        const caseDescription = this.parentForm.get('disabilityDetails.caseDescription').value;
        const caseArray = caseDescription.split('');
        for (let i = 0; i < Math.ceil(caseArray.length / this.maxCharLimit); i++) {
          caseDescriptionArray.push(
            caseArray.slice(i * this.maxCharLimit, i * this.maxCharLimit + this.maxCharLimit).join('')
          );
        }
      }
      this.commentAlert = false;
      const disbDate = {
        gregorian: startOfDay(
          new Date(data?.disabilityDate?.gregorian)
        ),
        hijiri: data?.disabilityDate?.hijiri
      };
      const disabilityDate = {
        gregorian: startOfDay(
          new Date(this.parentForm?.get('disabilityDetails')?.get('disabilityDate')?.get('gregorian')?.value)
        ),
        hijiri: this.parentForm?.get('disabilityDetails')?.get('disabilityDate')?.get('hijiri')?.value
      };
      let assessmentRequest = {
        ...this.parentForm.get('disabilityDetails').value,
        assessmentRequestId: this.assessmentRequestId || this.assessmentReqId,
        regNo: this.regNo,
        assessmentType:
          this.isReturn || this.ambReturn || this.isGosiDoctor || this.conveyanceRequired
            ? this.gosiDoctorAssessDetails?.assessmentType
            : this.assessmentTypeText,
        isParticipantPresent: this.parentForm?.get('disabilityDetails')?.get('isParticipantPresent')?.value,
        assessmentChannel: this.parentForm?.get('disabilityDetails')?.get('assessmentChannel')?.value,
        locationType: this.parentForm?.get('disabilityDetails')?.get('locationType')?.value,
        officeLocation: this.parentForm?.get('disabilityDetails')?.get('officeLocation')?.value,
        assessmentResult: this.parentForm?.get('disabilityDetails')?.get('assessmentResult')?.value,
        primaryGosiDr: {
          name: this.parentForm?.get('disabilityDetails')?.get('primaryGosiDr')?.value,
          mbProfessionId: this.sessionData.mbList.filter(list => list?.contractType?.english === 'Gosi Doctor')[
            this.doctorSequence - 1
          ]?.mbProfessionId,
          contractType: this.sessionData.mbList.filter(list => list?.contractType?.english === 'Gosi Doctor')[
            this.doctorSequence - 1
          ]?.contractType
        },
        nextAssessmentSpeciality: this.parentForm?.get('disabilityDetails')?.get('otherSpeciality')?.value,
        disabilityDate: disabilityDate?.gregorian === null ? disbDate : disabilityDate,
        disabilityEndDate: {
          gregorian: startOfDay(
            new Date(this.parentForm?.get('disabilityDetails')?.get('disabilityEndDate')?.get('gregorian')?.value)
          ),
          hijiri: this.parentForm?.get('disabilityDetails')?.get('disabilityEndDate')?.get('hijiri')?.value
        },
        assessedBy: this.parentForm
          ?.get('disabilityDetails')
          ?.get('assessedBy')
          ?.get('english')
          ?.value?.map(item => {
            return {
              name: {
                english: this.sessionDataLovList.items[item.sequence - 1]?.value?.english,
                arabic: this.sessionDataLovList.items[item.sequence - 1]?.value?.arabic
              },
              mbProfessionId: this.sessionData.mbList[item.sequence - 1]?.mbProfessionId,
              contractType: this.sessionData.mbList[item.sequence - 1]?.contractType
            };
          }),
        disabilityPercentage: Number(this.parentForm?.get('disabilityDetails')?.get('disabilityPercentage')?.value),
        helperStartDate: {
          gregorian: startOfDay(
            new Date(this.parentForm?.get('disabilityDetails')?.get('helperStartDate')?.get('gregorian')?.value)
          ),
          hijiri: this.parentForm?.get('disabilityDetails')?.get('helperStartDate')?.get('hijiri')?.value
        },
        nextAssessmentDate: {
          gregorian: startOfDay(
            new Date(this.parentForm?.get('disabilityDetails')?.get('nextAssessmentDate')?.get('gregorian')?.value)
          ),
          hijiri: this.parentForm?.get('disabilityDetails')?.get('nextAssessmentDate')?.get('hijiri')?.value
        },
        reasonForHelper: this.parentForm
          ?.get('disabilityDetails')
          ?.get('reasonForHelper')
          ?.get('english')
          ?.value?.map(item => {
            return {
              english: this.helperReasonList.items[item.sequence - 1]?.value?.english,
              arabic: this.helperReasonList.items[item.sequence - 1]?.value?.arabic
            };
          }),
        requestedDocs: this.parentForm
          ?.get('disabilityDetails')
          ?.get('requestedDocs')
          ?.get('english')
          ?.value?.map(item => {
            return {
              english: this.requestDocumentList.items[item.sequence - 1]?.value?.english,
              arabic: this.requestDocumentList.items[item.sequence - 1]?.value?.arabic
            };
          }),
        sessionId: this.disabilityAssessmentService.sessionIdMb,
        bodyPartsList: bodyParts,
        originLongitude: this.originLongitude,
        originLatitude: this.originLatitude,
        isGosiDoctor: this.isGosiDoctor,
        caseDescriptions: caseDescriptionArray
      };
      if (this.city) assessmentRequest = { ...assessmentRequest, city: this.city };
      if (assessmentRequest?.caseDescription) {
        delete assessmentRequest['caseDescription'];
      }
      if (this.injuryId) {
        assessmentRequest = {
          ...assessmentRequest,
          injuryId: this.injuryId
        };
      }
      if (this.benefitReqId) {
        assessmentRequest = { ...assessmentRequest, benefitReqId: this.benefitReqId };
      }
      if (assessmentRequest.participantLocation !== null) delete assessmentRequest['participantLocation'];
      if (this.disabilityAssessmentService.prevDisbAssmntId) {
        this.assessmentResponse.disabilityAssessmentId = this.disabilityAssessmentService.prevDisbAssmntId;
        if (this.gosiDoctorAssessDetails?.referenceNo) {
          this.assessmentResponse.transactionTraceId = this.gosiDoctorAssessDetails?.referenceNo;
        }
      } else if (this.conveyanceRequired || this.locationChanged) {
        this.assessmentResponse.disabilityAssessmentId = this.disbAssessmentId;
        this.assessmentResponse.transactionTraceId = this.assessmentRefNo || this.referenceNo;
      } else {
        this.assessmentResponse.disabilityAssessmentId = this.disabilityAssessmentService.mbassessmentId;
        this.assessmentResponse.transactionTraceId = this.disabilityAssessmentService.transactionTraceId;
      }
      if (this.isReassessment && !this.assessmentResponse.transactionTraceId) {
        this.assessmentResponse.disabilityAssessmentId = this.disabilityAssessmentService.prevDisbAssmntId;
      }
      if (this.ambReturn) {
        this.assessmentResponse.disabilityAssessmentId = this.disbAssessmentId;
        this.assessmentResponse.transactionTraceId = this.referenceNo;
      }
      this.disabilityAssessmentService
        .editAssessment(
          assessmentRequest,
          this.conveyanceRequired || this.locationChanged || this.ambReturn ? this.identifier : this.nationalId,
          this.assessmentResponse,
          this.isReturn || this.ambReturn || this.conveyanceRequired ? true : null
        )
        .subscribe(
          res => {
            if (res.transactionTraceId) {
              this.assessmentResponse.disabilityAssessmentId = res.disabilityAssessmentId;
              this.assessmentResponse.transactionTraceId = res.transactionTraceId;
              this.assessmentResponse.isFinalReschedule = res?.isFinalReschedule;
              this.assessmentResponse.sessionCompleted = res?.sessionCompleted;
            }
            this.nextTab();
            this.getDocuments();
            if (this.isGosiDoctor) {
              // this.getDocuments();
              this.documentFetch(this.personId, this.assessmentResponse.transactionTraceId);
            }
          },
          err => {
            this.alertService.showError(err?.error?.message);
          }
        );
      // } else {
      //   this.disabilityAssessmentService.createAssessment(assessmentRequest, this.nationalId).subscribe(res => {
      //     this.assessmentResponse.disabilityAssessmentId = res.disabilityAssessmentId;
      //     this.assessmentResponse.transactionTraceId = res.transactionTraceId;
      //     this.assessmentResponse.isFinalReschedule = res?.isFinalReschedule;
      //     this.getDocuments();
      //     this.nextTab();
      //   });
      // }
    } else if (this.isReturn || this.ambReturn) {
      this.nextTab();
      this.assessmentResponse.disabilityAssessmentId = this.disbAssessmentId;
      this.assessmentResponse.transactionTraceId = this.referenceNo;
      this.getDocuments();
      this.documentFetch(this.personId, this.referenceNo);
    } else {
      this.parentForm.markAllAsTouched();
      this.commentAlert = true;
      scrollToTop();
    }
    this.modalRef.hide();
  }
  /* Method to get injury details */
  getDisability() {
    this.disabilityAssessmentService
      .getDisabilityDetails(this.regNo, this.socialInsuranceNo, this.injuryId, this.transactionNumber)
      .subscribe(
        response => {
          this.injuredPersonDetails = response;
        },
        () => {}
      );
  }
  /* Method to get previous disability */
  getPreviousDisability() {
    this.disabilityAssessmentService
      .getPreviousDisability(this.nationalId || this.identifier, null, null, null, null, null, null, true)
      .subscribe(res => {
        this.previousDisabilityDetails = res;
      });
  }
  onContributorTabSelected() {}
  onAssessmentTabSelected() {}
  onDependentTabSelected() {}
  /* Method to view assessment details by assessment id */
  viewAssessmentById(disabilityDetail) {
    if (this.modalRef) this.modalRef.hide();
    this.viewPrevAssessment = true;
    this.coreBenefitService.injuryId = disabilityDetail?.injuryId;
    this.disabilityAssessmentService.disabilityAssessmentId = disabilityDetail?.assessmentId;
    this.disabilityAssessmentService.assessmentTypes = disabilityDetail?.assessmentType;
    this.disabilityAssessmentService.benefitReqId = disabilityDetail?.benefitReqId;
    this.disabilityAssessmentService.referenceNo = disabilityDetail?.referenceNo;
    this.coreAdjustmentService.socialNumber = disabilityDetail?.sin;
    this.router.navigate([AssessmentConstants.ROUTE_VIEW_ASSESSMENT]);
  }
  /* Method to view mb assessment modal */
  viewMBAssessmentModal(mbAssessmentTemplate: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(mbAssessmentTemplate, Object.assign({}, { class: 'modal-lg' }));
  }
  /* Method to navigate to injury history */
  viewInjuryHistory() {
    this.coreContributorService.registartionNo = this.regNo;
    this.coreContributorService.selectedSIN = this.socialInsuranceNo;
    this.coreMedicalAssessmentService.fromMb = true;
    this.router.navigate(['/home/oh/injury/history']);
  }
  /* Method to navigate to injury details */
  viewInjuryInfo(injuryId) {
    this.router.navigate([`/home/oh/injury/view/${this.regNo}/${this.socialInsuranceNo}/${injuryId}`]);
  }
  /* Method to navigate to contributor profile */
  viewContributorDetails(identifier) {
    this.router.navigate([RouterConstants.ROUTE_INDIVIDUAL_PROFILE_INFO(identifier)]);
  }
  /* Method to navigate to engagement details */
  viewEngagementDetails() {
    this.router.navigate([RouterConstants.ROUTE_ENGAGEMENT(this.nationalId)]);
  }
  /** Method to initialise progress wizard */
  initializeWizard() {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(AssessmentConstants.ASSESSMENT_DETAILS, 'file-medical')); //TODO: change icon
    wizardItems.push(new WizardItem(AssessmentConstants.DOCUMENTS, 'file-alt'));
    this.assessmentWizards = wizardItems;
    this.assessmentWizards[this.currentTab].isActive = true;
    this.assessmentWizards[this.currentTab].isDisabled = false;
  }
  /* Method to select wizard */
  selectedWizard(index: number) {
    this.currentTab = index;
  }
  /* Method to submit assessment */
  submitDocument(comments) {
    this.disabilityAssessmentService
      .submitAssessmentDetails(
        { comments: comments },
        this.nationalId || this.identifier,
        this.assessmentResponse.transactionTraceId || this.referenceNo,
        this.assessmentResponse.disabilityAssessmentId || this.disbAssessmentId,
        this.isGosiDoctor ? this.isGosiDoctor : null,
        this.isReturn || this.ambReturn || this.conveyanceRequired ? true : null
      )
      .subscribe(res => {
        if (this.isGosiDoctor) {
          this.disabilityAssessmentService.isModified = true;
          this.location.back();
          this.alertService.showSuccess(res.message);
          // this.alertService.clearAllErrorAlerts();
        } else if (this.isReturn || this.ambReturn || this.conveyanceRequired) {
          let comment;
          comment = comments;
          let action;
          if (
            this.ambReturn &&
            this.parentForm?.get('disabilityDetails')?.get('isParticipantPresent')?.value === false &&
            this.parentForm?.get('disabilityDetails')?.get('assessmentChannel')?.value?.english ===
              MBConstants.RESCHEDULE_ASSESSMENT &&
            this.assessmentDetails?.isVdRequired
          ) {
            action = WorkFlowActions.MODIFY_VISITING_DOCTOR;
          } else if (
            this.ambReturn &&
            this.parentForm?.get('disabilityDetails')?.get('isParticipantPresent')?.value === false &&
            this.parentForm?.get('disabilityDetails')?.get('assessmentChannel')?.value?.english ===
              MBConstants.RESCHEDULE_ASSESSMENT &&
            !this.assessmentDetails?.isVdRequired
          ) {
            action = WorkFlowActions.APPROVE;
          } else if (
            this.ambReturn &&
            (this.parentForm?.get('disabilityDetails')?.get('rescheduleReason')?.value?.english ===
              MBConstants.REQUEST_CLARIFICATION_FROM_CONTRIBUTOR ||
              this.parentForm?.get('disabilityDetails')?.get('rescheduleReason')?.value?.english ===
                MBConstants.REQUEST_CLARIFICATION_FROM_HEIR)
          ) {
            action = WorkFlowActions.REQUEST_CLARIFICATION_FROM_CONTRIBUTOR;
          } else if (
            this.ambReturn &&
            (this.parentForm?.get('disabilityDetails')?.get('rescheduleReason')?.value?.english ===
              MBConstants.VISITING_DOCTOR_UNAVAILABILITY ||
              this.parentForm?.get('disabilityDetails')?.get('rescheduleReason')?.value?.english ===
                MBConstants.ADD_ANOTHER_SPECIALITY)
          ) {
            action = WorkFlowActions.MODIFY_VISITING_DOCTOR;
          } else {
            action = WorkFlowActions.SUBMIT;
          }

          const datas = this.setWorkflowData(this.routerData, action, comment);
          this.saveWorkflow(datas);
        } else {
          if (this.assessmentResponse.sessionCompleted || this.conveyanceRequired) {
            this.router.navigate([RouterConstants.ROUTE_INBOX]);
          } else {
            this.location.back();
          }
          this.alertService.showSuccess(res.message);
          if (this.assessmentResponse?.isFinalReschedule) {
            this.alertService.showWarningByKey('MEDICAL-BOARD.PARTICIPANT-NO-SHOW-MSG');
          }
        }
      });
  }
  /* Method to navigate to previous tab */
  previousForm() {
    this.navigateToPreviousTab();
  }
  refreshDocument(docItem) {}
  /* Method to hide modal */
  confirmCancel() {
    if (this.modalRef) this.modalRef.hide();
    this.location.back();
  }
  /* Method to hide modal */
  decline() {
    if (this.modalRef) this.modalRef.hide();
  }
  /** Method to navigate to next tab */
  nextTab() {
    scrollToTop();
    this.currentTab = 1;
    this.alertService.clearAlerts();
    this.assessmentWizard.setNextItem(this.currentTab);
  }
  /** Method to navigate to previous tab */
  navigateToPreviousTab() {
    scrollToTop();
    this.alertService.clearAlerts();
    this.currentTab = 0;
    this.assessmentWizard.setPreviousItem(this.currentTab);
  }
  /* Method to set main, secondary reason lov */
  setReasons(res) {
    this.mainReasonList = res;
    this.secondaryReasonList = res;
  }
  /* Method to get specialities lov */
  getSpecialities() {
    this.disabilityAssessmentService.getSpecialities().subscribe(res => (this.otherSpecialityList = new LovList(res)));
  }
  /* Method to get docs by injury id for occ and benefit request id for non-occ */
  getSupportingDocuments(transactionId, businessTransaction) {
    this.documentService.getAllDocuments(transactionId, businessTransaction).subscribe(documentsResponse => {
      if (documentsResponse) {
        if (this.isAmbo) {
          this.amboDocuments = documentsResponse.filter(item => item.documentContent !== null);
          // this.docsForambo.push(...this.amboDocuments);

          // this.supportingDocuments = documentsResponse?.filter(item => item.documentContent !== null);
        }
      }
    });
  }

  /* Method to get assessment docs by assessment id */
  getAssessmentDocuments(identifier, disabilityAssessmentId) {
    this.coreMedicalAssessmentService
      .getMedicalBoardDocuments(identifier, disabilityAssessmentId)
      .subscribe(documentsResponse => {
        if (documentsResponse.length > 0) {
          this.supportingDocuments = documentsResponse?.filter(item => item.documentContent !== null);
        }
      });
  }
  /* Method to get assessment details by assessment id */
  getGosiDoctorAssessment() {
    this.doctorService
      .getAssessmentDetails(
        this.nationalId || this.identifier,
        this.disabilityAssessmentId || this.disbAssessmentId,
        this.transactionTraceId
      )
      .subscribe(res => {
        this.gosiDoctorAssessDetails = res;
        if (this.gosiDoctorAssessDetails.assessmentType.english.includes('isReassessment')) {
          this.isReassessment = true;
        }
        if (this.gosiDoctorAssessDetails?.isSaudi) {
          this.isSaudi = true;
        }
        // this.parentForm.get('disabilityDetails')?.patchValue(this.gosiDoctorAssessDetails);
        // this.parentForm.updateValueAndValidity();
      });
  }
  /* Method to get uploaded docs */
  documentFetch(personId, referenceNo) {
    this.documentService.getOldDocuments(personId, null, null, referenceNo).subscribe(documentResponse => {
      if (documentResponse) {
        this.complicationDocumentList = documentResponse.filter(item => item.documentContent !== null);
        this.documents = documentResponse.filter(item => item.documentContent !== null);
      }
    });
  }
  /* Method to set the selected doctor */
  onDoctorSelected(doctor) {
    this.doctorSequence = doctor.sequence;
    this.sessionDataLovListTemp = {
      ...this.sessionDataLovList,
      items: this.sessionDataLovList.items.filter(item => item.code != doctor.code)
    };
  }
  /* Method to get clarification docs lov */
  getClarificationDocuments() {
    this.lookupService.getClarificationDocuments().subscribe(res => {
      this.requestDocumentList = res;
    });
  }
  getHeading(assessmentType) {
    if (
      assessmentType === 'Reassessment Occupational Disability' ||
      assessmentType === 'Occupational Disability Reassessment'
    ) {
      this.heading = 'MEDICAL-BOARD.REASSESSMENT-OCCUPATIONAL';
    } else if (
      assessmentType === 'Reassessment Non-Occupational Disability' ||
      assessmentType === 'Non-Occupational Disability Reassessment' ||
      assessmentType === 'Non - Occupational Disability Reassessment'
    ) {
      this.heading = 'MEDICAL-BOARD.REASSESSMENT-NON-OCC';
    } else if (
      assessmentType === 'Reassessment Dependent Disability' ||
      assessmentType === 'Dependent Disability Reassessment'
    ) {
      this.heading = 'MEDICAL-BOARD.REASSESSMENT-DEPENDENT';
    } else {
      this.heading = 'MEDICAL-BOARD.REASSESSMENT-HEIR';
    }
  }
  showRescheduleWarning(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-lg' }));
  }
  hideModal() {
    this.modalRef.hide();
  }
  getHelperDates(type: string, percentage?: number) {
    this.validateDateDto.assessmentReqId = this.assessmentRequestId
      ? this.assessmentRequestId.toString()
      : this.assessmentReqId.toString();
    this.validateDateDto.assessmentResult = this.parentForm
      ?.get('disabilityDetails')
      ?.get('assessmentResult')?.value?.english;
    this.validateDateDto.isHelperRequired = type ? type : 'No';
    const disbPercentage = this.parentForm?.get('disabilityDetails')?.get('disabilityPercentage')?.value;
    this.doctorService
      .getHelperDates(
        this.nationalId || this.identifier,
        this.validateDateDto,
        null,
        disbPercentage,
        disbPercentage && this.injuryId ? this.injuryId : null
      )
      .subscribe(res => {
        this.assessmentResponseDateDto = res;
      });
  }
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    if(!this.viewPrevAssessment){
    this.disabilityAssessmentService.assessmentType = null;
    this.disabilityAssessmentService.mbassessmentId = null;
    this.disabilityAssessmentService.nationalID = null;
    this.coreBenefitService.regNo = null;
    this.disabilityAssessmentService.getRegistrationNo();
    this.coreBenefitService.assessmentRequestId = null;
    this.disabilityAssessmentService.identifier = null;
    }
  }
}
