import { Location } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, DocumentItem, Lov, LovList, markFormGroupTouched, Transaction } from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RaiseItsmService } from '../../shared/services';
import { ItsmSubmitData } from '../../shared/models/itsm-submit';
import { Observable } from 'rxjs-compat';
import en from 'libs/foundation/form-fragments/src/assets/i18n/form-fragments/en.json';
import ar from 'libs/foundation/form-fragments/src/assets/i18n/form-fragments/ar.json';
@Component({
  selector: 'frm-raise-itsm-dc',
  templateUrl: './raise-itsm-dc.component.html',
  styleUrls: ['./raise-itsm-dc.component.scss']
})
export class RaiseItsmDcComponent implements OnInit {
  /**
   * local variables
   */
  en: any = en;
  ar: any = ar;
  itsmLowSeverityTypeEn = en['ITSM-LOW-SEVERITY'];
  itsmLowSeverityTypeAr = ar['ITSM-LOW-SEVERITY'];
  itsmOptionNoEn = en['ITSM-OPTION-NO'];
  itsmOptionNoAr = ar['ITSM-OPTION-NO'];
  raiseItsmForm: FormGroup;
  modalRef: BsModalRef;
  referenceNo: number;
  @Input() transactionSummary: Transaction;
  @Input() parentForm: FormGroup;
  dropdownList1: LovList;
  dropdownList2: LovList;
  dropdownList3: LovList;
  severityList: LovList;
  paymentStopList: LovList = {
    items: [
      {
        value: { english: 'Yes', arabic: 'نعم' },
        sequence: 1
      },
      {
        value: { english: 'No', arabic: 'لا' },
        sequence: 2
      }]
  };
  selectedType: any;
  selectedSubType: any;
  addCount: number;
  documents: DocumentItem[] = [
    {
      show: true,
      identifier: undefined,
      documentContent: undefined,
      name: {
        arabic: 'إرفاق مستند',
        english: 'Upload Document'
      },
      reuse: false,
      referenceNo: 123456,
      sequenceNumber: 1,
      documentType: undefined,
      uuid: 'string',
      required: false,
      started: true,
      valid: true,
      contentId: 'string',
      fileName: undefined,
      uploaded: false,
      transactionId: '',
      isUploading: false,
      size: 'string',
      isContentOpen: false,
      percentageLoaded: 100,
      icon: undefined,
      businessKey: 123456,
      uploadFailed: false,
      isScanning: false,
      canDelete: true,
      fromJsonToObject: () => {
        return undefined;
      },
      transactionReferenceIds: [],
      documentClassification: undefined,
      userAccessList: []
    }
  ];
  itsmSubmitDetails: ItsmSubmitData = new ItsmSubmitData();
  isErrorMessageEnabled$: Observable<string>;

  @Output() confirm: EventEmitter<null> = new EventEmitter();
  @Output() error: EventEmitter<null> = new EventEmitter();
  @Output() show: EventEmitter<HTMLElement> = new EventEmitter();
  @Output() hide: EventEmitter<null> = new EventEmitter();
  /**
   *
   * @param fb
   * @param location
   */
  constructor(readonly fb: FormBuilder, readonly location: Location,
    readonly raiseItsmService: RaiseItsmService,
    readonly alertService: AlertService,) { }

  ngOnInit(): void {
    this.raiseItsmForm = this.createRaiseItsmForm();
    if (this.parentForm) {
      this.parentForm.addControl('itsmForm', this.raiseItsmForm);
    }
    this.getITSMTypeList();
    this.getITSMSeverityList();

    this.isErrorMessageEnabled$ = this.raiseItsmForm.get('errorMessage').get('english').valueChanges;
    this.isErrorMessageEnabled$.subscribe(value => {
     const errorMessageTextControl = this.raiseItsmForm.get('errorMessageText');
     if(value==="Yes"){
      errorMessageTextControl.setValidators([Validators.required,Validators.maxLength(1200)]);
     }else{
      errorMessageTextControl.clearValidators();
      errorMessageTextControl.setValue(null);
     }
     errorMessageTextControl.updateValueAndValidity();
    });
  }
  /** This method is to hide the modal reference. */
  hideModal() {
    this.hidePopup();
  }
  /** Method to show the popUp. */
  showModal(template) {
    this.show.emit(template);
  }
  hidePopup() {
    this.hide.emit();
  }
  /**
   *  Method to create itsm form
   * */
  createRaiseItsmForm(): FormGroup {
    return this.fb.group({
      // reason: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      note: [null, { validators: Validators.compose([Validators.required, Validators.maxLength(1200)]) }],
      itsmtype: this.fb.group({
        english: [null, Validators.compose([Validators.required])],
        arabic: [null]
      }),
      itsmsubtype: this.fb.group({
        english: [null, Validators.compose([Validators.required])],
        arabic: [null]
      }),
      itsmsubtype2: this.fb.group({
        english: [null, Validators.compose([Validators.required])],
        arabic: [null]
      }),
      documents: [null],
      paymentStop : this.fb.group({
        english: ['No', { validators: Validators.required }],
        arabic: ['لا']
      }),
      financialImpact : this.fb.group({
        english: ['No', { validators: Validators.required }],
        arabic: ['لا']
      }),
      itsmSeverity: this.fb.group({
        english: [this.itsmLowSeverityTypeEn, Validators.compose([Validators.required])],
        arabic: [this.itsmLowSeverityTypeAr]
      }),
      requiredAction: [null, { validators: Validators.compose([Validators.required, Validators.maxLength(1200)]) }],
      errorMessage : this.fb.group({
        english: [this.itsmOptionNoEn, { validators: Validators.required }],
        arabic: [this.itsmOptionNoAr]
      }),
      errorMessageText: [null],
    });
  }
  /**
   * This method is to submit itsm value
   * */

  submitItsm(template) {
    if (this.raiseItsmForm.valid) {
      let newDocuments: any = [];
      this.show.emit(template);
      for (var i = 0; i < this.documents.length; i++) {
        if (this.documents[i].fileName != null)
          newDocuments[i] = this.documents[i];
      }
      this.raiseItsmForm.value.documents = newDocuments;
    }
    else {
      markFormGroupTouched(this.raiseItsmForm);
      this.error.emit();
    }
  }

  /**
   * This method is to confirm submission of itsm value
   * */

  confirmEvent() {
    this.confirm.emit();
  }
  /** Method to decline the popUp. */
  decline() {
    this.hidePopup();
  }

  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.hidePopup();
    this.location.back();
  }

  selectType(evnt) {
    this.alertService.clearAlerts();
    this.clearDropdowns();
    this.selectedType = evnt;
    this.getITSMSubtypeList(this.selectedType);
  }

  selectSubType(evnt) {
    this.alertService.clearAlerts();
    //this.clearDropdowns();
    this.raiseItsmForm.get('itsmsubtype2').reset();
    this.raiseItsmForm.updateValueAndValidity();
    this.selectedSubType = evnt;
    this.getITSMSubtype2List(this.selectedSubType);
  }
  selectSeverityType() {
    this.alertService.clearAlerts();
  }

  onClick() {
    this.alertService.clearAlerts();
  }

  selectSubtype2() {
    this.alertService.clearAlerts();
  }

  getITSMTypeList() {
    this.raiseItsmService.getITSMTypeList().subscribe(res => {
      if (res) {
        let newList: any = [];
        for (var i = 0; i < res.length; i++) {
          newList.push({
            value: res[i].value,
            sequence: res[i].sequence
          })
        }
        this.dropdownList1 = new LovList(newList);
      }
    })
  }
  
  getITSMSeverityList() {
    this.raiseItsmService.getITSMSeverityList().subscribe(res => {
      if (res) {
        let newList: any = [];
        for (var i = 0; i < res.length; i++) {
          newList.push({
            value: res[i].value,
            sequence: res[i].sequence
          })
        }
        this.severityList = new LovList(newList);
      }
    })
  }

  getITSMSubtypeList(subtype) {
    this.raiseItsmService.getITSMSubtypeList(subtype).subscribe(res => {
      if (res) {
        let newList: any = [];
        for (var i = 0; i < res.length; i++) {
          newList.push({
            value: res[i].value,
            sequence: res[i].sequence
          })
        }
        this.dropdownList2 = new LovList(newList);
        
        if (this.dropdownList2.items.length == 1) {
          this.raiseItsmForm.get('itsmsubtype').setValue(this.dropdownList2.items[0].value);
          this.raiseItsmForm.updateValueAndValidity();
          this.getITSMSubtype2List(this.dropdownList2.items[0].value.english);
        } else if (this.dropdownList2.items.length > 1) {
          this.raiseItsmForm.get('itsmsubtype').reset();
          this.raiseItsmForm.updateValueAndValidity();
        }
      }
    })
  }

  getITSMSubtype2List(subtype) {
    this.raiseItsmService.getITSMSubtype2List(subtype).subscribe(res => {
      if (res) {
        let newList: any = [];
        for (var i = 0; i < res.length; i++) {
          newList.push({
            value: res[i].value,
            sequence: res[i].sequence
          })
        }
        this.dropdownList3 = new LovList(newList);
      }
    })
  }

  addAnotherDocument() {
    this.addCount = this.documents.length;
    if (this.addCount < 3) {
      this.documents.push(
        {
          show: true,
          identifier: undefined,
          documentContent: undefined,
          name: {
            arabic: 'إرفاق مستند',
            english: 'Upload Document'
          },
          reuse: false,
          referenceNo: 123456,
          sequenceNumber: 1,
          documentType: undefined,
          uuid: 'string',
          required: false,
          started: true,
          valid: true,
          contentId: 'string',
          fileName: undefined,
          uploaded: true,
          transactionId: '',
          isUploading: false,
          size: 'string',
          isContentOpen: false,
          percentageLoaded: 100,
          icon: undefined,
          businessKey: 123456,
          uploadFailed: false,
          isScanning: false,
          canDelete: true,
          fromJsonToObject: () => {
            return undefined;
          },
          transactionReferenceIds: [],
          documentClassification: undefined,
          userAccessList: []
        }
      );
    }
  }

  clearDropdowns() {
    this.dropdownList2 = undefined;
    this.dropdownList3 = undefined;
    this.raiseItsmForm.value.itsmsubtype.english = null;
    this.raiseItsmForm.value.itsmsubtype.arabic = null;
    this.raiseItsmForm.value.itsmsubtype2.english = null;
    this.raiseItsmForm.value.itsmsubtype2.arabic = null;
    this.raiseItsmForm.updateValueAndValidity();
    this.raiseItsmForm.get('itsmsubtype2').reset();
    this.raiseItsmForm.updateValueAndValidity();
  }
}
