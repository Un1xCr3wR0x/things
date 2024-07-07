import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LovList, Person, markFormGroupTouched } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { PersonDetailsFormModel } from '../../../shared';

@Component({
  selector: 'est-authorizedperson-details-dc',
  templateUrl: './authorizedperson-details-dc.component.html',
  styleUrls: ['./authorizedperson-details-dc.component.scss']
})
export class AuthorizedpersonDetailsDcComponent implements OnInit, OnChanges {
  @Input() parentForm: FormGroup;
  @Input() nationalityList$: LovList;
  @Input() genderList$: Observable<LovList>;
  @Input() personResponse: Person;
  @Input() newlyEnteredPerson: Person;
  @Input() isVerified: boolean;
  @Output() verifyPersonEmit: EventEmitter<Person> = new EventEmitter();
  @Output() resetPerson: EventEmitter<any> = new EventEmitter();

  authorizationForm: FormGroup = new FormGroup({});
  personFormDetails = new PersonDetailsFormModel();
  constructor() {}

  ngOnInit(): void {
    this.authorizationForm = this.createAuthorizationForm();
    if (this.parentForm.get('authorizationForm')) {
      this.parentForm.removeControl('authorizationForm');
    }
    this.parentForm.addControl('authorizationForm', this.authorizationForm);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.personResponse && changes.personResponse.currentValue) {
      this.personResponse = changes.personResponse.currentValue;
      this.bindPersonFormModel();
    }
    if (changes.isVerified) {
      this.isVerified = changes.isVerified.currentValue;
    }
  }

  createAuthorizationForm() {
    return new FormBuilder().group({
      isVerified: false,
      isSaved: false,
      personExists: false,
      checkBoxFlag: false,
      resetClicked: false
    });
  }
  // Method to bind data to personForm model
  bindPersonFormModel() {
    this.personFormDetails.fromJsonToObject(this.personResponse);
  }
  verifyPerson() {
    markFormGroupTouched(this.authorizationForm);
    const person = new Person();
    person.fromJsonToObject(this.authorizationForm.get('search').value);
    this.verifyPersonEmit.emit(person);
  }
  /**
   * Method to reset form
   */
  resetEventDetails(authorizationForm: FormGroup) {
    if (authorizationForm) {
      authorizationForm.get('isSaved').setValue(false);
      authorizationForm.get('personExists').setValue(false);
      authorizationForm.get('isVerified').setValue(false);
      authorizationForm.get('resetClicked').setValue(true);
      this.resetPerson.emit();
    }
  }
}
