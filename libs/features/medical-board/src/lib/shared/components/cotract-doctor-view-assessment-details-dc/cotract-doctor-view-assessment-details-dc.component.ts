import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { AssessedDoctorDetails, AssessmentDetail } from '../../models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BilingualText } from '@gosi-ui/core';
import { MbRouteConstants } from '../../constants';
import { Router } from '@angular/router';

@Component({
  selector: 'mb-cotract-doctor-view-assessment-details-dc',
  templateUrl: './cotract-doctor-view-assessment-details-dc.component.html',
  styleUrls: ['./cotract-doctor-view-assessment-details-dc.component.scss']
})
export class CotractDoctorViewAssessmentDetailsDcComponent implements OnInit {
  limitvalue = 100;
  modalRef: BsModalRef;
  helperReasons: BilingualText;
  helperRequired = false;
  disabledBodyPart: BilingualText;
  identificationNo: number;
  @Input() lang = 'en';
  @Input() assessmentDetails: AssessmentDetail;
  constructor(readonly router: Router, readonly modalService: BsModalService) {}

  ngOnInit(): void {
    if (this.assessmentDetails?.reasonForHelper) {
      this.assessmentDetails?.reasonForHelper.forEach(items => {
        this.helperReasons = items;
      });
    }
    if (this.assessmentDetails?.bodyPartsList?.length > 0 && this.assessmentDetails?.bodyPartsList[0]?.bodyParts) {
      this.assessmentDetails?.bodyPartsList[0]?.bodyParts.forEach(bodyPart => {
        this.disabledBodyPart = bodyPart;
      });
    }
  }
  ngOnChanges() {
    if (this.assessmentDetails?.disabilityPercentage >= 50) {
      this.helperRequired = true;
    }
  }
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
  }

  getBodyParts(bodyParts: BilingualText[]) {
    if (bodyParts && bodyParts.length > 0)
      return this.lang === 'en'
        ? bodyParts.map(item => item.english).join(',')
        : bodyParts.map(item => item.arabic).join(',');
  }
  getSpeciality(speciality: BilingualText[]) {
    if (speciality && speciality.length > 0)
      return this.lang === 'en'
        ? speciality.map(item => item.english).join(',')
        : speciality.map(item => item.arabic).join(',');
  }
  navigateToDoctor(details: AssessedDoctorDetails) {
    this.identificationNo = details?.identifier;
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
  }
  navigateToDoctorProfile() {
    this.identificationNo = this.assessmentDetails?.primaryGosiDr?.identifier;
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
  }
  getDescriptionString(caseArr: string[]): string {
    if(caseArr)
    return caseArr?.toString();
    else return '';
  }
}
