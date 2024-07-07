import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, BPMUpdateRequest, DocumentService, LookupService, Lov, LovList, Role, RouterConstants, RouterData, RouterDataToken, WorkFlowActions, WorkflowService } from '@gosi-ui/core';
import { AddAuthorizationService, ContributorService, EngagementDetails, EstablishmentService, SearchEngagementResponse, ValidatorBaseScComponent } from '@gosi-ui/features/contributor/lib/shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';

@Component({
  selector: 'cnt-enter-rpa-validator-sc',
  templateUrl: './enter-rpa-validator-sc.component.html',
  styleUrls: ['./enter-rpa-validator-sc.component.scss']
})
export class EnterRpaValidatorScComponent extends ValidatorBaseScComponent implements OnInit {

  engagementDetails: SearchEngagementResponse;
  //Lov Lists
  rejectReasonList$: Observable<LovList>;
  returnReasonList$: Observable<LovList>;
  isFirstScheme: boolean = false;
  showReject: boolean = false;
  isValidator1: boolean = false;
  booleanList: LovList;
  isAggreed: boolean = false;
  lastSchemeForm: boolean = false;
  list: LovList = null;
  items: Lov[];
  RejectionReasonCode: any;


  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly addAuthorizationService: AddAuthorizationService,
    readonly workflowService: WorkflowService,
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly router: Router,
    private fb: FormBuilder,
    @Inject(RouterDataToken) private routerData: RouterData
  ) {
    super(
      establishmentService,
      contributorService,
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router
    );
  }

  ngOnInit(): void {
    this.canReject = false;
    this.canReturn = false;
    if(this.routerData.customActions){
      this.routerData.customActions.forEach(element => {
        if(element == 'REJECT'){
          this.canReject = true;
        }
        else if(element == 'RETURN'){
          this.canReturn = true;
        }
        else{
          this.canReject = false;
          this.canReturn = false;
        }
      });
    }
    this.comments = this.routerData.comments;
    this.getLov();

    // let id: any = this.routerData.idParams.get("aggregationNumber");
    let sin: any = this.routerData.idParams.get("socialInsuranceNo");
    let title: string = this.routerData.idParams.get("titleEnglish");
    let resource: string = this.routerData.resourceType;
    if(resource == 'Enter Rpa First Scheme'){
      this.isFirstScheme = true;
    }
    else{
      this.isFirstScheme = false;
    }
    let ref: any = this.routerData.idParams.get("referenceNo");
    this.contributorService.getRpaDetails(sin,ref).subscribe(res=>{
      this.engagementDetails = res;
    })
    if(resource == 'Enter Rpa First Scheme'){
    this.documentService.getDocuments('ENTER_RPA_FIRST_SCHEME', 'ENTER_RPA_FIRST_SCHEME', ref, ref).subscribe(res => {
        this.documents = res.filter(item => item.documentContent !== null);
      })
    }
    else if(resource == 'Enter Rpa Last Scheme'){
      this.documentService.getDocuments('ENTER_RPA_LAST_SCHEME', 'ENTER_RPA_LAST_SCHEME', ref, ref).subscribe(res => {
          this.documents = res.filter(item => item.documentContent !== null);
        })
      }

    this.booleanList = {
      items: [
        { value: { english: 'Yes', arabic: 'نعم' }, sequence: 0 },
        { value: { english: 'No', arabic: 'لا' }, sequence: 1 }
      ]
    };

    if (this.routerData.assignedRole === Role.VALIDATOR_1 || this.routerData.assignedRole === Role.VALIDATOR__1){
      this.isValidator1 = true;
    }

    if(!this.isFirstScheme &&  this.isValidator1){
      this.validatorForm =this.createYesorNoList();
      this.lastSchemeForm = true;
    }else{
      this.isAggreed = true;
    }
    
  }

  async getLov() {
    try {
       this.items = [];
      while (this.items.length === 0) {
        this.rejectReasonList$ = this.lookupService.getEstablishmentRejectReasonList();
        this.returnReasonList$ = this.lookupService.getEstablishmentRejectReasonList();

        this.rejectReasonList$.subscribe(res => {
          this.items = res.items;
          console.log(this.items, 'items');
        });

        await this.delay(1000);
      }
    } catch (error) {
      console.error('Error fetching LOV:', error);
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  createYesorNoList() {
    return this.fb.group({
      agree: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }


  selectedbooleanList(type) {
    console.log(type);
    if (type === 'Yes') {
      this.isAggreed = true;
    } else if (type === 'No') {
      this.isAggreed = false;
    }
  }

  /** Method to decline reject / return pop up. */
  decline(): void {
    this.modalRef.hide();
    this.validatorForm.markAsUntouched();
    this.validatorForm.markAsPristine();
  }

  handleEInspectionActions(key: number) {
    this.validatorForm.markAllAsTouched();
    if(this.validatorForm.invalid ){
      this.alertService.showErrorByKey('CORE.ERROR.MANDATORY-FIELDS')
    }
    else if(key == 1){
      let rejectReason = this.validatorForm.get('rejectionReason').value.english;
      let RejectionReasonCode = this.getRejectionReason(rejectReason);
      let dataSourceCompletionStatus = this.isAggreed;
      const bpmRequest = new BPMUpdateRequest();
      bpmRequest.outcome = WorkFlowActions.REJECT;
      bpmRequest.payload = this.routerData.content;
      if (bpmRequest.payload) {
        Object.keys(bpmRequest.payload).forEach(key => {
          this.setRejectionReason(bpmRequest.payload[key], RejectionReasonCode);
          this.setDataSourceCompletionStatus(bpmRequest.payload[key], dataSourceCompletionStatus);
        });
      }
      bpmRequest.commentScope = 'BPM';
      bpmRequest.isExternalComment = false;
      if (this.validatorForm.get('comments')) bpmRequest.comments = this.validatorForm.get('comments').value;
      bpmRequest.taskId = this.routerData.taskId;
      bpmRequest.user = this.routerData.assigneeId;
      this.workflowService.mergeAndUpdateTask(bpmRequest).subscribe(
        (data: any) => {
          this.alertService.showSuccessByKey('CONTRIBUTOR.SUCCESS-MESSAGES.TRANSACTION-REJECTION-MESSAGE');
          this.navigateToInbox();
        },
        err => {
          this.hideModal();
          this.alertService.showError(err.error.message);
        }
      );
    }
    else{
    this.saveWorkflow(this.setWorkflowData(this.routerData, this.getWorkflowAction(key)));
    this.hideModal();
    }
  }

  getRejectionReason(value: any): any | null {
    const foundElement = this.items.find(element => element.value.english === value || element.value.arabic === value);
    return foundElement ? foundElement.code : null;
  }

   /**Method to return to inbox */
   confirmCancel() {
    this.router.navigateByUrl(RouterConstants.ROUTE_INBOX);
  }

  checkFormValid(){
    this.validatorForm.markAllAsTouched();
    if(this.validatorForm.invalid ){
      this.alertService.showErrorByKey('CORE.ERROR.MANDATORY-FIELDS')
    }
  }

    // method to set RejectionReason code to payload for reject
    setRejectionReason(obj: any, code: any) {
      for (const key in obj) {
        if (key === 'rejectionReason') {
          obj[key] = code;
          return;
        }
        if (typeof obj[key] === 'object') {
          this.setRejectionReason(obj[key], code);
        }
      }
    }

    // method to set dataSourceCompletionStatus boolean to payload for reject
    setDataSourceCompletionStatus(obj: any, code: any) {
      for (const key in obj) {
        if (key === 'dataSourceCompletionStatus') {
          obj[key] = code;
          return;
        }
        if (typeof obj[key] === 'object') {
          this.setDataSourceCompletionStatus(obj[key], code);
        }
      }
    }


}
