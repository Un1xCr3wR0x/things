// import { Input } from '@angular/core';
import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
// import { Establishment } from '@gosi-ui/features/contributor';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BilingualText, IdentityTypeEnum, markFormGroupTouched} from '@gosi-ui/core';
import {Establishment} from '../../../../lib/shared/models';
import { EEngagement } from '../../../shared/models/e-engagement';


@Component({
  selector: 'cnt-e-establishment-details-dc',
  templateUrl: './e-establishment-details-dc.component.html',
  styleUrls: ['./e-establishment-details-dc.component.scss']
})
export class EEstablishmentDetailsDcComponent implements OnInit, OnChanges {

   /*local varaibles*/ 
   actualEstablishment: BilingualText = new BilingualText();
   EstaDetailsForm: FormGroup;
   eestablishmentdetails:Establishment;
   isEditMode: boolean = true;
  // @Input() establishment: Establishment;
  // @Input() registrationNo: number;
  @Input() engDetails: EEngagement;
  @Input() inEditMode: boolean;

  constructor(private fb: FormBuilder) { }
  
  ngOnInit(): void {
    this.EstaDetailsForm = this.CreateDetailsForm(); 
    //console.log(this.inEditMode);
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.engDetails && changes.engDetails.currentValue){
      if(this.isEditMode) {
        this.bindDataToForm();
        //console.log('estnameOnInIt', this.engDetails.actualEstablishment.arabic);
      }
    }
  }

  
    /** Method to create engagement details form. */
CreateDetailsForm( ) {
  return this.fb.group({
    establishmentName: this.fb.group({
      english: [null, {updateOn: 'blur' }],
      arabic: [null]
    }),
    commercialRegistrationNumber: this.fb.group({
      id: ['',],
     
    }),
    unifiedNationalNumber:this.fb.group({
      idType: [IdentityTypeEnum.NATIONALID],
      id: ['', ],
      
    }),
    ownerId:this.fb.group({
      id: ['', ],
    
    }),
    hrsdEstablishmentId: this.fb.group({
       id: ['', ],
      
    }),
    gosiRegistrationNumber : this.fb.group({
      id: ['', ],
      
    }),
  });
}

/**Getters for form control */
private get establishmentNameFormControl(): FormControl {
  return this.EstaDetailsForm.get('establishmentName.english') as FormControl;
}
private get commercialRegistrationNumberFormControl(): FormControl {
  return this.EstaDetailsForm.get('commercialRegistrationNumber.id') as FormControl;
}
private get establishmentUnifiedNumberFormControl(): FormControl {
  return this.EstaDetailsForm.get('unifiedNationalNumber.id') as FormControl;
}
private get establishmentOwnerIDFormControl(): FormControl {
  return this.EstaDetailsForm.get('ownerId.id') as FormControl;
}
private get hrsdEstablishmentIdFormControl(): FormControl {
  return this.EstaDetailsForm.get('hrsdEstablishmentId.id') as FormControl;
}
private get gosiRegistrationNumberFormControl(): FormControl {
  return this.EstaDetailsForm.get('gosiRegistrationNumber.id') as FormControl;
}

  bindDataToForm(){
    Object.keys(this.engDetails).forEach(name => {
      if (this.EstaDetailsForm.get(name)) {
        if (name === 'establishmentName') {
          if (this.engDetails.actualEstablishment.english) {
            this.actualEstablishment = this.engDetails.actualEstablishment;
            this.establishmentNameFormControl.setValue(this.engDetails.actualEstablishment.english, { emitEvent: false });
          }
          else
          this.establishmentNameFormControl.setValue(this.engDetails.actualEstablishment.arabic, { emitEvent: false });
        }
        else if (name === 'gosiRegistrationNumber') {
          this.gosiRegistrationNumberFormControl.setValue(this.engDetails.gosiRegistrationNumber, { emitEvent: false });
        }
        else if (name === 'hrsdEstablishmentId') {
          this.hrsdEstablishmentIdFormControl.setValue(this.engDetails.hrsdEstablishmentId, { emitEvent: false });
        }
        else if (name === 'ownerId') {
          this.establishmentOwnerIDFormControl.setValue(this.engDetails.ownerId, { emitEvent: false });
        }
        else if (name === 'unifiedNationalNumber') {
          this.establishmentUnifiedNumberFormControl.setValue(this.engDetails.unifiedNationalNumber, { emitEvent: false });
        } 
        else if (name === 'commercialRegistrationNumber') {
          this.commercialRegistrationNumberFormControl.setValue(this.engDetails.commercialRegistrationNumber, { emitEvent: false });
        }
      }
    });
  }

onSave(){
  markFormGroupTouched(this.EstaDetailsForm);
  this.eestablishmentdetails  = this.EstaDetailsForm.getRawValue();
  // console.log("per ", this.contact);
  return this.eestablishmentdetails;
}


/** Method to save cancellation details. */
saveCancellationDetails() {

  this.eestablishmentdetails = this.EstaDetailsForm.getRawValue();
  markFormGroupTouched(this.EstaDetailsForm);
  // console.log("personal Details",this.eestablishmentdetails);
  // console.log(this.EstaDetailsForm.value.EstablishmentUnifiedNumber);
  // console.log(this.EstaDetailsForm.value.CommercialRegistrationNumber);
  // console.log(this.EstaDetailsForm.value.Name);
}

}
