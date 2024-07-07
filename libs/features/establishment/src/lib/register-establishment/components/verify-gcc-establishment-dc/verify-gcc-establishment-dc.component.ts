/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, ViewChild, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LovList, Lov } from '@gosi-ui/core';
import { markFormGroupTouched, scrollToTop } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EstablishmentConstants, OrganisationTypeEnum } from '../../../shared';
import { LawTypeEnum } from '../../../shared';

@Component({
  selector: 'est-verify-gcc-establishment-dc',
  templateUrl: './verify-gcc-establishment-dc.component.html',
  styleUrls: ['./verify-gcc-establishment-dc.component.scss']
})

/**
 * Component for verify GCC establishment GCC registration number
 *
 * @export
 * @class VerifyGccEstablishmentDcComponent
 * @extends {BaseComponent}
 * @implements {OnInit}
 */
export class VerifyGccEstablishmentDcComponent implements OnInit {
  //Constants
  registrationNoMaxLength = EstablishmentConstants.GCC_REG_MAX_LENGTH;

  //Private variables
  modalRef: BsModalRef;
  gccEstablishmentDetailsForm: FormGroup;
  submitted: boolean;
  showLegalEntity = false;
  lawTypeEnum = LawTypeEnum;
  //Input variables
  @Input() gccCountryList: LovList = new LovList(null);
  @Input() legalEntityList: Lov[];
  @Input() lawTypeList: LovList;

  //Output Variables
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() invalidForm: EventEmitter<null> = new EventEmitter();
  @Output() selectOrganizationType: EventEmitter<string> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();

  @ViewChild('cancelTemplate', { static: true })
  cancelTemplate: TemplateRef<HTMLElement>;

  @ViewChild('gccCountry', { static: true })
  gccCountry: TemplateRef<HTMLElement>;

  lawTypeToOrganisationType = {
    [LawTypeEnum.SOCIAL_INSURANCE_LAW]: OrganisationTypeEnum.GCC,
    [LawTypeEnum.CIVIL_PENSION_LAW]: OrganisationTypeEnum.GOVERNMENT
  };
  islawTypeSelected = false;
  selectedLawType: string;

  /**
   * This method is used to initialise the component
   * @param fb
   *  @memberof VerifyGccEstablishmentDcComponent
   */
  constructor(private fb: FormBuilder, private bsModalService: BsModalService) {}

  /**
   * This method handles the initialization tasks.
   *
   * @memberof VerifyGccEstablishmentDcComponent
   */
  ngOnInit() {
    this.gccEstablishmentDetailsForm = this.fb.group({
      lawType: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      departmentNumber: [
        null,
        {
          validators: Validators.compose([Validators.required, Validators.pattern('[0-9a-zA-Z]+')]),
          updateOn: 'blur'
        }
      ],

      legalEntity: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      country: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      registrationNo: [
        null,
        {
          validators: Validators.compose([Validators.required, Validators.maxLength(this.registrationNoMaxLength)]),
          updateOn: 'blur'
        }
      ]
    });
  }

  /* This method is used for show Modal */
  showModal(template: TemplateRef<HTMLElement>, size: string = 'md', ignoreBackdrop: boolean = false): void {
    if (template) {
      this.modalRef = this.bsModalService.show(
        template,
        Object.assign({}, { class: 'modal-' + size, ignoreBackdropClick: ignoreBackdrop })
      );
    }
  }
  /**
   * This method is used to reset verify GCC establishment form
   */
  resetVerifyGCCEstablishmentForm() {
    this.gccEstablishmentDetailsForm.reset(this.gccEstablishmentDetailsForm.getRawValue());
    this.gccEstablishmentDetailsForm.updateValueAndValidity();
    this.gccEstablishmentDetailsForm.markAsPristine();
    this.gccEstablishmentDetailsForm.markAsUntouched();
  }

  /**
   * This method is used to submit the form values
   * @memberof VerifyGccEstablishmentDcComponent
   */
  verifyGCCEstablishmentDetails() {
    scrollToTop();
    markFormGroupTouched(this.gccEstablishmentDetailsForm);
    if (this.gccEstablishmentDetailsForm && this.gccEstablishmentDetailsForm.valid) {
      this.submit.emit(this.gccEstablishmentDetailsForm.getRawValue());
    } else {
      this.invalidForm.emit();
    }
  }

  selectLawType(lawType) {
    if(lawType){
    this.islawTypeSelected = true;
    this.selectedLawType=lawType;
    this.showModal(this.cancelTemplate, 'lg');
    this.selectOrganizationType.emit(this.lawTypeToOrganisationType[lawType]);
    if (lawType === LawTypeEnum.CIVIL_PENSION_LAW) {
      this.gccEstablishmentDetailsForm
        .get('departmentNumber')
        .setValidators([Validators.required, Validators.pattern('[0-9a-zA-Z]+')]);
    } else {
      this.gccEstablishmentDetailsForm.get('departmentNumber').clearValidators();
      this.gccEstablishmentDetailsForm.get('departmentNumber').setErrors(null);
      this.gccEstablishmentDetailsForm.get('departmentNumber').setValue(null);
      this.gccEstablishmentDetailsForm.updateValueAndValidity();
    }
  }}

  selectGCCCountry(country) {
    if(country && this.selectedLawType === LawTypeEnum.CIVIL_PENSION_LAW){
    this.showModal(this.gccCountry, 'lg');
    }
  }

  /**
   * This method is used to navigate to previous tab
   * @memberof VerifyGccEstablishmentDcComponent
   */
  previousTab() {
    this.previous.emit();
  }

  /**
   * This method is to show a confirmation popup for reseting the form
   * @param template
   * @memberof VerifyGccEstablishmentDcComponent
   */
  resetForm(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.bsModalService.show(template);
  }

  /**
   * This method is to reset the form
   * @memberof VerifyGccEstablishmentDcComponent
   */
  confirm(): void {
    this.modalRef.hide();
    this.resetVerifyGCCEstablishmentForm();
  }

  /**
   * This method is to dismiss the reset
   * @memberof VerifyGccEstablishmentDcComponent
   */
  decline(): void {
    this.modalRef.hide();
    this.gccEstablishmentDetailsForm.get('legalEntity').reset();
  }

  /**
   * This method is to dismiss the reset GCC Country
   * @memberof VerifyGccEstablishmentDcComponent
   */
  declineCountrySelection(): void {
    this.modalRef.hide();
  }
}
