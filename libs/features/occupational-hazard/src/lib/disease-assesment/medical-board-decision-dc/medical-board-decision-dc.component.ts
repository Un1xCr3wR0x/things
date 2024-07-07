import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText, DisabilityDetails, Lov, LovList, MedicalboardAssessmentService, convertToYYYYMMDD, greaterThanValidator, lessThanValidator } from '@gosi-ui/core';
import { showModal } from '@gosi-ui/features/benefits/lib/shared';
import { AssessmentResponseDateDto, Contributor,  OriginLocation, Person, RescheduleSessionData } from '@gosi-ui/features/medical-board/lib/shared';
import { AssessmentDetail } from '@gosi-ui/features/medical-board/lib/shared/models/assessment-details';
import moment from 'moment';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';


@Component({
  selector: 'oh-medical-board-decision-dc',
  templateUrl: './medical-board-decision-dc.component.html',
  styleUrls: ['./medical-board-decision-dc.component.scss']
})
export class MedicalBoardDecisionDcComponent implements OnInit {
  

  @Input() listYesNo$ = new Observable<LovList>();
  @Input() sessionDataLovList: LovList;
  @Input() sessionDataLovListTemp: LovList;
  @Input() sessionGosiDrLovList: LovList;
  @Input() parentForm: FormGroup;
  @Input() helperReasonList: LovList;
  @Input() hospital$: Observable<LovList>;
  @Input() bodyPartsCategoryList;
  @Input() assessmentType;
  @Input() mainReasonList: LovList;
  @Input() offices: LovList = new LovList([]);
  @Input() otherSpecialityList: LovList = new LovList([]);
  @Input() secondaryReasonList: LovList;
  @Input() gosiDoctorAssessDetails: AssessmentDetail;
  @Input() injuredParts;
  @Input() isGosiDoctor = false;
  @Input() personDetails: Contributor;
  @Input() docsLists;
  @Input() isAmb = false;
  @Input() previousDisabilityDetailsById;
  @Input() sessionData: RescheduleSessionData;
  @Input() isReturn = false;
  @Input() isHeir = false;
  @Input() conveyanceRequired = false;
  @Input() assessmentResponseDateDto: AssessmentResponseDateDto;
  @Input() assessmentTypeText: BilingualText;
  @Input() isAmbo = false;
  @Input() doctorList: LovList;
  @Input() isSaudi = false;
  @Input() addressValue: string;
  @Input() heirPersonDetails: Person;
  @Input() assessmentDetails: DisabilityDetails;

  @Output() onMainDoctorSelected = new EventEmitter<Lov>();
  @Output() onOriginSelected = new EventEmitter<OriginLocation>();
  @Output() helperDateLimits = new EventEmitter<string>();
  @Output() onCitySelected = new EventEmitter<string>();
  @Output() getAssessmentDate: EventEmitter<number> = new EventEmitter();
  // @Input() injuredPersonDetails;
  @ViewChild('addresstext', { static: false }) addresstext: any;

  boardDecisonForm: FormGroup;
  assessmentChannelList: LovList = new LovList([]);
  assessmentChannelListParticipantNo: LovList = new LovList([]);
  assessmentResultList: LovList = new LovList([]);
  locationTypeList: LovList = new LovList([]);
  rescheduleReasonList: LovList = new LovList([]);
  nonOccAssessmentResultList: LovList = new LovList([]);

  helperRequired: string;
  assessedDoctors: BilingualText[] = [];
  reasonsForHelp: BilingualText[] = [];
  selectedDocument: [] = [];
  docList: Lov[];
  documentList: LovList;
  modalRef: BsModalRef;
  minDate: Date;
  geoCoder: google.maps.Geocoder;
  address: string;
  startDate: Date;
  endDate: Date;
  nextAssessmentMinDate: Date;
  nextAssessmentMaxDate: Date;
  disabilityEndMinDate: Date;
  disabilityEndMaxDate: Date;
  isNonOccReassessment = false;
  injuredBodyParts;
  @ViewChild('contributorModal', { static: true })
  contributorModal: TemplateRef<HTMLElement>;
  channels = [
    { english: 'In Office', arabic: 'في المكتب' },
    { english: 'Virtual', arabic: 'افتراضي' }
  ];
  channelsParticipantNo = [
    { english: 'Assessment by Medical Report', arabic: 'التقييم عن طريق التقرير الطبي' },
    { english: 'Reschedule Assessment', arabic: 'إعادة جدولة' }
  ];
  results = [
    {
      english: 'Injury is not related to Occupational Disability',
      arabic: 'لا علاقة للإصابة بالإعاقة المهنية'
    },
    { english: 'Case not Occupational Hazard', arabic: 'ليست إصابة عمل' },
    { english: 'Cured With Disability', arabic: 'شفاء بعجز' },
    { english: 'Cured Without Disability', arabic: 'شفاء بدون عجز' },
    { english: 'Not Cured', arabic: 'الحالة غير مستقرة' },
    { english: 'Reschedule Assessment', arabic: 'إعادة جدولة' }
  ];
  locationTypes = [
    { english: 'Other GOSI  Office', arabic: 'بأحد فروع المؤسسة ' },
    { english: 'Contributor House', arabic: 'بمقر اقامته' },
    { english: 'Healthcare Provider', arabic: 'مقدّم الرعاية الصحية' }
  ];
  caseMaxLength = 10000;
  channel: string;
  rescheduleReasons = [
    { english: 'Transferred to TPA', arabic: 'تم التحويل إلى شركة إدارة المطالبات', isOcc: true },
    {
      english: 'Other speciality required for the assessment',
      arabic: 'مطلوب تخصص اخر',
      isOcc: true
    },
    { english: 'Unavailability of visiting Doctor', arabic: 'لا يوجد طبيب زائر', isOcc: true },
    {
      english: 'Required clarification from contributor',
      arabic: 'مطلوب توضيح من المساهم',
      isOcc: false
    }
  ];
  heirRescheduleReason = [
    { english: 'Transferred to TPA', arabic: 'تم التحويل إلى شركة إدارة المطالبات', isOcc: true },
    {
      english: 'Other speciality required for the assessment',
      arabic: 'مطلوب تخصص اخر',
      isOcc: true
    },
    { english: 'Unavailability of visiting Doctor', arabic: 'لا يوجد طبيب زائر', isOcc: true },
    {
      english: 'Required clarification from heir',
      arabic: 'مطلوب توضيح من وريث',
      isOcc: false
    }
  ];
  result: string;
  percentage: number;
  type: string;
  nonOccAssessmentResults = [
    { english: 'Disabled', arabic: 'عجز' },
    { english: 'Not Disabled', arabic: 'ليست عجز' },
    { english: 'Reschedule Assessment', arabic: 'إعادة جدولة' }
    //, { english: 'End of Disability', arabic: 'نهاية الإعاقة' }
    // , {
    //   english: 'Return back to work will effect his/her health',
    //   arabic: 'العودة إلى العمل ستؤثر على صحته'
    // },
    // {
    //   english: 'Return back to work will not effect his/her health',
    //   arabic: 'العودة إلى العمل لن تؤثر على صحته'
    // }
  ];
  requestDocumentList = [
    {
      english: 'Detailed Medical report',
      arabic: 'تقرير مفصل عن الحالة '
    },
    {
      english: 'Discharge Summary',
      arabic: 'تقرير التنويم '
    },
    {
      english: 'Operation report ',
      arabic: 'تقرير العملية '
    },
    {
      english: 'Radiological report',
      arabic: 'تقرير الفحوصات الشعاعية'
    },
    {
      english: 'Laboratory tests result',
      arabic: 'نتائج الفحوصات المخبرية '
    },
    {
      english: 'EMG report',
      arabic: 'تقرير تخطيط الاعصاب - العضلات'
    },
    {
      english: 'Audiogram report',
      arabic: 'تقرير تخطيط السمع '
    },
    {
      english: 'EEG report',
      arabic: 'تقرير تخطيط المخ '
    },
    {
      english: 'ECG',
      arabic: 'تخطيط القلب '
    },
    {
      english: 'ECHO report',
      arabic: 'تقرير تصوير القلب التلفزيوني'
    },
    {
      english: 'Visual field examination report',
      arabic: 'تقرير فحص المجال البصري '
    },
    {
      english: 'Other',
      arabic: 'أخرى'
    }
  ];
  rescheduleReason;
  formattedaddress = ' ';
  options = {
    componentRestrictions: {
      country: ['SA']
    }
  };
  autocompleteInput: string;
  nextAssessmentEndDate: Date;
  today = moment().toDate();
  city: string;
  constructor(
    readonly fb: FormBuilder,
    readonly modalService: BsModalService,
    readonly medicalService: MedicalboardAssessmentService,
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef
  ) {
    this.addresstext = this.elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.geoCoder = new google.maps.Geocoder();
    this.channels.forEach((channel, i) =>
      this.assessmentChannelList.items.push({ ...new Lov(), value: channel, sequence: i + 1 })
    );
    this.results.forEach((result, i) =>
      this.assessmentResultList.items.push({ ...new Lov(), value: result, sequence: i + 1 })
    );
    this.locationTypes.forEach((type, i) =>
      this.locationTypeList.items.push({ ...new Lov(), value: type, sequence: i + 1 })
    );
    this.channelsParticipantNo.forEach((channel, i) =>
      this.assessmentChannelListParticipantNo.items.push({ ...new Lov(), value: channel, sequence: i + 1 })
    );
    if (
      this.assessmentType === 'Non-Occupational Disability' ||
      this.assessmentType === 'Dependent Disability' ||
      this.assessmentType === 'Heir Disability'
    ) {
      // this.assessmentChannelListParticipantNo.items.push({
      //   ...new Lov(),
      //   value: { english: 'Virtual', arabic: 'افتراضي' },
      //   sequence: this.assessmentChannelListParticipantNo.items.length + 1
      // });
    } else if (
      this.assessmentType === 'Occupational Disability' ||
      this.assessmentType === 'Reassessment Occupational Disability' ||
      this.assessmentType === 'Occupational Disability Reassessment'
    ) {
      this.rescheduleReasons = this.rescheduleReasons.filter(reason => reason.isOcc);
    } else if (this.isHeir) {
      this.rescheduleReasons = this.heirRescheduleReason;
    }
    this.rescheduleReasons.forEach((reason, i) =>
      this.rescheduleReasonList.items.push({ ...new Lov(), value: reason, sequence: i + 1 })
    );
    this.nonOccAssessmentResults.forEach((result, i) =>
      this.nonOccAssessmentResultList.items.push({ ...new Lov(), value: result, sequence: i + 1 })
    );

    if (this.gosiDoctorAssessDetails?.modifiedDetails?.bodyParts) {
      this.injuredBodyParts = { injuredPerson: this.gosiDoctorAssessDetails?.modifiedDetails?.bodyPartsLists };
    } else if (this.gosiDoctorAssessDetails?.bodyPartsList) {
      this.injuredBodyParts = { injuredPerson: this.gosiDoctorAssessDetails?.bodyPartsList };
    } else {
      this.injuredBodyParts = this.injuredParts;
    }
    // if (this.personDetails?.person?.nationality?.english === 'Saudi Arabia') {
    //   this.isSaudi = true;
    // }
    this.initialiseForm(true);
    if (this.gosiDoctorAssessDetails) {
      this.setGosiDoctorAssessment();
    }
    this.minDate = moment(this.gosiDoctorAssessDetails?.assessmentDate.gregorian).toDate();
    if (
      this.assessmentType === 'Reassessment Non-Occupational Disability' ||
      this.assessmentType === 'Reassessment Heir Disability' ||
      this.assessmentType === 'Reassessment Dependent Disability' ||
      this.assessmentType === 'Non-Occupational Disability Reassessment' ||
      this.assessmentType === 'Heir Disability Reassessment' ||
      this.assessmentType === 'Dependent Disability Reassessment'
    ) {
      this.isNonOccReassessment = true;
    }
  }
  initialiseForm(isPresent) {
    this.boardDecisonForm = this.fb.group({
      isParticipantPresent: [isPresent],
      assessmentChannel: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      }),
      caseDescription: ['', Validators.required],
      assessmentResult: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      })
    });
    this.parentForm.addControl('disabilityDetails', this.boardDecisonForm);
    this.boardDecisonForm.valueChanges.subscribe(() => {
      this.parentForm.setControl('disabilityDetails', this.boardDecisonForm);
    });
  }
  ngAfterViewInit() { }
  getPlaceAutocomplete(inputElement: HTMLInputElement) {
    const autocomplete = new google.maps.places.Autocomplete(inputElement, this.options);
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.getCityByCoordinates(place.geometry.location.lng(), place.geometry.location.lat());
      this.onOriginSelected.emit({
        originLatitude: place.geometry.location.lat(),
        originLongitude: place.geometry.location.lng()
      });
    });
  }
  getCityByCoordinates(lng, lat) {
    this.geoCoder.geocode(
      {
        location: {
          lat: Number(lat),
          lng: Number(lng)
        }
      },
      results => {
        results.map(data => {
          if (data.types.includes('locality')) {
            data.address_components.map(address => {
              if (address.types.includes('locality')) {
                console.log(address.long_name);
                this.city = address.long_name;
                this.onCitySelected.emit(this.city);
              }
            });
          }
        });
      }
    );
  }
  ngOnChanges(changes: SimpleChanges) {
    // if (this.boardDecisonForm && changes.gosiDoctorAssessDetails && changes.gosiDoctorAssessDetails.currentValue) {
    //   if (this.gosiDoctorAssessDetails) {
    //     this.setGosiDoctorAssessment();
    //   }
    // }
    if (
      changes.previousDisabilityDetailsById &&
      changes.previousDisabilityDetailsById.currentValue &&
      changes.previousDisabilityDetailsById.currentValue.data.length > 0
    ) {
      this.nonOccAssessmentResultList.items.push({
        ...new Lov(),
        value: { english: 'End of Disability', arabic: 'انتهاء العجز' },
        sequence: 3
      });
    } else if (
      this.assessmentType === 'Reassessment Non-Occupational Disability' ||
      this.assessmentType === 'Reassessment Heir Disability' ||
      this.assessmentType === 'Reassessment Dependent Disability' ||
      this.assessmentType === 'Non-Occupational Disability Reassessment' ||
      this.assessmentType === 'Heir Disability Reassessment' ||
      this.assessmentType === 'Dependent Disability Reassessment'
    ) {
      this.nonOccAssessmentResultList.items.push({
        ...new Lov(),
        value: { english: 'End of Disability', arabic: 'انتهاء العجز' },
        sequence: 3
      });
    }
    if (changes.assessmentResponseDateDto && changes.assessmentResponseDateDto.currentValue) {
      if (
        this.boardDecisonForm &&
        this.boardDecisonForm.get('disabilityPercentage') &&
        this.boardDecisonForm.get('disabilityPercentage').value
      )
        // if (this.assessmentResponseDateDto?.nextAssessmentRequired) {
        this.getHelper();
      // }
    }
    if (this.assessmentResponseDateDto) {
      if (this.assessmentType === 'Occupational Disability' ||
        this.assessmentType === 'Reassessment Occupational Disability' ||
        this.assessmentType === 'Occupational Disability Reassessment') {
        this.startDate = moment(this.assessmentResponseDateDto?.helperDetails?.helperStartDateLowerLimit).toDate();
        this.endDate = moment(this.assessmentResponseDateDto?.helperDetails?.helperStartDateUpperLimit).toDate();
      }
      this.nextAssessmentMinDate = moment(
        this.assessmentResponseDateDto?.nextAssessmentDetails?.assessmentDatelowerLimit
      ).toDate();
      this.nextAssessmentMaxDate = moment(
        this.assessmentResponseDateDto?.nextAssessmentDetails?.assessmentDateUpperLimit
      ).toDate();
      this.disabilityEndMinDate = moment(this.assessmentResponseDateDto?.disabilityEndDateLowerLimit).toDate();
      this.disabilityEndMaxDate = moment(this.assessmentResponseDateDto?.disabilityEndDateUpperLimit).toDate();

    }
  }
  onParticipantPresent(isPresent) {
    if (isPresent) {
      this.removeCompanionAllowance();
      this.initialiseForm(true);
    } else {
      this.selectChannel('');
      this.selectResult('');
      this.disabledPercentageChange('');
      this.selectHelperRequired('');
      this.channel = '';
      this.selectLocationType('');
      this.removeCompanionAllowance();
      this.initialiseForm(false);
    }
  }
  removeCompanionAllowance() {
    if (this.boardDecisonForm.get('isConveyanceRequired')) {
      this.boardDecisonForm.removeControl('isConveyanceRequired');
      this.boardDecisonForm.updateValueAndValidity();
    }
  }
  selectChannel(channel) {
    this.channel = channel;
    this.setOrigin(this.autocompleteInput);
    if (this.isAmb && !this.boardDecisonForm.get('isConveyanceRequired') && this.channel === 'In Office') {
      //
      this.boardDecisonForm.addControl(
        'isConveyanceRequired',
        this.fb.group({ english: ['', Validators.required], arabic: [''] })
      );
      this.autocompleteInput = this.addressValue;
    }
    if (channel === 'Virtual') {
      this.boardDecisonForm.addControl(
        'locationType',
        this.fb.group({ english: [null, Validators.required], arabic: [null] })
      );
    } else if (this.boardDecisonForm.get('locationType')) {
      this.boardDecisonForm.removeControl('locationType');
      this.selectLocationType('');
    }
    if (
      channel === 'Reschedule Assessment' &&
      this.boardDecisonForm.get('caseDescription') &&
      this.boardDecisonForm.get('assessmentResult')
    ) {
      this.boardDecisonForm.removeControl('caseDescription');
      this.boardDecisonForm.removeControl('assessmentResult');
      this.boardDecisonForm.removeControl('otherSpeciality');
      this.selectResult('');
      this.disabledPercentageChange('');
      this.selectHelperRequired('');
      this.selectLocationType('');
      this.boardDecisonForm.removeControl('isConveyanceRequired');
    } else if (!this.boardDecisonForm.get('caseDescription') && !this.boardDecisonForm.get('assessmentResult')) {
      this.boardDecisonForm.addControl('caseDescription', this.fb.control('', Validators.required));
      this.boardDecisonForm.addControl(
        'assessmentResult',
        this.fb.group({
          english: [null, Validators.required],
          arabic: [null]
        })
      );
    }
  }
  selectResult(result) {
    this.result = result;
    if (this.result && this.result !== '' && this.result !== 'Reschedule Assessment') {
      this.boardDecisonForm.addControl(
        'mainReason',
        this.fb.group({ english: [null, Validators.required], arabic: [null] })
      );
      this.boardDecisonForm.addControl('secondaryReason', this.fb.group({ english: [null], arabic: [null] }));
      if (!this.isAmb) {
        this.boardDecisonForm.addControl(
          'primaryGosiDr',
          this.fb.group({ english: [null, Validators.required], arabic: [null] })
        );
        if (!this.isGosiDoctor) {
          this.boardDecisonForm?.get('primaryGosiDr')?.patchValue(this.sessionGosiDrLovList?.items[0]?.value);
          this.selectedDoctor(this.sessionGosiDrLovList?.items[0]);
        }
      }
      this.boardDecisonForm.addControl(
        'assessedBy',
        this.fb.group({ english: ['', Validators.required], arabic: [''] })
      );
      if (this.isAmbo) {
        if (this.sessionDataLovListTemp) {
          this.sessionDataLovListTemp.items.slice(0, 3).forEach(item => {
            this.assessedDoctors?.push(item.value);
          });
          this.boardDecisonForm?.get('assessedBy')?.patchValue(this.assessedDoctors);
        }
      }
      if (this.boardDecisonForm.get('otherSpeciality')) {
        this.boardDecisonForm.removeControl('otherSpeciality');
      }
    } else if (
      this.boardDecisonForm.get('assessedBy') &&
      this.boardDecisonForm.get('mainReason') &&
      this.boardDecisonForm.get('secondaryReason')
    ) {
      this.boardDecisonForm.removeControl('primaryGosiDr');
      this.boardDecisonForm.removeControl('assessedBy');
      this.boardDecisonForm.removeControl('mainReason');
      this.boardDecisonForm.removeControl('secondaryReason');
    }
    if (this.result === 'Cured With Disability') {
      this.boardDecisonForm.addControl(
        'disabilityPercentage',
        this.fb.control('', Validators.compose([Validators.required, lessThanValidator(100), greaterThanValidator(0)]))
      );
    } else if (this.result === 'Reschedule Assessment') {
      this.boardDecisonForm.addControl(
        'rescheduleReason',
        this.fb.group({
          english: [null, Validators.required],
          arabic: [null]
        })
      );
    } else if (this.boardDecisonForm.get('disabilityPercentage')) {
      this.boardDecisonForm.removeControl('disabilityPercentage');
      this.boardDecisonForm.updateValueAndValidity();
    } else if (this.boardDecisonForm.get('rescheduleReason')) {
      this.boardDecisonForm.removeControl('rescheduleReason');
      this.boardDecisonForm.updateValueAndValidity();
    }
    if (this.result !== 'Cured With Disability') {
      this.boardDecisonForm.removeControl('disabilityPercentage');
      this.boardDecisonForm.removeControl('helperStartDate');
      this.boardDecisonForm.removeControl('reasonForHelper');
      this.boardDecisonForm.removeControl('isHelperRequired');
    }
    if (
      (this.assessmentType === 'Non-Occupational Disability' ||
        this.assessmentType === 'Dependent Disability' ||
        this.assessmentType === 'Heir Disability' ||
        this.assessmentType === 'Reassessment Non-Occupational Disability' ||
        this.assessmentType === 'Reassessment Heir Disability' ||
        this.assessmentType === 'Reassessment Dependent Disability' ||
        this.assessmentType === 'Non-Occupational Disability Reassessment' ||
        this.assessmentType === 'Heir Disability Reassessment' ||
        this.assessmentType === 'Dependent Disability Reassessment') &&
      this.result === 'Disabled'
    ) {
      this.boardDecisonForm.addControl(
        'disabilityDate',
        this.fb.group({ gregorian: ['', Validators.required], hijiri: [''] })
      );
      if (this.assessmentDetails?.disabilityDate && !this.isGosiDoctor && !this.isReturn) {
        this.boardDecisonForm
          .get('disabilityDate')
          ?.get('gregorian')
          .setValue(new Date(this.assessmentDetails?.disabilityDate?.gregorian));
        this.selectDisabilityDate();
      }
      if ((this.isGosiDoctor || this.isReturn) && this.gosiDoctorAssessDetails?.disabilityDate?.gregorian) {
        this.boardDecisonForm
          .get('disabilityDate')
          ?.get('gregorian')
          .setValue(new Date(this.gosiDoctorAssessDetails?.disabilityDate?.gregorian));
      }
      if (
        this.assessmentType === 'Non-Occupational Disability' ||
        this.assessmentType === 'Reassessment Non-Occupational Disability' ||
        this.assessmentType === 'Non-Occupational Disability Reassessment'
      )
        this.boardDecisonForm.addControl(
          'isHelperRequired',
          this.fb.group({ english: ['', Validators.required], arabic: [''] })
        );
      if (this.gosiDoctorAssessDetails?.isHelperRequired) {
        this.getHelperRequired();
      }
      if (
        (this.assessmentType === 'Dependent Disability' ||
          this.assessmentType === 'Heir Disability' ||
          this.assessmentType === 'Heir Disability Reassessment' ||
          this.assessmentType === 'Dependent Disability Reassessment') && this.heirPersonDetails?.ageInHijiri <= 60
      ) {
        let isRequired = 'No';
        this.helperDateLimits.emit(isRequired);
        this.boardDecisonForm.addControl('nextAssessmentDate', this.fb.group({ gregorian: [''], hijiri: [''] }));
      }
    } else if (
      (this.assessmentType === 'Non-Occupational Disability' ||
        this.assessmentType === 'Dependent Disability' ||
        this.assessmentType === 'Heir Disability' ||
        this.assessmentType === 'Reassessment Non-Occupational Disability' ||
        this.assessmentType === 'Reassessment Heir Disability' ||
        this.assessmentType === 'Reassessment Dependent Disability' ||
        this.assessmentType === 'Non-Occupational Disability Reassessment' ||
        this.assessmentType === 'Heir Disability Reassessment' ||
        this.assessmentType === 'Dependent Disability Reassessment') &&
      this.result === 'End of Disability'
    ) {
      let isRequired = 'No';
      this.helperDateLimits.emit(isRequired);
      this.boardDecisonForm.addControl(
        'disabilityEndDate',
        this.fb.group({ gregorian: ['', Validators.required], hijiri: [''] })
      );
    } else {
      if (this.boardDecisonForm?.get('disabilityDate')) {
        this.boardDecisonForm.removeControl('disabilityDate');
      }
      if (this.boardDecisonForm?.get('isHelperRequired')) {
        this.boardDecisonForm.removeControl('isHelperRequired');
      }
      if (this.boardDecisonForm?.get('helperStartDate')) {
        this.boardDecisonForm.removeControl('helperStartDate');
      }
      if (this.boardDecisonForm?.get('nextAssessmentDate')) {
        this.boardDecisonForm.removeControl('nextAssessmentDate');
      }
      if (this.boardDecisonForm?.get('reasonForHelper')) {
        this.boardDecisonForm.removeControl('reasonForHelper');
      }
      if (this.boardDecisonForm?.get('disabilityEndDate')) {
        this.boardDecisonForm.removeControl('disabilityEndDate');
      }
    }
    this.boardDecisonForm.updateValueAndValidity();
  }
  disabledPercentageChange(percentage: string) {
    let isRequired = 'No';
    this.helperDateLimits.emit(isRequired);
    // this.getAssessmentDate.emit(Number(percentage)); // to show helper required pass percentage
    this.percentage = Number(percentage);
  }
  getHelper() {
    if (this.assessmentResponseDateDto?.nextAssessmentRequired) {
      if (this.isSaudi) {
        this.boardDecisonForm?.addControl(
          'nextAssessmentDate',
          this.fb.group({ gregorian: ['', Validators.required], hijiri: [''] })
        );
      }
      this.boardDecisonForm?.addControl(
        'isHelperRequired',
        this.fb.group({ english: ['', Validators.required], arabic: [''] })
      );
      // if (
      //   this.gosiDoctorAssessDetails?.isHelperRequired &&
      //   this.assessmentResponseDateDto?.helperDetails?.helperStartDateLowerLimit !== null
      // ) {
      //   this.boardDecisonForm?.get('isHelperRequired')?.patchValue(this.gosiDoctorAssessDetails?.isHelperRequired);
      //   // this.getHelperRequired();
      // }
    } else if (
      this.boardDecisonForm?.get('isHelperRequired') ||
      this.boardDecisonForm?.get('helperStartDate') ||
      this.boardDecisonForm?.get('reasonForHelper')
    ) {
      this.boardDecisonForm.removeControl('isHelperRequired');
      this.boardDecisonForm?.removeControl('helperStartDate');
      this.boardDecisonForm?.removeControl('reasonForHelper');
      // this.selectHelperRequired('');
    } else if (this.boardDecisonForm?.get('nextAssessmentDate')) {
      this.boardDecisonForm.removeControl('nextAssessmentDate');
    }
    this.boardDecisonForm.updateValueAndValidity();
  }
  selectHelperRequired(isRequired) {
    if (isRequired === 'Yes' || isRequired === 'No') {
      this.helperDateLimits.emit(isRequired);
      // if (this.percentage) this.getAssessmentDate.emit(this.percentage); // to show helper required pass percentage
    }
    if (isRequired === 'Yes') {
      this.boardDecisonForm.addControl(
        'helperStartDate',
        this.fb.group({ gregorian: ['', Validators.required], hijiri: [''] })
      );
      this.boardDecisonForm.addControl(
        'reasonForHelper',
        this.fb.group({ english: ['', Validators.required], arabic: [''] })
      );
      if (
        this.assessmentType === 'Occupational Disability' ||
        this.assessmentType === 'Reassessment Occupational Disability' ||
        this.assessmentType === 'Occupational Disability Reassessment'
      )
        this.nextAssessmentEndDate = moment(this.sessionData?.sessionDate?.gregorian)
          .add(10, 'years')
          .subtract(1, 'days')
          .toDate();
    } else if (this.boardDecisonForm?.get('helperStartDate') && this.boardDecisonForm?.get('reasonForHelper')) {
      this.boardDecisonForm.removeControl('helperStartDate');
      this.boardDecisonForm.removeControl('reasonForHelper');
      this.boardDecisonForm.updateValueAndValidity();
      if (
        this.assessmentType === 'Occupational Disability' ||
        this.assessmentType === 'Occupational Disability Reassessment'
      )
        this.nextAssessmentEndDate = moment(this.sessionData?.sessionDate?.gregorian)
          .add(5, 'years')
          .subtract(1, 'days')
          .toDate();
    }
    if (this.isSaudi) {
      // const isRequired = 'No';
      // this.helperDateLimits.emit(isRequired);
      if (
        (this.assessmentType === 'Non-Occupational Disability' ||
          this.assessmentType === 'Reassessment Non-Occupational Disability' ||
          this.assessmentType === 'Non-Occupational Disability Reassessment') &&
        ((this.boardDecisonForm.get('isHelperRequired')?.value?.english === 'Yes' &&
          this.heirPersonDetails?.ageInHijiri <= 65) ||
          (this.boardDecisonForm.get('isHelperRequired')?.value?.english === 'No' &&
            this.heirPersonDetails?.ageInHijiri <= 60))
      ) {
        this.boardDecisonForm.addControl(
          'nextAssessmentDate',
          this.fb.group({ gregorian: ['', Validators.required], hijiri: [''] })
        );
      }
    }
  }
  selectLocationType(type) {
    this.type = type;
    if (type === 'Other GOSI  Office') {
      this.setOrigin(this.autocompleteInput);
      this.boardDecisonForm.addControl(
        'officeLocation',
        this.fb.group({
          english: [null, Validators.required],
          arabic: [null]
        })
      );
      if (this.isAmb && !this.boardDecisonForm.get('isConveyanceRequired') && this.type === 'Other GOSI  Office') {
        //
        this.boardDecisonForm.addControl(
          'isConveyanceRequired',
          this.fb.group({ english: ['', Validators.required], arabic: [''] })
        );
      }
      if (this.boardDecisonForm.get('healthcareProvider')) {
        this.boardDecisonForm.removeControl('healthcareProvider');
      }
    } else if (type === 'Healthcare Provider') {
      this.boardDecisonForm.addControl(
        'healthcareProvider',
        this.fb.group({
          english: [null, Validators.required],
          arabic: [null]
        })
      );
      if (this.boardDecisonForm.get('officeLocation')) {
        this.boardDecisonForm.removeControl('officeLocation');
      }
      this.removeCompanionAllowance();
    } else {
      if (this.boardDecisonForm.get('officeLocation')) {
        this.boardDecisonForm.removeControl('officeLocation');
      }
      if (this.boardDecisonForm.get('healthcareProvider')) {
        this.boardDecisonForm.removeControl('healthcareProvider');
      }
      if (this.channel !== 'In Office') this.removeCompanionAllowance();
    }
  }
  selectRescheduleReason(rescheduleReason) {
    this.rescheduleReason = rescheduleReason;
    if (rescheduleReason === 'Other speciality required for the assessment') {
      this.boardDecisonForm.addControl(
        'otherSpeciality',
        this.fb.group({
          english: [null, Validators.required],
          arabic: [null]
        })
      );
      if (this.boardDecisonForm.get('comments')) {
        this.boardDecisonForm.removeControl('comments');
      }
    } else if (rescheduleReason === 'Required clarification from contributor') {
      // if (this.boardDecisonForm?.get('rescheduleReason')?.value === 'Required clarification from contributor') {
      this.boardDecisonForm.addControl(
        'requestedDocs',
        this.fb.group({
          english: [null],
          arabic: [null]
        })
      );
      this.boardDecisonForm.addControl('comments', this.fb.control('', Validators.required));
      // }
      this.modalRef = showModal(this.modalService, this.contributorModal);
    } else if (this.result === 'Reschedule Assessment' && rescheduleReason === 'Transferred to TPA') {
      this.boardDecisonForm.addControl('comments', this.fb.control('', Validators.required));
    } else if (this.boardDecisonForm.get('otherSpeciality')) {
      this.boardDecisonForm.removeControl('otherSpeciality');
    } else if (this.boardDecisonForm.get('comments')) {
      this.boardDecisonForm.removeControl('comments');
    }
    this.boardDecisonForm.updateValueAndValidity();
  }

  setGosiDoctorAssessment() {
    if (this.gosiDoctorAssessDetails) {
      if (!this.gosiDoctorAssessDetails?.isParticipantPresent) {
        this.boardDecisonForm
          .get('isParticipantPresent')
          ?.patchValue(!this.gosiDoctorAssessDetails?.isParticipantPresent);
        // this.initialiseForm(false);
      }
      if (this.gosiDoctorAssessDetails?.caseDescriptions) {
        let caseArray = this.gosiDoctorAssessDetails?.caseDescriptions;
        let caseString = caseArray.join('');
        this.boardDecisonForm?.get?.('caseDescription')?.patchValue(caseString);
      }
      this.boardDecisonForm?.patchValue(this.gosiDoctorAssessDetails);
      this.boardDecisonForm?.get('assessmentChannel')?.patchValue(this.gosiDoctorAssessDetails?.assessmentChannel);
      this.selectChannel(this.gosiDoctorAssessDetails?.assessmentChannel?.english);
      this.boardDecisonForm.get('locationType')?.patchValue(this.gosiDoctorAssessDetails?.locationType);
      this.selectLocationType(this.gosiDoctorAssessDetails?.locationType?.english);
      this.boardDecisonForm.get('officeLocation')?.patchValue(this.gosiDoctorAssessDetails?.officeLocation);
      this.boardDecisonForm?.get('assessmentResult')?.patchValue(this.gosiDoctorAssessDetails?.assessmentResult);
      this.result = this.gosiDoctorAssessDetails?.assessmentResult?.english;
      this.selectResult(this.result);
      if (this.gosiDoctorAssessDetails?.rescheduleReason) {
        this.boardDecisonForm?.get('rescheduleReason')?.patchValue(this.gosiDoctorAssessDetails?.rescheduleReason);
        this.selectRescheduleReason(this.gosiDoctorAssessDetails?.rescheduleReason);
      }
      if (this.gosiDoctorAssessDetails?.nextAssessmentSpeciality) {
        this.boardDecisonForm
          ?.get('otherSpeciality')
          ?.patchValue(this.gosiDoctorAssessDetails?.nextAssessmentSpeciality);
      }
      if (this.gosiDoctorAssessDetails?.assessmentResult?.english === 'Cured With Disability') {
        if (this.gosiDoctorAssessDetails?.modifiedDetails?.disabilityPercentage) {
          this.percentage = this.gosiDoctorAssessDetails?.modifiedDetails?.disabilityPercentage;
          this.boardDecisonForm
            ?.get('disabilityPercentage')
            ?.patchValue(this.gosiDoctorAssessDetails?.modifiedDetails?.disabilityPercentage);
        } else {
          this.percentage = this.gosiDoctorAssessDetails?.disabilityPercentage;
          this.boardDecisonForm
            ?.get('disabilityPercentage')
            ?.patchValue(this.gosiDoctorAssessDetails?.disabilityPercentage);
        }
        this.disabledPercentageChange(this.percentage.toLocaleString());
      }
      if (this.gosiDoctorAssessDetails?.isHelperRequired) {
        this.boardDecisonForm?.addControl(
          'isHelperRequired',
          this.fb.group({ english: ['', Validators.required], arabic: [''] })
        );
        this.boardDecisonForm?.get('isHelperRequired')?.patchValue(this.gosiDoctorAssessDetails?.isHelperRequired);
      }

      if (this.gosiDoctorAssessDetails?.isHelperRequired?.english === 'Yes') {
        this.gosiDoctorAssessDetails?.reasonForHelper.forEach(item => {
          this.reasonsForHelp?.push(item);
        });
        this.helperRequired = this.gosiDoctorAssessDetails?.isHelperRequired?.english;
        this.selectHelperRequired(this.helperRequired);
        // this.boardDecisonForm?.get('helperStartDate')?.patchValue(this.gosiDoctorAssessDetails?.helperStartDate);
        this.boardDecisonForm
          ?.get('helperStartDate')
          ?.get('gregorian')
          .setValue(new Date(this.gosiDoctorAssessDetails?.helperStartDate?.gregorian));
        this.boardDecisonForm?.get('reasonForHelper')?.patchValue(this.reasonsForHelp);
      }
      if (this.gosiDoctorAssessDetails?.nextAssessmentDate) {
        this.boardDecisonForm?.addControl(
          'nextAssessmentDate',
          this.fb.group({ gregorian: ['', Validators.required], hijiri: [''] })
        );
        this.boardDecisonForm
          ?.get('nextAssessmentDate')
          ?.get('gregorian')
          .setValue(new Date(this.gosiDoctorAssessDetails?.nextAssessmentDate?.gregorian));
      }
      // if (
      //   this.assessmentType === 'Non-Occupational Disability' ||
      //   this.assessmentType === 'Heir Disability' ||
      //   this.assessmentType === 'Dependent Disability'
      // ) {
      if (this.gosiDoctorAssessDetails?.modifiedDetails?.mainReason) {
        this.boardDecisonForm?.get('mainReason')?.patchValue(this.gosiDoctorAssessDetails?.modifiedDetails?.mainReason);
      } else {
        this.boardDecisonForm?.get('mainReason')?.patchValue(this.gosiDoctorAssessDetails?.mainReason);
      }
      if (this.gosiDoctorAssessDetails?.modifiedDetails?.secondaryReason) {
        this.boardDecisonForm
          ?.get('secondaryReason')
          ?.patchValue(this.gosiDoctorAssessDetails?.modifiedDetails?.secondaryReason);
      } else {
        this.boardDecisonForm?.get('secondaryReason')?.patchValue(this.gosiDoctorAssessDetails?.secondaryReason);
      }
      this.boardDecisonForm
        ?.get('disabilityDate')
        ?.get('gregorian')
        .setValue(new Date(this.gosiDoctorAssessDetails?.disabilityDate?.gregorian));
      // }

      if (this.gosiDoctorAssessDetails.primaryGosiDr) {
        this.boardDecisonForm?.get('primaryGosiDr')?.patchValue(this.gosiDoctorAssessDetails?.primaryGosiDr?.name);
      }
      if (this.gosiDoctorAssessDetails?.assessedBy) {
        this.gosiDoctorAssessDetails?.assessedBy.forEach(item => {
          this.assessedDoctors?.push(item.name);
        });
        this.boardDecisonForm?.get('assessedBy')?.patchValue(this.assessedDoctors);
        this.boardDecisonForm?.get('assessedBy')?.disable();
      }
      if (this.gosiDoctorAssessDetails?.originLatitude && this.gosiDoctorAssessDetails?.originLongitude) {
        this.getPlaceByLocation();
      }
      if (this.gosiDoctorAssessDetails?.isConveyanceRequired) {
        this.boardDecisonForm
          ?.get('isConveyanceRequired')
          ?.patchValue(this.gosiDoctorAssessDetails?.isConveyanceRequired);
      }
    }
  }
  selectedDoctor(doctor: Lov) {
    this.onMainDoctorSelected.emit(doctor);
  }
  onOriginFocus() {
    if (this.addresstext) this.getPlaceAutocomplete(this.addresstext.nativeElement);
  }
  docsSelected(items) {
    this.selectedDocument = items;
    if (this.selectedDocument.length > 0) {
      this.docList = new Array<Lov>();
      this.selectedDocument.forEach(item => {
        this.docList.push(item);
      });
      this.documentList = new LovList(this.docList);
    } else {
      this.documentList = new LovList([]);
    }
    // let count = 1;
    // this.documentList.items.forEach(element => {
    //   element.sequence = count++;
    // });
  }
  hideModal() {
    this.boardDecisonForm.removeControl('requestedDocs');
    this.boardDecisonForm.removeControl('comments');
    this.modalRef.hide();
  }
  addClarification() {
    if (this.boardDecisonForm.get('comments').valid) {
      this.modalRef.hide();
    } else {
      this.boardDecisonForm.get('comments').markAllAsTouched();
    }
  }
  selectMainReason(reason: Lov) {
    this.secondaryReasonList = {
      ...this.mainReasonList,
      items: this.mainReasonList.items.filter(mainReason => mainReason.sequence != reason.sequence)
    };
  }
  getPlaceByLocation() {
    this.geoCoder = new google.maps.Geocoder();
    this.geoCoder.geocode(
      {
        location: {
          lat: Number(this.gosiDoctorAssessDetails?.originLatitude),
          lng: Number(this.gosiDoctorAssessDetails?.originLongitude)
        }
      },
      results => {
        this.autocompleteInput = results[3]?.formatted_address;
        this.onOriginSelected.emit({
          originLatitude: Number(this.gosiDoctorAssessDetails?.originLatitude),
          originLongitude: Number(this.gosiDoctorAssessDetails?.originLongitude)
        });
      }
    );
  }
  setOrigin(address) {
    this.onOriginFocus();
    this.autocompleteInput = this.addressValue;
  }
  getHelperRequired() {
    if (this.gosiDoctorAssessDetails?.assessmentResult?.english === 'Cured With Disability') {
      if (this.gosiDoctorAssessDetails?.modifiedDetails?.disabilityPercentage) {
        this.percentage = this.gosiDoctorAssessDetails?.modifiedDetails?.disabilityPercentage;
        this.boardDecisonForm
          ?.get('disabilityPercentage')
          ?.patchValue(this.gosiDoctorAssessDetails?.modifiedDetails?.disabilityPercentage);
      } else {
        this.percentage = this.gosiDoctorAssessDetails?.disabilityPercentage;
        this.boardDecisonForm
          ?.get('disabilityPercentage')
          ?.patchValue(this.gosiDoctorAssessDetails?.disabilityPercentage);
      }
      // this.disabledPercentageChange(this.percentage.toLocaleString());
    }
    this.boardDecisonForm?.get('isHelperRequired')?.patchValue(this.gosiDoctorAssessDetails?.isHelperRequired);
    if (this.gosiDoctorAssessDetails?.isHelperRequired?.english === 'Yes') {
      this.gosiDoctorAssessDetails?.reasonForHelper.forEach(item => {
        this.reasonsForHelp?.push(item);
      });
      this.helperRequired = this.gosiDoctorAssessDetails?.isHelperRequired?.english;
      this.selectHelperRequired(this.helperRequired);
      // this.boardDecisonForm?.get('helperStartDate')?.patchValue(this.gosiDoctorAssessDetails?.helperStartDate);
      this.boardDecisonForm
        ?.get('helperStartDate')
        ?.get('gregorian')
        .setValue(new Date(this.gosiDoctorAssessDetails?.helperStartDate?.gregorian));
      this.boardDecisonForm?.get('reasonForHelper')?.patchValue(this.reasonsForHelp);
    }
    if (this.gosiDoctorAssessDetails?.nextAssessmentDate) {
      this.boardDecisonForm
        ?.get('nextAssessmentDate')
        ?.get('gregorian')
        .setValue(new Date(this.gosiDoctorAssessDetails?.nextAssessmentDate?.gregorian));
    }
  }
  selectDisabilityDate() {
    this.startDate = moment(convertToYYYYMMDD((this.boardDecisonForm?.get('disabilityDate')?.get('gregorian')?.value))).toDate();
    this.endDate = this.today
  }


}
