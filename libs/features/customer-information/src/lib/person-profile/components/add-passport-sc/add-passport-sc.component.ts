import { Component, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ChangePersonService, ManagePersonConstants, ManagePersonRoutingService, ManagePersonScBaseComponent, ManagePersonService, PersonConstants } from '../../../shared';
import { AlertService, ApplicationTypeToken, Contributor, CoreContributorService, DocumentItem, DocumentService, IdentityTypeEnum, PayloadKeyEnum, Role, RouterData, RouterDataToken, TransactionService, UuidGeneratorService, WorkflowService, startOfDay } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MaxLengthEnum } from '@gosi-ui/features/contributor';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'cim-add-passport-sc',
  templateUrl: './add-passport-sc.component.html',
  styleUrls: ['./add-passport-sc.component.scss']
})
export class AddPassportScComponent extends ManagePersonScBaseComponent implements OnInit, OnDestroy {
  documents: DocumentItem[] = [];
  personId;
  contributor: Contributor;
  bsModalRef: BsModalRef;
  referenceNo: number;
  addPassportForm: FormGroup;
  passportMaxLength = MaxLengthEnum.PASSPORT;
  constructor(
    public contributorService: CoreContributorService,
    public manageService: ManagePersonService,
    public changePersonService: ChangePersonService,
    readonly alertService: AlertService,
    public documentService: DocumentService,
    @Inject(RouterDataToken)
    readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService,
    readonly bsModalService: BsModalService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    public managePersonRoutingService: ManagePersonRoutingService,
    readonly uuidService: UuidGeneratorService,
    readonly location: Location,
    readonly transactionService: TransactionService,
    readonly router: Router,
    private fb: FormBuilder
  ) {
    super(
      contributorService,
      manageService,
      changePersonService,
      alertService,
      documentService,
      routerDataToken,
      workflowService,
      appToken,
      managePersonRoutingService,
      uuidService,
      location
    );
  }

  ngOnInit(): void {
    this.getComments(this.routerDataToken);
    this.addPassportForm = this.fb.group({
      passportNumber: [
        null,
        {
          validators: [Validators.required, Validators.pattern('[a-zA-Z0-9]+$'), Validators.maxLength(this.passportMaxLength)],
          updateOn: 'blur'
        }
      ],
      type: ['PASSPORT', Validators.required],
      comments: [null],
      passportIssueDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      passportExpiryDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
    });
    this.initialiseTransaction(false, 'isAddPassport')
      .pipe(
        tap(() => {
          // if (!this.iqamaReferenceNo)
          //   this.iqamaReferenceNo = this.routerDataToken.idParams.get(PayloadKeyEnum.REFERENCE_NO);
          if (this.manageService.isEdit && this.routerDataToken) {
            this.transactionService
              .getTransaction(this.passportReferenceNo)
              .pipe(
                tap(res => {
                  this.routerDataToken.taskId = res?.taskId;
                  this.routerDataToken.assigneeId = res?.assignedTo;
                  this.routerDataToken.transactionId = this.passportReferenceNo;
                }),
                catchError(err => {
                  this.showErrorMessage(err);
                  return of(null);
                })
              )
              .subscribe();
          }
        })
      )
      .subscribe();
    if (this.passportForm && (this.editTransaction || this.manageService.isEdit)) {
     this.passportForm.addControl('passportAdd', this.addPassportForm);
    }
  }
  savePassport() {
    this.passportForm.get('passportAdd').markAllAsTouched();
    this.passportForm.get('passportAdd').updateValueAndValidity()
    if (this.passportForm.get('passportAdd')) {
      this.isDocumentUploaded = true;
      this.setNavigationIndicator();
      if (
        this.routerDataToken.taskId !== null &&
        (this.routerDataToken.assignedRole === Role.VALIDATOR_1 ||
          this.routerDataToken.assignedRole === Role.EST_ADMIN_OH)
      ) {
        this.referenceNo = +this.routerDataToken.idParams.get(PayloadKeyEnum.REFERENCE_NO);
      } else {
        this.referenceNo = null;
      }
      this.isDocumentUploaded = this.documentService.checkMandatoryDocuments(this.passportDocuments);
      if (this.passportForm.get('passportAdd').valid && this.isDocumentUploaded) {
         this.manageService
           .patchIdentityDetails(
             PersonConstants.PATCH_IDENTITY_ID,

             {
               comments: this.passportForm.get('passportAdd').get('comments').value,
               navigationInd: this.revertTransaction.navigationInd,
               personIdentity: {
                 idType: IdentityTypeEnum.PASSPORT,
                 passportNo: this.passportForm.value.passportAdd.passportNumber,
                 expiryDate: {
                   hijiri: null,
                   gregorian: startOfDay(this.passportForm.value.passportAdd.passportExpiryDate.gregorian)
                 },
                 issueDate: {
                   hijiri: null,
                   gregorian: startOfDay(this.passportForm.value.passportAdd.passportIssueDate.gregorian)
                 }

               },
               referenceNo: 0,
               transactionTraceId: this.referenceNo,
               uuid: this.uuid
             },
             this.socialInsuranceNo
           )
           .subscribe(
             res => {
               if (res) {
                 this.currentTab = 1;
                 this.alertService.clearAllErrorAlerts();
                 this.triggerFeedbackOnSave(
                   res,
                   this.socialInsuranceNo,
                   this.passportForm.get('passportAdd').get('comments').value
                 );
            // this.router.navigate([`home/profile/contributor/${this.registrationNo}/${this.socialInsuranceNo}/engagement/individual`]);

               }
             },
             err => {
               this.currentTab = 0;
               this.showErrorMessage(err);
             }
           );
      } else if (this.passportForm.get('passportAdd').valid) {

        this.alertService.showMandatoryDocumentsError();
      } else {
        // this.passportForm.get('passportAdd').get('passportNumber').setErrors({valid:false})
        // this.passportForm.get('passportAdd').updateValueAndValidity();
        // this.passportForm.get('passportAdd').get('passportNumber').markAsTouched();
        // this.passportForm.get('passportAdd').setErrors({valid:false})
        this.alertService.showMandatoryErrorMessage();

      }
    }
  }
  showModal(template: TemplateRef<HTMLElement>) {
    this.bsModalRef = this.bsModalService.show(template);
  }
  cancelModal() {
    this.alertService.clearAlerts();
    this.bsModalRef.hide();
    this.clearErrorAndHide(IdentityTypeEnum.PASSPORT);
  }
  /**
   * Method to clear modal
   */
  decline() {
    this.bsModalRef.hide();
  }
  deleteUuid(document: DocumentItem){
    this.uuid = undefined;
  }
  navigateToPage() {
    if(this.manageService.isEdit || !this.editTransaction){
      this.router.navigate([`home/profile/contributor/${this.registrationNo}/${this.socialInsuranceNo}/engagement/individual`]);
    }
    else{
      this.router.navigate([ManagePersonConstants.ROUTE_TO_INBOX(this.appToken)]);
    }

  } 
}
