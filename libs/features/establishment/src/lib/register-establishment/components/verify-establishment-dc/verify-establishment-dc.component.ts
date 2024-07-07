/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BaseComponent,
  lengthValidator,
  Lov,
  LovList,
  markFormGroupTouched,
  recruitmentNumberValidator,
  scrollToTop
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  Establishment,
  EstablishmentConstants,
  EstablishmentTypeEnum,
  LawTypeEnum,
  OrganisationTypeEnum,
  socialInsuranceLawBilingual
} from '../../../shared';

/**
 * Component for verify establishment with license number and main establishment registration number if branch
 *
 * @export
 * @class VerifyEstablishmentDCComponent
 * @extends {BaseComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'est-verify-establishment-dc',
  templateUrl: './verify-establishment-dc.component.html',
  styleUrls: ['./verify-establishment-dc.component.scss']
})
export class VerifyEstablishmentDCComponent extends BaseComponent implements OnInit, OnChanges {
  /**
   * Private variable
   */
  modalRef: BsModalRef;
  establishmentDetailsForm: FormGroup = null;
  currentDate: Date = new Date();
  minDate: Date = new Date();
  nextDay: Date = new Date();
  submitted: boolean;
  serviceRequestMessage: string;

  /* Constants */
  estTypeBranch = EstablishmentTypeEnum.BRANCH;
  licenseNoMax = EstablishmentConstants.LICENSE_MAX_LENGTH;
  recruitmentNoMax = EstablishmentConstants.RECRUITMENT_MAX_LENGTH;
  organisationTypeEnum = OrganisationTypeEnum;
  lawTypeEnum = LawTypeEnum;
  /**
   * Input Variables from Add Establishment SC Component
   */
  @Input() legalEntityList: Lov[];
  @Input() licenseIssuingAuthorityList: Lov[];
  @Input() establishmentBranchTypeList: LovList;
  @Input() lawTypeList: LovList;
  @Input() establishment: Establishment;
  /**
   * Output Variables
   */
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() invalidForm: EventEmitter<null> = new EventEmitter();

  /**
   * This method is used to initialise the component
   * @param fb
   *  @memberof VerifyEstablishmentDCComponent
   */

  @ViewChild('cancelTemplate', { static: true })
  cancelTemplate: TemplateRef<HTMLElement>;

  constructor(private fb: FormBuilder, private bsModalService: BsModalService) {
    super();
    this.nextDay.setDate(this.nextDay.getDate() + 1);
  }

  /**
   * This method handles the initialization tasks.
   *
   * @memberof VerifyEstablishmentDCComponent
   */
  ngOnInit() {
    // this.establishmentDetailsForm = this.createVerifyEstablishmentForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes.legalEntityList?.currentValue && this.establishmentDetailsForm) {
    //   this.establishmentDetailsForm.reset();
    // }
    if (
      changes.establishment?.currentValue &&
      changes.establishment?.currentValue?.organizationCategory.english !==
        changes.establishment?.previousValue?.organizationCategory?.english
    ) {
      //For non government select law type as social insurance law
      // if(this.establishmentDetailsForm){
      //   this.establishmentDetailsForm.reset();
      // }
      this.establishmentDetailsForm = this.createVerifyEstablishmentForm(
        this.establishment.organizationCategory.english
      );

      // if(this.establishment.organizationCategory?.english === OrganisationTypeEnum.NON_GOVERNMENT){
      //   this.establishmentDetailsForm.get('lawType.english').patchValue(socialInsuranceLawBilingual().english);
      //   this.establishmentDetailsForm.get('lawType.arabic').patchValue(socialInsuranceLawBilingual().arabic);
      //   this.establishmentDetailsForm.get('departmentNumber').clearValidators();
      //   this.establishmentDetailsForm.get('departmentNumber').setErrors(null);
      //   this.establishmentDetailsForm.updateValueAndValidity();
      // }
    }
  }

  /**
   * This method is used to initialisee the form template
   */
  createVerifyEstablishmentForm(orgType: string) {
    return this.fb.group({
      legalEntity: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      establishmentType: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      lawType: this.fb.group({
        english: [
          orgType === OrganisationTypeEnum.NON_GOVERNMENT ? socialInsuranceLawBilingual().english : null,
          Validators.required
        ],
        arabic: [orgType === OrganisationTypeEnum.NON_GOVERNMENT ? socialInsuranceLawBilingual().arabic : null]
      }),
      departmentNumber: [null, this.getDepartmentNumberFormControl(orgType)],

      license: this.fb.group({
        issueDate: this.fb.group({
          gregorian: [
            null,
            {
              validators: Validators.compose([Validators.required]),
              updateOn: 'blur'
            }
          ],
          hijiri: ['']
        }),
        issuingAuthorityCode: this.fb.group({
          english: [null, Validators.required],
          arabic: []
        }),
        number: [
          '',
          {
            validators: Validators.compose([
              Validators.required,
              Validators.pattern('[0-9a-zA-Z]+'),
              Validators.maxLength(this.licenseNoMax)
            ]),
            updateOn: 'blur'
          }
        ],
        expiryDate: this.fb.group({
          gregorian: [null],
          hijiri: ['']
        })
      }),
      mainEstablishmentRegNo: [
        null,
        {
          updateOn: 'blur'
        }
      ],
      recruitmentNo: [
        null,
        {
          validators: Validators.compose([
            lengthValidator(this.recruitmentNoMax),
            recruitmentNumberValidator,
            Validators.pattern('[0-9]+')
          ]),
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
   * This method is used to reset verify establishment form
   */
  resetVerifyEstablishmentForm() {
    this.establishmentDetailsForm.reset(
      this.createVerifyEstablishmentForm(this.establishment?.organizationCategory?.english).getRawValue()
    );
    this.establishmentDetailsForm.updateValueAndValidity();
    this.establishmentDetailsForm.markAsPristine();
    this.establishmentDetailsForm.markAsUntouched();
  }

  /**
   * This method is to select the minimum date corresponding to the legal entity
   * @param val
   */
  selectLegalEntity() {
    this.establishmentDetailsForm.get('license').get('issueDate').get('gregorian').setValue(null);
    this.establishmentDetailsForm.get('license').get('issueDate').get('gregorian').markAsUntouched();
    this.establishmentDetailsForm.get('license').get('issueDate').get('gregorian').markAsPristine();
  }

  /**
   * This method is used to submit the form values
   * @memberof VerifyEstablishmentDCComponent
   */
  verifyEstablishmentDetails() {
    scrollToTop();
    markFormGroupTouched(this.establishmentDetailsForm);

    if (this.establishmentDetailsForm.valid) {
      this.submit.emit(this.establishmentDetailsForm.getRawValue());
    } else {
      this.invalidForm.emit();
    }
  }

  /**
   * This method is used to navigate to previous tab
   * @memberof VerifyEstablishmentDCComponent
   */
  previousTab() {
    this.previous.emit();
  }

  /**
   * This method is to show a confirmation popup for reseting the form
   * @param template
   * @memberof VerifyEstablishmentDCComponent
   */
  resetForm(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.bsModalService.show(template);
  }

  /**
   * This method is to reset the form
   * @memberof VerifyEstablishmentDCComponent
   */
  confirm(): void {
    this.resetVerifyEstablishmentForm();
    this.modalRef.hide();
  }

  /**
   * This method is to dismiss the reset
   * @memberof VerifyEstablishmentDCComponent
   */
  decline(): void {
    this.modalRef.hide();
  }

  /**
   * This method is to make the main registration number field required corresponding to establishment type
   * @memberof VerifyEstablishmentDCComponent
   */
  selectEstType(val) {
    if (val === EstablishmentTypeEnum.BRANCH) {
      this.establishmentDetailsForm
        .get('mainEstablishmentRegNo')
        .setValidators([Validators.required, Validators.pattern('[0-9]+')]);
    } else {
      this.establishmentDetailsForm.get('mainEstablishmentRegNo').clearValidators();
      this.establishmentDetailsForm.get('mainEstablishmentRegNo').setValue(null);
      this.establishmentDetailsForm.get('mainEstablishmentRegNo').markAsUntouched();
      this.establishmentDetailsForm.get('mainEstablishmentRegNo').markAsPristine();
    }
    this.establishmentDetailsForm.get('mainEstablishmentRegNo').updateValueAndValidity();
  }
  selectLawType(lawType) {
    if (lawType === LawTypeEnum.CIVIL_PENSION_LAW) {
      this.showModal(this.cancelTemplate, 'lg');
      this.establishmentDetailsForm
        .get('departmentNumber')
        .setValidators([Validators.required, Validators.pattern('[0-9a-zA-Z]+')]);
    } else {
      this.showModal(this.cancelTemplate, 'lg');
      this.establishmentDetailsForm.get('departmentNumber').clearValidators();
      this.establishmentDetailsForm.get('departmentNumber').setErrors(null);
      this.establishmentDetailsForm.get('departmentNumber').patchValue(null);
      // this.establishmentDetailsForm.removeControl('departmentNumber');
      this.establishmentDetailsForm.updateValueAndValidity();
    }
  }

  getDepartmentNumberFormControl(orgType: string): FormControl {
    return new FormControl(null, {
      validators: Validators.compose([
        orgType === OrganisationTypeEnum.GOVERNMENT ? Validators.required : null,
        Validators.pattern('[0-9a-zA-Z]+')
      ]),
      updateOn: 'blur'
    });
  }
}
