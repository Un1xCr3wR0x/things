import { Component, Input, OnInit } from '@angular/core';
import { BilingualText} from '@gosi-ui/core';
import { VisitingDoctorList } from '../../models';
import { MbRouteConstants } from '../../constants';
import { Router } from '@angular/router';

@Component({
  selector: 'mb-session-doctor-list-dc',
  templateUrl: './session-doctor-list-dc.component.html',
  styleUrls: ['./session-doctor-list-dc.component.scss']
})
export class SessionDoctorListDcComponent implements OnInit {
  @Input() visitingDoctorList: VisitingDoctorList[];
  @Input() lang = 'en';

  constructor(readonly router: Router) {}

  ngOnInit(): void {}
  getRegion(regions: BilingualText[]) {
    if(regions){
    return this.lang === 'en'
      ? regions.map(region => region.english).join(',')
      : regions.map(region => region.arabic).join(',');
    }
  }
  getSpeciality(speciality: BilingualText[]) {
    if(speciality){
    return this.lang === 'en'
      ? speciality.map(item => item.english).join(',')
      : speciality.map(item => item.arabic).join(',');
    }
  }
  navigateToProfile(identificationNo: number) {
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(identificationNo)]);
  }
}
