/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  bindToObject,
  BorderNumber,
  Contributor,
  DocumentItem,
  DocumentService,
  EstablishmentProfile,
  getPersonIdentifier,
  IdentityTypeEnum,
  Iqama,
  LookupService,
  LovList,
  NationalId,
  NIN,
  Passport,
  PayloadKeyEnum,
  Person,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  scrollToTop,
  TransactionReferenceData,
  WorkflowService,
  BPMUpdateRequest,
  ApplicationTypeToken,
  CoreContributorService,
  UuidGeneratorService,
  BilingualText,
  WorkFlowActions
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import {
  ManagePersonConstants,
  ManagePersonRoutingService,
  ManagePersonScBaseComponent,
  ManagePersonService,
  PersonBankDetails,
  rejectMessage,
  returnMessage,
  TransactionResponse,
  approveMessage,
  ChangePersonService
} from '../../../shared';
import { CimRoutesEnum } from '../../../shared/enums';
import { Location } from '@angular/common';

@Component({
  selector: 'cim-manage-person-sc',
  templateUrl: './manage-person-sc.component.html',
  styleUrls: ['./manage-person-sc.component.scss']
})
export class ManagePersonScComponent extends ManagePersonScBaseComponent implements OnInit {
  //Local Variables
  personValidatorForm: FormGroup;
  person: Person = new Person();
  personDocumentList: DocumentItem[];
  bankDetails: PersonBankDetails = new PersonBankDetails();
  socialInsuranceNo: number;
  active = false; //Contributor active status with engagement
  canReturn = false; // If the user is able to return
  modalRef: BsModalRef;
  establishmentDetails: EstablishmentProfile;
  estRegistrationNo: number;
  contributor: Contributor;
  isIqama = false;
  isBorder = false;
  isPassport=false;
  isAddNin = false;
  isEditNin = false;
  contributorDocuments: DocumentItem[];
  bpmUpdateRequestData: BPMUpdateRequest = new BPMUpdateRequest();
  heading: string;
  isReturn = false; // To hide approve and reject buttons
  isReturnToAdmin = false;
  transactionNumber = null;
  passportDetails:Passport=new Passport();
  addNinDetails : NIN= new NIN();
  //Lov Lists
  rejectReasonList$: Observable<LovList>;
  returnReasonList$: Observable<LovList>;

  //ModalRef
  commonModalRef: BsModalRef;
  comments: TransactionReferenceData[] = [];
  rejectHeading: string;
  returnHeading: string;
  isShowPassport: boolean=false;
  personDetails: any;
  transactionId: number;
  referenceNo: any;
  personNumber: string;
  isInprogressTransaction: Object;

  /**
   * Creates an instance of ManagePersonScComponent
   * @memberof  ManagePersonScComponent
   *
   */
  constructor(
    private fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly validatorService: ManagePersonService,
    readonly alertService: AlertService,
    readonly bsModalService: BsModalService,
    private lookUpService: LookupService,
    readonly modalService: BsModalService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly router: Router,
    @Inject(RouterDataToken) readonly validatorDataToken: RouterData,
    public contributorService: CoreContributorService,
    public manageService: ManagePersonService,
    public changePersonService: ChangePersonService,
    @Inject(RouterDataToken)
    readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService,
    public managePersonRoutingService: ManagePersonRoutingService,
    readonly uuidService: UuidGeneratorService,
    readonly location: Location
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
  /** This method is to initialise the component */
  ngOnInit() {
    scrollToTop();
    this.personValidatorForm = this.createForm();
    this.rejectReasonList$ = this.lookUpService.getEstablishmentRejectReasonList();
    this.returnReasonList$ = this.lookUpService.getEstablishmentRejectReasonList();
    this.transactionId = this.validatorDataToken.transactionId;
    this.personNumber = this.validatorDataToken.resourceId;
    this.isEditNin = this.validatorDataToken.resourceType === RouterConstants.TRANSACTION_EDIT_NIN ? true : false;
    this.isAddNin = this.validatorDataToken.resourceType === RouterConstants.TRANSACTION_ADD_NIN ? true : false;
    if (this.isAddNin) {
      this.rejectHeading = ManagePersonConstants.HEADING_REJECT_ADD_NIN;
      this.getAddNinDocument(this.transactionId);
    } else if (this.isEditNin){
      this.rejectHeading = ManagePersonConstants.HEADING_REJECT_EDIT_NIN;
      this.getAddNinDocument(this.transactionId);
    }
    if(this.isAddNin || this.isEditNin){
    this.validatorService.getInprogressNinTransactions(this.personNumber, this.transactionId).subscribe(res => {
      this.isInprogressTransaction = res;
      const value = {
        english: 'Unable to create request, An active request is already available.',
        arabic: 'عذرا لا يمكن تنفيذ طلبك لوجود طلب آخر في مسار العمل'
      };
      if(this.isInprogressTransaction === true){
        this.alertService.showError(value);
      }
    })
  }
    if (this.validatorDataToken.taskId !== null) {
      this.intialiseTheView(this.validatorDataToken);
    }
    // this.rejectReasonList$ = this.lookUpService.getEstablishmentRejectReasonList();
    // this.returnReasonList$ = this.lookUpService.getEstablishmentRejectReasonList();
  }

  /**
   * This method is to handle the data corresponding to the transation type
   * @param validatorDataToken
   */
  intialiseTheView(validatorDataToken: RouterData) {
    const payload = JSON.parse(this.validatorDataToken.payload);
    this.transactionNumber = payload.referenceNo;
    this.bindQueryParamsToForm(validatorDataToken);
    this.checkIfIqamaofBorder(validatorDataToken);
    if (this.validatorDataToken.previousOwnerRole === Role.VALIDATOR_2) {
      this.isReturn = true;
    } else {
      this.isReturn = false;
    }
    if (this.validatorDataToken.assignedRole === Role.VALIDATOR_2) {
      this.isReturnToAdmin = false;
    } else {
      this.isReturnToAdmin = true;
    }
    if (this.isIqama || this.isBorder || this.isPassport || this.isAddNin) {
      this.getEstablishmentProfile(this.estRegistrationNo);
      this.fetchContributorDetails();
          }
    //Non Saudi Bank update scenario
    else {
      this.fetchPersonDetails();
    }
  }
  /**
   * Method to fetch the regNo Details
   * @param estRegNo
   */
  getEstablishmentProfile(estRegNo) {
    this.validatorService.getEstablishmentProfile(estRegNo).subscribe(
      res => {
        this.establishmentDetails = bindToObject(new EstablishmentProfile(), res);

      },
      err => this.alertService.showError(err?.error?.message)
    );
  }
  /**
   * This method binds the necessary validatorDataToken into form
   * @param validatorDataToken
   */
  bindQueryParamsToForm(validatorDataToken: RouterData) {
    this.personValidatorForm.get('taskId').setValue(validatorDataToken.taskId);
    this.estRegistrationNo = Number(validatorDataToken.idParams.get(PayloadKeyEnum.REGISTRATION_NO));
    this.socialInsuranceNo = Number(validatorDataToken.idParams.get(PayloadKeyEnum.ID));
    this.personValidatorForm.get('user').setValue(validatorDataToken.assigneeId);
    this.personValidatorForm.get('personId').setValue(validatorDataToken.idParams.get(PayloadKeyEnum.PERSON_ID));
    this.personValidatorForm
      .get('type')
      .setValue(
        validatorDataToken.resourceType === RouterConstants.TRANSACTION_ADD_IQAMA
          ? IdentityTypeEnum.IQAMA
          : IdentityTypeEnum.BORDER
      );
    if (validatorDataToken.assignedRole === Role.VALIDATOR_2 || validatorDataToken.assignedRole === Role.VALIDATOR) {
      this.canReturn = true;
    }
  }
  /**
   * This method is used to check if the workflow is for iqama or border and corresponding functionalitites
   * @param validatorDataToken
   */
  checkIfIqamaofBorder(validatorDataToken) {
    //Iqama or border no validator scenario
    if (
      validatorDataToken.resourceType === RouterConstants.TRANSACTION_ADD_IQAMA ||
      validatorDataToken.resourceType === RouterConstants.TRANSACTION_ADD_BORDER ||
      validatorDataToken.resourceType === RouterConstants.TRANSACTION_ADD_PASSPORT ||
      validatorDataToken.resourceType === RouterConstants.TRANSACTION_ADD_NIN ||
      validatorDataToken.resourceType === RouterConstants.TRANSACTION_EDIT_NIN
    ) {
      this.isIqama = validatorDataToken.resourceType === RouterConstants.TRANSACTION_ADD_IQAMA ? true : false;
      this.isBorder = validatorDataToken.resourceType === RouterConstants.TRANSACTION_ADD_BORDER ? true : false;
      this.isPassport = validatorDataToken.resourceType === RouterConstants.TRANSACTION_ADD_PASSPORT ? true : false;
      this.isAddNin = validatorDataToken.resourceType === RouterConstants.TRANSACTION_ADD_NIN ? true : false;
      this.isEditNin = validatorDataToken.resourceType === RouterConstants.TRANSACTION_EDIT_NIN ? true : false;
      this.heading = this.isIqama
        ? ManagePersonConstants.HEADING_ADD_IQAMA
        : this.isBorder
        ? ManagePersonConstants.HEADING_ADD_BORDER
        : this.isPassport
        ? ManagePersonConstants.HEADING_ADD_PASSPORT
        : this.isAddNin
        ? ManagePersonConstants.HEADING_ADD_NIN
        : this.isEditNin
        ? ManagePersonConstants.HEADING_ADD_NIN
        : ManagePersonConstants.HEADING_VERIFY_PERSON;
    }
  }
  /**
   * This method is to fetch the contributor details
   */
  fetchContributorDetails() {
    this.getComments(this.validatorDataToken);
    this.validatorService
      .fetchContributor(this.estRegistrationNo, this.socialInsuranceNo)
      .pipe(
        tap(res => {
          this.contributor = res;
          this.personDetails=res
          this.person = this.contributor.person;
          
          
        })
      )
      .subscribe(
        () => {
          this.validatorService
            .getWorkFlowDetails(this.estRegistrationNo, this.contributor.socialInsuranceNo)
            .subscribe(
              workFlowRes => {
                workFlowRes.map(item => {
                  let identity: NIN | Iqama | NationalId | Passport | BorderNumber;
                  if (this.isIqama) {
                    if (item.type === IdentityTypeEnum.IQAMA) {
                      this.person.identity = this.person.identity.filter(
                        identityItem => identityItem.idType !== item.type
                      );
                      identity = new Iqama();
                      identity.iqamaNo = Number(item.newValue);
                      //  this.comments = item.transactionData;
                      if (this.validatorDataToken.resourceType === RouterConstants.TRANSACTION_ADD_IQAMA) {
                        // this.transactionNumber = item.referenceNo;
                      }
                    }
                  } else if (this.isBorder) {
                    if (item.type === IdentityTypeEnum.BORDER) {
                      this.person.identity = this.person.identity.filter(
                        identityItem => identityItem.idType !== item.type
                      );
                      identity = new BorderNumber();
                      identity.id = Number(item.newValue);
                      //  this.comments = item.transactionData;
                      if (this.validatorDataToken.resourceType === RouterConstants.TRANSACTION_ADD_BORDER) {
                        //  this.transactionNumber = item.referenceNo;
                      }
                    }
                  }
                  else if (this.isPassport) {
                    if (item.type === RouterConstants.TRANSACTION_ADD_PASSPORT) {
                      this.person.identity = this.person.identity.filter(
                        identityItem => identityItem.idType !== 'PASSPORT'
                      );
                      
                      //  identity = new Passport();
                      //  identity.passportNo =item.newValue;
                      //  identity.expiryDate=item.expiryDate;
                      //  identity.issueDate=item.issueDate;
                      this.passportDetails.expiryDate=item?.expiryDate;
                      this.passportDetails.issueDate=item?.issueDate;
                      this.passportDetails.passportNo=item?.newValue;
                      this.isShowPassport=true

                      // //  this.comments = item.transactionData;
                      // if (this.validatorDataToken.resourceType === RouterConstants.TRANSACTION_ADD_BORDER) {
                      //   //  this.transactionNumber = item.referenceNo;
                      // }
                    }
                  }
                  else if (this.isAddNin) {
                    if (item.type === RouterConstants.TRANSACTION_ADD_NIN) {
                      this.person.identity = this.person.identity.filter(
                        identityItem => identityItem.idType !== 'NIN'
                      );
                      
                    }
                  }
                  
                  if (identity?.idType) {
                    this.person.identity.push(identity);
                  }
                });
                this.person.identity = getPersonIdentifier(this.person);
              },
              err => this.showApiErrorMessage(err)
            );
          if (this.isIqama) {

            this.rejectHeading = ManagePersonConstants.HEADING_REJECT_ADD_IQAMA;
            this.returnHeading = ManagePersonConstants.HEADING_RETURN_ADD_IQAMA;
            this.getIqamaOrBorderDocument(
              ManagePersonConstants.IQAMA_DOCUMENT_KEY,
              ManagePersonConstants.IQAMA_DOCUMENT_TYPE,
              this.person.personId
            );
          } else if (this.isBorder) {
            this.rejectHeading = ManagePersonConstants.HEADING_REJECT_ADD_BORDER;
            this.returnHeading = ManagePersonConstants.HEADING_RETURN_ADD_BORDER;
            this.getIqamaOrBorderDocument(
              ManagePersonConstants.BORDER_DOCUMENT_KEY,
              ManagePersonConstants.BORDER_DOCUMENT_TYPE,
              this.person.personId
            );
          }
          else if (this.isPassport) {
            this.rejectHeading = ManagePersonConstants.HEADING_REJECT_ADD_PASSPORT;
            this.returnHeading = ManagePersonConstants.HEADING_RETURN_ADD_PASSPORT;
            this.getPassportDocument(
              ManagePersonConstants.PASSPORT_DOCUMENT_KEY,
              ManagePersonConstants.PASSPORT_DOCUMENT_TYPE,
              null,
              this.transactionNumber
            );
          }
        },
        err => this.showApiErrorMessage(err)
      );
  }
  /**
   * For fetching the documents depending on the workflow type
   */
  getIqamaOrBorderDocument(key, type, id) {
    this.documentService.getDocuments(key, type, id).subscribe(response => (this.contributorDocuments = response));
  }

  getPassportDocument(key,type,identifier,referenceNumber){
    this.documentService.getDocuments(key,type,identifier,referenceNumber).subscribe(response => (this.contributorDocuments = response));
  }
  getAddNinDocument(transactionId) {
    this.uuid = this.uuidService.getUuid();
  this.documentService.getAllDocuments(transactionId).subscribe(response => (this.contributorDocuments = response));
}
  /**
   * Method to create form to handle validator operations
   */
  createForm(): FormGroup {
    return this.fb.group({
      taskId: [null],
      personId: [null],
      user: [null],
      type: [null],
      action: [null]
    });
  }
  /**
   * Method to fetch person details in change person feature
   */
  fetchPersonDetails() {
    if (this.person.personId) {
      this.validatorService
        .getPerson(this.person.personId)
        .pipe(tap(res => (this.person = res)))
        .subscribe(
          () => {
            this.validatorService.getActiveStatus(this.person.personId).subscribe(
              engagement => {
                this.socialInsuranceNo = engagement.socialInsuranceNo;
                this.active = engagement.active;
                this.person.identity = getPersonIdentifier(this.person);
              },
              err => this.showApiErrorMessage(err)
            );
            this.validatorService.getBankDetails(this.person.personId).subscribe(
              bankResponse => {
                this.bankDetails = bankResponse;
              },
              err => this.showApiErrorMessage(err)
            );
            this.documentService
              .getDocuments(
                ManagePersonConstants.NONSAUDI_DOCUMENT_TRANSACTION_KEY,
                ManagePersonConstants.DOCUMENT_TRANSACTION_TYPE,
                this.person.personId
              )
              .subscribe(response => (this.personDocumentList = response));
          },
          err => this.showApiErrorMessage(err)
        );
    }
  }
  /**
   * Method to show approve modal
   * @param templateRef
   */
  approveTransaction(form: FormGroup, templateRef: TemplateRef<HTMLElement>) {
    form.updateValueAndValidity();
    this.showModal(templateRef);
  }
  /**
   * Method to show reject modal
   * @param templateRef
   */
  rejectTransaction(form: FormGroup, templateRef: TemplateRef<HTMLElement>) {
    form.updateValueAndValidity();
    this.showModal(templateRef);
  }
  /**
   * Method to show return modal
   * @param templateRef
   */
  returnTransaction(form: FormGroup, templateRef: TemplateRef<HTMLElement>) {
    form.updateValueAndValidity();
    this.showModal(templateRef);
  }
  //Method to approve the transaction
  confirmApprove(form: FormGroup) {
    this.approveBpmTransaction(this.validatorDataToken, form).subscribe(
      res => {
        this.router.navigate([ManagePersonConstants.ROUTE_TO_INBOX(this.appToken)]);
        this.alertService.showSuccess(res);
        this.hideModal();
      },
      err => {
        this.alertService.showError(err.error.message);
        this.hideModal();
      }
    );
  }
  //Method to reject the transaction
  confirmReject(form: FormGroup) {
    this.rejectBpmTransaction(this.validatorDataToken, form).subscribe(
      res => {
        this.router.navigate([ManagePersonConstants.ROUTE_TO_INBOX(this.appToken)]);
        this.alertService.showSuccess(res);
        this.hideModal();
      },
      err => {
        this.alertService.showError(err.error.message);
        this.hideModal();
      }
    );
  }
  //Method to return the transaction
  confirmReturn(form: FormGroup) {
    this.returnBpmTransaction(this.validatorDataToken, form).subscribe(
      res => {
        this.router.navigate([ManagePersonConstants.ROUTE_TO_INBOX(this.appToken)]);
        this.alertService.showSuccess(res);
        this.hideModal();
      },
      err => {
        this.alertService.showError(err.error.message);
        this.hideModal();
      }
    );
  }
  /**
   * Method to navigate on validator actions
   * @param response
   */
  navigateToInbox(response: TransactionResponse) {
    if (response) {
      this.alertService.showSuccess(response.bilingualMessage);
    }
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /**
   * This method is used to navigate to profile on clicking of edit icon
   * @param val
   */
  navigateToProfile() {
    if (this.isIqama) {
      this.router.navigate([CimRoutesEnum.CONTRIBUTOR_PROFILE_ADD_IQAMA]);
    } else if (this.isBorder) {
      this.router.navigate([CimRoutesEnum.CONTRIBUTOR_PROFILE_ADD_BORDER]);
    }
  }
  /**
   * This method is to show the modal reference
   * @param modalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>, size?: string) {
    const options = Object.assign({}, { class: `modal-${size ? size : 'lg'}` });
    this.modalRef = this.modalService.show(templateRef, options);
  }
  /**
   * This method is to hide the modal reference
   * @param modalRef
   */

  hideModal() {
    this.modalRef?.hide();
  }
  confirmCancel() {
    this.navigateToInbox(undefined);
    this.hideModal();
  }
  /**
   * Method to show error messages coming from api
   * @param err
   */
  showApiErrorMessage(apiErr) {
    if (apiErr) {
      this.alertService.showError(apiErr.error.message, apiErr.error.details);
    }
  }
  //Method to approve the BPM transaction
  approveBpmTransaction(routerData: RouterData, form: FormGroup): Observable<BilingualText> {
    return this.submitWorkflow(this.assembleBpmRequest(routerData, WorkFlowActions.APPROVE, form)).pipe(
      map(() => approveMessage()),
      tap(() => {
        routerData.fromJsonToObject(new RouterData());
      })
    );
  }
  //Method to reject the bpm transaction
  rejectBpmTransaction(routerData: RouterData, form: FormGroup): Observable<BilingualText> {
    return this.submitWorkflow(this.assembleBpmRequest(routerData, WorkFlowActions.REJECT, form)).pipe(
      map(() => rejectMessage()),
      tap(() => {
        routerData.fromJsonToObject(new RouterData());
      })
    );
  }
  //method to return the bpm transaction
  returnBpmTransaction(routerData: RouterData, form: FormGroup): Observable<BilingualText> {
    return this.submitWorkflow(this.assembleBpmRequest(routerData, WorkFlowActions.RETURN, form)).pipe(
      map(() => returnMessage()),
      tap(() => {
        routerData.fromJsonToObject(new RouterData());
      })
    );
  }
}
