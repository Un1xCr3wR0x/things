import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ContactDetails, markFormGroupTouched, Person } from '@gosi-ui/core';
import { ContactDcComponent } from '@gosi-ui/foundation/form-fragments';
import { ContractStatus, PersonalInformation } from '../../../shared';

@Component({
  selector: 'cnt-e-contact-details-dc',
  templateUrl: './e-contact-details-dc.component.html',
  styleUrls: ['./e-contact-details-dc.component.scss']
})
export class EContactDetailsDcComponent implements OnInit {
  @ViewChild('contactDetails', { static: false })
  contactDetailsComponent: ContactDcComponent;
  @Input() personalDetails:PersonalInformation;
  @Input() isMobileDefault= false;
  @Input() contactDetails:ContactDetails=null;
  @Input() emailMandatory = true;
  @Input() idValue = '';
  contact = new ContactDetails();
  constructor() { }

  ngOnInit(): void {
    
  }
  
  isContactValid(){
    if(this.contactDetailsComponent.contactDetailsForm.valid){
      return true;
    }
    return false;
  }
  onSave(){
    markFormGroupTouched(this.contactDetailsComponent.contactDetailsForm)
    this.contact  = this.contactDetailsComponent.contactDetailsForm.getRawValue();
    // console.log("per ", this.contact);
    return this.contact;
  }

}
