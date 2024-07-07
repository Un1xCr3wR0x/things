/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Inject } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { PersonBankDetails } from '../../models';

@Component({
  selector: 'bnt-ui-validator-bank-details-dc',
  templateUrl: './person-bank-details-dc.component.html',
  styleUrls: ['./person-bank-details-dc.component.scss']
})
export class PersonBankDetailsDcComponent implements OnInit {
  lang: string;

  //Input Variables
  @Input() bankDetails: PersonBankDetails;
  @Input() isIbanVerified = false;
  @Input() isCsr = false;

  /**
   * Creates an instance of PersonBankDetailsDcComponent
   * @memberof  PersonBankDetailsDcComponent
   *
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   * This method handles the initialization tasks.
   *
   */
  ngOnInit() {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }
}
