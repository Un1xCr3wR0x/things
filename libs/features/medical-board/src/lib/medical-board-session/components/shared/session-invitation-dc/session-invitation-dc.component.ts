/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { greaterThanValidator, lessThanValidator, LovList } from '@gosi-ui/core';
import { IndividualSessionDetails, SessionDetails } from '../../../../shared';

@Component({
  selector: 'mb-session-invitation-dc',
  templateUrl: './session-invitation-dc.component.html',
  styleUrls: ['./session-invitation-dc.component.scss']
})
export class SessionInvitationDcComponent implements OnInit, OnChanges {
  /**
   * Local variables
   */
  invitationForm: FormGroup = new FormGroup({});
  doctorAcceptanceList: LovList;
  invitationDay: number;
  canEdit = false;
  /**
   * Input variables
   */
  @Input() isCreateSession = true;
  @Input() parentForm: FormGroup;
  @Input() isEditMode: boolean;
  @Input() sessionDetails: SessionDetails;
  @Input() sessionDifference: number;
  @Input() individualSessionDetails: IndividualSessionDetails;
  @Input() configurationDetails: IndividualSessionDetails;

  @Output() invitationDays: EventEmitter<number> = new EventEmitter();

  constructor(readonly fb: FormBuilder) {}
  /**
   * Method to intialise tasks
   */
  ngOnInit(): void {
    this.invitationForm = this.createInvitationForm();
    if (this.parentForm) this.parentForm.addControl('invitationForm', this.invitationForm);
    const item = [
      {
        value: { english: 'Yes', arabic: 'نعم' },
        sequence: 0
      },
      {
        value: { english: 'No', arabic: 'لا' },
        sequence: 1
      }
    ];
    this.doctorAcceptanceList = new LovList(item);
    this.setMinDays()
  }
  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.sessionDifference) this.sessionDifference = changes.sessionDifference.currentValue;
    if (changes && changes.sessionDetails) this.sessionDetails = changes.sessionDetails.currentValue;
    if (changes && changes.isEditMode) this.isEditMode = changes.isEditMode.currentValue;
    if (changes && changes.configurationDetails) this.configurationDetails = changes.configurationDetails.currentValue;
    if (this.isEditMode) this.bindToForm(this.configurationDetails);

  }
  /**
   * Method to create invitation form
   */
  createInvitationForm() {
    return this.fb.group({
      noOfInvitationDays: [21, { validators: Validators.required, updateOn: 'blur' }],
      doctorAcceptance: this.fb.group({
        english: ['No', { validators: Validators.required }],
        arabic: [null]
      }),
      noOfCancellationDays: [7, { validators: Validators.required }]
    });
  }
  /**
   * Method to bind to form
   * @param sessionDetails
   */
  bindToForm(configurationDetails: IndividualSessionDetails) {
    if (configurationDetails?.isDoctorInviteCancelAllowed === true) {
      this.invitationForm?.get('doctorAcceptance')?.setValue(this.doctorAcceptanceList?.items[0].value);
    } else if (configurationDetails?.isDoctorInviteCancelAllowed === false)
      this.invitationForm?.get('doctorAcceptance')?.setValue(this.doctorAcceptanceList?.items[1].value);
  }
  setMinDays(){
    this.invitationForm.setValidators(Validators.required);
    //To check validation for minimum days prior to invitation(21)
    this.invitationForm
      ?.get('noOfInvitationDays')
      ?.setValidators(Validators.compose([Validators.required, Validators.min(21)]));
    //To check validation for minimum days prior for cancellation(7)
    this.invitationForm
      ?.get('noOfCancellationDays')
      ?.setValidators(Validators.compose([Validators.required, Validators.min(7), 
        Validators.max(Number(this.invitationForm.get('noOfInvitationDays').value))]));
        this.invitationForm.get('noOfInvitationDays')?.valueChanges.subscribe(day => {
          this.invitationForm
      ?.get('noOfCancellationDays')
      ?.setValidators(Validators.compose([Validators.required, Validators.min(7), 
        Validators.max(Number(day))]));
        });
  }
  /**
   * Method to get Number of InvitationDays
   * @param value
   */
  getNumberOfInvitationDays(value) {
    this.invitationForm.get('noOfInvitationDays')?.valueChanges.subscribe(day => {
      this.invitationDays.emit(day);
      this.invitationDay = Number(day);
      this.invitationForm.get('noOfCancellationDays').reset();
    });
  }
  getDoctorAcceptance(value) {}
}
