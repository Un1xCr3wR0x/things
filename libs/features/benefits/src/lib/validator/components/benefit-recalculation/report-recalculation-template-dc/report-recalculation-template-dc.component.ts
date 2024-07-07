import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, AppConstants, DocumentItem, LovList, markFormGroupTouched } from '@gosi-ui/core';
import { RaiseItsmService } from '@gosi-ui/foundation/form-fragments/lib/shared/services';
import { Location } from '@angular/common';


@Component({
  selector: 'bnt-report-recalculation-template-dc',
  templateUrl: './report-recalculation-template-dc.component.html',
  styleUrls: ['./report-recalculation-template-dc.component.scss']
})
export class ReportRecalculationTemplateDcComponent implements OnInit, OnDestroy {
  //Local Variables
  comments: FormControl = new FormControl(null, { updateOn: 'blur' });
  commentsMaxlength = AppConstants.MAXLENGTH_COMMENTS;
  dropdownList1: LovList;
  dropdownList2: LovList;
  dropdownList3: LovList;
  raiseItsmForm: FormGroup;
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
  mandatoryFieldMsg:boolean;
  //Input Variables
  @Input() heading = 'FORM-FRAGMENTS.CNF-APPROVE';
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() isCommentsMandatory: false;
  @Input() infoMessage: string;

  //Output Variables
  @Output() submitEvent: EventEmitter<null> = new EventEmitter();
  @Output() cancelEvent: EventEmitter<null> = new EventEmitter();

  /**
   * Creates an instance of ApproveTemplateDcComponent
   * @memberof  ApproveTemplateDcComponent
   *
   */
  /**
   *
   * @param fb
   * @param location
   */
  constructor(readonly fb: FormBuilder, readonly location: Location,
    readonly raiseItsmService: RaiseItsmService,
    readonly alertService: AlertService,) { }

  /**
   * This method handles the initialization tasks.
   * @memberof  ApproveTemplateDcComponent
   */
  ngOnInit() {
    this.raiseItsmForm = this.createRaiseItsmForm();
    if (this.parentForm) {
      this.parentForm.addControl('itsmForm', this.raiseItsmForm);
    }
    this.getITSMTypeList();
    if (this.isCommentsMandatory && this.parentForm) {
      this.comments = new FormControl(null, { validators: Validators.required });
      this.parentForm.get('comments')
        ? this.parentForm.removeControl('comments')
        : this.parentForm.addControl('comments', this.comments);
    } else if (this.parentForm) {
      this.parentForm.get('comments')
        ? this.parentForm.removeControl('comments')
        : this.parentForm.addControl('comments', this.comments);
    }
  }
  selectType(evnt) {
    this.alertService.clearAlerts();
    this.clearDropdowns();
    this.selectedType = evnt;
    this.getITSMSubtypeList(this.selectedType);
  }
  selectSubtype2() {
    this.alertService.clearAlerts();
    const subType2 = this.raiseItsmForm?.get('itsmsubtype2')?.value;
    this.parentForm?.get('itsmForm')?.get('itsmsubtype2')?.patchValue(subType2);
  }
  selectSubType(evnt) {
    this.alertService.clearAlerts();
    //this.clearDropdowns();
    this.raiseItsmForm.get('itsmsubtype2').reset();
    this.raiseItsmForm.updateValueAndValidity();
    this.selectedSubType = evnt;
    this.getITSMSubtype2List(this.selectedSubType);
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
          // this.raiseItsmForm.get('itsmsubtype').setValue(this.dropdownList2.items[0].value);
          this.raiseItsmForm.get('itsmsubtype').patchValue(this.dropdownList2.items[0].value);
          this.raiseItsmForm.updateValueAndValidity();
          this.getITSMSubtype2List(this.dropdownList2.items[0].value.english);
        } else if (this.dropdownList2.items.length > 1) {
          this.raiseItsmForm.get('itsmsubtype').reset();
          this.raiseItsmForm.updateValueAndValidity();
        }
      }
    })
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

  /**
   * This method handles the clearing of tasks.
   */
  ngOnDestroy() {
    this.parentForm.removeControl('comments');
  }

  // Method to emit  approve details

  submitEventDetails() {
    this.parentForm.markAllAsTouched();
    if (this.raiseItsmForm.valid && this.parentForm.get('comments').valid) {
      let newDocuments: any = [];
      this.submitEvent.emit();
      for (var i = 0; i < this.documents.length; i++) {
        if (this.documents[i].fileName != null)
          newDocuments[i] = this.documents[i];
      }
      this.raiseItsmForm.value.documents = newDocuments;
      // this.submitEvent.emit();
    }
    else {
      markFormGroupTouched(this.raiseItsmForm);
      this.mandatoryFieldMsg = true;
    }
  }

  // Method to emit cancel details

  cancelEventDetails() {
    this.cancelEvent.emit();
  }
  /**
   *  Method to create itsm form
   * */
  createRaiseItsmForm(): FormGroup {
    return this.fb.group({
      // reason: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
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
    });
  }
}
