import { Component, OnInit } from '@angular/core';
import {EstablishmentRoutesEnum} from "@gosi-ui/features/establishment";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'est-medical-insurance-acknowledgement-dc',
  templateUrl: './medical-insurance-acknowledgement-dc.component.html',
  styleUrls: ['./medical-insurance-acknowledgement-dc.component.scss']
})
export class MedicalInsuranceAcknowledgementDcComponent implements OnInit {
  termsUrl: string;
  terms: string;
  constructor(readonly translate: TranslateService) { }

  ngOnInit(): void {
    this.termsUrl = EstablishmentRoutesEnum.MEDICAL_INSURANCE_TERMS;
    this.translate.get("ESTABLISHMENT.MEDICAL-INSURANCE-ACKNOWLEDGEMENT", {url: this.termsUrl}).subscribe(value => {
      this.terms = value;
    });
    this.translate.onLangChange.subscribe(() => {
      this.translate.get("ESTABLISHMENT.MEDICAL-INSURANCE-ACKNOWLEDGEMENT", {url: this.termsUrl}).subscribe(value => {
        this.terms = value;
      });
    });
  }

}
