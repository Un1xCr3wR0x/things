import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, ApplicationTypeToken, AuthTokenService, BilingualText, CoreContributorService, DocumentItem, DocumentService, GosiCalendar, IdentifierLengthEnum, LanguageToken, RouterData, RouterDataToken, UuidGeneratorService, WizardItem, WorkflowService, lengthValidator, ninValidator } from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ChangePersonService, DocumentTransactionTypeEnum, ManagePersonRoutingService, ManagePersonScBaseComponent, ManagePersonService, TransactionId } from '../../../shared';
import { PersonDetailsDTO, SaveDetails, SimisDocDetails } from '../../../shared/models/person-details-dto';
import { BehaviorSubject } from 'rxjs-compat';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cim-add-nin-sc',
  templateUrl: './add-nin-sc.component.html',
  styleUrls: ['./add-nin-sc.component.scss']
})

export class AddNinScComponent extends ManagePersonScBaseComponent implements OnInit, OnDestroy {
  wizardItems: WizardItem[] = [];
  @ViewChild('changePersonalWizard', { static: false })
  changePersonalWizard: ProgressWizardDcComponent;
  currentTab = 0;
  ninModifyForm: FormGroup;
  ninMaxLength = IdentifierLengthEnum.NIN;
  currentDate = new Date();
  modalRef: BsModalRef;
  uuid: string;
  documents: DocumentItem[] = [];
  registrationNo: number;
  documentTransactionId: number;
  referenceNo: number;
  parentForm = new FormGroup({});
  documentTransactionType: string;
  documentTransactionKey: string;
  docUploaded: boolean;
  isVerified: boolean = false;
  isSubmit: boolean = true;
  person: any;
  personName: any;
  englishName: any;
    nationality: BilingualText;
  gender: BilingualText;
  lang = 'en';
  personalDetailsCurrentDto: PersonDetailsDTO = new PersonDetailsDTO();
  personalDetailsFromNicDto: PersonDetailsDTO = new PersonDetailsDTO();
  simisDocDetails: SimisDocDetails;
  isPreviousClick: boolean = false;
  uuid2: string;
  id : number;

  constructor(
    private fb: FormBuilder,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly location: Location,
    public documentService: DocumentService,
    public changePersonService: ChangePersonService,
    public authTokenService: AuthTokenService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    public managePersonRoutingService: ManagePersonRoutingService,
    readonly uuidService: UuidGeneratorService,
    @Inject(RouterDataToken)
    readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService,
    public contributorService: CoreContributorService,
    public manageService: ManagePersonService,
    readonly activatedRoute: ActivatedRoute,
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
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.activatedRoute.url.subscribe(params => {
      if(params[0].path == 'add-nin'){
        this.routerDataToken.idParams.set('isAddNin',true);
      }
      else{
        this.routerDataToken.idParams.set('isAddNin',false);
      }
    })
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.ninModifyForm = this.createNinForm();
    if(this.id){
      this.changePersonService.getPersonDetails(this.id).subscribe(res=> {
        this.person = res;
        let firstName = res.name.arabic?.firstName ? res.name.arabic?.firstName : '';
      let secondName = res.name.arabic?.secondName ? res.name.arabic?.secondName : '';
      let thirdName = res.name.arabic?.thirdName ? res.name.arabic?.thirdName : '';
      let familyName = res.name.arabic?.familyName ? res.name.arabic?.familyName : '';
      this.personName = firstName +' '+ secondName + ' ' + thirdName + ' ' + familyName;
      this.englishName = res.name.english?.name ? res.name.english?.name : this.personName;
      this.gender = res.sex;
      this.nationality = res.nationality;
      let identity: any = this.person.identity;
      let ninDetails = identity.filter(item => item.idType == 'NIN');
      this.ninModifyForm.get('nin').setValue(ninDetails[0]?.newNin);
      this.ninModifyForm.get('dateOfBirth').get('gregorian').setValue(new Date(this.person?.birthDate?.gregorian));
      })
    }
    else{
      this.changePersonService.getPersonInfo().subscribe(res => {
        this.person = res;
        let firstName = res.name.arabic?.firstName ? res.name.arabic?.firstName : '';
        let secondName = res.name.arabic?.secondName ? res.name.arabic?.secondName : '';
        let thirdName = res.name.arabic?.thirdName ? res.name.arabic?.thirdName : '';
        let familyName = res.name.arabic?.familyName ? res.name.arabic?.familyName : '';
        this.personName = firstName +' '+ secondName + ' ' + thirdName + ' ' + familyName;
        this.englishName = res.name.english?.name ? res.name.english?.name : this.personName;
        this.gender = res.sex;
        this.nationality = res.nationality;
        let identity: any = this.person.identity;
      let ninDetails = identity.filter(item => item.idType == 'NIN');
      this.ninModifyForm.get('nin').setValue(ninDetails[0]?.newNin);
      this.ninModifyForm.get('dateOfBirth').get('gregorian').setValue(new Date(this.person?.birthDate?.gregorian));
      });
    }
    this.uuid = this.uuidService.getUuid();
    this.uuid2 = this.uuid;
    this.initializeWizard()
    
  }

  createNinForm(){
    return this.fb.group({
      nin: [
        null,
        {
          validators: Validators.compose([Validators.required, ninValidator, lengthValidator(this.ninMaxLength)]),
          updateOn: 'blur'
        }
      ],
      dateOfBirth: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null],
        entryFormat: 'GREGORIAN'
      }),
    });
  }

  initializeWizard() {
    this.wizardItems = this.getWizardItems();
    this.wizardItems[0].isDisabled = false;
    this.wizardItems[0].isActive = true;
  }

  getWizardItems() {

    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem('CUSTOMER-INFORMATION.PERSONAL-DETAILS', 'user'));
    wizardItems.push(new WizardItem('CUSTOMER-INFORMATION.DOCUMENTS', 'file-alt'));
    return wizardItems;
  }
  selectWizard(index) {
    //this.isPrevious=true;
    this.alertService.clearAlerts();
    this.currentTab = index;
  }
  verifyNin(){
    this.alertService.clearAlerts();
    if(this.ninModifyForm.valid){
      let newNin = this.ninModifyForm.get('nin').value;
      let dob = this.ninModifyForm.get('dateOfBirth').value;
      this.manageService.getPersonDetailsAddNin(this.person.personId, newNin, dob).subscribe(res => {
        let data: any = res;
        this.personalDetailsCurrentDto = data.personalDetailsCurrentDto;
        this.personalDetailsFromNicDto = data.personalDetailsFromNicDto;
        this.isVerified = true;
        this.isSubmit = false;
        this.manageService.getsimisDocDetails(this.person.personId).subscribe(res => {
       this.simisDocDetails = res;
        }
          )
      },
      err => {
        this.alertService.showError(err.error.message);
        this.isVerified = false;
        this.isSubmit = true;
      }) 
    }
  }
  /**
   * Method of cancel template
   */
  showCancelTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
  saveDetails(){
    this.currentTab++;
    this.wizardItems[1].isDisabled = false;
    this.wizardItems[1].isActive = true;
    this.wizardItems[0].isDone = true;
    this.wizardItems[0].isActive = false;
    this.documentTransactionId = this.routerDataToken.idParams.get('isAddNin') ? TransactionId.ADD_NIN : TransactionId.EDIT_NIN;
    this.documentTransactionKey = this.routerDataToken.idParams.get('isAddNin')? DocumentTransactionTypeEnum.ADD_NIN : DocumentTransactionTypeEnum.EDIT_NIN;
    this.documentTransactionType = this.routerDataToken.idParams.get('isAddNin')? DocumentTransactionTypeEnum.ADD_NIN : DocumentTransactionTypeEnum.EDIT_NIN;
   
   if(this.isPreviousClick != true){
    this.getRequiredDocument(this.documentTransactionKey, this.documentTransactionType, true);
   }
  }
  submitDetails(){
    let isAddNin = this.routerDataToken.idParams.get('isAddNin');
    let details: SaveDetails = new SaveDetails();
    details.newNin = this.ninModifyForm.get('nin').value;
    details.dob = this.ninModifyForm.get('dateOfBirth').value;
    details.uuid = this.uuid;
    if(isAddNin == true) {
    this.manageService.submitDetailsAddNin(details, this.person.personId).subscribe(res =>{
      let data: any = res;
      this.location.back();
      this.alertService.showSuccess(data.message);
    })
  }
  else{
    this.manageService.submitEditNin(details, this.person.personId).subscribe(res =>{
      let data: any = res;
      this.location.back();
      this.alertService.showSuccess(data.message);
    })
  }
  }

  /** Method to get required document list. */
  getRequiredDocument(transactionId: string, transactionType: string, isRefreshRequired = false) {
    this.documentService.getRequiredDocuments(transactionId, transactionType).subscribe(res => {
      this.documents = res;
      if (isRefreshRequired)
        this.documents.forEach(doc => {
          this.refreshDocumentItem(doc);
        });
    });
  }
   /**
   * method to confirm cancel
   */
   confirmCancel() {
    this.modalRef.hide();
    this.location.back();
  }

   /**
   * Method to get the document content
   * @param document
   */
   refreshDocumentItem(document: DocumentItem) {
    this.documentService
      .refreshDocument(
        document,
        this.registrationNo,
        this.documentTransactionKey,
        this.documentTransactionType,
        this.referenceNo,
        null,
        this.referenceNo ? undefined : this.uuid
      )
      .subscribe(res => {
        document = res;
        document.uuid = this.uuid;
      }
      ,
      err => {
        this.alertService.showError(err.error.message);});
  }
   /**
   * Method to hide modal
   */
   decline() {
    this.modalRef.hide();
  }
  navigateToPreviousTab(){
    this.isPreviousClick = true;
    this.alertService.clearAlerts();
    this.currentTab--;
    this.wizardItems[1].isActive = false;
    this.wizardItems[0].isActive = true;
  }
   /**
   * Method to refresh documents after scan.
   * @param doc document
   */
   refreshDocument(doc: DocumentItem) {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          doc,
          this.registrationNo,
          this.documentTransactionKey,
          this.documentTransactionType,
          this.referenceNo,
          null,
          this.uuid
        )
        .subscribe(res => {
          doc = res;
          doc.uuid = this.uuid;
        
        },
        err => {
          this.alertService.showError(err.error.message);});
    }
  }
  setUuid(isUploadSuccess) {
    if (isUploadSuccess) {
      this.docUploaded = true;
      this.uuid = this.uuid2;
      
    }
  }
  deleteUuid(isDeletionSuccess) {
    if (isDeletionSuccess) {
      this.docUploaded = false;
      this.uuid = null;
    }  
  }


}
