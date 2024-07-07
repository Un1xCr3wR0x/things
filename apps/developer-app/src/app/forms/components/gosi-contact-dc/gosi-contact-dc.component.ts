import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  bindToForm,
  bindToObject,
  ContactDetails,
  emailValidator,
  Establishment,
  IdentityTypeEnum,
  Person
} from '@gosi-ui/core';

@Component({
  selector: 'dev-gosi-contact-dc',
  templateUrl: './gosi-contact-dc.component.html',
  styleUrls: ['./gosi-contact-dc.component.scss']
})
export class GosiContactDcComponent implements OnInit {
  contactDetailsForm: FormGroup;

  person: Person;

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactDetailsForm = this.createContactForm();
    this.person = {
      socialInsuranceNumber: [],
      personId: 1036053648,
      nationality: { arabic: 'مصر', english: 'Egypt' },
      identity: [
        {
          idType: IdentityTypeEnum.PASSPORT,
          passportNo: 'A18803474',
          issueDate: {
            gregorian: new Date('2016-08-13T00:00:00.000Z'),
            hijiri: '1437-11-10'
          },
          expiryDate: undefined
        },
        {
          idType: IdentityTypeEnum.IQAMA,
          iqamaNo: 2475362386,
          borderNo: undefined,
          expiryDate: {
            gregorian: new Date('2020-11-21T00:00:00.000Z'),
            hijiri: '1442-04-06'
          }
        },
        { idType: IdentityTypeEnum.BORDER, id: 3048746279 }
      ],
      name: {
        arabic: {
          firstName: 'هبه',
          secondName: 'عبد الرحيم',
          thirdName: 'حسين',
          familyName: 'محمد',
          fromJsonToObject: () => {
            return undefined;
          }
        },
        english: { name: 'Abdulah' },
        fromJsonToObject: () => {
          return undefined;
        }
      },
      sex: { arabic: 'انثى', english: 'Female' },
      education: { arabic: 'ثانويه عامه', english: 'High School' },
      specialization: { arabic: 'الزراعة', english: 'الزراعة' },
      birthDate: { gregorian: new Date('1994-06-10T00:00:00.000Z'), hijiri: '1415-01-01' },
      deathDate: null,
      maritalStatus: { arabic: 'الزراعة', english: 'single' },
      contactDetail: null,
      govtEmp: false,
      role: 'contributor',
      fromJsonToObject: () => {
        return undefined;
      }
    };
    this.person.contactDetail = bindToObject(new ContactDetails(), this.person.contactDetail);
    bindToForm(this.contactDetailsForm, this.person.contactDetail);
  }
  createContactForm() {
    return this.fb.group({
      comments: ''
    });
  }
}
