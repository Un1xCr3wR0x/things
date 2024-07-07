/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, Input, OnInit } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { BilingualText, CommonIdentity, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { VisitingDoctorList } from '../../models';
import { getIdentityLabel } from '../../utils';
import { MbRouteConstants } from '../../constants';
import { Router } from '@angular/router';
@Component({
  selector: 'mb-visiting-doctor-details-dc',
  templateUrl: './visiting-doctor-details-dc.component.html',
  styleUrls: ['./visiting-doctor-details-dc.component.scss']
})
export class VisitingDoctorDetailsDcComponent implements OnInit {
  @Input() selectedVistingDr: VisitingDoctorList;
  @Input() isColumnThree = false;
  @Input() isMboAssessment = false;
  lang: string;
  identity: CommonIdentity | null;
  identityLabel = '';
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>,readonly router: Router) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
      this.getIdentity();
  }
  getIdentity() {
    if(this.selectedVistingDr?.identity) {
      this.identity = new CommonIdentity();
      this.identity.idType = this.selectedVistingDr?.identity?.idType;
      this.identity.id = Number(this.selectedVistingDr?.identity?.personIdentifier);
      this.identityLabel = getIdentityLabel(this.identity);  
    }
  }
  getSpeciality(speciality: BilingualText[]) {
    if(speciality && speciality.length > 0)
    return this.lang === 'en'
      ? speciality.map(item => item.english).join(',')
      : speciality.map(item => item.arabic).join(',');
  }
  onNavigateToDoctor(identificationNo: number) {
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(identificationNo)]);
  }
}
