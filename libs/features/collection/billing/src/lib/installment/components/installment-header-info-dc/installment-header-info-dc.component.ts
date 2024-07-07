/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, Input, OnInit } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { EstablishmentDetails } from '../../../shared/models';

@Component({
  selector: 'blg-installment-header-info-dc',
  templateUrl: './installment-header-info-dc.component.html',
  styleUrls: ['./installment-header-info-dc.component.scss']
})
export class InstallmentHeaderInfoDcComponent implements OnInit {
  //Local Variables
  arabicName: string;
  lang = 'en';

  @Input() establishmentDet?: EstablishmentDetails;
  /**
   *
   * @param language
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
}
