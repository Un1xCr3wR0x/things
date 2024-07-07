import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  bindToForm,
  bindToObject,
  ContactDetails,
  IdentityTypeEnum,
  LookupService,
  LovList,
  Person
} from '@gosi-ui/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'dev-gosi-address-dc',
  templateUrl: './gosi-address-dc.component.html',
  styleUrls: ['./gosi-address-dc.component.scss']
})
export class GosiAddressDcComponent implements OnInit {
  addressDetailsForm: FormGroup;
  person: Person;
  lovlist: LovList = {
    items: [
      {
        value: { english: 'Dropdown Item One', arabic: 'نعم' },
        sequence: 1
      },
      {
        value: { english: 'Dropdown Item Two', arabic: 'لا' },
        sequence: 2
      },
      {
        value: { english: 'Dropdown Item Three', arabic: 'لا' },
        sequence: 3
      }
    ]
  };
  constructor(readonly fb: FormBuilder, readonly lookUpService: LookupService) {}

  ngOnInit(): void {
    this.addressDetailsForm = this.createContactForm();
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
    bindToForm(this.addressDetailsForm, this.person.contactDetail);
  }
  createContactForm() {
    return this.fb.group({
      comments: ''
    });
  }
}
