/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  BilingualText,
  CommonIdentity,
  convertToStringDDMMYYYY,
  getIdentityByType,
  getPersonNameAsBilingual,
  GosiCalendar,
  LanguageToken
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BehaviorSubject } from 'rxjs';
import { Person, Engagement, getAge } from '../../../shared/models';

@Component({
  selector: 'oh-vtr-personal-details-dc',
  templateUrl: './personal-details-dc.component.html',
  styleUrls: ['./personal-details-dc.component.scss']
})
export class PersonalDetailsDcComponent implements OnInit, OnChanges {
  /**
   *
   * @param language Creating an instance
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   * Local variables
   */
  personType: CommonIdentity = new CommonIdentity();
  primaryIdentityType: string;
  personNameEnglish: string = null;
  personNameArabic: String = null;
  occupation: BilingualText = new BilingualText();
  age: number = null;
  dateOfBirth: BilingualText = new BilingualText();
  lang = 'en';
  /**
   * Input variables
   */
  @Input() canEdit = false;
  @Input() person: Person;
  @Input() engagement: Engagement;
  @Input() injuryDate: GosiCalendar;

  /**
   * Output variables
   */
  @Output() onEdit: EventEmitter<null> = new EventEmitter();
  @Output() nameRegulation: EventEmitter<Object> = new EventEmitter();

  /**
   * This method is for initialization tasks
   */
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  /**
   * This method is to capture inputs on changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.person) {
      this.person = changes.person.currentValue;

      if (this.person) {
        /**
         * setting the identity
         */
        this.personType = getIdentityByType(this.person.identity, this.person.nationality.english);
        if (this.personType) {
          this.primaryIdentityType = 'OCCUPATIONAL-HAZARD.' + this.personType.idType;
          const nameObj = getPersonNameAsBilingual(this.person.name);
          this.personNameEnglish = nameObj.english;
          this.personNameArabic = nameObj.arabic;
          this.nameRegulation.emit({personNameEnglish: this.personNameEnglish, personNameArabic: this.personNameArabic, id: this.personType.id})
        }
      }
    }
    if (changes && changes.engagement) {
      this.engagement = changes.engagement.currentValue;
      if (this.engagement && this.engagement.engagementPeriod) {
        this.occupation = this.engagement.engagementPeriod[0].occupation;
      }
    }
  }
  /**
   * Calculate age
   */
  calculatePersonAge() {
    if (this.person.birthDate) {
      const birthDate = this.person.birthDate.gregorian;
      this.age = moment(new Date()).diff(moment(birthDate), 'years');

      if (birthDate != null) {
        this.dateOfBirth.english =
          convertToStringDDMMYYYY(birthDate.toString()) + ' ' + '(Age: ' + this.age + ' ' + 'years)';
        this.dateOfBirth.arabic =
          convertToStringDDMMYYYY(birthDate.toString()) + ' ' + '(سنوات ' + this.age + ' ' + ':السن)';
      }
      if (this.lang === 'ar') return getAge(birthDate, this.age);
      else if (this.lang === 'en') return this.dateOfBirth.english;
    }
  }
  // Method to emit edit details

  onEditPersonalDetails() {
    this.onEdit.emit();
  }
}
