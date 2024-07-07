/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BilingualText,
  InputBaseComponent,
  Lov,
  LovList,
  markFormGroupTouched,
  ApplicationTypeToken,
  ApplicationTypeEnum
} from '@gosi-ui/core';
import { Router } from '@angular/router';
import { RouteConstants } from '../../constants';
import { ProcessType } from '../../enums';

@Component({
  selector: 'oh-establishment-details-dc',
  templateUrl: './establishment-details-dc.component.html',
  styleUrls: ['./establishment-details-dc.component.scss']
})
export class EstablishmentDetailsDcComponent extends InputBaseComponent implements OnInit, OnChanges {
  engagementForm: FormGroup;
  registrationNo: number = null;
  isAppPrivate = false;
  @Input() establishmentName: BilingualText = new BilingualText();
  @Input() disableEst = false;

  /**
   * Creates an instance of EstablishmentDetailsDcComponent
   * @param fb
   */
  constructor(
    private fb: FormBuilder,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super();
  }
  /**
   * Input Variables
   */
  @Input() establishments: LovList = new LovList([]);
  @Input() occupation: BilingualText;
  @Input() isValidator1: boolean;
  @Input() registrationNumber: number;
  @Input() isEdit: boolean;
  @Input() processType = '';

  /**
   * Output variables
   */
  @Output() selectEstablishment: EventEmitter<number> = new EventEmitter();

  /**
   * This method is to handle initialization tasks
   */
  ngOnInit() {
    this.engagementForm = this.createEngagementForm();
    this.occupation = null;
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
  }
  /**
   *Capturing the input on changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this.isValidator1 || this.isEdit || this.processType === ProcessType.MODIFY) {
      if (changes && changes.establishmentName) {
        this.establishmentName = changes.establishmentName.currentValue;
        if (this.establishmentName?.arabic) {
          this.setEstablishmentName();
        }
      }
      if (changes && changes.disableEst) {
        this.disableEst = changes.disableEst.currentValue;
      }
      if (changes && changes.registrationNumber) {
        this.registrationNumber = changes.registrationNumber.currentValue;
        this.registrationNo = this.registrationNumber;
      }
      if (changes && changes.occupation) {
        this.occupation = changes.occupation.currentValue;
      }
    }
    if (changes && changes.disableEst) {
      this.disableEst = changes.disableEst.currentValue;
    }
    if (changes && changes.registrationNumber) {
      this.registrationNumber = changes.registrationNumber.currentValue;
    }
    this.registrationNo = this.registrationNumber;
    if (changes && changes.occupation) {
      this.occupation = changes.occupation.currentValue;
    }
  }
  /**
   * Set Establishment Name
   */
  setEstablishmentName() {
    this.engagementForm = this.createEngagementForm();
    if (this.engagementForm) {
      if (this.establishmentName && this.establishmentName.english) {
        this.engagementForm.get('engagementWhenInjuryOccured.english').setValue(this.establishmentName.english);
      } else {
        this.engagementForm.get('engagementWhenInjuryOccured.english').setValue(this.establishmentName.arabic);
        this.engagementForm.get('engagementWhenInjuryOccured.arabic').setValue(this.establishmentName.arabic);
      }
      this.engagementForm.updateValueAndValidity();
    }
  }
  /*
   * Create engagement form
   */
  createEngagementForm() {
    return this.fb.group({
      engagementWhenInjuryOccured: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  /*
   * This method is used to select the corresponding establishment
   */
  selectedEstablishment(establishment: Lov) {
    if (establishment !== undefined) {
      this.registrationNo = establishment?.code;
      this.selectEstablishment.emit(this.registrationNo);
    }
  }
  /**
   * This method is to navigate to dashboard
   */

  navigate() {
    let url = '';
    if (this.isAppPrivate) {
      if (this.registrationNo) {
        url = '/establishment-private/#' + RouteConstants.EST_PROFILE_ROUTE(this.registrationNo);
        window.open(url, '_blank');
      }
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Validation for form
   */
  isValidForm() {
    markFormGroupTouched(this.engagementForm);
    if (this.engagementForm.valid) {
      return true;
    }
    return false;
  }
  setErrorMsgs() {}
}
