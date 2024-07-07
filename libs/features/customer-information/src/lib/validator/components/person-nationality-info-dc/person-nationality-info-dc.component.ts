
import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { PersonDetails, ProfileWrapper } from '../../../shared';
import { BilingualText, LanguageToken, Person, getPersonArabicName, getPersonEnglishName } from '@gosi-ui/core';
import { ChangeRequestList } from '../../../shared/models/modify-nationality-details-info';
import { BehaviorSubject } from 'rxjs';
import { contractSocialInsuranceNo } from 'testing';
import moment from 'moment-timezone';

@Component({
  selector: 'cim-person-nationality-info-dc',
  templateUrl: './person-nationality-info-dc.component.html',
  styleUrls: ['./person-nationality-info-dc.component.scss']
})
export class PersonNationalityInfoDcComponent implements OnInit {
  @Input() profileDetails: any;
  @Input() nationalityDetails: any[] = [];
  name;
  nameEnglish;
  nationality: BilingualText;
  personNationalityDetails: ChangeRequestList;
  passportNumber: any;
  passportExpiryDetails: any;
  passportIssueDetails: any;
  nationalityInfo: any;
  passport: any;
  lang: any;
  iqmaNo: any;
  borderNo: any;
  ageHij: string;
  ageGreg: string;
  gccIdDetails: any;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>,) { }

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.nationalityDetails && changes.nationalityDetails.currentValue) {
      this.nationalityDetails = changes?.nationalityDetails?.currentValue?.changeRequestList;
      this.passportIssueDetails = this.nationalityDetails?.find(data => data.parameter == 'Passport Issue Date')
      this.passportExpiryDetails = this.nationalityDetails?.find(data => data.parameter == 'Passport Expiry Date')
      this.nationalityInfo = this.nationalityDetails?.find(data => data.parameter == 'Nationality')
      this.passport = this.nationalityDetails?.find(data => data.parameter == 'Passport Number')
      this.gccIdDetails = this.nationalityDetails?.find(data => data.parameter == 'Gcc Id')

    }
    if (changes.profileDetails && changes.profileDetails.currentValue) {
      this.profileDetails = changes?.profileDetails?.currentValue;
      this.name = getPersonArabicName(this.profileDetails?.name?.arabic);
      this.nameEnglish = getPersonEnglishName(this.profileDetails?.name?.english);
      this.nationality = this.profileDetails.nationality;
      const isIqmatype = this.profileDetails.identity.find(id => id.idType === 'IQAMA')
      const borderNO = this.profileDetails.identity.find(id => id.idType === 'BORDERNO')
      if (isIqmatype) {
        this.iqmaNo = isIqmatype.iqamaNo

      }
      else if (borderNO) {
        this.borderNo = borderNO.id
      }
      this.language.subscribe(language => {
        this.lang = language;
        if (this.profileDetails?.birthDate) {
          if (this.lang == 'en') {
            this.ageHij = "(Age:" + this.profileDetails.ageInHijiri + ")";
            const ageValue = moment(new Date()).diff(moment(this.profileDetails.birthDate.gregorian), 'year');
            this.ageGreg = "(Age:" + ageValue + ")";

          } else {
            this.ageHij = "(العمر:" + this.profileDetails.ageInHijiri + ")";
            const ageValue = moment(new Date()).diff(moment(this.profileDetails.birthDate.gregorian), 'year');
            this.ageGreg = "(العمر:" + ageValue + ")";
          }
        }
        else {
          this.ageHij = null
          this.ageGreg = null
        }
      });


      // else if(){

      // }

    }




  }

}
