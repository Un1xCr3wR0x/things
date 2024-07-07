import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthTokenService, JWTPayload, LanguageToken } from '@gosi-ui/core';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';

@Component({
  selector: 'gosi-ui-write-to-us-sc',
  templateUrl: './write-to-us-sc.component.html',
  styleUrls: ['./write-to-us-sc.component.scss']
})
export class WriteToUsScComponent implements OnInit {
  lang = 'en';
  token: JWTPayload;
  isShowCES: boolean;

  constructor(
    readonly router: Router,
    readonly authTokenService: AuthTokenService,
    readonly authService: AuthTokenService,
    readonly changePersonService: ChangePersonService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.token = this.authService.decodeToken(this.authService.getAuthToken());
    this.changePersonService.getEstablishmentProfileDetails().subscribe(
      response => {
        this.isShowCES = true;
      },
      err => {
        if (err?.error?.code == 'PM-ERR-0001') {
          this.isShowCES = false;
        } else {
          this.isShowCES = true;
        }
      }
    );
  }
  onBack() {}
  communicate(type) {
    if (type == 'ameen') {
      if (this.lang == 'en') {
        window.open('https://labeeb.masdr.sa/en/Welcome');
      } else {
        window.open('https://labeeb.masdr.sa/ar/Welcome');
      }
    } else if (type == 'visit') {
      if (this.lang == 'en') {
        window.open('https://www.gosi.gov.sa/en/IndividualsServices/ServiceDetails/VirtualVisit');
      } else {
        window.open('https://www.gosi.gov.sa/ar/IndividualsServices/ServiceDetails/VirtualVisit');
      }
    } else {
      if (this.lang == 'en') {
        window.open('https://www.gosi.gov.sa/en/IndividualsServices/ServiceDetails/Appointments');
      } else {
        window.open('https://www.gosi.gov.sa/ar/IndividualsServices/ServiceDetails/Appointments');
      }
    }
  }
  navigate() {
    this.router.navigate([`/home/complaints/register/register-complaint`]);
  }
  navigateToAppeal() {
    const lan: any = this.lang + '_US';
    window.open('https://www.gosi.gov.sa/GOSIOnline/File_an_Appeal?locale=' + lan);
  }
  navigateToPlea() {
    const lan: any = this.lang + '_US';
    window.open('https://www.gosi.gov.sa/GOSIOnline/File_a_Plea?locale=' + lan);
  }
}
