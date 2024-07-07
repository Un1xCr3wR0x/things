import { Component, OnInit, Input } from '@angular/core';
import { AnnuityResponseDto, ContributorSearchResult } from '../../../shared';
import { Establishment } from '@gosi-ui/core';

@Component({
  selector: 'bnt-retirement-contributor-details-dc',
  templateUrl: './retirement-contributor-details-dc.component.html',
  styleUrls: ['./retirement-contributor-details-dc.component.scss']
})
export class RetirementContributorDetailsDcComponent implements OnInit {
  /**
   * Input variables
   */
  @Input() establishment: Establishment;
  @Input() registrationNo: number;
  @Input() contributor: ContributorSearchResult;

  contributorId = 7686789;

  socialInsuranceNo: number;
  dob: string;
  age: number;

  @Input() personNameEnglish: string;
  @Input() personNameArabic: string;
  @Input() validatorCanEdit = false;
  @Input() benefitRequest: AnnuityResponseDto;

  constructor() {}

  ngOnInit(): void {
    this.personNameArabic = 'arabic name';
    this.personNameEnglish = 'english name';
  }
  navigateToDetails() {}
}
