import { Component, Input, OnInit,SimpleChanges,TemplateRef,Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RejectReasonsEnum } from '../../../shared/enums/reject-reasons';
import {
  AlertService,
  LookupService,
  Lov,
  LovList,
  markFormGroupTouched,
} from '@gosi-ui/core';
import { ContractAuthenticationService } from '../../../shared/services';
import { ActivatedRoute ,Router} from '@angular/router';
import { ContractAuthConstant, ContributorRouteConstants } from '../../../shared/constants';
import { Observable } from 'rxjs';
import { PendingEngagement } from '../../../shared/models/pending-engagement';
import moment from 'moment';
import { dayDiff } from '@gosi-ui/core';
import { ContributorBPMRequest } from '../../../shared';


@Component({
  selector: 'cnt-establishment-preview-dc',
  templateUrl: './establishment-preview-dc.component.html',
  styleUrls: ['./establishment-preview-dc.component.scss']
})
export class EstablishmentPreviewDcComponent implements OnInit {

  // input variables
  @Input() pendingEngagement:PendingEngagement;
  @Input() eng:boolean;
  @Input() isIndividualApp:boolean;
  @Input() rejectReasonList$: Observable<LovList>;
  @Input() acceptOrRejectFlag:boolean;

  //output variables
  @Output() reject: EventEmitter<object> = new EventEmitter();
  @Output() approve: EventEmitter<object> = new EventEmitter();
  @Output() engReject: EventEmitter<object> = new EventEmitter();
  @Output() engApprove: EventEmitter<object> = new EventEmitter();




  // local variables
  declarationForm:FormGroup;
  modalRef: BsModalRef;
  rejectDetailsForm: FormGroup;
  otherReasonFlag = false;
  referenceNo: string;
  identifier: number;
  engagementId:number;
  currentDate:Date;
  daysCount:number;
  days:string;
  autoCancellationDate:Date;
  showCount:boolean=false;

  value="value";
  a="231214123123123"
  constructor(
    readonly lookupService: LookupService,
    readonly fb: FormBuilder,
    readonly modalService: BsModalService,
    readonly contractService: ContractAuthenticationService,
    readonly activatedRoute: ActivatedRoute,
    readonly alertService: AlertService,
    readonly router: Router
  ) { }

  ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
      this.referenceNo = params.reference_number;
    });
    this.identifier = this.contractService.identifier;
    this.declarationForm=this.createCommentsForm();
    if (this.referenceNo && this.identifier || this.isIndividualApp) {
      this.rejectDetailsForm = this.createReceiptForm();
      this.getRejectReasonList();
    }
    else{
      this.navigateToHome()
    }


  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes.pendingEngagement && changes.pendingEngagement.currentValue){
      this.autoCancellationDate= moment(this.pendingEngagement.engagementExpiryDate.gregorian).toDate();
      this.currentDate = moment(new Date()).toDate()
      this.daysCount=dayDiff(this.currentDate,this.autoCancellationDate);
      this.dayCount(this.daysCount);
     //console.log(this.currentDate,this.autoCancellationDate,'dates');
      //console.log(this.daysCount,'days');


    }
  }

  dayCount(daysCount){
     if(daysCount===1){
       this.days='CONTRIBUTOR.ONE-DAY';

     }
     else if(daysCount===2){
      this.days='CONTRIBUTOR.TWO-DAY';
     }
     else{
      this.days='CONTRIBUTOR.MORE-DAY';
      this.showCount=true;
     }
  }
  /** Method to create reject form. */
  createReceiptForm(): FormGroup {
    return this.fb.group({
      reasonForReject: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      rejectedMessage: [null]
    });
  }

  /** Method to get other reason. */
  otherValueSelect() {
    const otherField = this.rejectDetailsForm.get('reasonForReject').get('english');
    const othersReason = this.rejectDetailsForm.get('rejectedMessage');
    if (otherField.value === 'Other Reasons') {
      this.otherReasonFlag = true;
      othersReason.setValidators([Validators.required, Validators.maxLength(1000)]);
    } else {
      this.otherReasonFlag = false;
      othersReason.setValue(null);
      othersReason.setValidators(null);
    }
  }

   /** Method to get contract rejection reason list. */
   getRejectReasonList() {
     this.rejectReasonList$ = this.lookupService.getEngReasonForRejection(this.contractService.getNoAuthHeaders());
  }

  /** Method to get rejecction reason. */
  getRejectedReason() {
    const value = this.rejectDetailsForm.get('reasonForReject').get('english').value;
    let reason: string;
    if (value) {
      switch (value.toUpperCase()) {
        case 'INVALID WAGE DETIALS':
          reason = RejectReasonsEnum.INVALID_WAGE_DETAILS;
          break;
        case 'INVALID STARTING OR ENDING CONTRACT DATE':
          reason = RejectReasonsEnum.INVALID_CONTRACT_DATE;
          break;
        case 'INCORRECT LABOR RELATIONSHIP':
          reason = RejectReasonsEnum.INCORRECT_LABOR_RELATIONSHIP;
          break;
        case 'OTHER REASONS':
          reason = RejectReasonsEnum.OTHER_REASONS;
          break;
        case 'INVALID OCCUPATION':
          reason = RejectReasonsEnum.INVALID_OCCUPATION;
          break;
      }
    }
    return reason;
  }

  /** Method to reject engagement. */
  confirmRejectPreview() {
    if(this.isIndividualApp){
        this.hideModal();
        this.reject.emit();
    }
    else{
      const rejectedReason = this.getRejectedReason();
      markFormGroupTouched(this.rejectDetailsForm);
      const otherField = this.rejectDetailsForm.get('reasonForReject').get('english');
      if (otherField.value !== 'Other Reasons') {
        this.rejectDetailsForm.get('rejectedMessage').setValue(null);
        this.rejectDetailsForm.get('rejectedMessage').setValidators(null);
      }
      if (this.rejectDetailsForm.valid) {
        const rejectContract = {
          rejectedMessage: this.rejectDetailsForm.get('rejectedMessage').value,
          rejectedReason: rejectedReason
        };
      this.hideModal();
      this.engReject.emit(rejectContract);
      }
   }
  }

  createCommentsForm(): FormGroup {
    return this.fb.group({
      checkBoxFlag: [, { validators:  Validators.requiredTrue}]
    });
  }
  onApprove(){}
  onReject(){}
  onCancel(){}
  /** This method is to show the modal reference.*/
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.declarationForm.markAllAsTouched();
    if(this.declarationForm.valid){
      this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
    }
    else{
      this.alertService.showErrorByKey('CORE.ERROR.MANDATORY-FIELDS');
    }

  }

  RejectModal(templateRef: TemplateRef<HTMLElement>){
    this.alertService.clearAlerts();
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
  }

   /** This method is to accept contract. */
   confirmAcceptPreview() {
    if(this.isIndividualApp){
       this.hideModal();
       this.approve.emit();
    }
    else{
      this.hideModal();
      this.alertService.clearAlerts();
      this.engApprove.emit();
    }
  }

  /** This method is to hide the modal reference. */
  hideModal() {
    this.modalRef.hide();
    //reset form
    this.rejectDetailsForm.reset();
    //hide text area
    this.otherReasonFlag = false;
  }

  navigateToHome() {
    this.router.navigate([ContributorRouteConstants.ROUTE_CONTRACT_APP_LOGIN], {
      queryParams: {
        reference_number: this.referenceNo,
        type:"ENG_AUTH"
      }
    });
  }

}
