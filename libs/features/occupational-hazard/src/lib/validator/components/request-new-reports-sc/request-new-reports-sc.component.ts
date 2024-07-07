import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DocumentService,
  LookupService,
  LovList,
  MedicalAssessmentService,
  RouterData,
  RouterDataToken,
  WorkflowService,
  markFormGroupTouched
} from '@gosi-ui/core';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import { Location, PlatformLocation } from '@angular/common';
import { AlertService, ApplicationTypeToken, LanguageToken, AuthTokenService } from '@gosi-ui/core';
import {
  OhService,
  InjuryService,
  EstablishmentService,
  ComplicationService,
  ContributorService,
  DiseaseService
} from '../../../shared/services';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'oh-request-new-reports-sc',
  templateUrl: './request-new-reports-sc.component.html',
  styleUrls: ['./request-new-reports-sc.component.scss']
})
export class RequestNewReportsScComponent extends ValidatorBaseScComponent implements OnInit {
  /**
   * Local & Input Variable
   */
  requestReportsForm: FormGroup = new FormGroup({});
  reportsFormControl = new FormGroup({});
  specialtyList: LovList;
  investigationDocType: LovList;
  code: number;

  documentTypeList$: LovList;
  cptCodeList$ = new LovList([]);
  documentRadioform = new FormGroup({});

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly ohService: OhService,
    readonly injuryService: InjuryService,
    readonly establishmentService: EstablishmentService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly contributorService: ContributorService,
    readonly workflowService: WorkflowService,
    readonly fb: FormBuilder,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly authTokenService: AuthTokenService,
    readonly lookupService: LookupService,
    readonly coreMedicalAssessmentService: MedicalAssessmentService
  ) {
    super(
      language,
      ohService,
      injuryService,
      establishmentService,
      complicationService,
      diseaseService,
      alertService,
      router,
      modalService,
      documentService,
      contributorService,
      workflowService,
      fb,
      routerData,
      location,
      pLocation,
      appToken,
      authTokenService,
      coreMedicalAssessmentService
    );
  }
  // Initialize while page loading

  ngOnInit(): void {
    this.GetLookupValues();
    this.initializeFormControl();
    this.reportDetails = this.injuryService.getMedicalReportDetails(); // get details while route
  }
  GetLookupValues() {
    this.getSpecialityList();
    this.getDocumentTypeList();
    this.getInvestigationList();
  }
  initializeFormControl() {
    this.reportsFormControl = this.createReportsFormGroup();
    this.requestReportsForm = this.createReportsForm();
  }

  getInvestigationList() {
    this.lookupService.getInvestigation().subscribe(res => {
      this.investigationDocType = res;
    });
  }
  addAnotherRequest(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
    this.requestReportsForm?.reset();
    this.documentRadioform = this.fb.group({
      documentType: this.fb.group({
        english: ['Medical Report'],
        arabic: ['تقرير طبي']
      })
    });
  }
  getSpecialityList() {
    this.lookupService.getSpecialityList().subscribe(res => {
      if (res) this.specialtyList = res;
    });
  }
  cancelSubmit() {
    this.location.back();
  }
  /**
   * To remove the Row
   */
  onDeleteField(i: number) {
    this.medicalReportsArray.splice(i, 1);
  }
  createReportsForm() {
    return this.fb.group({
      specialty: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      cptCodeDetails: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      documentDetails: ['', { validators: Validators.required }]
    });
  }
  selectedSpecialty(selectedSpeciality) {
    switch (selectedSpeciality?.value?.english) {
      case 'Radiology':
        this.code = 1002;
        break;
      case 'Laboratory':
        this.code = 1010;
        break;
      case 'Dentist':
        this.code = 1001;
        break;
      default:
        this.code = 1003;
        break;
    }
    this.ohService
      .getCPTCodeDetails(
        this.reportDetails.resourceType,
        this.reportDetails.socNo,
        this.reportDetails.injId,
        this.code,
        selectedSpeciality?.value?.english,
        this.code,
        this.reportDetails?.identityNumber,
        this.reportDetails?.mbAssessmentRequestId
      )
      .subscribe((res: [{ cptCode: string; cptCodeDescription: string }]) => this.getCptCodeList(res));
    this.requestReportsForm.get('specialty').valueChanges.subscribe(() => {
      this.requestReportsForm.get('cptCodeDetails').reset();
      this.requestReportsForm?.get('documentDetails')?.reset();
    });
  }
  onchangeDocType(value) {
    if (value) this.requestReportsForm.reset();
  }
  requestNewMedicalReport() {
    if (
      (this.medicalReportsArray && this.medicalReportsArray.length < 1) ||
      this.reportsFormControl.invalid ||
      this.requestReportsForm.invalid
    ) {
      if (this.medicalReportsArray.length < 1) {
        this.alertService.showError({ english: 'Please add atleast  one document detail', arabic: '' });
      }
      if (this.reportsFormControl.invalid) {
        markFormGroupTouched(this.reportsFormControl);
      }
    } else {
      if (this.getDuplicateRowValues()) {
        this.alertService.showError({
          english: 'You can’t add multiple row with same details of Required Medical Reports',
          arabic: ''
        });
      }
      // structure change 
      const reportDetailsDto = {
        medicalReportsDetailsDtos: this.medicalReportsArray,
        ...{ transactionId: this.reportDetails.refNo }
      };
      this.ohService
        .saveTpaDocuments(
          reportDetailsDto,
          this.reportDetails.resourceType,
          this.reportDetails.socNo,
          this.reportDetails.injId,
          this.reportDetails.identityNumber,
          this.reportDetails.mbAssessmentRequestId
        )
        .subscribe(
          response => {
            if (response?.english) {
              this.confirmTPAReport(reportDetailsDto);
            }
          },
          err => this.alertService.showError(err.error.message)
        );
    }
  }
  getDocumentTypeList() {
    this.documentTypeList$ = new LovList([
      { value: { english: 'Medical Report', arabic: 'تقرير طبي' }, sequence: 0 },
      { value: { english: 'Laboratory test', arabic: 'فحص مخبري' }, sequence: 1 }
    ]);
  }
  getCptCodeList(res: [{ cptCode: string; cptCodeDescription: string }]) {
    this.cptCodeList$ = new LovList([]);
    res.forEach((data, i) => {
      this.cptCodeList$.items.push({
        value: {
          english: `${data?.cptCode}-${data?.cptCodeDescription}`,
          arabic: `${data?.cptCode}-${data?.cptCodeDescription}`
        },
        sequence: i + 1
      });
    });
  }
  addRequestNewMedicalReports() {
    const eachRequest = {
      documentType: this.documentRadioform.get('documentType').value,
      specialty: this.requestReportsForm.get('specialty')?.value,
      cptCodeDetails: this.requestReportsForm?.get('cptCodeDetails')?.value,
      documentDetails: this.requestReportsForm?.get('documentDetails')?.value,
      cptCode: this.requestReportsForm?.get('cptCodeDetails')?.get('english')?.value?.split('-')[0],
      cptDescription: this.requestReportsForm?.get('cptCodeDetails')?.get('english')?.value?.split('-')[1]
    };
    this.medicalReportsArray.push(eachRequest);
    this.modalRef?.hide();
  }
  onChange(event) {
    if (event === undefined) {
      if (this.requestReportsForm?.get('specialty')?.value === null) {
        this.requestReportsForm.reset();
      }
    }
  }
  getDuplicateRowValues() {
    const reportSet = new Set();
    for (const eachReport of this.medicalReportsArray) {
      const report = JSON.stringify(eachReport);
      if (reportSet.has(report)) {
        return true;
      }
      reportSet.add(report);
    }
    return false;
  }
}
