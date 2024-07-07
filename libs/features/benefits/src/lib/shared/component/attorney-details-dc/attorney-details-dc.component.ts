/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { getPersonNameAsBilingual, Person } from '@gosi-ui/core';
import { AnnuityResponseDto, PersonBankDetails } from '../../models';
import { AttorneyDetailsWrapper } from '../../models/attorney-details-wrapper';

@Component({
  selector: 'bnt-attorney-details-dc',
  templateUrl: './attorney-details-dc.component.html',
  styleUrls: ['./attorney-details-dc.component.scss']
})
export class AttorneyDetailsDcComponent implements OnInit, OnChanges {
  /*
   * Local variables
   */
  nin: number;
  //Input variables

  @Input() preselctdAttorney: AttorneyDetailsWrapper; //not required
  @Input() annuityBenefitDetails: AnnuityResponseDto; // for fetching agentid and certificate expiration date
  @Input() authPersonDetails: Person;
  @Input() isHeir: false;
  @Input() bankDetails: PersonBankDetails;
  personNameEnglish: string;
  personNameArabic: string;
  //Output variables

  constructor() {}

  ngOnInit(): void {}
  /*
   * This method is to detect changes in input property
   */
  ngOnChanges(changes: SimpleChanges) {
    // if (changes && changes.preselctdAttorney && changes.preselctdAttorney.currentValue) {
    //   if (changes.preselctdAttorney.currentValue[0]) {
    //     this.preselctdAttorney = changes.preselctdAttorney.currentValue[0];
    //   } else if ((this.preselctdAttorney = changes.preselctdAttorney.currentValue)) {
    //     this.preselctdAttorney = changes.preselctdAttorney.currentValue;
    //   }
    //   if (this.preselctdAttorney && this.preselctdAttorney.identity) {
    //     this.nin = this.preselctdAttorney.identity[0]['newNin'];
    //   }
    // }
    if (changes.annuityBenefitDetails && changes.annuityBenefitDetails.currentValue) {
      this.nin = this.annuityBenefitDetails?.authorizedPersonIdentity[0]['newNin'];
    }
    // if (changes.authPersonDetails) {
    //   this.authPersonDetails = changes.authPersonDetails.currentValue;
    //   this.nin = this.authPersonDetails?.identity[0]['newNin'];
    //   const nameObj = getPersonNameAsBilingual(this.authPersonDetails?.name);
    //   this.personNameEnglish = nameObj?.english?.length > 0 ? nameObj?.english : '-';
    //   this.personNameArabic = nameObj?.arabic;
    // }
  }
}
