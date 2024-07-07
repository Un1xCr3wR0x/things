/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { convertToStringDDMMYYYY, LanguageToken, LovList } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { PersonDetailsSmartForm } from '../../forms';
import { PersonDetailsInputDcComponent } from '../person-details-input-dc/person-details-input-dc.component';

enum FormState {
  ReadyToVerify,
  ReadyToCompleteDetails,
  ReadyToContinue
}

@Component({
  selector: 'cnt-authorizer-person-dc',
  templateUrl: './authorizer-person-dc.component.html',
  styleUrls: ['./authorizer-person-dc.component.scss']
})
export class AuthorizerPersonDcComponent implements OnInit {
  @Input() authorizerList: Array<{ form: PersonDetailsSmartForm; allowEdit: boolean }> = [];
  @Input() isAttorney = true;
  @Input() personForm: PersonDetailsSmartForm;
  @Input() nationalityList;
  @Input() genderList;
  @Input() showAuthorizerPersonNameFields = false;
  @Input() showAuthorizerPersonIdentityFields = true;

  @Output() onVerifyAuthorizer = new EventEmitter<PersonDetailsSmartForm>();
  @Output() onDeleteAuthorizer = new EventEmitter<number>();
  @Output() onResetAuthorizer = new EventEmitter<void>();
  @Output() onAddAuthorizer = new EventEmitter<void>();
  @Output() onEditAuthorizer = new EventEmitter<number>();

  formState = FormState;
  state = FormState.ReadyToVerify;
  lang = 'en';

  @ViewChild('personDetailsInput', { static: false })
  personDetailsInput: PersonDetailsInputDcComponent;

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
    // this will be true if we move to next section then came back
    if (this.authorizerList.length !== 0) {
      this.state = FormState.ReadyToContinue;
    }
  }

  authorizerFound() {
    this.showAuthorizerPersonNameFields = false;
    this.showAuthorizerPersonIdentityFields = true;
    this.state = FormState.ReadyToContinue;
  }

  authorizerNotFound() {
    this.showAuthorizerPersonNameFields = true;
    this.showAuthorizerPersonIdentityFields = false;
    this.state = FormState.ReadyToCompleteDetails;
  }

  addAuthorizer() {
    this.showAuthorizerPersonNameFields = false;
    this.showAuthorizerPersonIdentityFields = true;
    this.state = FormState.ReadyToVerify;
  }

  resetAuthorizer() {
    this.onResetAuthorizer.emit();
    if (this.authorizerList.length === 0) {
      this.addAuthorizer();
    } else {
      this.authorizerFound();
    }
  }

  /**
   * Calculate age
   */
  calculatePersonAge(birthDate, age: number) {
    if (birthDate.gregorian) {
      return convertToStringDDMMYYYY(birthDate.gregorian.toString()) + ' ' + this.calculateYear(age);
    } else {
      return birthDate.hijiri + ' ' + this.calculateYear(age);
    }
  }

  /**
   *
   * @param years Label for years
   * @param years
   */
  calculateYear(years: number) {
    if (this.lang === 'en') {
      return `(Age: ${years} years)`;
    } else {
      if (years === 0) return '(السن: أصغر من سنة)';
      if (years === 1) return '(السن: سنة)';
      if (years === 2) return '(السن: سنتان)';
      if (years <= 10) return `(السن: ${years} سنوات)`;
      return `(السن: ${years} سنة)`;
    }
  }
}
