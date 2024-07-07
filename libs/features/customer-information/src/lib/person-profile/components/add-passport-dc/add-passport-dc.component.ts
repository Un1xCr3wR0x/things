import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConstants, BaseComponent, DocumentItem, TransactionReferenceData } from '@gosi-ui/core';
import { MaxLengthEnum } from '@gosi-ui/features/contributor';
import moment from 'moment-timezone';
@Component({
  selector: 'cim-add-passport-dc',
  templateUrl: './add-passport-dc.component.html',
  styleUrls: ['./add-passport-dc.component.scss']
})
export class AddPassportDcComponent extends BaseComponent implements OnInit, OnDestroy {
  addPassportForm: FormGroup;
  passportMaxLength = MaxLengthEnum.PASSPORT;
  @Input() parentForm: FormGroup;
  @Input() documents: DocumentItem[] = [];
  @Input() personId: string;
  @Input() isCsr = true;
  @Input() referenceNo: number;
  @Input() comments: TransactionReferenceData[] = [];
  @Input() isComments = true;
  @Input() uuid: string;
  //Output Variables
  @Output() uploadedEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() refresh: EventEmitter<DocumentItem> = new EventEmitter();
  @Output() delete: EventEmitter<DocumentItem> = new EventEmitter();
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;
  minDate: Date;
  currentDate: any;
  isDisabled: boolean = true;
  issueDateDisabled:boolean = true;
  transactionID: number;
  /**
   * Creates an instance of AddIqamaDcComponent
   * @memberof  AddPassportDcComponent
   *
   */
  constructor( private fb: FormBuilder) {
    super();
   }

  ngOnInit(): void {
    this.transactionID=300401
    this.currentDate = moment().subtract(1, 'day').toDate();;
        this.addPassportForm=this.fb.group({
      passportNumber: [
        null,
        {
          validators: [Validators.required, Validators.pattern('[a-zA-Z0-9]+$'), Validators.maxLength(this.passportMaxLength)],
          updateOn: 'blur'
        }
      ],
      type: ['PASSPORT', Validators.required],
      comments: [ null,
        {
          updateOn: 'blur'
        }],
      passportIssueDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      passportExpiryDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
    });
    console.log(this.addPassportForm.get('comments').value)
    if (this.parentForm) {
      this.parentForm.addControl('passportAdd', this.addPassportForm);
      if (this.parentForm.get('passportAdd').get('passportNumber').value !== null) {  
         this.addPassportForm.get('passportNumber').setValue(this.parentForm.get('passportAdd').get('passportNumber').value);
         this.addPassportForm.get('passportIssueDate').get('gregorian').setValue(this.parentForm.get('passportAdd').get('passportIssueDate').get('gregorian').value);
         this.addPassportForm.get('passportExpiryDate').get('gregorian').setValue(this.parentForm.get('passportAdd').get('passportExpiryDate').get('gregorian').value);
         this.issueDateDisabled=false;
         this.isDisabled=false;
         this.addPassportForm.get('comments').setValue(this.parentForm.get('passportAdd').get('comments').value);
        
    }

    }
  }
  // Method to emit refresh details
  refreshDocument(document: DocumentItem) {
    this.refresh.emit(document);
  } 
  onBlur(){
    
    this.parentForm.get('passportAdd').get('comments').setValue(this.addPassportForm.get('comments').value)
    this.parentForm.get('passportAdd').get('passportNumber').setValue(this.addPassportForm.get('passportNumber').value)

  }

  fileUpload() {
    this.uploadedEvent.emit();
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.parentForm.removeControl('iqamaAdd');
  }
  issueDateSelected() {
    this.minDate = moment().add(1, 'day').toDate();
    if (this.addPassportForm.value.passportIssueDate.gregorian) {
      this.parentForm.get('passportAdd').get('passportIssueDate').get('gregorian').setValue(this.addPassportForm.get('passportIssueDate').get('gregorian').value);
      this.isDisabled = false;
    }
  }
  expiryDateSelected(){
    this.parentForm.get('passportAdd').get('passportExpiryDate').get('gregorian').setValue(this.addPassportForm.get('passportExpiryDate').get('gregorian').value)

  }
  deleteUuid(document: DocumentItem){
    this.delete.emit(document);
  }
  enableIssueDateField(){
    this.issueDateDisabled = false;
  }
  enableExpiryDateField(){
    this.isDisabled = false;
  }
}
