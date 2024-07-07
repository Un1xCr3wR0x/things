/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  Alert,
  AlertIconEnum,
  AlertTypeEnum,
  GccCountryEnum,
  IdentityTypeEnum,
  LovList,
  NationalityTypeEnum
} from '@gosi-ui/core';
import { MaxLengthEnum } from '@gosi-ui/features/contributor';
import { cardType, InputTextDcComponent } from '@gosi-ui/foundation-theme';
import { PersonDetailsSmartForm } from '../../forms';

@Component({
  selector: 'cnt-person-details-input-dc',
  templateUrl: './person-details-input-dc.component.html',
  styleUrls: ['./person-details-input-dc.component.scss']
})
export class PersonDetailsInputDcComponent implements OnInit, OnChanges {
  @Input() isAttorney: boolean;
  @Input() enableRelationshipToMinors = false;
  @Input() enableMinorType = false;
  @Input() personDetailsSmartForm: PersonDetailsSmartForm;
  @Input() nationalityList;
  @Input() genderList;
  @Input() noBorder = true;
  @Input() showCard = false;
  @Input() cardType = cardType.Primary;
  @Input() heading;
  @Input() isEnglishNameMandatory = false;

  @Input() showPersonIdentityFields = true;
  @Input() showPersonNameFields = false;
  @Input() showName = true;

  @ViewChild('idNumber', { static: false })
  idNumberTextField: InputTextDcComponent;

  alert: Alert;
  MAX_LENGTH_ENUM = MaxLengthEnum;
  randomId = '_' + Math.random().toString(36).substring(2, 9);
  idTypeList = {
    [IdentityTypeEnum.NIN]: {
      arabic: 'الهوية الوطنية',
      english: 'National ID',
      sequence: 1
    },
    [IdentityTypeEnum.IQAMA]: {
      arabic: 'رقم إقامة',
      english: 'Iqama Number',
      sequence: 2
    },
    [IdentityTypeEnum.NATIONALID]: {
      arabic: 'رقم الهوية الخليجية',
      english: 'GCC National ID',
      sequence: 3
    },
    [IdentityTypeEnum.BORDER]: {
      arabic: 'رقم الحدود',
      english: 'Border Number',
      sequence: 4
    },
    [IdentityTypeEnum.PASSPORT]: {
      arabic: 'رقم الجواز',
      english: 'Passport Number',
      sequence: 5
    }
  };
  authRelationshipToMinorList: LovList = new LovList([
    { value: { english: 'Father/Mother', arabic: 'أب/أم' }, sequence: 1 },
    { value: { english: 'Other', arabic: 'أخرى' }, sequence: 2 }
  ]);

  personIdTypeList = this.getIdTypeList([
    IdentityTypeEnum.NIN,
    IdentityTypeEnum.NATIONALID,
    IdentityTypeEnum.IQAMA,
    IdentityTypeEnum.BORDER,
    IdentityTypeEnum.PASSPORT
  ]);
  saudiIdTypeList = this.getIdTypeList([IdentityTypeEnum.NIN]);
  gccIdTypeList = this.getIdTypeList([IdentityTypeEnum.NATIONALID, IdentityTypeEnum.IQAMA, IdentityTypeEnum.PASSPORT]);
  nonSaudiTypeList = this.getIdTypeList([IdentityTypeEnum.IQAMA, IdentityTypeEnum.BORDER, IdentityTypeEnum.PASSPORT]);

  idTypeControl: FormGroup;

  constructor(readonly fb: FormBuilder) {}

  ngOnInit() {
    const alert = new Alert();
    alert.messageKey = 'CONTRIBUTOR.NO-PERSON-INFO';
    alert.type = AlertTypeEnum.INFO;
    alert.icon = AlertIconEnum.INFO;
    this.alert = alert;
    if (this.showPersonNameFields) {
      this.personDetailsSmartForm.addPersonNameFields();
      if (this.isEnglishNameMandatory) {
        this.personDetailsSmartForm.makeEnglishNameMandatory();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.enableRelationshipToMinors?.currentValue) {
      this.personDetailsSmartForm.addRelationshipToMinors();
    } else {
      this.personDetailsSmartForm.removeRelationshipToMinors();
    }
  }

  selectNationality(nationality) {
    if (nationality === NationalityTypeEnum.SAUDI_NATIONAL) {
      this.personIdTypeList = this.saudiIdTypeList;
    } else if (Object.values(GccCountryEnum).indexOf(nationality) !== -1) {
      this.personIdTypeList = this.gccIdTypeList;
    } else {
      this.personIdTypeList = this.nonSaudiTypeList;
    }
    this.personDetailsSmartForm.resetIdFields();
  }

  selectIdType(id: string) {
    this.personDetailsSmartForm.selectIdType(id);
    // we do this to empty the errors when we change the validators
    this.idNumberTextField.setErrorMsgs(this.personDetailsSmartForm.id);
  }

  getIdTypeList(idType: Array<IdentityTypeEnum>) {
    return new LovList(
      idType.map((type, i) => ({
        value: this.idTypeList[type],
        sequence: i
      }))
    );
  }
  getIdTypeFromList(id) {
    for (const key of Object.keys(this.idTypeList)) {
      if (this.idTypeList[key].english === id) return key;
    }
  }
}
