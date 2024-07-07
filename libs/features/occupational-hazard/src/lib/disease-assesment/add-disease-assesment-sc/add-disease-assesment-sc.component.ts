import { Component, Inject, OnInit } from '@angular/core';
import { Contributor, DiseaseWrapper, Injury, MedicalBoardService } from '../../shared';
import { AlertService, BilingualText, CoreAdjustmentService, CoreBenefitService, CoreContributorService, DisabilityData, DisabilityDetails, DocumentItem, DocumentService, LanguageToken, LookupService, LovList, MedicalAssessmentService, RouterData, RouterDataToken, WorkflowService } from '@gosi-ui/core';
import { AssessmentDetail, AssessmentResponseDateDto, CreateSessionBaseScComponent, CreateSessionService, DisabilityAssessmentService, DoctorService, OriginLocation, Person, SessionConfigurationService, SessionStatusService } from '@gosi-ui/features/medical-board/lib/shared';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';


@Component({
  selector: 'oh-add-disease-assesment-sc',
  templateUrl: './add-disease-assesment-sc.component.html',
  styleUrls: ['./add-disease-assesment-sc.component.scss']
})
export class AddDiseaseAssesmentScComponent extends CreateSessionBaseScComponent implements OnInit {
  personDetails: Contributor;
  injuryDetails: Injury;
  assessmentType: string;
  diseaseDetails: any;
  parentForm: FormGroup;
  assessmentDetails: DisabilityDetails;
  bodyPartsCategoryList: LovList;
  isGosiDoctor = false;
  previousDisabilityDetailsById: DisabilityData;
  heirPersonDetails: Person;
  offices: LovList;
  mainReasonList: LovList;
  secondaryReasonList: LovList;
  reqAssessmentDetails = false;
  gosiDoctorAssessDetails: AssessmentDetail;
  listYesNo$ = new Observable<LovList>();
  helperReasonList: LovList;
  hospital$: Observable<LovList>;
  doctorSequence: number;
  originLongitude: string;
  originLatitude: string;
  isReturn = false;
  locationChanged = false;
  city: string;
  requestDocumentList: LovList;
  isHeir = false;
  conveyanceRequired = false;
  assessmentResponseDateDto: AssessmentResponseDateDto;
  assessmentTypeText: BilingualText;
  isAmbo = false;
  isSaudi = false;
  addressText: string;


















  injuredParts;
  otherSpecialityList: LovList;
  diseaseDetailsWrapper: DiseaseWrapper = new DiseaseWrapper();
  supportingDocuments: DocumentItem[] = [];
  docsForambo = [];
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
  ) {super( router,
    activatedRoute,
    lookupService,
    modalService,
    statusService,
    alertService,
    sessionService,
    workflowService,
    configurationService)}

  ngOnInit(): void {}
  onContributorTabSelected() {}
  onOccupationSelected() {}
  /* Method to set the selected doctor */
  onDoctorSelected(doctor) {
    this.doctorSequence = doctor.sequence;
    this.sessionDataLovListTemp = {
      ...this.sessionDataLovList,
      items: this.sessionDataLovList.items.filter(item => item.code != doctor.code)
    };
  }
  /* Method to set origin location */
  setOrigin(location: OriginLocation) {
    this.originLongitude = location.originLongitude.toString();
    this.originLatitude = location.originLatitude.toString();
    if (this.isReturn && this.originLatitude !== this.gosiDoctorAssessDetails?.originLatitude) {
      this.locationChanged = true;
    }
  }
  /* Method to set city */
  setCity(city) {
    this.city = city;
  }
  /* Method to get contributor details */
  getContributor() {
    // if (this.isGosiDoctor) {
    //   this.disabilityAssessmentService.getContributorBySin(this.socialInsuranceNo).subscribe(res => {
    //     this.personDetails = res;
    //     this.setAddressText(res?.person?.contactDetail?.addresses);
    //   });
    // } else {
    //   this.disabilityAssessmentService.getContributorBySin(this.socialInsuranceNo).subscribe(res => {
    //     this.personDetails = res;
    //     this.setAddressText(res?.person?.contactDetail?.addresses);
    //   });
    //   this.doctorService.getPerson(this.disabilityAssessmentService.identifier || this.identifier).subscribe(res => {
    //     this.heirPersonDetails = res.listOfPersons[0];
    //   });
    // }
  }
}
