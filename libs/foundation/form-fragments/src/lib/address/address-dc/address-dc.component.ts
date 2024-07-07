/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AddressDetails,
  AddressTypeEnum,
  ContactDetails,
  Lov,
  LovList,
  hasRequiredField,
  isAddressValid,
  setAddressFormToAddresses
} from '@gosi-ui/core';
import { cardType } from '@gosi-ui/foundation-theme';
import { AddressDCHelper } from './address-dc-helper';

export const SAUDI_ADDRESS = 'saudiAddress';
export const POBOX_ADDRESS = 'poBoxAddress';
export const FOREIGN_ADDRESS = 'foreignAddress';
export const AddressMandatoryErrorKey = 'FORM-FRAGMENTS.ERROR.ADDRESS-MANDATORY';
export const SaudiMandatoryErrorKey = 'FORM-FRAGMENTS.ERROR.SAUDI-ADDRESS-MANDATORY';
export const ForeignMandatoryErrorKey = 'FORM-FRAGMENTS.ERROR.FOREIGN-ADDRESS-MANDATORY';
export const NationalMandatoryErrorKey = 'FORM-FRAGMENTS.ERROR.NATIONAL-ADDRESS-MANDATORY';
export const PoMandatoryErrorKey = 'FORM-FRAGMENTS.ERROR.POBOX-ADDRESS-MANDATORY';

@Component({
  selector: 'frm-address-dc',
  templateUrl: './address-dc.component.html',
  styleUrls: ['./address-dc.component.scss']
})
export class AddressDcComponent extends AddressDCHelper implements OnInit, OnChanges, AfterViewInit {
  readonly typeNational = 'National Address';
  readonly typePoBox = 'PO Box Address';
  readonly nationalType = AddressTypeEnum.NATIONAL;
  readonly poBoxType = AddressTypeEnum.POBOX;
  readonly foreignType = AddressTypeEnum.OVERSEAS;
  readonly nationalAddressFormName = SAUDI_ADDRESS;
  readonly poAddressFormName = POBOX_ADDRESS;
  readonly foreignAddressFormName = FOREIGN_ADDRESS;
  nationalAddress = new AddressDetails(); //To pass the national address to national address component
  poBoxAddress = new AddressDetails(); //To pass the pobox address to pobox address component
  overSeasAddress = new AddressDetails(); //To pass the overseas address to overseas address component
  onlyAddressType: string; //If only one address is required
  toggleMailingAddress: FormControl; // Control to select the mailing address
  selectedAddresses = []; //To keep track of all the addresses selected for validation
  showError = false; //To show error if any
  addressTypeForm: FormGroup;

  /**
   * Lookup values
   */
  @Input() countryList: LovList = null; //Country list to be passed to foreign address - (gcc country list)
  @Input() cityList: LovList = null;

  @Input() parentForm: FormGroup; // Bind details to parent form
  @Input() contactDetail: ContactDetails; // Bind details to parent form
  @Input() isOptional = false; // Make address optional or mandatory
  @Input() isSaudiAddrMandatory = false; //If either one of National or PO address is mandatory
  @Input() isNationalMandatory = false; //If only national is mandatory
  @Input() nationalAlwaysMandatory = false; //If national is always mandatory
  @Input() isPoMandatory = false; //If only po box is mandatory
  @Input() hasAddressDetailsLabel = true; //Show or hide heading
  @Input() hasPOAddress = true; //show or hide pobox component
  @Input() hasNationalAddress = true; //show or hide national component
  @Input() hasOverseasAddress = true; //show or hide foreign component
  @Input() mandatoryOverseasAddress = false; // If overseas is mandatory
  @Input() addressDetails: AddressDetails[] = []; // All Address details
  @Input() currentMailingAddress: string; // To set the current mailing address
  @Input() readOnlyAll = false; //To make all fields readonly
  @Input() countryReadOnly = false; //To make country readonly
  @Input() showCard = true; //To make the card visible
  @Input() lessPadding: boolean;
  //View Mode for address
  @Input() isViewOnly = false;
  @Input() showEdit = false; //Show or hide edit button for editing address in view mode
  @Input() isPaddingRequired = true;
  @Input() establishmentWaselAddress: AddressDetails;

  @Input() idValue: ''; // to select different toggle and checkboxes (purely for testing)
  @Input() isWaselAddress: boolean;

  @Output() editEvent: EventEmitter<null> = new EventEmitter();
  @Output() deleteAddress: EventEmitter<string> = new EventEmitter(); // To trigger an event when delete address
  @Output() addAddress: EventEmitter<string> = new EventEmitter(); // To trigger an event when delete address
  isGCC = false;

  addressTypeList: LovList;
  addressAlertKey: string;
  selectedCardType: string = cardType.Secondary;
  noHeadingMargin = false;
  /**
   * Creates an instance of AddressDcComponent
   * @param fb
   * @memberof  AddressDcComponent
   */
  constructor(readonly fb: FormBuilder) {
    super();
    this.addressAlertKey = AddressMandatoryErrorKey;
  }

  // TODO:Add method comment
  ngOnInit() {
    this.getAddressTypeList();
    this.toggleMailingAddress = new FormControl(this.nationalType, Validators.required);
    this.addressTypeForm = this.fb.group({
      english: [
        this.mapAddressType(this.toggleMailingAddress.value).english,
        { validators: Validators.required, updateOn: 'blur' }
      ],
      arabic: [null]
    });
    if (this.parentForm) {
      if (this.parentForm.get('currentMailingAddress')) {
        this.addressTypeForm.controls.english.setValue(
          this.mapAddressType(this.parentForm.get('currentMailingAddress').value).english
        );
      }
    }
    if (this.parentForm === undefined) {
      this.parentForm = new FormGroup({});
    }
    if (!this.parentForm.get('currentMailingAddress')) {
      this.parentForm.addControl('currentMailingAddress', this.toggleMailingAddress);
    }
  }
  ngAfterViewInit() {
    if (this.addressDetails) {
      this.setAddresses();
    }
    if (!this.isViewOnly) {
      this.toggleCardView(this.toggleMailingAddress.value);
    }
  }
  // TODO:Add method comment
  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes.addressDetails && changes.addressDetails.currentValue) ||
      changes.hasPOAddress ||
      changes.hasNationalAddress ||
      changes.hasOverseasAddress
    ) {
      this.setAddresses();
    }
    if (changes.isPoMandatory) {
      this.isPoMandatory = changes.isPoMandatory.currentValue;
      if (this.isPoMandatory) {
        this.currentMailingAddress = this.poBoxType;
        this.setAddresses();
      } else {
        this.currentMailingAddress = this.nationalType;
        this.setAddresses();
      }
    }
  }

  /**
   * This method is used to set the different input for different components
   */
  public setAddresses() {
    this.nationalAddress = null;
    this.overSeasAddress = null;
    this.poBoxAddress = null;
    this.selectedAddresses = [];
    const addressTypes = [];

    if (this.hasNationalAddress === true) {
      addressTypes.push(AddressTypeEnum.NATIONAL);
      this.nationalAddress = this.selectAndBindAddress(AddressTypeEnum.NATIONAL);
    }
    if (this.hasPOAddress === true) {
      addressTypes.push(AddressTypeEnum.POBOX);
      this.poBoxAddress = this.selectAndBindAddress(AddressTypeEnum.POBOX);
    }

    if (this.hasOverseasAddress === true) {
      addressTypes.push(AddressTypeEnum.OVERSEAS);
      this.overSeasAddress = this.selectAndBindAddress(AddressTypeEnum.OVERSEAS);
    }
    if (!this.toggleMailingAddress) {
      this.toggleMailingAddress = new FormControl(this.nationalType, Validators.required);
    }
    if (this.toggleMailingAddress) {
      switch (this.currentMailingAddress) {
        case this.nationalType: {
          if (this.hasNationalAddress) {
            this.toggleMailingAddress.setValue(this.currentMailingAddress);
          }

          break;
        }
        case this.poBoxType: {
          if (this.hasPOAddress) {
            this.toggleMailingAddress.setValue(this.currentMailingAddress);
          }
          break;
        }
        case this.foreignType: {
          if (this.hasOverseasAddress) {
            this.toggleMailingAddress.setValue(this.currentMailingAddress);
          }
          break;
        }
        default: {
          break;
        }
      }
      this.addressTypeForm?.controls.english.setValue(
        this.mapAddressType(this.parentForm.get('currentMailingAddress').value)?.english
      );
      this.toggleCardView(this.toggleMailingAddress.value);
    }

    //If only one address is required
    if (addressTypes.length === 1) {
      this.onlyAddressType = addressTypes[0];
      this.currentMailingAddress = addressTypes[0];
    } else {
      this.onlyAddressType = undefined;
      // this.currentMailingAddress = addressTypes[0];
    }

    // Open the first address shown in screen and if address not optional
    if (this.selectedAddresses.length === 0 && !this.isOptional) {
      if (this.currentMailingAddress === this.poBoxType) {
        this.selectedAddresses.push(AddressTypeEnum.POBOX);
      }
      if (this.currentMailingAddress === this.foreignType && this.hasOverseasAddress){
        this.selectedAddresses.push(AddressTypeEnum.OVERSEAS);
      }
      else {
        this.selectedAddresses.push(addressTypes[0]);
      }
    }
  }

  /**
   * This method is used to bind address from input addressDetails add show the data
   * @param addressType
   */
  private selectAndBindAddress(addressType) {
    if (this.selectedAddresses.indexOf(addressType) === -1) {
      if (this.addressDetails && this.addressDetails.map(item => item.type).includes(addressType)) {
        this.selectedAddresses.push(addressType);
      }
    }
    return this.getAddress(addressType);
  }

  /**
   * Method to get the particular address from array
   * @param type
   */
  private getAddress(type): AddressDetails {
    if (this.addressDetails) {
      this.addressDetails = this.addressDetails.filter(address => address !== null);
      return this.addressDetails.find(address => address.type === type) || new AddressDetails(type);
    } else {
      return new AddressDetails(type);
    }
  }

  /**
   * Check the for validity depends upon the type
   * For view child
   */

  getAddressValidity() {
    this.updateAddressValidity();
    this.checkIfPreferredAddressIsValid();
    if (this.nationalAlwaysMandatory) {
      return (
        isAddressValid(this.parentForm.get(this.nationalAddressFormName) as FormGroup) &&
        this.showError === false &&
        // Defect 545721: During add member PO box address can be submitted without selecting city
        // if the optional address is selected, it should be filled ( mandatory)
        this.checkIfSelectedAddressIsValid(this.poBoxType, this.poAddressFormName) &&
        this.checkIfSelectedAddressIsValid(this.foreignType, this.foreignAddressFormName)
      );
    }
    if (this.showError === false) {
      return (
        this.checkIfSelectedAddressIsValid(this.nationalType, this.nationalAddressFormName) &&
        this.checkIfSelectedAddressIsValid(this.poBoxType, this.poAddressFormName) &&
        this.checkIfSelectedAddressIsValid(this.foreignType, this.foreignAddressFormName)
      );
    } else {
      return false;
    }
  }


  /**
   * Method to check if preferred address is valid
   */
  checkIfPreferredAddressIsValid() {
    if (this.selectedAddresses?.length === 0 && this.isOptional) {
      return true;
    }
    const formName = this.getFormName(this.parentForm.get('currentMailingAddress').value);
    if (isAddressValid(this.parentForm.get(formName) as FormGroup)) {
            this.showError = false;
    } else {
            this.showError = true;
    }
    if (this.currentMailingAddress) {
      const formName = this.getFormName(this.currentMailingAddress);
      if (isAddressValid(this.parentForm.get(formName) as FormGroup)) {
        this.showError = false;
      } else {
        this.showError = true;
      }
    }
  }

  /**
   * Method to get the address details through view child
   */
  getAddressDetails(): AddressDetails[] {
    return setAddressFormToAddresses(this.parentForm);
  }

  /**
   * This method is used to take count of all the addresses selected
   * @param isSelected- to identify add or delete events
   * @param addressType - The addres which has been added or deleted
   */
  choseAddresses(isSelected, addressType, formName) {
    if (this.parentForm.get(formName)) {
      let country;
      if (
        !this.mandatoryOverseasAddress &&
        addressType === AddressTypeEnum.OVERSEAS &&
        this.isOptional &&
        this.parentForm.get(formName).get('country').disabled
      ) {
        country = this.parentForm.get(formName).get('country').value;
        if (country.arabic === undefined) country.arabic = null;
      }
      this.parentForm.get(formName).reset({ type: addressType });

      if (
        !this.mandatoryOverseasAddress &&
        addressType === AddressTypeEnum.OVERSEAS &&
        this.isOptional &&
        this.parentForm.get(formName).get('country').disabled
      ) {
        country = this.parentForm.get(formName).get('country').setValue(country);
      }
    }
    //If address is added
    if (isSelected === true) {
      this.addAddress.emit(addressType);
      this.selectedAddresses.push(addressType);
    }
    //If address is removed
    else {
      if (this.selectedAddresses.includes(addressType)) {
        this.deleteAddress.emit(addressType);
        this.selectedAddresses = this.selectedAddresses.filter(item => item !== addressType);
      }
    }

    if (this.selectedAddresses.length === 0) {
      this.toggleMailingAddress.setValue(null);
    }
    this.updateAddressValidity();
  }

  /**
   * Generic method to check and update the validity of the address when user adds or delete address   *
   */
  private updateAddressValidity() {
    this.showError = false;
    //More than one address is shown and one address is mandatory
    if (this.onlyAddressType === undefined && this.isOptional === false) {
      //If neither National nor PO Address has been selected
      if (this.isSaudiAddrMandatory === true) {
        if (
          this.selectedAddresses.indexOf(this.nationalType) === -1 &&
          this.selectedAddresses.indexOf(this.poBoxType) === -1
        ) {
          this.showError = true;
          this.addressAlertKey = SaudiMandatoryErrorKey;
        }
      }
      //If Foreign Address has not been selected
      else if (this.mandatoryOverseasAddress === true) {
        if (this.selectedAddresses.indexOf(this.foreignType) === -1) {
          this.showError = true;
          this.addressAlertKey = ForeignMandatoryErrorKey;
        }
      }
      //If National Address has not been selected
      else if (this.isNationalMandatory === true) {
        if (this.selectedAddresses.indexOf(this.nationalType) === -1) {
          this.showError = true;
          this.addressAlertKey = NationalMandatoryErrorKey;
        }
      }
      //If PO Address has not been selected
      else if (this.isPoMandatory === true) {
        if (this.selectedAddresses.indexOf(this.poBoxType) === -1) {
          this.showError = true;
          this.addressAlertKey = PoMandatoryErrorKey;
        }
      }
      //No address has been selected
      else if (this.selectedAddresses.length === 0) {
        this.showError = true;
        this.addressAlertKey = AddressMandatoryErrorKey;
      }
    }
  }

  /**
   * Method to check if form is selected and is valid
   * @param addressType
   * @param formName
   */
  private checkIfSelectedAddressIsValid(addressType, formName) {
    if (this.selectedAddresses.includes(addressType)) {
      return isAddressValid(this.parentForm.get(formName) as FormGroup) && this.showError === false;
    } else {
      return true;
    }
  }

  //Reset all forms
  resetAddressForm() {
    this.resetAddress(this.nationalAddressFormName);
    this.resetAddress(this.poAddressFormName);
    this.resetAddress(this.foreignAddressFormName);
  }

  /**
   * Method to reset the address content
   * @param addressType
   */
  private resetAddress(addressType) {
    if (this.parentForm.get(addressType)) {
      this.parentForm.get(addressType).reset();
    }
  }
  // method to emit edit values
  editEventDetails() {
    this.editEvent.emit();
  }
  /**
   * method to get the preferred address type
   * @param type
   */
  selectedAddressType(type) {
    type = this.mapAddressType(type).type;
    if (!this.selectedAddresses.includes(type)) {
      const formName = this.getFormName(type);
      if (this.parentForm.get(formName) && hasRequiredField(this.parentForm.get(formName))) {
        this.parentForm.get(formName).reset({ type: type });
        this.parentForm.get('currentMailingAddress').reset(type);
      }
      this.selectedAddresses.push(type);
    }
    this.currentMailingAddress = type;
    this.toggleMailingAddress.setValue(type);
    if (this.contactDetail) {
      this.contactDetail.currentMailingAddress = type;
    }

    this.updateAddressValidity();
    this.toggleCardView(type);
  }
  /**
   * method to get the lovlist for address type
   */
  private getAddressTypeList() {
    this.addressTypeList = new LovList([]);
    let item: Lov;
    if (this.hasNationalAddress) {
      item = new Lov();
      item.value.english = this.mapAddressType(AddressTypeEnum.NATIONAL).english;
      item.value.arabic = this.mapAddressType(AddressTypeEnum.NATIONAL).arabic;
      this.addressTypeList.items.push(item);
    }
    if (this.hasPOAddress) {
      item = new Lov();
      item.value.english = this.mapAddressType(AddressTypeEnum.POBOX).english;
      item.value.arabic = this.mapAddressType(AddressTypeEnum.POBOX).arabic;
      this.addressTypeList.items.push(item);
    }
    if (this.hasOverseasAddress) {
      item = new Lov();
      item.value.english = this.mapAddressType(AddressTypeEnum.OVERSEAS).english;
      item.value.arabic = this.mapAddressType(AddressTypeEnum.OVERSEAS).arabic;
      this.addressTypeList.items.push(item);
    }
  }
  /**
   * method to prioritize addresses
   * @param type
   */
  private toggleCardView(type: string) {
    this.addressOrder.forEach(element => {
      if (type === element.type) element.index = 0;
      else element.index = 1;
    });
    if (!this.hasNationalAddress && !this.hasPOAddress && this.hasOverseasAddress) {
      this.isGCC = false;
      this.noHeadingMargin = true;
    } else this.isGCC = this.showCard;
  }
  private getFormName(type): string {
    switch (type) {
      case AddressTypeEnum.NATIONAL:
        return this.nationalAddressFormName;
      case AddressTypeEnum.POBOX:
        return this.poAddressFormName;
      case AddressTypeEnum.OVERSEAS:
        return this.foreignAddressFormName;
    }
  }
  getAddressWaselValidity() {
    if (this.showError === false) {
      return (
        this.checkIfSelectedAddressIsValid(this.poBoxType, this.poAddressFormName) &&
        this.checkIfSelectedAddressIsValid(this.foreignType, this.foreignAddressFormName)
      );
    } else {
      return false;
    }
  }
}
