/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent, LanguageToken, Lov } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { OrganisationTypeEnum } from '../../../shared';

/**
 * Component for selecting the organisation type
 *
 * @export
 * @class EstablishmentTypeDcComponent
 * @extends {BaseComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'est-establishment-type-dc',
  templateUrl: './establishment-type-dc.component.html',
  styleUrls: ['./establishment-type-dc.component.scss']
})
export class EstablishmentTypeDcComponent extends BaseComponent implements OnInit {
  /**
   * Local Variables
   */
  establishmentTypeForm: FormGroup;
  lang = 'en';

  /**
   * Input Variable From Smart Component
   */
  @Input() establishmentTypeList: Lov[] = [];

  /** Output Variables */
  @Output() next: EventEmitter<null> = new EventEmitter();

  /** Local variables */
  orgTypeGCC = OrganisationTypeEnum.GCC;
  submitted: boolean;

  /**
   * This method is used to initialise the component
   *
   * @param fb
   * @param language
   * @memberof EstablishmentTypeDcComponent
   */
  constructor(private fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
  }

  /**
   * This method handles the initialization tasks.
   *
   * @memberof EstablishmentTypeDcComponent
   */
  ngOnInit() {
    this.establishmentTypeForm = this.createEstablishmentTypeForm();

    this.establishmentTypeForm.valueChanges.subscribe(() => {
      this.submitted = true;
      this.next.emit(this.establishmentTypeForm.get('organizationCategory').get('english').value);
      window.scrollTo(document.documentElement.scrollTop, document.body.scrollHeight);
    });

    this.language.subscribe(language => (this.lang = language));
  }

  /**
   * This method is used to initialise the form template
   */
  createEstablishmentTypeForm() {
    return this.fb.group({
      organizationCategory: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      })
    });
  }

  /**
   * This method is used to reset the form to initial template
   */
  resetEstablishmentTypeForm() {
    if (this.establishmentTypeForm) {
      this.establishmentTypeForm.reset(this.createEstablishmentTypeForm().getRawValue());
      this.establishmentTypeForm.updateValueAndValidity();
      this.establishmentTypeForm.markAsPristine();
      this.establishmentTypeForm.markAsUntouched();
    }
  }
}
