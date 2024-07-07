import { Component, Inject, Input, OnInit } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { BilingualText, checkIqamaOrBorderOrPassport, CommonIdentity, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { getIdentityLabel, MbList } from '../../../shared';

@Component({
  selector: 'mb-mbo-visiting-doctor-details-dc',
  templateUrl: './mbo-visiting-doctor-details-dc.component.html',
  styleUrls: ['./mbo-visiting-doctor-details-dc.component.scss']
})
export class MboVisitingDoctorDetailsDcComponent implements OnInit {
  @Input() selectedVistingDr: MbList;
  @Input() isColumnThree = false;
  @Input() isMboAssessment = false;
  lang: string;
  identity: CommonIdentity | null;
  identityLabel = '';
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.getIdentity();
  }
  getIdentity() {
    this.identity = new CommonIdentity();
    this.identity.idType = this.selectedVistingDr?.idType;
    this.identity.id = null;
    this.identityLabel = getIdentityLabel(this.identity);
  }
  getRegion(region: BilingualText[]) {
    if (region && region.length > 0)
      return this.lang === 'en'
        ? region.map(item => item.english).join(', ')
        : region.map(item => item.arabic).join(',');
  }
}
