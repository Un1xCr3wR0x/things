/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, Input, OnInit } from '@angular/core';
import { CommonIdentity, getIdentityByType, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'cnt-preview-agreement-table-dc',
  templateUrl: './preview-agreement-table-dc.component.html',
  styleUrls: ['./preview-agreement-table-dc.component.scss']
})
export class PreviewAgreementTableDcComponent implements OnInit {
  @Input() establishment;
  @Input() contractAtDraft;
  @Input() personDetails;
  @Input() section;

  lang;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => (this.lang = language));
  }
  /**Method to fetch person identity*/
  getPersonIdentity(personDetails): CommonIdentity {
    return getIdentityByType(personDetails?.person?.identity, personDetails?.person?.nationality?.english);
  }
}
