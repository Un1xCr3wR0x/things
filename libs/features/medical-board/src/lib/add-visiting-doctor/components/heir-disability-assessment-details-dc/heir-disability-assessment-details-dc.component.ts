import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { Router } from '@angular/router';
import {
  BilingualText,
  CommonIdentity,
  Contributor,
  formatDate,
  getIdentityByType,
  getPersonNameAsBilingual,
  LanguageToken,
  RouterConstants,
  PersonalInformation,
  AnnuityResponseDto
} from '@gosi-ui/core';
// import { AnnuityResponseDto } from '@gosi-ui/features/benefits/lib/shared';
// import {  } from '@gosi-ui/features/occupational-hazard/lib/shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { AssessmentConstants, Injury, MBConstants } from '../../../shared';
import { AssessmentDetails, DisabilityDetails } from '../../../shared/models';
// import {  } from '@gosi-ui/features/contributor';

@Component({
  selector: 'mb-heir-disability-assessment-details-dc',
  templateUrl: './heir-disability-assessment-details-dc.component.html',
  styleUrls: ['./heir-disability-assessment-details-dc.component.scss']
})
export class HeirDisabilityAssessmentDetailsDcComponent implements OnInit, OnChanges {
  @Input() contributor: Contributor;
  @Input() registrationNo: number;
  @Input() injury: Injury;
  @Input() collapseView: boolean;
  @Input() previousDisabilityDetails: DisabilityDetails;
  @Output() onOHClicked = new EventEmitter<null>();
  @Input() heirDisabilityAssessment: boolean;
  @Input() activeBenefitDetails: AnnuityResponseDto;
  @Input() personalInformation: PersonalInformation;

  modalRef: BsModalRef;
  primaryIdentity: CommonIdentity = new CommonIdentity();
  primaryIdentityType: string;
  personNameEnglish: string = null;
  personNameArabic: String = null;
  socialInsuranceNo: number;
  location: BilingualText = null;
  cityLocation: string;
  isSmallScreen: boolean;
  heirNameEnglish :string;
  heirNameArabic:string;
  lang: string;
  constructor(
    readonly router: Router,
    readonly modalService: BsModalService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
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
    this.getHeirDepName();
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
      this.cityLocation = this.contributor?.person?.contactDetail?.addresses[0]?.city?.english
        ? this.contributor?.person?.contactDetail?.addresses[0]?.city?.english
        : this.contributor?.person?.contactDetail?.addresses[0]?.city?.arabic;
    }
  }

  /**
   * Method to capture navigation details and send to parent via event emitter
   */
  navigateToInjuryDetails() {
    this.router.navigate([
      `home/profile/contributor/${this.registrationNo}/${this.contributor.socialInsuranceNo}/info`
    ]);
  }
  /**
   * This method is to route to benefit details
   */
  navigateToHeirDetails() {
    this.socialInsuranceNo = this.contributor.socialInsuranceNo;
    // this.router.navigate([BenefitConstants.ROUTE_BENEFIT_LIST(null, this.socialInsuranceNo)]);
    this.router.navigate([MBConstants.ROUTE_BENEFIT_LIST(null, getIdentityByType(this.personalInformation?.identity, this.personalInformation?.nationality?.english)?.id)]);
  }
  previousAssessment(TemplateValue: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-lg modal-dialog-centered` };
    this.modalRef = this.modalService.show(TemplateValue, config);
  }
  viewAssessmentById(eachperson: AssessmentDetails) {
    if (eachperson.assessmentId) {
      this.hideModal();
    }
    const disabilityUrl =
      RouterConstants.ROUTE_OH_DISABILITY_ASSESSMENT +
      `/${this.contributor?.socialInsuranceNo}/${this.contributor?.person?.personId}/${
        eachperson?.injuryId || eachperson.benefitReqId
      }`;
    this.router.navigate([disabilityUrl], { queryParams: { disabilityType: eachperson?.assessmentType?.english } });
    // this.router.navigate([AssessmentConstants.ROUTE_VIEW_ASSESSMENT]);
  }
  hideModal() {
    this.modalRef.hide();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
  getHeirIdentity() {
    return getIdentityByType(this.personalInformation?.identity, this.personalInformation?.nationality?.english)?.id;
  }
  getHeirDepName() {
    const nameObj = getPersonNameAsBilingual(this.personalInformation.name);
    this.heirNameEnglish = nameObj.english;
    this.heirNameArabic = nameObj.arabic;
  }
}
