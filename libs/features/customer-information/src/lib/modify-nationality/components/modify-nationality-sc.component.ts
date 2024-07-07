import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { ContributorBaseScComponent, ContributorService, EstablishmentService, ManageWageService, EngagementService, CancelContributorService, ContributorConstants, MaxLengthEnum } from '@gosi-ui/features/contributor';
import { AlertService, LookupService, DocumentService, WorkflowService, StorageService, RouterDataToken, RouterData, UuidGeneratorService, WizardItem, LovList, Person, BilingualText, DocumentItem, LanguageToken, getPersonArabicName, getPersonEnglishName, scrollToTop, startOfDay, IdentityTypeEnum, gccCountryList, GccCountryEnum, IdentifierLengthEnum, borderNoValidator, iqamaValidator, CalendarTypeEnum, BPMUpdateRequest, WorkFlowActions, RouterConstants, BPMCommentScope } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ChangePersonService, PersonDetails, ProfileWrapper, UserActivityService } from '../../shared';
import { BehaviorSubject, noop, Observable, of } from 'rxjs';
import { ModifyDetails } from '../../shared/models/benefits';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { BillingConstants } from '@gosi-ui/features/collection/billing/lib/shared/constants';
import moment from 'moment-timezone';
import { ModifyNationalityDetails, NationalityModifyDetails } from '../../shared/models/benefits/nationality';
import { NationalityConstants } from '../../shared/constants/nationality-constants';
import { TransactionOutcome } from '@gosi-ui/features/collection/billing/lib/shared/enums';
import { Location } from '@angular/common';
import { ModifyPersonalDetails } from '@gosi-ui/features/contributor/lib/transactions/components';
import { AddModifyPersonDetails } from '../../shared/models/add-modify-person-details';

@Component({
  selector: 'cim-modify-nationality-sc',
  templateUrl: './modify-nationality-sc.component.html',
  styleUrls: ['./modify-nationality-sc.component.scss']
})
export class ModifyNationalityScComponent implements OnInit {
  name: any;
  nationality: BilingualText;
  iqmaNUmber: any;
  nin: any;
  passportNumber: any;
  gccId: any;
  isOldGcc: any;
  borderNo: any;
  wizardItems: WizardItem[] = [];
  currentTab = 0;
  modifyDetailsForm: FormGroup;
  @ViewChild('changePersonalWizard', { static: false })
  changePersonalWizard: ProgressWizardDcComponent;
  array: any[] = []
  personId: number;
  documents: DocumentItem[] = [];
  profileDetails: ProfileWrapper;
  personDtls: PersonDetails;
  nationalityList$: Observable<LovList> = new Observable<LovList>(null);
  nationalityLovList: LovList = new LovList([]);
  nationalityDetails: ModifyNationalityDetails;
  modifyDetails: NationalityModifyDetails;
  referenceNo: number;
  uuid: any;
  currentDate: any;
  lang = 'en';
  modalRef: BsModalRef;
  transactionID: number;
  nameEnglish;
  passportMaxLength = MaxLengthEnum.PASSPORT;
  iqamaMaxLength = MaxLengthEnum.IQAMA;
  borderMaxLength = MaxLengthEnum.BORDER;
  gccIdLength: number;
  isDisabled: boolean = true;
  issueDateDisabled: boolean = true;
  parentForm = new FormGroup({});
  isDocumentUploaded: boolean;
  minDate: Date;
  personNationalityDetails: any;
  personNumber: number;
  isValidatorEdit: boolean;
  isGcc: boolean = false;
  isImmigratedTribes: boolean = false;
  docTransactionID: string;
  docTransactionTypeBorder: string;
  docTransactionTypeIqama: string;
  isOldImmigratedTribes: boolean = false;
  referenceNumber: any;
  updateBpmTask: BPMUpdateRequest = new BPMUpdateRequest();
  validatorEditResponse: AddModifyPersonDetails;
  showGccValidator: boolean;
  isEditNationality: boolean = false;
  oldgccNo: any;
  oldPassportNo: any;
  oldIssueDate: any;
  oldExpiryDate: any;
  gccidedited:  boolean = false;
  passportEdited:  boolean = false;
  passportIssueDateEdited:  boolean = false;
  passportExpiryDateEdited: boolean = false;
  isEdited: boolean = false;
  issueDate: Date;
  sin: number;
  personIds: number;
  constructor(readonly contributorService: ContributorService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly manageWageService: ManageWageService,
    readonly lookupService: LookupService,
    readonly engagementService: EngagementService,
    public documentService: DocumentService,
    public changePersonService: ChangePersonService,
    readonly workflowService: WorkflowService,
    readonly cancelContributorService: CancelContributorService,
    readonly route: ActivatedRoute,
    readonly location: Location,
    public modalService: BsModalService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly router: Router,
    readonly storageService: StorageService,
    readonly userActivityService: UserActivityService,
    private fb: FormBuilder,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,


    private uuidGeneratorService: UuidGeneratorService,
  ) {


  }

  ngOnInit(): void {
    this.currentDate = new Date();
    this.language.subscribe(lang => (this.lang = lang));
    this.uuid = !this.uuid ? this.uuidGeneratorService.getUuid() : this.uuid;
    this.route.params.subscribe(params => {
      this.personId = params['personId'];
      this.personNumber = params['validatorId'];
      if(this.personNumber){
      this.getModifiedDetails(this.personNumber);
      }
      //this.retrieveScannedDocument();
      // this.getDocuments();
      this.setPersonProfileDetails();
     

    });
    
    this.initializeWizard()
    this.array = [{ code: "1001", sequence: 1, value: { arbic: '', english: 'Overlapping' } }]

    this.modifyDetailsForm = this.createForm();

    this.alertService.clearAlerts();
  }
  getModifiedDetails(id){
    this.changePersonService.getChangeRequestDetails(id)?.subscribe(res => {
        this.personNationalityDetails = res;
        this.issueDateDisabled = false;
        this.isDisabled = false;
        this.isValidatorEdit = true;
        this.referenceNumber = this.personNationalityDetails.changeRequestList[0].referenceNo;
        for( let i=0; i<=this.personNationalityDetails.changeRequestList.length; i++ ){
        if(this.personNationalityDetails.changeRequestList[i]?.parameter == 'Nationality'){
          this.modifyDetailsForm.get('nationality.english').setValue(this.personNationalityDetails.changeRequestList[i].newValue);
          this.modifyDetailsForm.get('nationality.arabic').setValue(this.personNationalityDetails.changeRequestList[i].newValueArb);
          this.modifyDetailsForm.get('nationality').updateValueAndValidity();
          if(this.personNationalityDetails.changeRequestList[i].newValue === 'Immigrated Tribes'){
            this.isEditNationality = true;
            this.modifyDetailsForm.get('passportNumber').clearValidators();
            this.modifyDetailsForm.get('passportNumber').updateValueAndValidity();
            this.modifyDetailsForm.get('passportIssueDate.gregorian').clearValidators();
            this.modifyDetailsForm.get('passportIssueDate.gregorian').updateValueAndValidity();
            this.modifyDetailsForm.get('passportExpiryDate.gregorian').clearValidators();
            this.modifyDetailsForm.get('passportExpiryDate.gregorian').updateValueAndValidity();
          }
          gccCountryList.forEach(country => {
            if (this.personNationalityDetails.changeRequestList[i].newValue === country) {
              this.isGcc = true;
              this.setGccIdMaxLength(this.personNationalityDetails.changeRequestList[i].newValue);
        }
      });

        }
        else if(this.personNationalityDetails.changeRequestList[i]?.parameter == 'Passport Number'){
          this.modifyDetailsForm.get('passportNumber').setValue(this.personNationalityDetails.changeRequestList[i].newValue);
          this.modifyDetailsForm.get('passportNumber').updateValueAndValidity();
          this.oldPassportNo = this.personNationalityDetails.changeRequestList[i].newValue;
        }
        else if(this.personNationalityDetails.changeRequestList[i]?.parameter == 'Passport Issue Date'){
          this.modifyDetailsForm.get('passportIssueDate.gregorian').setValue(new Date(this.personNationalityDetails.changeRequestList[i].newDate.gregorian));
          this.modifyDetailsForm.get('passportIssueDate').updateValueAndValidity();
          this.oldIssueDate = (new Date(this.personNationalityDetails.changeRequestList[i].newDate.gregorian));
        }
        else if(this.personNationalityDetails.changeRequestList[i]?.parameter == 'Passport Expiry Date'){
          this.modifyDetailsForm.get('passportExpiryDate.gregorian').setValue(new Date(this.personNationalityDetails.changeRequestList[i].newDate.gregorian));   
          this.modifyDetailsForm.get('passportExpiryDate').updateValueAndValidity();
          this.oldExpiryDate = (new Date(this.personNationalityDetails.changeRequestList[i].newDate.gregorian));   
        } else if(this.personNationalityDetails.changeRequestList[i]?.parameter == 'Gcc Id'){
          this.modifyDetailsForm.get('gccId').setValue(this.personNationalityDetails.changeRequestList[i].newValue);
          this.modifyDetailsForm.get('gccId').updateValueAndValidity();
          this.oldgccNo = this.personNationalityDetails.changeRequestList[i].newValue;
          if(this.personNationalityDetails.changeRequestList[i].newValue){
            this.showGccValidator = true;
          }
 
        }
      }


      })
  }
  setPersonProfileDetails() {
    this.changePersonService.getProfileDetails(this.personId).pipe(
      tap(res => {
        this.profileDetails = res;
        this.personDtls = res.personDetails
        this.sin = this.profileDetails.socialInsuranceNumber[0];
        this.name = getPersonArabicName(this.personDtls.name.arabic);
        this.nameEnglish = getPersonEnglishName(this.personDtls?.name?.english);
        this.nationality = this.personDtls.nationality;
        // this.personNumber = this.personDtls.personId;
            gccCountryList.forEach(country => {
              if (this.nationality.english === country) {
                this.isOldGcc = true;
          }
        });
        if (this.isOldGcc) {
          this.modifyDetailsForm?.get('checkBoxFlag').setValue(true);
        }
        if(this.personDtls?.nationality?.english === 'Immigrated Tribes'){
          this.isOldImmigratedTribes = true;
        }

        const isIqmatype = this.personDtls.personIdentities.find((id) => id.idType === 'IQAMA')
        if (isIqmatype) {
          this.iqmaNUmber = isIqmatype;
          if(this.iqmaNUmber?.iqamaNo){
            this.modifyDetailsForm?.get('iqamaNo').setValue(this.iqmaNUmber?.iqamaNo);
          }
        }
        const nin: any =  this.personDtls.personIdentities.find((id) => id.idType === 'NIN')
        if(nin){
          this.nin = nin;
        }
        const isIdtype = this.personDtls.personIdentities.some((id) => id.idType === 'PASSPORT')
        if (isIdtype) {
          const value = this.personDtls.personIdentities.find(id => id.idType === 'PASSPORT')
          this.passportNumber = value

        }
        const isGcctype = this.personDtls.personIdentities.find((id) => id.idType === 'GCCID')
        if (isGcctype) {
          this.gccId = isGcctype
        }
        const isBordertype = this.personDtls.personIdentities.find((id) => id.idType === 'BORDERNO')
        if (isBordertype) {
          this.borderNo = isBordertype;
          if(this.borderNo?.id){
            this.modifyDetailsForm?.get('borderNo').setValue(this.borderNo?.id);
          }
        }
      }),
      switchMap(() => {

        this.nationalityList$ = this.lookupService.getNationalityList().pipe(
          filter(res => res !== null),
          map(res => new LovList(res.items.filter(item => ContributorConstants.EXCLUDED_NATIONALITIES.indexOf(item.value.english) === -1 && item?.value?.english !=
            this.nationality?.english)))
        );;
        return this.nationalityList$

      }
      ),
     ).subscribe();
  }
   




  refreshDocument(event) {
  }
  upload(event) {
  }
  initializeWizard() {
    this.wizardItems = this.getWizardItems();
    this.wizardItems[0].isDisabled = false;
    this.wizardItems[0].isActive = true;
  }

  getWizardItems() {

    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem('CUSTOMER-INFORMATION.PERSONAL-DETAILS', 'user'));
    wizardItems.push(new WizardItem('CUSTOMER-INFORMATION.PREVIEW', 'file-alt'));
    return wizardItems;
  }
  navigateToNextTab() {

    this.alertService.clearAlerts();
    this.currentTab++;
    this.changePersonalWizard.setNextItem(this.currentTab);
    scrollToTop();
  }

  checkDocumentValidity(form: FormGroup) {
    if (!this.documentService.checkMandatoryDocuments(this.documents)) {
      // this.alertService.showMandatoryDocumentsError();
      return false;
    } else if (form) {
      return form.valid;
    } else {
      return true;
    }
  }
  next() {
    //this.checkDocumentValidity(this.modifyDetailsForm) 
    this.isDocumentUploaded = this.documentService.checkMandatoryDocuments(this.documents);
    if (this.modifyDetailsForm.valid && this.isDocumentUploaded) {
      this.modifyDetails = {

        contributorType: this.isGcc ? "GCC_Person" : this.isImmigratedTribes ? "Immigrated_Tribe" : "Non_Saudi_Person",
        nationality: {
          arabic: this.modifyDetailsForm.value.nationality.arabic,
          english: this.modifyDetailsForm.value.nationality.english

        },
        personIdentities: [

        ],

        referenceNo: this.referenceNo ? this.referenceNo : null,
        uuid: this.uuid,
        removeGccId: this.modifyDetailsForm?.get('checkBoxFlag').value ? true : false

      }
      if (this.modifyDetailsForm?.value.passportNumber) {
        this.modifyDetails.personIdentities.push({
          idType: "PASSPORT",
          passportNo: this.modifyDetailsForm.value.passportNumber,
          expiryDate: {
            hijiri: this.modifyDetailsForm.value.passportExpiryDate.hijiri,
            gregorian: startOfDay(this.modifyDetailsForm.value.passportExpiryDate.gregorian),
            entryFormat : CalendarTypeEnum.GREGORIAN

          },
          issueDate: {

            hijiri: this.modifyDetailsForm.value.passportIssueDate.hijiri,
            gregorian: startOfDay(this.modifyDetailsForm.value.passportIssueDate.gregorian),
            entryFormat : CalendarTypeEnum.GREGORIAN

          }
        });

      }
      if (this.modifyDetailsForm?.value?.iqamaNo || this.iqmaNUmber?.iqamaNo) {
        this.modifyDetails.personIdentities.push({
          idType: "IQAMA",
          iqamaNo: this.modifyDetailsForm.value.iqamaNo ? this.modifyDetailsForm.value.iqamaNo :this.iqmaNUmber?.iqamaNo,
          expiryDate: null
        });
      }
     if (this.modifyDetailsForm?.value?.borderNo || this.borderNo?.id) {
        this.modifyDetails.personIdentities.push({
          idType: "BORDERNO",
          id: this.modifyDetailsForm.value.borderNo ? this.modifyDetailsForm.value.borderNo : this.borderNo?.id,
        });
      }
     if (this.modifyDetailsForm?.value?.gccId) {
        this.modifyDetails.personIdentities.push({
          idType: "GCCID",
            id: this.modifyDetailsForm.value.gccId 
        });
      }

      if (!this.referenceNo) {
        this.userActivityService.saveModifyNationalityDetails(this.personId, this.modifyDetails).subscribe((res: any) => {
          this.referenceNo = res;
          this.modifyDetails.referenceNo = res;
          this.navigateToNextTab()
          this.nationalityDetails = this.modifyDetailsForm.value

        })
      }
      else {
        this.userActivityService.updateModifyNationalityDetails(this.personId, this.modifyDetails).subscribe((res: any) => {
          this.navigateToNextTab()

          this.nationalityDetails = this.modifyDetailsForm.value


        })
      }

    }
    // else if (!this.isDocumentUploaded) {
    //   this.alertService.showMandatoryDocumentsError();
    // }
    else {

      this.modifyDetailsForm.markAllAsTouched();
      this.alertService.showMandatoryErrorMessage()
    }

  }
  selectWizard(index) {
    //this.isPrevious=true;
    this.alertService.clearAlerts();
    this.currentTab = index;
  }
  previousClick() {
    this.currentTab--;
    this.changePersonalWizard.setPreviousItem(this.currentTab);
    scrollToTop();
    this.nationalityDetails = this.modifyDetailsForm.value
  }
  issueDateSelected() {
    this.minDate = moment().add(1, 'day').toDate();
    if (this.modifyDetailsForm.value.passportIssueDate.gregorian) {
      this.isDisabled = false;
    }
  }
  createForm() {
    return this.fb.group({
      nationality: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null, { validators: Validators.required }]
      }),
      passportNumber: [
        null,
        {
          validators: [Validators.required, Validators.pattern('[a-zA-Z0-9]+$'), Validators.maxLength(this.passportMaxLength)],
          updateOn: 'blur'
        }
      ],
      passportIssueDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      passportExpiryDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null]
      }),
      gccId: [
        null,
        {
          validators: [Validators.required, Validators.maxLength(this.gccIdLength)],
          updateOn: 'blur'
        }
      ],
       iqamaNo: [
        null,
        {
          validators: [iqamaValidator, Validators.maxLength(this.iqamaMaxLength)],
          updateOn: 'blur'
        }
      ],
      borderNo: [
        null,
        {
          validators: [borderNoValidator, Validators.maxLength(this.borderMaxLength)],
          updateOn: 'blur'
        }
      ],
      checkBoxFlag: [false, {}]
    });
  }
  previous() {
    this.currentTab = 1;
    this.wizardItems[0].isDisabled = false;
    this.wizardItems[0].isActive = true;
  }

  submit() {
    this.modifyDetails.uuid = this.uuid;
    this.userActivityService.submitModifyNationalityDetails(this.personId, this.modifyDetails).subscribe((res: any) => {
   //   this.lang == 'en' ? this.alertService.showSuccessByKey(res.bilingualMessage.english, null, 7) : this.alertService.showSuccessByKey(res.bilingualMessage?.arabic, null, 7);
      this.alertService.showSuccess(res.bilingualMessage)
      this.router.navigate([`/home/profile/individual/internal/${this.personId}/personal-details`]);

    })
  }

  showCancelTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
  routeBack() {
    if(this.currentTab ===0 && !this.isValidatorEdit && !this.referenceNo){
      this.router.navigate([`/home/profile/individual/internal/${this.personId}/personal-details`]);
    }
    else if(this.currentTab ===0 && this.isValidatorEdit)
    {
      this.router.navigate([`/home/profile/validator/change-nationality`]); 
    }
    else if(this.currentTab ===1) {
      this.previousClick();
    }
    else if(this.currentTab === 0 && this.referenceNo){
      this.userActivityService.cancelChangeNationality(this.personDtls?.personId, this.referenceNo).subscribe((res: any) => {
      }) 
      this.router.navigate([`/home/profile/individual/internal/${this.personId}/personal-details`]);
    }
    
  }

  confirmCancel() {
    this.alertService.clearAlerts();
    if(this.currentTab ===1 || this.referenceNo){
    this.userActivityService.cancelChangeNationality(this.personDtls?.personId, this.referenceNo).subscribe((res: any) => {
    })
    }
    if(this.isValidatorEdit){
      this.router.navigate([`/home/profile/validator/change-nationality`]); 
    } else {
    this.router.navigate([`/home/profile/individual/internal/${this.personId}/personal-details`]);
    }
    this.modalRef.hide();
  }
  decline() {
    this.modalRef.hide();
  }
  enableIssueDateField(){
    this.issueDateDisabled = false;
  }
  enableExpiryDateField(){
    this.minDate = moment().add(1, 'day').toDate();
    this.isDisabled = false;
  }
  selectIdForm(nationality: string) {
    this.isGcc = false;
    this.isImmigratedTribes = false;
    gccCountryList.forEach(country => {
      if (this.modifyDetailsForm?.get('nationality').get('english').value === country) {
        this.isGcc = true;
        this.setGccIdMaxLength(nationality);
  }
});
if (this.modifyDetailsForm?.get('nationality')?.get('english').value === 'Immigrated Tribes')
{
  this.isImmigratedTribes = true;
}
if(this.isGcc){
  this.modifyDetailsForm.get('gccId').setValidators([
    Validators.required,
    Validators.maxLength(this.gccIdLength)
]);
this.modifyDetailsForm.get('gccId').updateValueAndValidity()
}
else{
  this.modifyDetailsForm.get('gccId').clearValidators();
  this.modifyDetailsForm.get('gccId').updateValueAndValidity();
}
if (this.isImmigratedTribes) {
  // Clear validators for passportNumber
  this.modifyDetailsForm.get('passportNumber').clearValidators();
  this.modifyDetailsForm.get('passportNumber').updateValueAndValidity();

  // Clear validators for passportIssueDate
  this.modifyDetailsForm.get('passportIssueDate.gregorian').clearValidators();
  this.modifyDetailsForm.get('passportIssueDate.gregorian').updateValueAndValidity();

  // Clear validators for passportExpiryDate
  this.modifyDetailsForm.get('passportExpiryDate.gregorian').clearValidators();
  this.modifyDetailsForm.get('passportExpiryDate.gregorian').updateValueAndValidity();
}
else {
      this.modifyDetailsForm.get('passportNumber').setValidators([
        Validators.required,
        Validators.pattern('[a-zA-Z0-9]+$'),
        Validators.maxLength(this.passportMaxLength)
    ]);
    this.modifyDetailsForm.get('passportNumber').updateValueAndValidity();

    // Apply validators for passportIssueDate
    this.modifyDetailsForm.get('passportIssueDate.gregorian').setValidators(Validators.required);
    this.modifyDetailsForm.get('passportIssueDate.gregorian').updateValueAndValidity();

    // Apply validators for passportExpiryDate
    this.modifyDetailsForm.get('passportExpiryDate.gregorian').setValidators(Validators.required);
    this.modifyDetailsForm.get('passportExpiryDate.gregorian').updateValueAndValidity();
}
this.uuid = this.uuidGeneratorService.getUuid();
this.getDocumentType();
this.documentService
          .getRequiredDocuments(
            this.docTransactionID,
            this.iqmaNUmber
              ? this.docTransactionTypeIqama
              : this.docTransactionTypeBorder
          )
          .pipe(
            map(docs => this.documentService.removeDuplicateDocs(docs)),
            catchError(error => of(error))
          ).subscribe(doc => (this.documents = doc), noop, noop);

  }
  setGccIdMaxLength(nationality: string) {
    switch (nationality) {
      case GccCountryEnum.KUWAIT: {
        this.gccIdLength = IdentifierLengthEnum.KUWAIT_ID;
        break;
      }
      case GccCountryEnum.BAHRAIN: {
        this.gccIdLength = IdentifierLengthEnum.BAHRAIN_ID;
        break;
      }
      case GccCountryEnum.UAE: {
        this.gccIdLength = IdentifierLengthEnum.UAE_ID;
        break;
      }
      case GccCountryEnum.OMAN: {
        this.gccIdLength = IdentifierLengthEnum.OMAN_ID;

        break;
      }
      case GccCountryEnum.QATAR: {
        this.gccIdLength = IdentifierLengthEnum.QATAR_ID;
        break;
      }
    }
  }

  getDocumentType() {
   if(this.isGcc && this.isOldImmigratedTribes){
    this.docTransactionID = NationalityConstants.MODIFY_NATIONALITY_IMMIGRATED_TRIBES_TO_GCC;
    this.docTransactionTypeIqama = NationalityConstants.MODIFY_NATIONALITY_IMMIGRATED_TRIBES_TO_GCC;
    this.docTransactionTypeBorder = NationalityConstants.MODIFY_NATIONALITY_IMMIGRATED_TRIBES_TO_GCC;
    this.transactionID = 300404;
   }
   else if(this.isGcc && this.isOldGcc){
    this.docTransactionID = NationalityConstants.MODIFY_NATIONALITY_GCC_TO_GCC;
    this.docTransactionTypeIqama = NationalityConstants.MODIFY_NATIONALITY_GCC_TO_GCC_HAVING_IQAMA;
    this.docTransactionTypeBorder = NationalityConstants.MODIFY_NATIONALITY_GCC_TO_GCC_HAVING_BORDER_NO;
    this.transactionID = 300414;
   }
   else if(this.isGcc && !this.isOldImmigratedTribes && !this.isOldGcc){
    this.docTransactionID = NationalityConstants.MODIFY_NATIONALITY_NON_SAUDI_TO_GCC;
    this.docTransactionTypeIqama = NationalityConstants.MODIFY_NATIONALITY_NON_SAUDI_TO_GCC;
    this.docTransactionTypeBorder = NationalityConstants.MODIFY_NATIONALITY_NON_SAUDI_TO_GCC;
    this.transactionID = 300407;
   }
   else if(this.isImmigratedTribes && !this.isOldGcc){
    this.docTransactionID = NationalityConstants.MODIFY_NATIONALITY_NON_SAUDI_TO_IMMIGRATED_TRIBES;
    this.docTransactionTypeIqama = NationalityConstants.MODIFY_NATIONALITY_NON_SAUDI_TO_IMMIGRATED_TRIBES_HAVING_IQAMA;
    this.docTransactionTypeBorder = NationalityConstants.MODIFY_NATIONALITY_NON_SAUDI_TO_IMMIGRATED_TRIBES_HAVING_BORDER_NO;
    this.transactionID = 300402;
   }
   else if(this.isImmigratedTribes && this.isOldGcc){
    this.docTransactionID = NationalityConstants.MODIFY_NATIONALITY_GCC_TO_IMMIGRATED_TRIBES;
    this.docTransactionTypeIqama = NationalityConstants.MODIFY_NATIONALITY_GCC_TO_IMMIGRATED_TRIBES_HAVING_IQAMA;
    this.docTransactionTypeBorder = NationalityConstants.MODIFY_NATIONALITY_GCC_TO_IMMIGRATED_TRIBES_HAVING_BORDER_NO;
    this.transactionID = 300406;
   }
   else if(!this.isGcc && !this.isImmigratedTribes && this.isOldGcc){
    this.docTransactionID = NationalityConstants.MODIFY_NATIONALITY_GCC_TO_NON_SAUDI;
    this.docTransactionTypeIqama = NationalityConstants.MODIFY_NATIONALITY_GCC_TO_NON_SAUDI_HAVING_IQAMA;
    this.docTransactionTypeBorder = NationalityConstants.MODIFY_NATIONALITY_GCC_TO_NON_SAUDI_HAVING_BORDER_NO;
    this.transactionID = 300405;
   }
   else if(!this.isGcc && !this.isImmigratedTribes && this.isOldImmigratedTribes){
    this.docTransactionID = NationalityConstants.MODIFY_NATIONALITY_IMMIGRATED_TRIBES_TO_NON_SAUDI;
    this.docTransactionTypeIqama = NationalityConstants.MODIFY_NATIONALITY_IMMIGRATED_TRIBES_TO_NON_SAUDI_HAVING_IQAMA;
    this.docTransactionTypeBorder = NationalityConstants.MODIFY_NATIONALITY_IMMIGRATED_TRIBES_TO_NON_SAUDI_HAVING_BORDER_NO;
    this.transactionID = 300403;
   }
   else if(!this.isGcc && !this.isImmigratedTribes && !this.isOldImmigratedTribes && !this.isOldGcc){
    this.docTransactionID = NationalityConstants.NATIONALITY_TRANSACTIONID;
    this.docTransactionTypeIqama = NationalityConstants.NATIONALITY_HAVING_IQMA;
    this.docTransactionTypeBorder = NationalityConstants.NATIONALITY_HAVING_BORDERNUMBER;
    this.transactionID = 300400;
   }


  }
  validatorEditSubmit(){
    this.isFormEdited();
    this.modifyDetails = {

      contributorType: this.isGcc ? "GCC_Person" : this.isEditNationality ? "Immigrated_Tribe" : "Non_Saudi_Person",
      nationality: {
        arabic: this.modifyDetailsForm?.get('nationality')?.get('arabic').value,
        english: this.modifyDetailsForm?.get('nationality')?.get('english').value,

      },
      personIdentities: [

      ],

      referenceNo: this.referenceNo ? this.referenceNo : null,
      uuid: this.uuid,
      removeGccId: this.modifyDetailsForm?.get('checkBoxFlag').value ? true : false

    }
    if (this.modifyDetailsForm?.value?.passportNumber) {
      this.modifyDetails.personIdentities.push({
        idType: "PASSPORT",
        passportNo: this.modifyDetailsForm?.value?.passportNumber,
        expiryDate: {
          hijiri: this.modifyDetailsForm?.value?.passportExpiryDate?.hijiri,
          gregorian: startOfDay(this.modifyDetailsForm?.value?.passportExpiryDate?.gregorian),
          entryFormat : CalendarTypeEnum.GREGORIAN

        },
        issueDate: {

          hijiri: this.modifyDetailsForm?.value?.passportIssueDate?.hijiri,
          gregorian: startOfDay(this.modifyDetailsForm?.value?.passportIssueDate?.gregorian),
          entryFormat : CalendarTypeEnum.GREGORIAN

        }
      });

    }
    if (this.modifyDetailsForm?.value?.iqamaNo || this.iqmaNUmber?.iqamaNo) {
      this.modifyDetails.personIdentities.push({
        idType: "IQAMA",
        iqamaNo: this.modifyDetailsForm?.value?.iqamaNo ? this.modifyDetailsForm?.value?.iqamaNo :this.iqmaNUmber?.iqamaNo,
        expiryDate: null
      });
    }
   if (this.modifyDetailsForm?.value?.borderNo || this.borderNo?.id) {
      this.modifyDetails.personIdentities.push({
        idType: "BORDERNO",
        id: this.modifyDetailsForm?.value?.borderNo ? this.modifyDetailsForm?.value.borderNo : this.borderNo?.id,
      });
    }
   if (this.modifyDetailsForm?.value?.gccId) {
      this.modifyDetails.personIdentities.push({
        idType: "GCCID",
          id: this.modifyDetailsForm?.value?.gccId 
      });
    }
    if(this.isEdited){
    this.userActivityService.submitValidatorEditNationality(this.personNumber,this.referenceNumber,this.modifyDetails).subscribe((res : any) =>{
    this.validatorEditResponse = res;
    const workflowData = this.setWorkFlowDetails(TransactionOutcome.UPDATE);
    const outcome = WorkFlowActions.UPDATE;
    this.saveWorkflow(workflowData, outcome);
    })

  }
  else{
    this.alertService.showErrorByKey('CUSTOMER-INFORMATION.NO-MODIFICATION-FOUND');
  }
  }
  setWorkFlowDetails(action: string): BPMUpdateRequest {
    const data: BPMUpdateRequest = new BPMUpdateRequest();
    data.outcome = action;
    data.user = this.routerDataToken.assigneeId;
    data.taskId = this.routerDataToken.taskId;
    return data;

  }
  saveWorkflow(updateData: BPMUpdateRequest, outcome) {
    const bpmUpdateDataRequest = new BPMUpdateRequest();
    bpmUpdateDataRequest.outcome = outcome;
    bpmUpdateDataRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateDataRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateDataRequest.outcome = outcome;
    bpmUpdateDataRequest.commentScope = 'BPM';
    bpmUpdateDataRequest.payload = this.routerDataToken.content;
    if (updateData.comments) bpmUpdateDataRequest.comments = updateData.comments;
    this.workflowService.updateTaskWorkflow(bpmUpdateDataRequest, outcome).subscribe(
      () => {
         this.router.navigate([RouterConstants.ROUTE_INBOX]);
         this.alertService.showSuccess(this.validatorEditResponse?.bilingualMessage);
      },
      err => {
        // this.alertService.showError(err.error.message);
      }
    );

  }
  isFormEdited(){
    // Compare current form values with initial values
    const currentFormValues = this.modifyDetailsForm.value;
    const oldgccNo = this.oldgccNo ? this.oldgccNo : null;
    const oldPassportNo = this.oldPassportNo ? this.oldPassportNo : null;
    const oldIssueDate = this.oldIssueDate ? this.oldIssueDate : null;
    const oldExpiryDate = this.oldExpiryDate ? this.oldExpiryDate : null;
    
    if(currentFormValues?.gccId !== oldgccNo){
      this.gccidedited = true;
    }
    else if(currentFormValues?.passportNumber !== oldPassportNo){
      this.passportEdited = true;
    }
    else if(moment(currentFormValues?.passportIssueDate?.gregorian).format('DD/MM/YYYY') !== moment(oldIssueDate).format('DD/MM/YYYY')){
      this.passportIssueDateEdited = true;
    }
    else if(moment(currentFormValues?.passportExpiryDate?.gregorian).format('DD/MM/YYYY') !== moment(oldExpiryDate).format('DD/MM/YYYY')){
      this.passportExpiryDateEdited = true;
    }
  if(this.gccidedited || this.passportEdited || this.passportIssueDateEdited || this.passportExpiryDateEdited){
    this.isEdited = true
  }
}
}