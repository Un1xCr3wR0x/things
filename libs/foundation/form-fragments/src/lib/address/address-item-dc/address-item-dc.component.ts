import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AddressTypeEnum } from '@gosi-ui/core';

export const OverseasOptionalInfoKey = 'FORM-FRAGMENTS.INFO.OVERSEAS-ADDRESS-OPTIONAL';
export const NationalOptionalInfoKey = 'FORM-FRAGMENTS.INFO.NATIONAL-ADDRESS-OPTIONAL';
export const PoOptionalInfoKey = 'FORM-FRAGMENTS.INFO.POBOX-ADDRESS-OPTIONAL';
@Component({
  selector: 'frm-address-item-dc',
  templateUrl: './address-item-dc.component.html',
  styleUrls: ['./address-item-dc.component.scss']
})
export class AddressItemDcComponent implements OnInit, OnChanges {
  /* toggleAddressSelection: FormControl; */
  readonly plusIcon = 'plus';
  readonly trashIcon = 'trash-alt';
  icon: string; // add or delete icon name

  @Input() toggleMailingAddressControl: FormControl; // To select the current address as mailing address
  @Input() heading: string; // Address Label
  @Input() id: string; //id for selecting the buttons (purely for testing purpose)
  @Input() onlyAddress = false; //If the current address is the only address
  @Input() value: string; // Value to set current mailing address
  @Input() isAddressSelected = true; //is address needs to filled or shown
  @Input() readOnly = false;
  @Input() isOptional = false;
  @Input() isWaselAddress: boolean=false;
  @Input() nationalAlwaysMandatory = false; //If national is always mandatory
  @Output() setCurrentMailingAddress: EventEmitter<boolean> = new EventEmitter();
  @Output() selectAddress: EventEmitter<boolean> = new EventEmitter();
  addressAlertKey: string;
  constructor() {}

  ngOnInit() {
    /* this.toggleAddressSelection = new FormControl(this.isAddressSelected); */
    if (this.onlyAddress === true && this.toggleMailingAddressControl) {
      this.toggleMailingAddressControl.setValue(this.value);
    }
    if (this.nationalAlwaysMandatory) {
      this.isAddressSelected = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.isAddressSelected) {
      switch (this.value) {
        case AddressTypeEnum.NATIONAL:
          this.addressAlertKey = NationalOptionalInfoKey;
          break;
        case AddressTypeEnum.POBOX:
          this.addressAlertKey = PoOptionalInfoKey;
          break;
        case AddressTypeEnum.OVERSEAS:
          this.addressAlertKey = OverseasOptionalInfoKey;
          break;
      }
      if (this.isAddressSelected === true) {
        this.icon = this.trashIcon;
      } else {
        this.icon = this.plusIcon;
      }
    }
    if (changes && changes.isOptional) {
      this.isOptional = changes.isOptional.currentValue;
    }
    if (this.nationalAlwaysMandatory) {
      this.selectAddress.emit(true);
    }
  }

  /**
   * Method to select the current address
   * @param isSelected
   */
  selectCurrentAddress() {
    if (this.icon === this.plusIcon) {
      this.selectAddress.emit(true);
    } else {
      this.selectAddress.emit(false);
    }
  }
  // method to emit values
  setCurrentMailingAddressDetails() {
    this.setCurrentMailingAddress.emit();
  }
}
