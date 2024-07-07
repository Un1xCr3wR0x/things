/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Component for selecting the organisation type
 *
 * @export
 * @class FeatureTypeDcComponent
 * @extends {BaseComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'fea-feature-type-dc',
  templateUrl: './feature-type-dc.component.html',
  styleUrls: ['./feature-type-dc.component.scss']
})
export class FeatureTypeDcComponent extends BaseComponent implements OnInit {
  /**
   * Local Variables
   */
  featureTypeForm: FormGroup;
  lang = 'en';

  /**
   * Input Variable From Smart Component
   */
  featureTypeList = [
    {
      name: {
        english: 'Establishments',
        arabic: 'منشأت'
      }
    },
    {
      name: {
        english: 'Individuals',
        arabic: 'افراد'
      }
    }
  ];

  @Input() selected: String;
  /** Output Variables */
  @Output() next: EventEmitter<null> = new EventEmitter();

  /** Local variables */
  orgTypeGCC = null;
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
    this.featureTypeForm = this.createFeatureTypeForm();

    this.featureTypeForm.valueChanges.subscribe(() => {
      this.submitted = true;
      this.next.emit(this.featureTypeForm.get('organizationCategory').get('english').value);
      window.scrollTo(document.documentElement.scrollTop, document.body.scrollHeight);
    });

    this.language.subscribe(language => (this.lang = language));
  }

  /**
   * This method is used to initialise the form template
   */
  createFeatureTypeForm() {
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
  resetFeatureTypeForm() {
    if (this.featureTypeForm) {
      this.featureTypeForm.reset(this.createFeatureTypeForm().getRawValue());
      this.featureTypeForm.updateValueAndValidity();
      this.featureTypeForm.markAsPristine();
      this.featureTypeForm.markAsUntouched();
    }
  }
}
