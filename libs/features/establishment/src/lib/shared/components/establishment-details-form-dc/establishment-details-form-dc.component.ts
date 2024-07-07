/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  AfterViewInit,
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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActivityTypeList,
  BaseComponent,
  Establishment,
  EstablishmentStatusEnum,
  GccCountryEnum,
  Lov,
  LovList,
  NationalityTypeEnum,
  markFormGroupTouched,
  scrollToTop,
  startOfMonth
} from '@gosi-ui/core';
import { AddressDcComponent, ContactDcComponent } from '@gosi-ui/foundation/form-fragments';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EstablishmentConstants } from '../../constants';
import { LawTypeEnum, LegalEntityEnum, OrganisationTypeEnum, SystemParamsEnum } from '../../enums';
import { createEstablishmentDetailsForm } from './establishment-details-form-dc';

/**
 * This component is used to handle the establishment basic details details.
 *
 * @export
 * @class EstablishmentDetailsFormDCComponent
 * @extends {BaseComponent}
 *
 */
@Component({
  selector: 'est-establishment-details-form-dc',
  templateUrl: 'establishment-details-form-dc.component.html',
  styleUrls: ['establishment-details-form-dc.component.scss']
})
export class EstablishmentDetailsFormDCComponent extends BaseComponent implements OnInit, OnChanges, AfterViewInit {
  /** Input Variables. */
  @Input() nationalityList: LovList = null;
  @Input() cityList: LovList = null;
  @Input() gccCountryList: LovList = null;
  @Input() activityTypeList: ActivityTypeList = null;
  @Input() addressTypeList: LovList = null;
  @Input() establishment: Establishment = null;
  @Input() isSaved = false;
  @Input() issueDate: Date;
  @Input() countryReadOnly = false;
  @Input() disableActivityType = false;
  @Input() disableNameEnglish = false;
  @Input() gosiStartDates: Map<string, Date>;
  @Input() lawTypeList: LovList;
  @Input() isValidator = false;
  @Input() legalEntityList: Lov[];

  registered = EstablishmentStatusEnum.REGISTERED;

  //Constants
  engNameMaxLength = EstablishmentConstants.EST_NAME_ENGLISH_MAX_LENGTH;
  arabicNameMaxLength = EstablishmentConstants.EST_NAME_ARABIC_MAX_LENGTH;

  //output variables
  @Output() submit: EventEmitter<object> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() progress: EventEmitter<null> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() selectOrganizationType: EventEmitter<string> = new EventEmitter();

  // child components
  @ViewChild('contactDetails', { static: false })
  contactDcComponent: ContactDcComponent;
  @ViewChild('addressDetails', { static: false })
  addressDetailsComponent: AddressDcComponent;

  lawTypeToOrganisationType = {
    [LawTypeEnum.SOCIAL_INSURANCE_LAW]: OrganisationTypeEnum.GCC,
    [LawTypeEnum.CIVIL_PENSION_LAW]: OrganisationTypeEnum.GOVERNMENT
  };

  // @ViewChild('cancelTemplate', { static: true })
  // cancelTemplate: TemplateRef<HTMLElement>;

  /** Local Variables. */
  invalidCode: number = null;
  list: Lov[];
  establishmentDetailsForm: FormGroup;
  date: Date = new Date();
  minDate: Date = null;
  maxDate: Date = new Date();
  submitted = false;
  disableNationality = false;
  isGccEstablishment = false;
  disableNameArabic = false;
  disableStartDate = false;
  modalRef: BsModalRef;
  addressForm = new FormGroup({});
  lawTypeEnum = LawTypeEnum;
  islawTypeSelected = false;
  lawTypeChanged = true;

  /**
   * Creates an instance of EstablishmentDetailsFormDCComponent.
   * @param {FormBuilder} fb
   * @memberof EstablishmentDetailsFormDCComponent
   */
  constructor(readonly fb: FormBuilder, private modalService: BsModalService) {
    super();
  }

  /**
   * This method is to handle initialization tasks.
   * @memberof EstablishmentDetailsFormDCComponent
   */
  ngOnInit() {
    this.establishmentDetailsForm = createEstablishmentDetailsForm(this.establishment?.organizationCategory?.english);
    this.initialiseComponentState(this.establishment, this.establishmentDetailsForm);
    if (
      this.isValidator &&
      this.establishment.lawType &&
      this.establishment.legalEntity &&
      this.establishmentDetailsForm.get('lawType.english')?.value &&
      this.establishmentDetailsForm.get('legalEntity.english')?.value &&
      this.establishment.lawType.english === this.establishmentDetailsForm.get('lawType.english')?.value
    ) {
      this.lawTypeChanged = false;
    }
  }

  /**
   * This method captures the changes to input and bind the same to forms and hanldes any validations
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this.establishmentDetailsForm && changes.establishment && changes.establishment.currentValue) {
      this.initialiseComponentState(this.establishment, this.establishmentDetailsForm);
    }
    if (this.establishment.organizationCategory?.english !== OrganisationTypeEnum.GCC && this.isValidator) {
      this.establishmentDetailsForm.removeControl('legalEntity');
      this.establishmentDetailsForm.updateValueAndValidity();
    }
  }

  /**
   * This is method is used initiate certain tasks after the child components are created
   */
  ngAfterViewInit() {
    this.checkForValueChange();
  }

  /**
   * Initialise the component state
   * @param establishment
   * @param form
   */
  initialiseComponentState(establishment: Establishment, form: FormGroup) {
    if (establishment && form) {
      Object.keys(establishment).forEach(name => {
        if (establishment[name] && name in form.controls) {
          form.get(name).patchValue(establishment[name]);
        }
      });
      this.selectLawType(form.get('lawType.english')?.value);
      this.setNationalityField(establishment, form);
      if (this.establishment.proactive && this.establishment.proactive === true) {
        this.initialiseForProacive(establishment, form);
      } else {
        if (establishment.gccCountry === false) {
          const licenseIssueDate = moment(this.establishment.license?.issueDate?.gregorian).toDate();
          if (this.gosiStartDates) {
            if (this.establishment.legalEntity.english === LegalEntityEnum.GOVERNMENT) {
              const startDate = moment(this.gosiStartDates.get(SystemParamsEnum.government)).toDate();
              if (licenseIssueDate <= startDate) {
                this.setStartDate(new Date(this.gosiStartDates.get(SystemParamsEnum.government)), form);
              } else {
                this.setStartDate(startOfMonth(this.establishment.license?.issueDate?.gregorian), form);
              }
            } else if (this.establishment.legalEntity.english === LegalEntityEnum.SEMI_GOV) {
              const startDate = moment(this.gosiStartDates.get(SystemParamsEnum.semiGovernment)).toDate();
              if (licenseIssueDate <= startDate) {
                this.setStartDate(new Date(this.gosiStartDates.get(SystemParamsEnum.semiGovernment)), form);
              } else {
                this.setStartDate(startOfMonth(this.establishment.license?.issueDate?.gregorian), form);
              }
            } else {
              const startDate = moment(this.gosiStartDates.get(SystemParamsEnum.orgRegInternational)).toDate();
              if (licenseIssueDate <= startDate) {
                this.setStartDate(new Date(this.gosiStartDates.get(SystemParamsEnum.orgRegInternational)), form);
              } else {
                this.setStartDate(startOfMonth(this.establishment.license?.issueDate?.gregorian), form);
              }
            }
          }

          this.disableStartDate = true;
        } else {
          this.disableStartDate = false;
          this.setStartDate(startOfMonth(this.establishment.startDate.gregorian), form);
        }
      }
    }
  }

  /**
   * Method to set the nationality field and min start date
   * @param establishment
   * @param form
   */
  setNationalityField(establishment: Establishment, form: FormGroup) {
    if (establishment.proactive === true) {
      form.get('nationalityCode').get('english').setValue(NationalityTypeEnum.SAUDI_NATIONAL);
      this.disableNationality = true;
      this.isGccEstablishment = false;
    } else if (establishment.organizationCategory?.english === OrganisationTypeEnum.GCC) {
      if (establishment.lawType?.english === LawTypeEnum.CIVIL_PENSION_LAW) {
        form.get('nationalityCode').get('english').setValue(establishment.gccEstablishment?.country?.english);
        this.disableNationality = true;
      } else {
        this.disableNationality = false;
      }
      this.isGccEstablishment = true;
      this.setStartDateValidation(establishment.gccEstablishment?.country?.english);
    } else if (
      establishment.legalEntity &&
      (establishment.legalEntity.english === LegalEntityEnum.GOVERNMENT ||
        establishment.legalEntity.english === LegalEntityEnum.SEMI_GOV)
    ) {
      form.get('nationalityCode').get('english').setValue(NationalityTypeEnum.SAUDI_NATIONAL);
      this.disableNationality = true;
      this.isGccEstablishment = false;
    } else {
      form.get('nationalityCode').get('english').setValue(establishment.nationalityCode?.english);
      this.disableNationality = false;
      this.isGccEstablishment = false;
    }
  }

  /**
   * Mol Establishments
   * @param establishment
   * @param form
   */
  initialiseForProacive(establishment: Establishment, form: FormGroup) {
    markFormGroupTouched(form);
    markFormGroupTouched(this.contactDcComponent.contactDetailsForm);
    markFormGroupTouched(this.addressDetailsComponent?.parentForm);
    if (establishment.name.arabic) {
      this.disableNameArabic = true;
    }
    if (
      establishment.legalEntity &&
      (establishment.legalEntity.english === LegalEntityEnum.GOVERNMENT ||
        establishment.legalEntity.english === LegalEntityEnum.SEMI_GOV)
    ) {
      this.disableNationality = true;
      form.get('nationalityCode').get('english').setValue(NationalityTypeEnum.SAUDI_NATIONAL);
    }
    this.checkStartDate();
    if (establishment.crn?.issueDate?.gregorian) {
      this.checkGosiStartDate(establishment.crn.issueDate.gregorian, form);
    }
  }

  /**
   * This method is check crn and license issue date
   */
  checkStartDate() {
    if (this.establishment?.license?.issueDate?.gregorian) {
      if (
        this.establishment.crn?.issueDate?.gregorian &&
        this.establishment.crn.issueDate.gregorian < this.establishment.license.issueDate.gregorian
      ) {
        this.checkGosiStartDate(this.establishment.crn.issueDate.gregorian, this.establishmentDetailsForm);
      } else {
        this.checkGosiStartDate(this.establishment.license.issueDate.gregorian, this.establishmentDetailsForm);
      }
    } else {
      this.setStartDate(startOfMonth(new Date()), this.establishmentDetailsForm); //no license issue date then set start of current month
    }
  }

  /**
   * This method is to check if the establishment start date is greater than gosi start date.
   * @param startDate
   */
  checkGosiStartDate(startDate: Date, form: FormGroup) {
    let date = new Date();
    if (this.establishment.legalEntity.english === LegalEntityEnum.GOVERNMENT) {
      date = new Date(this.gosiStartDates.get(SystemParamsEnum.government));
    } else if (this.establishment.legalEntity.english === LegalEntityEnum.SEMI_GOV) {
      date = new Date(this.gosiStartDates.get(SystemParamsEnum.semiGovernment));
    } else if (this.establishment.legalEntity.english === LegalEntityEnum.ORG_REGIONAL) {
      date = new Date(this.gosiStartDates.get(SystemParamsEnum.orgRegInternational));
    } else {
      date = new Date(this.gosiStartDates.get(SystemParamsEnum.orgRegInternational));
    }
    if (startDate < date || moment(startOfMonth(startDate)).isSame(startOfMonth(date))) {
      this.setStartDate(date, form);
    } else {
      if (this.establishment.proactive) {
        this.setStartDate(startOfMonth(startDate), form);
      } else {
        this.setStartDate(startDate, form);
      }
    }
  }

  /**
   * This method is used to detect and emit any value change in the establishment details page
   */
  checkForValueChange() {
    if (this.establishmentDetailsForm) {
      this.establishmentDetailsForm.valueChanges.subscribe(() => {
        if (this.isSaved) {
          this.progress.emit();
        }
      });
    }
    if (this.contactDcComponent && this.contactDcComponent.contactDetailsForm) {
      this.contactDcComponent.contactDetailsForm.valueChanges.subscribe(() => {
        if (this.isSaved) {
          this.progress.emit();
        }
      });
    }
  }

  /**
   * This method is used set min date validation depending on GCC Country
   * @memberof EstablishmentDetailsFormDCComponent
   */
  setStartDateValidation(nationalityCode: string) {
    if (nationalityCode) {
      if (
        nationalityCode === GccCountryEnum.OMAN ||
        nationalityCode === GccCountryEnum.BAHRAIN ||
        nationalityCode === GccCountryEnum.KUWAIT
      ) {
        this.minDate = new Date(this.gosiStartDates.get(SystemParamsEnum.gccCountries1));
      } else if (nationalityCode === GccCountryEnum.UAE || nationalityCode === GccCountryEnum.QATAR) {
        this.minDate = new Date(this.gosiStartDates.get(SystemParamsEnum.gccCountries2));
      }
    }
  }

  /* This method is used for show Modal */
  showModal(template: TemplateRef<HTMLElement>, size: string = 'md', ignoreBackdrop: boolean = false): void {
    if (template) {
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: 'modal-' + size, ignoreBackdropClick: ignoreBackdrop })
      );
    }
  }

  /**
   * This method is used to reset establishment details form
   */
  resetEstablishmentDetailsForm() {
    scrollToTop();
    this.submitted = false;
    this.disableNationality = false;
    this.isGccEstablishment = false;
    this.disableNameArabic = false;
    this.establishmentDetailsForm.reset(
      createEstablishmentDetailsForm(this.establishment?.organizationCategory?.english).getRawValue()
    );
    this.resetStartDate();
    this.contactDcComponent.resetContactForm();
    this.addressDetailsComponent.resetAddressForm();
    this.establishmentDetailsForm.updateValueAndValidity();
    this.establishmentDetailsForm.markAsPristine();
    this.establishmentDetailsForm.markAsUntouched();
  }

  //This method is set startDate after reset
  resetStartDate() {
    if (
      this.establishment.license != null &&
      this.establishment.license.issueDate != null &&
      this.establishment.license.issueDate.gregorian != null
    ) {
      this.setStartDate(startOfMonth(this.establishment.license.issueDate.gregorian), this.establishmentDetailsForm);
      this.checkStartDate();
    }
  }

  /**
   * This method is to set the start date of the establishment.
   * @param date
   * @memberof EstablishmentDetailsFormDCComponent
   */
  setStartDate(date: Date, form: FormGroup) {
    if (form) {
      form.get('startDate').get('gregorian').setValue(date);
      form.get('startDate').get('gregorian').updateValueAndValidity();
    }
  }

  /**
   * This method is used to submit the establishment basic details
   * @memberof EstablishmentDetailsFormDCComponent
   */
  saveEstablishment() {
    this.submitted = true;
    markFormGroupTouched(this.establishmentDetailsForm);
    markFormGroupTouched(this.contactDcComponent.contactDetailsForm);
    markFormGroupTouched(this.addressDetailsComponent?.parentForm);
    if (!this.isGccEstablishment) {
      //If not an gcc establishment set the default value to saudi
      if (!this.establishment.contactDetails?.mobileNo?.isdCodePrimary) {
        this.contactDcComponent.contactDetailsForm.get('mobileNo')?.get('isdCodePrimary')?.setValue('sa');
      }
    }
    const addressDetails = this.addressDetailsComponent.getAddressDetails();
    const currentMailingAddress = this.addressDetailsComponent.currentMailingAddress;
    this.submit.emit({
      establishmentDetails: this.establishmentDetailsForm.getRawValue(),
      addressDetails: addressDetails,
      establishmentContact: this.contactDcComponent.contactDetailsForm.getRawValue(),
      currentMailingAdddress: currentMailingAddress
    });
  }

  /**
   * This method is to show a confirmation popup for reseting the form
   * @param template
   * @memberof EstablishmentDetailsFormDCComponent
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  /**
   * This method is to confirm cancelation the form
   * @memberof EstablishmentDetailsFormDCComponent
   */
  confirmCancel() {
    this.modalRef.hide();
    this.cancel.emit();
  }

  /**
   * This method is to decline the popUp *
   * @memberof EstablishmentDetailsFormDCComponent
   */
  decline() {
    this.modalRef.hide();
    if (
      this.isValidator &&
      this.establishment?.lawType?.english === this.establishmentDetailsForm.get('lawType.english')?.value
    ) {
      this.establishmentDetailsForm.get('legalEntity.english').setValue(this.establishment?.legalEntity?.english);
    } else this.establishmentDetailsForm.get('legalEntity').reset();
  }

  selectLawType(lawType: string, templateRef?: TemplateRef<HTMLElement>) {
    this.islawTypeSelected = true;
    this.selectOrganizationType.emit(this.lawTypeToOrganisationType[lawType]);
    if (lawType === LawTypeEnum.CIVIL_PENSION_LAW) {
      this.establishmentDetailsForm
        .get('departmentNumber')
        .setValidators([Validators.required, Validators.pattern('[0-9a-zA-Z]+')]);
      this.establishmentDetailsForm
        .get('nationalityCode')
        .get('english')
        .setValue(this.establishment.nationalityCode?.english);
      this.disableNationality = true;
    } else {
      this.disableNationality = false;
      this.establishmentDetailsForm.get('departmentNumber').clearValidators();
      this.establishmentDetailsForm.get('departmentNumber').setErrors(null);
      if (this.isValidator) this.establishmentDetailsForm.get('legalEntity').reset();
      this.establishmentDetailsForm.updateValueAndValidity();
      // this.establishmentDetailsForm.get('lateFeeIndicator').setValue(null);
    }

    if (
      this.isValidator &&
      this.establishment.lawType.english !== this.establishmentDetailsForm.get('lawType.english')?.value
    ) {
      this.lawTypeChanged = true;
    }
    if (
      this.isValidator &&
      this.establishment.lawType.english === this.establishmentDetailsForm.get('lawType.english')?.value
    ) {
      this.establishmentDetailsForm.get('legalEntity.english').setValue(this.establishment?.legalEntity?.english);
      this.lawTypeChanged = false;
    }
    if (templateRef) {
      this.showModal(templateRef, 'lg');
    }
  }

  /**
   * This method is to navigate to the previous section of the form
   */
  previousSection() {
    this.previous.emit();
  }

  //This method is used to reset form on reset button
  confirmReset() {
    this.resetEstablishmentDetailsForm();
    this.modalRef.hide();
  }

  /**
   * This method is to check the overall form validity
   * @memberof EstablishmentDetailsFormDCComponent
   */
  isValidForm() {
    let addressValid = true;
    if (this.addressDetailsComponent) {
      addressValid = this.addressDetailsComponent.getAddressValidity();
    }
    if (this.establishmentDetailsForm.valid && this.contactDcComponent) {
      return addressValid && this.contactDcComponent.contactDetailsForm.valid;
    }
    return false;
  }
}
