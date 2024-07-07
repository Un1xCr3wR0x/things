import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, greaterThanLessThanValidator, greaterThanValidator } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Repatriation, RepatriationDto } from '../../models/dead-body-repatriation';
import { ClaimWrapper, ClaimsWrapper } from '../../models';

@Component({
  selector: 'oh-deadbody-repatriation-dc',
  templateUrl: './deadbody-repatriation-dc.component.html',
  styleUrls: ['./deadbody-repatriation-dc.component.scss']
})
export class DeadbodyRepatriationDcComponent implements OnInit, OnChanges {

  repatriationForm: FormGroup;
  modalRef: BsModalRef;
  repatriationExpenses: Repatriation = new Repatriation();
  hasChanged: boolean = false;
  @Input() allowanceDetailsWrapper: ClaimWrapper;
  @Input() modifiedRepatriation: RepatriationDto;
  @Output() submit: EventEmitter<Repatriation> = new EventEmitter(); //remove
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();

  constructor(public fb: FormBuilder, private modalService: BsModalService, 
    private alertService: AlertService) {}

  ngOnInit(): void {
    this.repatriationForm = this.createRepatriationForm();
  //   this.repatriationForm?.get('shippingAmount')
  //       ?.setValidators([
  //         Validators.required,
  //         greaterThanLessThanValidator(null, 0)
  //       ]);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes && changes.modifiedRepatriation && changes.modifiedRepatriation.currentValue) {
      this.modifiedRepatriation = changes.modifiedRepatriation.currentValue;
      this.setValues();
    }  
  }
  createRepatriationForm(): FormGroup {
    return this.fb.group({
      shippingAmount: [parseFloat('0.00').toFixed(2), {validators: Validators.compose([Validators.required, Validators.min(0), greaterThanValidator(0)])}],
      bodyPreparationAmount: [parseFloat('0.00').toFixed(2), {validators: Validators.compose([Validators.required, Validators.min(0), greaterThanValidator(0)])}],
      documentationExpenses: [parseFloat('0.00').toFixed(2)],
      embassyVerificationAmount: [parseFloat('0.00').toFixed(2)],
      airportConveyanceAmount: [parseFloat('0.00').toFixed(2)],
      translationAmount: [parseFloat('0.00').toFixed(2)],
      familyNotificationAmount: [parseFloat('0.00').toFixed(2)],
      airportServicesExpense: [parseFloat('0.00').toFixed(2)]
    })
  }

  saveAndNext() {
    this.repatriationForm.markAllAsTouched();
    if(this.repatriationForm.valid) {
      this.repatriationExpenses.shippingAmount = parseInt(this.repatriationForm.get('shippingAmount').value);
      this.repatriationExpenses.bodyPrepAmount = parseInt(this.repatriationForm.get('bodyPreparationAmount').value);
      this.repatriationExpenses.docCopyAmount = parseInt(this.repatriationForm.get('documentationExpenses').value);
      this.repatriationExpenses.embVerfAmount = parseInt(this.repatriationForm.get('embassyVerificationAmount').value);
      this.repatriationExpenses.airportConvAmount = parseInt(this.repatriationForm.get('airportConveyanceAmount').value);
      this.repatriationExpenses.translationAmount = parseInt(this.repatriationForm.get('translationAmount').value);
      this.repatriationExpenses.familyNotiExpenseAmount = parseInt(this.repatriationForm.get('familyNotificationAmount').value);
      this.repatriationExpenses.airportServicesExpenseAmount = parseInt(this.repatriationForm.get('airportServicesExpense').value);
      this.submit.emit(this.repatriationExpenses);
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
 

  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  confirmCancel() {
    this.modalRef.hide();
    this.cancel.emit(this.hasChanged);
  }
  decline() {
    this.modalRef.hide();
  }

  setValues() {
    if(this.modifiedRepatriation.modifiedDeadBodyRepatriationDto.length > 0) {
      this.modifiedRepatriation.modifiedDeadBodyRepatriationDto.forEach(element => {
        if(element.claimType.english === 'Airport Conveyance Expense'){
          this.repatriationForm.get('airportConveyanceAmount').setValue(element.amount);
        } else if(element.claimType.english === 'Translation Expense'){
          this.repatriationForm.get('translationAmount').setValue(element.amount);
        } else if(element.claimType.english === 'Family Notification Expense'){
          this.repatriationForm.get('familyNotificationAmount').setValue(element.amount);
        } else if(element.claimType.english === 'Body Preparation Expense'){
          this.repatriationForm.get('bodyPreparationAmount').setValue(element.amount);
        } else if(element.claimType.english === 'Airport Services Expense (Radiography - handling services …)'){
          this.repatriationForm.get('airportServicesExpense').setValue(element.amount);
        } else if(element.claimType.english === 'Shipping (body transportation) Expense'){
          this.repatriationForm.get('shippingAmount').setValue(element.amount);
        } else if(element.claimType.english === 'Embassy Verification Expense'){
          this.repatriationForm.get('embassyVerificationAmount').setValue(element.amount);
        } else if(element.claimType.english === 'Document Copy Expense'){
          this.repatriationForm.get('documentationExpenses').setValue(element.amount);
        }
        
      });
    } else {
      this.modifiedRepatriation.deadBodyRepatriationDto.forEach(element => {
        if(element.claimType.english === 'Airport Conveyance Expense'){
          this.repatriationForm.get('airportConveyanceAmount').setValue(element.amount);
        } else if(element.claimType.english === 'Translation Expense'){
          this.repatriationForm.get('translationAmount').setValue(element.amount);
        } else if(element.claimType.english === 'Family Notification Expense'){
          this.repatriationForm.get('familyNotificationAmount').setValue(element.amount);
        } else if(element.claimType.english === 'Body Preparation Expense'){
          this.repatriationForm.get('bodyPreparationAmount').setValue(element.amount);
        } else if(element.claimType.english === 'Airport Services Expense (Radiography - handling services …)'){
          this.repatriationForm.get('airportServicesExpense').setValue(element.amount);
        } else if(element.claimType.english === 'Shipping (body transportation) Expense'){
          this.repatriationForm.get('shippingAmount').setValue(element.amount);
        } else if(element.claimType.english === 'Embassy Verification Expense'){
          this.repatriationForm.get('embassyVerificationAmount').setValue(element.amount);
        } else if(element.claimType.english === 'Document Copy Expense'){
          this.repatriationForm.get('documentationExpenses').setValue(element.amount);
        }
        
      });
    }
  }

}
