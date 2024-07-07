import { Component, OnInit } from '@angular/core';
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { EventEmitter, HostListener, Inject, Input, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  BilingualText,
  CommonIdentity,
  Contributor,
  formatDate,
  getIdentityByType,
  getPersonNameAsBilingual,
  LanguageToken,
  AnnuityResponseDto,
  Injury,
  DisabilityDetails,
  AssessmentDetails,
  DisabilityData
} from '@gosi-ui/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'mb-tracking-contributor-details-dc',
  templateUrl: './tracking-contributor-details-dc.component.html',
  styleUrls: ['./tracking-contributor-details-dc.component.scss']
})
export class TrackingContributorDetailsDcComponent implements OnInit {
  @Input() contributor: Contributor;
  @Input() registrationNo: number;
  @Input() injury: Injury;
  @Input() heirDisabilityAssessment: boolean;
  @Input() activeBenefitDetails: AnnuityResponseDto;
  @Input() collapseView: boolean;
  @Input() previousDisabilityDetails:DisabilityData ;
  @Output() onOHClicked = new EventEmitter<null>();
  @Output() previousDisability = new EventEmitter<AssessmentDetails>();

  modalRef: BsModalRef;
  primaryIdentity: CommonIdentity = new CommonIdentity();
  primaryIdentityType: string;
  personNameEnglish: string = null;
  personNameArabic: String = null;
  socialInsuranceNo: number;
  location: BilingualText = null;
  cityLocation: string;
  isSmallScreen: boolean;
  lang: String;

  constructor(
    readonly router: Router,
    readonly modalService: BsModalService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;

    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }

  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.setPersonDetails();
    // this.collapseView = true;
  }
  ngOnChanges(changes: SimpleChanges) {
    this.setPersonDetails();
    if (changes && changes.contributor) {
      this.contributor = changes.contributor.currentValue;
      if (this.contributor) {
        const nameObj = getPersonNameAsBilingual(this.contributor.person.name);
        this.personNameEnglish = nameObj.english;
        this.personNameArabic = nameObj.arabic;
        this.socialInsuranceNo = this.contributor.socialInsuranceNo;
        this.location = this.contributor.person.contactDetail?.addresses[0]?.city;
      }
    }
    if (changes && changes.registrationNo) {
      this.registrationNo = changes.registrationNo.currentValue;
    }
    if (changes && changes.collapseView) {
      this.collapseView = changes.collapseView.currentValue;
    }
  }
  /**
   * This method is used to set name details
   */
  setPersonDetails() {
    if (this.contributor) {
      const nameObj = getPersonNameAsBilingual(this.contributor.person.name);
      this.personNameEnglish = nameObj.english;
      this.personNameArabic = nameObj.arabic;
      this.socialInsuranceNo = this.contributor.socialInsuranceNo;
      this.location = this.contributor.person.contactDetail?.addresses[0]?.city;
      /**
       * getting the identity type for the contributor eg:iqama number border number
       */

      this.primaryIdentity =
        this.contributor.person.identity != null
          ? getIdentityByType(this.contributor.person.identity, this.contributor.person.nationality.english)
          : null;

      this.primaryIdentityType =
        this.primaryIdentity !== null ? 'OCCUPATIONAL-HAZARD.' + this.primaryIdentity.idType : null;
      this.cityLocation = this.contributor.person?.contactDetail?.addresses[0]?.city?.english
        ? this.contributor.person.contactDetail?.addresses[0]?.city?.english
        : this.contributor.person.contactDetail?.addresses[0]?.city?.arabic;
    }
  }

  /**
   * Method to capture navigation details and send to parent via event emitter
   */
  navigateToInjuryDetails() {
    if (this.contributor.socialInsuranceNo && !isNaN(Number(this.registrationNo))) {
      this.router.navigate([
        `home/profile/contributor/${this.registrationNo}/${this.contributor.socialInsuranceNo}/info`
      ]);
    } else {
      this.router.navigate([`/home/profile/contributor/${this.contributor.socialInsuranceNo}/info`]);
    }
  }
  previousAssessment(TemplateValue: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-lg modal-dialog-centered` };
    this.modalRef = this.modalService.show(TemplateValue, config);
  }
  onAssessmentIdClick(eachperson: AssessmentDetails) {
    if (eachperson.assessmentId) {
      this.hideModal();
    }
    this.previousDisability.emit(eachperson);
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
  hideModal() {
    this.modalRef.hide();
  }
}
