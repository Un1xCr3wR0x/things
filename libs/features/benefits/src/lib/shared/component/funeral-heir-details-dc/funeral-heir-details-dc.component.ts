/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AnnuityResponseDto, BenefitDetails, FuneralGrantBeneficiaryResponse, PersonBankDetails } from '../../models';
import { getPersonNameAsBilingual } from '@gosi-ui/core/lib/utils/person';
import moment from 'moment';
import { CommonIdentity } from '@gosi-ui/core';
import { BeneficiaryType } from '../../enum/beneficiary-type';
import { getIdLabel, getIdRemoveNullValue } from '../../utils';
import { BenefitConstants } from '../../constants';

@Component({
  selector: 'bnt-funeral-heir-details-dc',
  templateUrl: './funeral-heir-details-dc.component.html',
  styleUrls: ['./funeral-heir-details-dc.component.scss']
})
export class FuneralHeirDetailsDcComponent implements OnInit, OnChanges {
  // local variables
  loadLessNotes = true;
  beneficiaryNameEnglish: string;
  beneficiaryNameArabic: string;
  idNumber: string;
  idLabel: string;
  age: number;
  dob: string;
  dobHijiri: string;
  bankDetails: PersonBankDetails;
  lessNotes = BenefitConstants.LESS_NOTES_LENGTH;
  beneficiaryEnums = BeneficiaryType;
  /**
   * Input variables
   */
  @Input() lang = 'en';
  @Input() benefitCalculationDetails: BenefitDetails;
  @Input() annuityBenefitDetails: AnnuityResponseDto;
  @Input() funeralBeneficiaryDetails: FuneralGrantBeneficiaryResponse;
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.funeralBeneficiaryDetails && changes.funeralBeneficiaryDetails.currentValue) {
      const nameObj = getPersonNameAsBilingual(this.funeralBeneficiaryDetails.beneficiaryDetails.name);
      this.beneficiaryNameEnglish = nameObj.english;
      this.beneficiaryNameArabic = nameObj.arabic;
      this.bankDetails = this.funeralBeneficiaryDetails.beneficiaryDetails.bankAccount;
      this.getAgeDateOfBirthValues();

      if (this.funeralBeneficiaryDetails?.beneficiaryDetails?.identity) {
        const idObj: CommonIdentity | null = this.funeralBeneficiaryDetails?.beneficiaryDetails?.identity?.length
          ? getIdRemoveNullValue(this.funeralBeneficiaryDetails?.beneficiaryDetails?.identity)
          : null;
        if (idObj) {
          this.idNumber = idObj.id.toString();
          this.idLabel = getIdLabel(idObj);
        }
      }
    }
  }
  loadFullNotes() {
    this.loadLessNotes = !this.loadLessNotes;
  }
  getAgeDateOfBirthValues() {
    this.age = this.funeralBeneficiaryDetails.beneficiaryDetails.age;
    if (this.funeralBeneficiaryDetails.beneficiaryDetails.dateOfBirth.gregorian) {
      const momentObj = moment(this.funeralBeneficiaryDetails.beneficiaryDetails.dateOfBirth.gregorian, 'YYYY-MM-DD');
      const momentString = momentObj.format('DD/MM/YYYY');
      this.dob = momentString;
    }
    if (this.funeralBeneficiaryDetails.beneficiaryDetails.dateOfBirth.hijiri) {
      const momentObj = moment(this.funeralBeneficiaryDetails.beneficiaryDetails.dateOfBirth.hijiri, 'YYYY-MM-DD');
      const momentString = momentObj.format('DD/MM/YYYY');
      this.dobHijiri = momentString;
    }
  }
}
