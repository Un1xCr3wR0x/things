import {Component, Inject, Input, OnInit, SimpleChanges} from '@angular/core';
import {Router} from "@angular/router";
import {IdentityTypeEnum, NIN, Iqama, LanguageToken} from "@gosi-ui/core";
import {BehaviorSubject} from "rxjs";
import { CustomerInfo } from '@gosi-ui/features/violations/lib/shared/models/appeal-on-violation';

@Component({
  selector: 'appeal-requestor-details-dc',
  templateUrl: './appeal-requestor-details-dc.component.html',
  styleUrls: ['./appeal-requestor-details-dc.component.scss']
})
export class AppealRequestorDetailsDcComponent implements OnInit {

  lang: string;
  identificationHeader: string = null;
  identificationNumber: number = null;

  constructor(readonly router: Router, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  @Input() customerSummary: CustomerInfo;
  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });}

      /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.customerSummary && changes.customerSummary.currentValue) {
      this.customerSummary = changes.customerSummary.currentValue;
      if (this.customerSummary.customerName.english && !this.customerSummary.customerName.arabic)
        this.customerSummary.customerName.arabic = this.customerSummary.customerName.english;
      if (this.customerSummary.customerName.arabic && !this.customerSummary.customerName.english)
        this.customerSummary.customerName.english = this.customerSummary.customerName.arabic;
      if (this.customerSummary && this.customerSummary.id && this.customerSummary.id.idType) {
        if (this.customerSummary.id.idType === IdentityTypeEnum.NIN) {
          this.identificationNumber = (<NIN>this.customerSummary.id).newNin;
          this.identificationHeader = "VIOLATIONS.CUSTOMER-NATIONAL-NUMBER";
        } else if (this.customerSummary.id.idType === IdentityTypeEnum.IQAMA) {
          this.identificationNumber = (<Iqama>this.customerSummary.id).iqamaNo;
          this.identificationHeader = "VIOLATIONS.CUSTOMER-IQAMA-NUMBER";
        }
      }
    }
  }

  navigateToCustomerProfile(identificationNumber: number): void {
     const url = `/establishment-private/#/home/profile/individual/internal/${identificationNumber}/overview`;
     window.open(url, '_blank');
  }
}
