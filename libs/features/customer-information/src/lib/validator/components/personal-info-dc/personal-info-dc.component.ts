/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { checkNull, IdentityTypeEnum, Person, getPersonArabicName, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment-timezone';

@Component({
  selector: 'cim-personal-info-dc',
  templateUrl: './personal-info-dc.component.html',
  styleUrls: ['./personal-info-dc.component.scss']
})
export class PersonalInfoDcComponent implements OnInit {
  //Local Variables
  typeNin = IdentityTypeEnum.NIN;
  typeIqama = IdentityTypeEnum.IQAMA;
  typeBorder = IdentityTypeEnum.BORDER;
  typePassport = IdentityTypeEnum.PASSPORT;
  typeGcc = IdentityTypeEnum.NATIONALID;
  arabicName: string;
  lang: any;
  iqmaNo: any;
  borderNo: any;
  ageHij: string;
  ageGreg: string;
  //Input Varaibles
  @Input() canEdit = false;
  @Input() isPassport=false;
  @Input() person: Person = new Person();
  @Input () personDetails:any
  @Input() socialInsuranceNo: number;
  @Input() active: boolean;
  @Output() onEdit: EventEmitter<void> = new EventEmitter();

  /**
   * Creates an instance of PersonalInfoDcComponent
   * @memberof  PersonalInfoDcComponent
   *
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>,) {}
  /**
   * This method handles the initialization tasks.
   */
  ngOnInit() {
   
  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes?.personDetails?.currentValue){

    
    this.personDetails = changes?.personDetails?.currentValue;
    this.language.subscribe(language => {
      this.lang = language;
      if (this.personDetails?.person?.birthDate) {
        if (this.lang == 'en') {
          this.ageHij = "(Age:" + this.personDetails.person?.ageInHijiri + ")";
          const ageValue = moment(new Date()).diff(moment(this.personDetails.person.birthDate.gregorian), 'year');
          this.ageGreg = "(Age:" + ageValue + ")";

        } else {
          this.ageHij = "(العمر:" + this.personDetails?.ageInHijiri + ")";
          const ageValue = moment(new Date()).diff(moment(this.personDetails.person.birthDate.gregorian), 'year');
          this.ageGreg = "(العمر:" + ageValue + ")";
        }
      }
      else {
        this.ageHij = null
        this.ageGreg = null
      }
    });
  }
  }
  getPersonArabicNames = arabicObject => {
    if (arabicObject) {
      return (
        (arabicObject.firstName ? arabicObject.firstName : '') +
        ' ' +
        (arabicObject.secondName ? arabicObject.secondName : '') +
        ' ' +
        (arabicObject.thirdName ? arabicObject.thirdName : '') +
        ' ' +
        (arabicObject.familyName ? arabicObject.familyName : '')
      ).trim();
    } else {
      return null;
    }
  };
  /**
   * This method handles the null check of values.
   */
  checkNull(value) {
    return checkNull(value);
  }
  // Method to emit edit details

  onEditPersonalInfo() {
    this.onEdit.emit();
  }
}
