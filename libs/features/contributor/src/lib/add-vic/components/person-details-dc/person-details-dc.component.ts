/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BilingualText,
  bindToForm,
  bindToObject,
  ContactDetails,
  LovList,
  markFormGroupTouched,
  setAddressFormToAddresses
} from '@gosi-ui/core';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments';
import { PersonalInformation } from '../../../shared/models';

@Component({
  selector: 'cnt-person-details-dc',
  templateUrl: './person-details-dc.component.html',
  styleUrls: ['./person-details-dc.component.scss']
})
export class PersonDetailsDcComponent implements OnInit, OnChanges, AfterViewInit {
  /** Local variables. */
  personDetailsForm: FormGroup;
  hasAddress: boolean;

  /**Input varialbes. */
  @Input() parentForm: FormGroup;
  @Input() educationList: LovList;
  @Input() specializationList: LovList;
  @Input() cityList: LovList;
  @Input() nationalityList: LovList;
  @Input() person: PersonalInformation = new PersonalInformation();
  @Input() canEdit: boolean;
  @Input() isEditMode: boolean;

  /** Output variables. */
  @Output() cancelTransaction = new EventEmitter<null>(null);
  @Output() savePerson = new EventEmitter<PersonalInformation | null>(null);

  /** Template and directive references. */
  @ViewChild('addressDetails', { static: false })
  addressDetailsComponent: AddressDcComponent;

  /** Method to initialize  PersonDetailsDcComponent. */
  constructor(private fb: FormBuilder) {}

  /** Method to handle initialization tasks. */
  ngOnInit(): void {
    if (!this.personDetailsForm) this.createPersonDetailsForm();
  }

  /** Method to create person details form. */
  createPersonDetailsForm() {
    this.personDetailsForm = this.createBasicDetailsForm();
    this.parentForm.addControl('basicDetails', this.personDetailsForm);
  }

  /** Method to detect changes in input variables. */
  ngOnChanges(change: SimpleChanges) {
    if (change.person?.currentValue) {
      if (!this.personDetailsForm) this.createPersonDetailsForm();
      bindToForm(this.personDetailsForm, this.person), bindToForm(this.personDetailsForm, this.person.contactDetail);
      if (this.addressDetailsComponent) this.checkPersonHasAddress();
    }
  }

  /** Method to handle ngAfterViewInit. */
  ngAfterViewInit() {
    if (this.addressDetailsComponent) this.checkPersonHasAddress();
  }

  /** Method to check whether person has address. */
  checkPersonHasAddress() {
    if (this.person.contactDetail && this.person.contactDetail.addresses.length > 0)
      this.hasAddress =
        this.person.contactDetail.addresses.length === 1 && this.person.contactDetail.addresses[0].type === 'OVERSEAS'
          ? false
          : this.addressDetailsComponent.getAddressValidity();
    else this.hasAddress = false;
  }

  /** Method to create basic person details form.*/
  createBasicDetailsForm(): FormGroup {
    return this.fb.group({
      education: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      specialization: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      mobileNo: this.fb.group({
        primary: [
          null,
          {
            validators: Validators.compose([Validators.required, Validators.pattern('[0-9]+')]),
            updateOn: 'blur'
          }
        ],
        isdCodePrimary: [null, { updateOn: 'blur' }]
      })
    });
  }

  /** Method to submit person details. */
  submitPersonDetails(): void {
    markFormGroupTouched(this.personDetailsForm);
    const isAddressValid = this.addressDetailsComponent.getAddressValidity();
    if (this.personDetailsForm.valid && isAddressValid) {
      this.person.education = this.person.specialization = new BilingualText();
      bindToObject(this.person, this.personDetailsForm.value);
      if (!this.person.contactDetail) this.person.contactDetail = new ContactDetails();
      this.person.contactDetail.mobileNo = this.personDetailsForm.get('mobileNo').value;
      this.person.contactDetail.addresses = setAddressFormToAddresses(this.parentForm);
      this.person.contactDetail.currentMailingAddress = this.addressDetailsComponent.parentForm.get(
        'currentMailingAddress'
      ).value;
      this.savePerson.emit(this.person);
    } else this.savePerson.emit(null);
  }
}
