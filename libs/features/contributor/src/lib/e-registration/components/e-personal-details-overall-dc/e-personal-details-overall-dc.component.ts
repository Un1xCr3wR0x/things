import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, checkNull, ContactDetails, IdentityTypeEnum, isObject, lengthValidator, LookupService, LovList, markFormGroupTouched, NationalId, NIN, ninValidator, Person, scrollToTop } from '@gosi-ui/core';
import { ContactDcComponent } from '@gosi-ui/foundation/form-fragments';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ContributorService, PersonalInformation, YesOrNo } from '../../../shared';
import { EAddressDetailsDcComponent } from '../e-address-details-dc/e-address-details-dc.component';
import { EContactDetailsDcComponent } from '../e-contact-details-dc/e-contact-details-dc.component';

@Component({
  selector: 'cnt-e-personal-details-overall-dc',
  templateUrl: './e-personal-details-overall-dc.component.html',
  styleUrls: ['./e-personal-details-overall-dc.component.css']
})
export class EPersonalDetailsOverallDcComponent implements OnInit, OnChanges {


  personalDetails:Person;
  // personDetail:Person;
  modalRef: BsModalRef;
  currentDate=new Date();
  booleanList: LovList;
  personalDetailForm: FormGroup;
  person: PersonalInformation;
  personNin: any[] = [];



  @ViewChild(EContactDetailsDcComponent, { static: false })
  eContactDetailsDcComponent:EContactDetailsDcComponent;
  @ViewChild(EAddressDetailsDcComponent,{static: false})
  eAddressDetailsDcComponent:EAddressDetailsDcComponent;

   /** Observables. */
   specializationList$: Observable<LovList>;
   educationList$: Observable<LovList>;
   cityList: Observable<LovList>;
   nationalityList: Observable<LovList>;

   /* local variables*/
   isMobileDefault= false;
   emailMandatory=true;
   contactDetails:any;
   idValue="cont";
   MIN_LENGTH = 10;
   MAX_LENGTH = 10;

  @Input() isApiTriggered: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() perDetails: PersonalInformation = new PersonalInformation();
  /**
   * Output event emitters
   */
  @Output() save: EventEmitter<object> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();


  constructor(readonly fb: FormBuilder,
    readonly lookupService: LookupService,
    private modalService: BsModalService,
    readonly alertService: AlertService,
    readonly contributorService: ContributorService
    ) { }

  ngOnInit(): void {
    this.personalDetailForm = this.createPersonDetailsForm()
    this.fetchLookUpDetails();
    this.booleanList = {
      items: [
        { value: { english: 'Yes', arabic: 'نعم' }, sequence: 0 },
        { value: { english: 'No', arabic: 'لا' }, sequence: 1 }
      ]
    };
    this.handleInitialisation()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.perDetails && changes.perDetails.currentValue){
        //console.log('estname', this.perDetails);
        this.personNin[0] = this.perDetails.identity[0];
        this.personalDetailForm.get('nationalId').get('id').setValue(this.personNin[0].newNin);
        // this.personalDetailForm.get('nationalId.id').setValue(this.personNin[0].newNin);
        //console.log("contact details ngonchanges : ",this.contactDetails);
        this.bindDataToForm(this.personalDetailForm, this.perDetails);
    }
  }
  bindDataToForm(formGroup: FormGroup, data: Person) {
    Object.keys(data).forEach(name => {
      if (formGroup.get(name) && data[name]) {
        if (name !== 'identity') {
          if (name === 'birthDate') {
            formGroup.get(name).get('gregorian').patchValue(new Date(data[name]['gregorian']));
          } else if (name === 'student' || name === 'prisoner') {
            if (data[name]) formGroup.get(name).get('english').patchValue(YesOrNo.YES);
          } else {
            formGroup.get(name).patchValue(data[name]);
          }
        }
      }
    });
    formGroup.updateValueAndValidity();
    formGroup.markAsPristine();
  }


  handleInitialisation(){
    this.person = this.contributorService.getPerson;
    //console.log("details in overall ",this.person);
    this.personNin[0] = this.person.identity[0];
    this.personalDetailForm.get('nationalId').get('id').setValue(this.personNin[0].newNin);
    this.personalDetailForm.get('birthDate').get('gregorian').setValue(moment(this.person.birthDate.gregorian).toDate())
  }

 /** Method to fetch lookup details. */
 fetchLookUpDetails(): void {
  this.specializationList$ = this.lookupService.getSpecializationList();
  this.educationList$ = this.lookupService.getEducationList();
  this.cityList = this.lookupService.getCityList();
  this.nationalityList = this.lookupService.getNationalityList();
 }

/** Method to create person details form. */
createPersonDetailsForm() {
  return this.fb.group({
    nationalId:this.fb.group({
        idType: [IdentityTypeEnum.NIN],
        id: [null,
          {
            validators: Validators.compose([
              Validators.required,
              lengthValidator(this.MIN_LENGTH),
              Validators.maxLength(this.MAX_LENGTH),
              Validators.pattern('[0-9]+'),
              ninValidator
            ]),
            updateOn: 'blur'
          }]

    }),
    birthDate: this.fb.group({
      gregorian: [null, { validators:Validators.compose([
        Validators.required])}],
      hijiri: [null],
      entryFormat: 'GREGORIAN'
    }),
    education: this.fb.group({
      english: [null, { validators: Validators.required, updateOn: 'blur' }],
      arabic: [null]
    }),
    specialization: this.fb.group({
      english: [null, { validators: Validators.required, updateOn: 'blur' }],
      arabic: [null]
    }),
    student: this.fb.group({
      english: ['No', { validators: Validators.required, updateOn: 'blur' }],
      arabic: null
    }),
    prisoner: this.fb.group({
      english: ['No', { validators: Validators.required, updateOn: 'blur' }],
      arabic: null
    })
  });
}



  onSavePersonalDetails(){
    this.personalDetails  = this.personalDetailForm.getRawValue();
    // const identity = new NIN();
    // identity.idType = IdentityTypeEnum.NIN;
    // identity.newNin = parseInt(this.personalDetailForm.get('nationalId').get('id').value)
    // this.personalDetails.identity =[identity];
    this.personalDetails = this.setResponse(new Person(), this.personalDetails);
    if(!this.isEditMode){
      this.personalDetails.personId = this.person?.personId;
      this.personalDetails.identity = this.person?.identity;
      this.personalDetails.nationality = this.person?.nationality;
      this.personalDetails.name = this.person?.name;
      this.personalDetails.birthDate = this.person?.birthDate;
      this.personalDetails.deathDate = this.person?.deathDate;
      this.personalDetails.maritalStatus = null;
      this.personalDetails.sex = this.person?.sex;
      this.personalDetails.userPreferences = this.person?.userPreferences
      this.personalDetails.proactive = null;
      this.personalDetails.lifeStatus = this.person?.lifeStatus;
      this.personalDetails.contributorType = null;
    }
    markFormGroupTouched(this.personalDetailForm)
    this.personalDetails.contactDetail=this.eContactDetailsDcComponent.onSave();
    this.personalDetails.contactDetail.emailId.secondary = null;
    this.personalDetails.contactDetail.mobileNo.isdCodeSecondary = null;
    this.personalDetails.contactDetail.mobileNo.secondary=null;
    this.personalDetails.contactDetail.telephoneNo.extensionSecondary= null;
    this.personalDetails.contactDetail.telephoneNo.secondary = null;
    this.personalDetails.contactDetail.addresses = this.eAddressDetailsDcComponent.onSave();
    this.personalDetails.contactDetail.faxNo = this.person?.contactDetail?.faxNo;
    this.personalDetails.contactDetail.currentMailingAddress = this.eAddressDetailsDcComponent.getmailingAddress();

    //console.log("personal Details",this.personalDetails);
    if(this.personalDetailForm.valid
      && this.eContactDetailsDcComponent.isContactValid()
      && this.eAddressDetailsDcComponent.isAddressValid()
      ){
      this.save.emit(
        this.personalDetails
      );
    }
    else this.showMandatoryFieldsError();
  }




  /** Method to bind form data to model */
setResponse(object, data) {
  if (data && object) {
    Object.keys(object).forEach(key => {
      if (key in data) {
        if (data[key]) {
          if (key === 'prisoner' || key === 'student') {
            object[key] = data[key]['english'] === 'No' ? false : true;
          }
          else {
            object[key] = data[key];
          }
        }
      }
    });
  }
  return { ...object };
}

  /**
   * This method is used to confirm cancellation of transaction
   * @param changes
   * @memberof EmploymentDetailsDcComponent
   */
  confirmCancel(): void {
    this.reset.emit();
    this.decline();
  }
  /**Method to hide modal */
  decline(): void {
    this.modalRef.hide();
  }

  /**
   * This method is used to show given template
   * @param template
   */
  showCancelTemplate(template: TemplateRef<HTMLElement>): void {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }

   /** Method to set mandatory fields validation (Use this as common method for all under this feature). */
   showMandatoryFieldsError() {
    this.isApiTriggered = false;
    scrollToTop();
    this.alertService.showMandatoryErrorMessage();
  }
}
