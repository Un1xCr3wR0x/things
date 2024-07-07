/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  addDays,
  LovList,
  LanguageToken,
  greaterThanValidator,
  BilingualText,
  LookupService,
  Lov,
  startOfDay,
  convertToYYYYMMDD,
  convertToStringDDMMYYYY
} from '@gosi-ui/core';
import { markFormGroupTouched } from '@gosi-ui/features/benefits/lib/shared/utils';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import {
  MBConstants,
  IndividualSessionDetails,
  GeneralEnum,
  MbDetails,
  CreateSessionService,
  UnAvailableMemberListRequest
} from '../../../../shared';

@Component({
  selector: 'mb-session-details-dc',
  templateUrl: './session-details-dc.component.html',
  styleUrls: ['./session-details-dc.component.scss']
})
export class SessionDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Local Variables
   * */
  invitationForm: FormGroup = new FormGroup({});
  sessionDifference: number;
  medicalBoardType: LovList;
  sessionChannelList: LovList;
  officeLocationList: LovList;
  items: Lov[] = [];
  currentDate: Date = new Date();
  isReadOnly = true;
  isDisabled: boolean;
  isDisable: boolean;
  startHour: number;
  startMinute: number;
  starttimePeriod: string;
  endHour: number;
  endMinute: number;
  endtimePeriod: string;
  startdateArray = ['00', '00'];
  enddateArray = ['00', '00'];
  lang = 'en';
  daysArray = new Array<string>(7);
  sessionStartDate: Date;
  currentHours: string;
  currentMinute: string;
  sessionStartHour: string;
  sessionStartMinute: string;
  sessionTime: string;
  currentTime: string;
  currentMinutes: string;
  isTimeDisabled = false;
  days = [
    {
      label: 'SUNDAY',
      control: 'sunday',
      index: 0
    },
    {
      label: 'MONDAY',
      control: 'monday',
      index: 1
    },
    {
      label: 'TUESDAY',
      control: 'tuesday',
      index: 2
    },
    {
      label: 'WEDNESDAY',
      control: 'wednesday',
      index: 3
    },
    {
      label: 'THURSDAY',
      control: 'thursday',
      index: 4
    },
    {
      label: 'FRIDAY',
      control: 'friday',
      index: 5
    },
    {
      label: 'SATURDAY',
      control: 'saturday',
      index: 6
    }
  ];

  //Input Variables
  @Input() sessionList: LovList;
  @Input() isRegularSession = true;
  @Input() individualSessionDetails: IndividualSessionDetails;
  @Input() configurationDetails: IndividualSessionDetails;
  @Input() isCreateSession = true;
  @Input() parentForm: FormGroup;
  @Input() mbDetails: MbDetails;
  @Input() isEditMode: boolean;
  @Input() isInCharge: boolean;
  @Output() difference: EventEmitter<number> = new EventEmitter();
  @Output() changeValue: EventEmitter<string> = new EventEmitter();
  @Output() unAvailableList: EventEmitter<UnAvailableMemberListRequest> = new EventEmitter();
  @Output() officeLocationChangeValue: EventEmitter<BilingualText> = new EventEmitter();
  startTime: string;
  endTime: string;
  timePicker: FormGroup = new FormGroup({});

  /**
   *
   * @param fb
   * @param language
   */
  constructor(
    readonly fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly lookUpService: LookupService,
    readonly sessionService: CreateSessionService,
    private datePipe: DatePipe
  ) {}
  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {
    if (this.isRegularSession) {
      this.currentDate = addDays(this.currentDate, 21);
      this.sessionService.setNewDate(this.currentDate);
    } else this.currentDate = startOfDay(new Date());
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.invitationForm = this.createInvitationForm();
    this.medicalBoardType = new LovList(MBConstants.MEDICAL_BOARD_TYPE);
    this.sessionChannelList = this.isRegularSession
      ? new LovList(MBConstants.SESSION_CHANNEL)
      : new LovList(MBConstants.AD_HOC_SESSION_CHANNEL);

    if (this.isRegularSession) {
      this.isDisable = true;
    } else {
      this.onValidateForm();
    }
    if (this.parentForm) this.parentForm.addControl('inviteForm', this.invitationForm);
    if (this.parentForm) this.parentForm.addControl('sessionDetails', this.invitationForm);
    this.invitationForm.get('startTimePicker')?.valueChanges.subscribe(value => {
      this.invitationForm.get('timePicker').reset();
      const startHour = this.invitationForm.get('startTimePicker')?.get('injuryHour').value;
      const endHour = Number(this.invitationForm.get('timePicker')?.get('injuryHour').value);
      if (startHour !== "00") {
      this.invitationForm
        .get('timePicker')
        ?.get('injuryHour')
        ?.setValidators([greaterThanValidator(Number(startHour)), Validators.required]);
      }
      else if(startHour === 0){
        this.invitationForm.get('timePicker')
            .get('injuryHour')
            .setValidators(Validators.required);
      }
    });
    this.invitationForm.get('timePicker')?.valueChanges.subscribe(() => {
      this.invitationForm
        .get('timePicker')
        ?.get('injuryHour')
        .valueChanges.subscribe(() => {
          this.invitationForm.get('timePicker')?.get('injuryMinute').reset();
        });
      const startHour = Number(this.invitationForm.get('startTimePicker')?.get('injuryHour').value);
      const startMinute = Number(this.invitationForm.get('startTimePicker')?.get('injuryMinute').value);
      const endHour = Number(this.invitationForm.get('timePicker')?.get('injuryHour').value);
      if (startHour === endHour) {
        this.invitationForm
          .get('timePicker')
          ?.get('injuryMinute')
          ?.setValidators([Validators.min(Number(startMinute) + 1), Validators.required]);
      } else {
        this.invitationForm.get('timePicker')?.get('injuryMinute')?.setValidators([Validators.required]);
      }
    });
    /**
     * To  get currentDate and CurrentHour
     */
    this.currentHours = new Date().getHours().toString();
    if (this.currentHours && this.currentHours.length <= 1) {
      this.currentHours = '0' + this.currentHours;
    }
    // this.currentDates = convertToYYYYMMDD(new Date().toString());
    this.currentMinute = new Date().getMinutes().toString();
    if (this.currentMinute && this.currentMinute.length <= 1) {
      this.currentMinute = '0' + this.currentMinute;
    }
    this.currentTime = this.currentHours.concat(this.currentMinute);
    if (this.isEditMode && !this.isRegularSession) {
      this.invitationForm.valueChanges.subscribe(() => {
        this.setFormForUnavailableList();
      });
    }
    if (this.isEditMode && !this.isRegularSession)
      this.invitationForm.get('timePicker')?.valueChanges.subscribe(() => [this.setFormForUnavailableList()]);
  }
  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.individualSessionDetails)
      this.individualSessionDetails = changes.individualSessionDetails.currentValue;
    if (changes && changes.configurationDetails) {
      this.configurationDetails = changes.configurationDetails.currentValue;
      this.bindConfigurationDetails(this.configurationDetails);
    }
    if (changes && changes.isEditMode) this.isEditMode = changes.isEditMode.currentValue;
    if (this.individualSessionDetails) {
      this.setSessionTime(this.individualSessionDetails);
    }
    if (changes && changes.mbDetails) {
      this.mbDetails = changes.mbDetails.currentValue;
      if (this.mbDetails.medicalBoardType.english === GeneralEnum.PMB) {
        this.lookUpService.getEstablishmentLocationList().subscribe(res => {
          this.officeLocationList = res;
        });
      } else {
        this.items.push({
          value: this.mbDetails.officeLocation,
          sequence: 1
        });
        this.officeLocationList = new LovList(this.items);
        if (this.officeLocationList.items.length > 1) {
          this.officeLocationList.items = Object.assign(
            {},
            this.officeLocationList.items.filter(x => x.value.english !== undefined)
          );
        }
      }
      this.bindSessionDetails(this.mbDetails);
    }
    // if(this.isEditMode){
    // this.invitationForm.get('timePicker')?.valueChanges.subscribe(() => [this.setFormForUnavailableList()]);}
  }
  bindConfigurationDetails(configurationDetails: IndividualSessionDetails) {
    if (this.isEditMode && configurationDetails) {
      if (this.invitationForm.get('startDate')) {
        this.isDisabled = true;
        this.invitationForm
          .get('startDate')
          .get('gregorian')
          .setValue(new Date(configurationDetails?.startDate?.gregorian));

        this.sessionStartDate = this.configurationDetails?.startDate?.gregorian;
      }
      if (this.invitationForm.get('startTimePicker')) {
        const starttime = configurationDetails?.startTime.split('::');
        this.invitationForm.get('startTimePicker').get('injuryHour').setValue(starttime[0]);
        this.invitationForm.get('startTimePicker').get('injuryMinute').setValue(starttime[1]);
        //To get session start hour
        this.sessionStartHour = starttime[0];
        this.sessionStartMinute = starttime[1];
        this.sessionTime = this.sessionStartHour.concat(this.sessionStartMinute);
        this.isSessionAlreadyStarted();
      }
      if (this.invitationForm.get('timePicker')) {
        const endtime = configurationDetails?.endTime.split('::');
        this.invitationForm.get('timePicker').get('injuryHour').setValue(endtime[0]);
        this.invitationForm.get('timePicker').get('injuryMinute').setValue(endtime[1]);
      }
      if (this.invitationForm.get('sessionFrequency')) {
        this.bindSessioncontrolToForm(
          this.invitationForm.get('sessionFrequency'),
          configurationDetails?.sessionFrequency
        );
      }
      this.days?.forEach(day => {
        configurationDetails?.days?.forEach(dayDetail => {
          if (dayDetail?.english?.toLowerCase() === day.control) {
            this.invitationForm?.get('day')?.get(day.control)?.setValue(true);
            this.checkDays('true', day.index);
          }
        });
      });
    } else this.isDisabled = false;
  }
  /**
   * Method to set the session time
   * @param individualSessionDetails
   */
  setSessionTime(individualSessionDetails) {
    this.startdateArray = individualSessionDetails.startTime?.split('::');
    this.enddateArray = individualSessionDetails.endTime?.split('::');
    if (this.startdateArray && this.enddateArray) {
      const startMinute = this.startdateArray[1] ? this.startdateArray[1] : 0;
      const startHour = this.startdateArray[0];
      const endMinute = this.enddateArray[1] ? this.enddateArray[1] : 0;
      const endHour = this.enddateArray[0];
      if (Number(startHour) > 12) {
        this.startHour = Number(startHour) - 12;
        this.startMinute = Number(startMinute);
        this.starttimePeriod = MBConstants.POST_MERIDIAN();
      } else if (Number(startHour) === 12) {
        this.startHour = 12;
        this.startMinute = Number(startMinute);
        this.starttimePeriod = MBConstants.POST_MERIDIAN();
      } else {
        if (Number(startHour) === 0) {
          this.startHour = 12;
          this.startMinute = Number(startMinute);
          this.starttimePeriod = MBConstants.ANTE_MERIDIAN();
        } else if (Number(startHour) !== 0 && !isNaN(Number(startHour))) {
          this.startHour = Number(startHour);
          this.startMinute = Number(startMinute);
          this.starttimePeriod = MBConstants.ANTE_MERIDIAN();
        }
      }
      if (Number(endHour) > 12) {
        this.endHour = Number(endHour) - 12;
        this.endMinute = Number(endMinute);
        this.endtimePeriod = MBConstants.POST_MERIDIAN();
      } else if (Number(endHour) === 12) {
        this.endHour = 12;
        this.endMinute = Number(endMinute);
        this.endtimePeriod = MBConstants.POST_MERIDIAN();
      } else {
        if (Number(endHour) === 0) {
          this.endHour = 12;
          this.endMinute = Number(endMinute);
          this.endtimePeriod = MBConstants.ANTE_MERIDIAN();
        } else if (Number(endHour) !== 0 && !isNaN(Number(endHour))) {
          this.endHour = Number(endHour);
          this.endMinute = Number(endMinute);
          this.endtimePeriod = MBConstants.ANTE_MERIDIAN();
        }
      }
    }
  }
  /**
   * Method to bind to session details form
   * @param sessionDetails
   */
  bindSessionDetails(mbDetails: MbDetails) {
    if (this.invitationForm && mbDetails) {
      if (this.invitationForm.get('officeLocation')) {
        if (this.isEditMode) {
          this.invitationForm.get('officeLocation').setValue(this.configurationDetails?.officeLocation);
        } else {
          this.invitationForm.get('officeLocation').setValue(mbDetails?.officeLocation);
        }
      }
      if (this.invitationForm.get('sessionChannelList')) {
        if (this.isEditMode) {
          this.invitationForm.get('sessionChannelList').setValue(this.configurationDetails?.sessionChannel);
        } else {
          this.invitationForm.get('sessionChannelList').setValue(mbDetails?.sessionChannel);
        }
      }
      if (this.invitationForm.get('medicalBoardList')) {
        this.invitationForm.get('medicalBoardList').setValue(mbDetails?.medicalBoardType);
        if (!this.isEditMode && this.mbDetails.medicalBoardType.english === GeneralEnum.PMB) {
          this.isReadOnly = false;
        }
      }
    }
  }
  /**
   *To make the Time component disable by comparing current time and session time
   */
  isSessionAlreadyStarted() {
    if (this.isEditMode && !this.isRegularSession) {
      //only for modify session
      if (moment(this.sessionStartDate).isBefore(startOfDay(new Date()))) {
        // const today: Date = startOfDay(new Date());
        this.isTimeDisabled = true;
      } else if (
        moment(this.sessionStartDate).isSame(startOfDay(new Date())) &&
        Number(this.sessionTime) < Number(this.currentTime)
      ) {
        this.isTimeDisabled = true;
      }
    }
  }
  /**
   * Method to bindSessioncontrolToForm
   * @param formValue
   * @param value
   */
  bindSessioncontrolToForm(formValue: AbstractControl, value: BilingualText) {
    formValue.get('english')?.setValue(value?.english);
    formValue.get('arabic')?.setValue(value?.arabic);
  }
  createInvitationForm() {
    return this.fb.group({
      medicalBoardList: this.fb.group({
        english: ['Primary Medical Board', { validators: Validators.required }],
        arabic: [null]
      }),
      sessionChannelList: this.fb.group({
        english: ['GOSI Office', { validators: Validators.required }],
        arabic: [null]
      }),
      officeLocation: this.fb.group({
        english: [null, Validators.required],
        arabic: [null, Validators.required]
      }),
      sessionFrequency: this.fb.group({
        arabic: [],
        english: [
          null,
          {
            validators: Validators.compose([Validators.required]),
            updateOn: 'blur'
          }
        ]
      }),
      startDate: this.fb.group({
        gregorian: [null, { validators: Validators.compose([Validators.required]), updateOn: 'blur' }],
        hijiri: null
      }),
      startTimePicker: this.fb.group({
        injuryHour: [null, { validators: Validators.required }],
        injuryMinute: [null, { validators: Validators.required }]
      }),
      timePicker: this.fb.group({
        injuryHour: [null, { validators: Validators.required }],
        injuryMinute: [null, { validators: Validators.required }]
      }),
      day: this.fb.group({
        sunday: [null, { validators: Validators.required }],
        monday: [null, { validators: Validators.required }],
        tuesday: [null, { validators: Validators.required }],
        wednesday: [null, { validators: Validators.required }],
        thursday: [null, { validators: Validators.required }],
        friday: [null, { validators: Validators.required }],
        saturday: [null, { validators: Validators.required }]
      }),
      noOfCancellationDays: [null]
    });
  }
  setFormForUnavailableList() {
    markFormGroupTouched(this.invitationForm);
    const startHour = this.invitationForm.get('startTimePicker').get('injuryHour').value;
    const startMinute = this.invitationForm.get('startTimePicker').get('injuryMinute').value;
    const startDate = this.invitationForm.get('startDate.gregorian').value;
    const endHour = this.invitationForm.get('timePicker').get('injuryHour').value;
    const endMinute = this.invitationForm.get('timePicker').get('injuryMinute').value;
    const valid = startHour === endHour ? (startMinute < endMinute ? true : false) : startHour < endHour ? true : false;
    if (
      startDate !== null &&
      startHour !== null &&
      startMinute !== null &&
      endHour !== null &&
      endMinute !== null &&
      this.invitationForm.valid &&
      valid
    ) {
      const sessionDate = String(startOfDay(startDate));
      const dateArray = convertToYYYYMMDD(sessionDate);
      let sTime: string = startHour;
      sTime = sTime + '::' + startMinute;
      let eTime: string = endHour;
      eTime = eTime + '::' + endMinute;
      const unAvailableRequest: UnAvailableMemberListRequest = {
        startDate: dateArray,
        startTime: sTime,
        endTime: eTime
      };
      if (
        // unAvailableRequest.startDate !== convertToYYYYMMDD(String(this.sessionData.sessionDate.gregorian)) ||
        unAvailableRequest.startTime !== this.startTime ||
        unAvailableRequest.endTime !== this.endTime
      )
        this.unAvailableList.emit(unAvailableRequest);
      this.startTime = unAvailableRequest.startTime;
      this.endTime = unAvailableRequest.endTime;
    }
  }
  getDoctorAcceptance(value) {
    this.changeValue.emit(value);
  }

  gosiOfficerLocationChange() {
    const value = this.invitationForm.get('officeLocation').value;
    this.officeLocationChangeValue.emit(value);
  }

  checkDays(event, index) {
    this.daysArray[index] = event;
    let daysSelected = 0;
    this.daysArray?.forEach(val => {
      if (val === 'true') daysSelected++;
    });
    const dayitem = this.invitationForm?.get('day')?.value;
    if (daysSelected > 0) {
      Object.keys(dayitem).forEach(element => {
        this.invitationForm?.get('day')?.get(element).clearValidators();
        this.invitationForm?.get('day')?.get(element).updateValueAndValidity();
      });
    } else {
      Object.keys(dayitem).forEach(element => {
        this.invitationForm?.get('day')?.get(element).reset();
        this.invitationForm?.get('day')?.get(element).setValidators(Validators.required);
        this.invitationForm?.get('day')?.get(element).markAsPristine();
        this.invitationForm?.get('day')?.get(element).updateValueAndValidity();
      });
    }
  }
  onValidateForm() {
    if (!this.isRegularSession) {
      this.invitationForm?.get('sessionFrequency')?.get('english')?.clearValidators();
      this.invitationForm?.get('sessionFrequency')?.get('english')?.reset();
      this.invitationForm?.get('sessionFrequency')?.get('english')?.updateValueAndValidity();
      const element = this.invitationForm?.get('day')?.value;
      Object.keys(element).forEach(dayitem => {
        this.invitationForm?.get('day')?.get(dayitem).clearValidators();
        this.invitationForm?.get('day')?.get(dayitem)?.reset();
        this.invitationForm?.get('day')?.get(dayitem).updateValueAndValidity();
      });
    } else {
      this.invitationForm?.get('sessionFrequency')?.get('english')?.reset();
      this.invitationForm?.get('sessionFrequency')?.get('english')?.setValidators([Validators.required]);
      this.invitationForm?.get('sessionFrequency')?.get('english')?.updateValueAndValidity();
      const elements = this.invitationForm?.get('day')?.value;
      Object.keys(elements).forEach(dayvalues => {
        this.invitationForm?.get('day')?.get(dayvalues)?.reset();
        this.invitationForm?.get('day')?.get(dayvalues)?.setValidators([Validators.required]);
        this.invitationForm?.get('day')?.get(dayvalues).updateValueAndValidity();
      });
    }
  }
}
