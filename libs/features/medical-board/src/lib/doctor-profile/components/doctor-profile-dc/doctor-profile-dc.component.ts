import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationTypeEnum, ApplicationTypeToken, AuthTokenService, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { MbRouteConstants } from '../../../shared';

@Component({
  selector: 'mb-doctor-profile-dc',
  templateUrl: './doctor-profile-dc.component.html',
  styleUrls: ['./doctor-profile-dc.component.scss']
})
export class DoctorProfileDcComponent implements OnInit {
  lang = 'en';
  identificationNo: number;

  constructor(
    readonly location: Location,
    private route: ActivatedRoute,
    readonly router: Router,
    readonly authTokenService: AuthTokenService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.route.parent.params.subscribe(params => {
      this.identificationNo = params.identificationNo;
    });
  }
  routeBack() {
    this.location.back();
  }

}
