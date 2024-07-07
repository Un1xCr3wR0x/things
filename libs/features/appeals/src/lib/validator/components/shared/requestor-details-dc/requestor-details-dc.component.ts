import {Component, Inject, Input, OnInit, SimpleChanges} from '@angular/core';
import {Router} from "@angular/router";
import {IdentityTypeEnum, NIN, Iqama, LanguageToken} from "@gosi-ui/core";
import { RequestorDetails } from '@gosi-ui/features/appeals';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'requestor-details-dc',
  templateUrl: './requestor-details-dc.component.html',
  styleUrls: ['./requestor-details-dc.component.scss']
})
export class RequestorDetailsDcComponent implements OnInit {

  lang: string;
  identificationHeader: string = null;
  identificationNumber: number = null;

  constructor(readonly router: Router, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  @Input() requestor: RequestorDetails;
  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });}

      /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.requestor && changes.requestor.currentValue) {
      this.requestor = changes.requestor.currentValue;
      if (this.requestor.name.english && !this.requestor.name.arabic)
        this.requestor.name.arabic = this.requestor.name.english;
      if (this.requestor.name.arabic && !this.requestor.name.english)
        this.requestor.name.english = this.requestor.name.arabic;
      if (this.requestor && this.requestor.id && this.requestor.id.idType) {
        if (this.requestor.id.idType === IdentityTypeEnum.NIN) {
          this.identificationNumber = (<NIN>this.requestor.id).newNin;
          this.identificationHeader = "APPEALS.NATIONAL-NUMBER";
        } else if (this.requestor.id.idType === IdentityTypeEnum.IQAMA) {
          this.identificationNumber = (<Iqama>this.requestor.id).iqamaNo;
          this.identificationHeader = "APPEALS.IQAMA-NUMBER";
        }
      }
    }
  }

  navigateToCustomerProfile(identificationNumber: number): void {
     const url = `/establishment-private/#/home/profile/individual/internal/${identificationNumber}/overview`;
     window.open(url, '_blank');
  }
}
