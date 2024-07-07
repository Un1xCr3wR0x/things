import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText } from '@gosi-ui/core';
import { convertToYYYYMMDD, startOfDay } from '@gosi-ui/core/lib/utils/date';
import { IndividualSessionDetails, MbDetails, SessionChannelEnum, SessionDetails } from '../../../../shared';
import moment from 'moment';

@Component({
  selector: 'mb-session-slot-details-dc',
  templateUrl: './session-slot-details-dc.component.html',
  styleUrls: ['./session-slot-details-dc.component.scss']
})
export class SessionSlotDetailsDcComponent implements OnInit, OnChanges {
  sessionSlotForm: FormGroup = new FormGroup({});
  @Input() isRequired: boolean;
  //Input Variables
  @Input() isCreateSession = true;
  @Input() isEditMode: boolean;
  @Input() parentForm: FormGroup;
  @Input() invitationDay: number;
  @Input() sessionDetails: SessionDetails;
  @Input() individualSessionDetails: IndividualSessionDetails;
  @Input() configurationDetails: IndividualSessionDetails;
  @Input() mbDetails: MbDetails;
  @Input() isInCharge: boolean;
  @Input() getSessionChannel: BilingualText;
  @Input() isAddparticpantbyMb = false;
  @Input() participantLength: number;
  isSessionStarted = false;
  isHidePrior: boolean;

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.onValidateForm();
    this.sessionSlotForm = this.createSessionSlotForm();
    this.sessionSlotForm.get('noOfSessionDays')?.valueChanges.subscribe(value => {
      if (!this.isInCharge && this.isSessionStarted) {
        this.getMinimumNumberOfDays(value);
      } else {
        this.sessionSlotForm.get('noOfbeneficiaries')?.reset();
        this.getMinimumNumberOfDays(value);
      }
    });
    this.sessionSlotForm.get('noOfbeneficiaries').valueChanges.subscribe(value => {
      this.getNumberOfbeneficiaries(value);
    });
    if (this.parentForm) {
      this.parentForm.addControl('sessionSlotForm', this.sessionSlotForm);
      this.checkParentForm();
    }
  }
  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.invitationDay) this.invitationDay = changes.invitationDay.currentValue;
    if (this.invitationDay) {
      this.sessionSlotForm?.get('noOfSessionPriorDays')?.reset();
    }
    if (changes && changes.configurationDetails) this.configurationDetails = changes.configurationDetails.currentValue;
    if (changes && changes.isEditMode) this.isEditMode = changes.isEditMode.currentValue;
    if (changes && changes.sessionDetails) this.sessionDetails = changes.sessionDetails.currentValue;
    if (this.isAddparticpantbyMb) {
      this.sessionSlotForm.get('noOfSessionDays')?.setValue(this.participantLength);
    }
    if (this.isEditMode) {
      this.bindToSlotForm(this.configurationDetails);
      this.showChannel();
    }
    if (changes && changes.isRequired) {
      this.isRequired = changes.isRequired.currentValue;
      this.onValidateForm();
    }

    if (this.configurationDetails) {
      this.isSessionAlreadyStarted();
    }
  }
  /**
   * Method to create slot form
   */
  createSessionSlotForm() {
    return this.fb.group({
      noOfSessionDays: [
        null,
        { validators: Validators.compose([Validators.required, Validators.min(1)]), updateOn: 'blur' }
      ],
      noOfbeneficiaries: [null, Validators.required],
      noOfSessionPriorDays: [null, Validators.required]
    });
  }
  /**
   * Method to bindToSlotForm
   */
  bindToSlotForm(configurationDetails) {
    if (this.sessionSlotForm) {
      this.sessionSlotForm.get('noOfSessionDays')?.setValue(configurationDetails.minimumBeneficiaries);
      this.sessionSlotForm.get('noOfbeneficiaries')?.setValue(configurationDetails.maximumBeneficiaries);
      this.sessionSlotForm.get('noOfSessionPriorDays')?.setValue(configurationDetails.beneficiarySlotOpenDays);
    }
  }

  isSessionAlreadyStarted() {
    if (this.isEditMode) {
      //only for modify session
      const starttime = this.configurationDetails?.startTime.split('::');
      starttime[1] = starttime[1] !== undefined ? starttime[1] : '00';
      const startTime = starttime[0] + ':' + starttime[1];
      let hours = new Date().getHours().toString();
      hours = hours.length === 1 ? '0' + hours.toString() : hours;
      let _min = new Date().getMinutes().toString();
      _min = _min.length === 1 ? '0' + _min.toString() : _min;
      const currentTime = hours + ':' + _min;
      // const todayDate = convertToYYYYMMDD(new Date().toString());
      // const sDate = moment(configurationDetails.startDate.gregorian).format('YYYY-MM-DD');
      // if (todayDate === sDate && startTime < currentTime) {
      //   this.isSessionStarted = true;
      // }
      if (moment(this.configurationDetails?.startDate?.gregorian).isBefore(startOfDay(new Date()))) {
        this.isSessionStarted = true;
      } else if (
        moment(this.configurationDetails?.startDate?.gregorian).isSame(startOfDay(new Date())) &&
        startTime < currentTime
      ) {
        this.isSessionStarted = true;
      }
    }
  }
  getMinimumNumberOfDays(value) {
    if (this.sessionSlotForm.get('noOfbeneficiaries').value !== null) {
      this.sessionSlotForm
        .get('noOfSessionDays')
        ?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(Number(this.sessionSlotForm.get('noOfbeneficiaries').value - 1))
        ]);
    }
  }
  getNumberOfbeneficiaries(value) {
    this.sessionSlotForm
      .get('noOfbeneficiaries')
      ?.setValidators([
        Validators.required,
        Validators.min(Number(this.sessionSlotForm.get('noOfSessionDays').value) + 1)
      ]);
  }
  onValidateForm() {
    if (!this.isRequired) {
      this.sessionSlotForm?.get('noOfSessionPriorDays')?.clearValidators();
      this.sessionSlotForm?.get('noOfSessionPriorDays')?.reset();
      this.sessionSlotForm?.get('noOfSessionPriorDays')?.updateValueAndValidity();
    } else if (this.isRequired) {
      // Commented the below code since noOfSessionPriorDays value was not populating. (workitem 170171 no. of prior days fix)
      // this.sessionSlotForm?.get('noOfSessionPriorDays')?.reset();
      this.sessionSlotForm?.get('noOfSessionPriorDays')?.setValidators([Validators.required]);
      this.sessionSlotForm?.get('noOfSessionPriorDays')?.updateValueAndValidity();
    }
  }
  checkParentForm() {
    const formValue = this.parentForm?.get('inviteForm')?.get('sessionChannelList')?.value;
    if (formValue.english === SessionChannelEnum.VIRTUAL) {
      this.isRequired = false;
    } else if (formValue.english !== SessionChannelEnum.VIRTUAL) {
      this.isRequired = true;
    }
    this.onValidateForm();
  }

  showChannel() {
    if (this.getSessionChannel) {
      if (this.getSessionChannel.english === SessionChannelEnum.VIRTUAL) {
        this.isRequired = false;
      } else if (this.getSessionChannel.english !== SessionChannelEnum.VIRTUAL) {
        this.isRequired = true;
      }
    }
    this.onValidateForm();
  }
}
