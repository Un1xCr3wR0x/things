import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressDetails, AddressTypeEnum, LovList, Person } from '@gosi-ui/core';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments';
import { add } from 'ngx-bootstrap/chronos';
import { Observable } from 'rxjs';
import { PersonalInformation } from '../../../shared';

@Component({
  selector: 'cnt-e-address-details-dc',
  templateUrl: './e-address-details-dc.component.html',
  styleUrls: ['./e-address-details-dc.component.scss']
})
export class EAddressDetailsDcComponent implements OnInit, OnChanges {

  
  /** Template and directive references */
  @ViewChild('addressDetails', { static: false })
  addressDetailsComponent: AddressDcComponent;
  
  @Input() personalDetails:PersonalInformation;
  @Input() cityList:Observable<LovList>;
  @Input() nationalityList:Observable<LovList>;

  contactDetailParentForm = new FormGroup({});
  addresses:AddressDetails[]=[];
  currentMailingAddress: string = AddressTypeEnum.NATIONAL;
  addressDetails: AddressDetails[];
  mailingAddress:string;
  
  constructor() { }

  ngOnInit(): void {
    this.personalDetails.contactDetail.addresses
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.personalDetails && changes.personalDetails.currentValue){
        this.currentMailingAddress = this.personalDetails.contactDetail.currentMailingAddress;
    }
  }

  onSave(){
  this.addressDetails = this.addressDetailsComponent.getAddressDetails();
  return this.addressDetails;
  }

  getmailingAddress(){
  this.mailingAddress = this.addressDetailsComponent.currentMailingAddress;
  //console.log("mailing Address",this.mailingAddress);
  return this.mailingAddress
  }

  isAddressValid(){
    if( this.addressDetailsComponent.getAddressValidity()){
      return true;
    }
    return false;
  }

  
}
