import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { InjuredContributors } from '../../shared/models/injured-contributors';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  AlertService,
  BilingualText,  
  bindToForm,  
  Contributor,
  LanguageToken,
  LovList,
  OccupationList,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Engagement, InjuryStatistics, Person, ProcessType } from '../../shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportGroupInjuryBase } from '../report-group-injury-details-dc/report-group-injury-base-dc';
import { GroupInjury } from '../../shared/models/group-injury-details';
import { GroupInjuryService } from '../../shared/services/group-injury.service';

@Component({
  selector: 'oh-injured-contributor-details-dc',
  templateUrl: './injured-contributor-details-dc.component.html',
  styleUrls: ['./injured-contributor-details-dc.component.scss']
})
export class InjuredContributorDetailsDcComponent extends ReportGroupInjuryBase implements OnInit, OnChanges {
  //Input variables
  @Input() injuredContributorList: InjuredContributors[] = [];
  @Input() isContributorFound: boolean;
  @Input() booleanList: LovList;
  @Input() contributorGroupInjuryForm: FormGroup;
  @Input() injuryStatistics: InjuryStatistics = new InjuryStatistics();
  @Input() socialInsuranceNo;
  @Input() person: Person;
  @Input() isAppPrivate: boolean;
  @Input() workFlowType: string;
  @Input() emergencyContact: number;
  @Input() occupationList: OccupationList;
  @Input() payeeT: number;
  @Input() prohibitUpdate = false;
  @Input() isdControl: string;
  @Input() injuryTypeChanged = false;
  @Input() engagement: Engagement = new Engagement();
  @Input() isAddressPresent = false;
  @Input() isAddressOptional = false;
  @Input() isValidator1 = false;
  @Input() isPoMandatory: Boolean;
  @Input() emergencyContactNo: string;
  @Input() length = 0;
  @Input() isValidatorView: boolean;
  @Input() processType = '';
  @Input() injuryReasonList: LovList;
  @Input() countryList: LovList;
  @Input() cityList: LovList;
  @Input() prohibitInspection = false;
  @Input() contributorInjuryDetails: GroupInjury[];
  @Input() contributorInjury: GroupInjury;
  @Input() isSaved: boolean = false;
  @Input() hasMandatoryDetails = true;
  //Output variables
  @Output() saveInjuredContributor: EventEmitter<GroupInjury> = new EventEmitter();
  @Output() resetContributorList: EventEmitter<GroupInjury[]> = new EventEmitter();
  @Output() searchContributor: EventEmitter<string> = new EventEmitter();
  @Output() saveContributorDetails: EventEmitter<GroupInjury[]> = new EventEmitter();
  @Output() previous: EventEmitter<null> = new EventEmitter();
  @Output() template: EventEmitter<null> = new EventEmitter();

  fail = false;
  showContributorEditMode = false;
  isInjuryReasonNull = false;
  showContributorTable = false;
  noResults = false;
  isMinimumContributorsPresent = false;
  showContributor = false;  
  searchByValue: string;
  occupation: BilingualText = new BilingualText();
  contributor: Contributor = new Contributor();
  addressForms = new FormGroup({});
  lang = '';
  modalRef: BsModalRef;
  payee = 2;
  contributorInjuryToEdit: GroupInjury;
  contributorListDetails: GroupInjury[] = [];
  constructor(
    readonly fb: FormBuilder,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly groupInjuryService: GroupInjuryService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.isContributorFound = false;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.contributorInjuryDetails && changes.contributorInjuryDetails.currentValue) {
      this.contributorInjuryDetails = changes.contributorInjuryDetails.currentValue;
      if (this.groupInjuryService.cancelTransaction) {
        this.contributorInjuryDetails = [];
      }
      this.checkIfContributorsAdded();
    }

    if (changes.isContributorFound && changes.isContributorFound.currentValue) {
      this.isContributorFound = changes.isContributorFound.currentValue;
    }
    if (this.isContributorFound) {
      this.isSaved = false;
    } else {
      this.isSaved = true;
    }
    if (changes.person && changes.person.currentValue) {
      this.person = changes.person.currentValue;
      if (this.person && this.person.personId) {
        this.isContributorFound = true;
      }
    }
  }

  checkIfContributorsAdded() {
    this.contributorInjuryDetails.forEach(contributor => {
      if (contributor.injuryReason === null) {
        this.hasMandatoryDetails = false;
        this.isInjuryReasonNull = true;
        contributor.isInjuryReasonNull = true;
      } else {
        contributor.isInjuryReasonNull = false;
      }
    });
    this.length = 0;
    if (this.contributorInjuryDetails && this.contributorInjuryDetails.length > 0) {
      this.contributorInjuryDetails.forEach(contributor => {
        if (!contributor.isDeleted) {
          this.length++;
        }
      });
    }
    if (this.length > 0) {
      this.showContributorTable = true;
      this.noResults = false;
    } else {
      this.noResults = true;
      this.showContributorTable = false;
      this.showContributor = false;
    }
    if (this.length > 1) {
      this.isMinimumContributorsPresent = true;
    } else {
      this.isMinimumContributorsPresent = false;
    }
  }

  expand(item) {
    this.contributorInjuryToEdit = item;
    this.groupInjuryService.setBulkInjuryRequestItemId(item.bulkInjuryRequestItemId);
    this.alertService.clearAlerts();
    this.contributorInjuryDetails.forEach(element => {
      if (element !== item) {
        element.isExpanded = false;
      }
    });
    item.isExpanded = !item.isExpanded;
    if (item.isExpanded) {
      this.showContributorEditMode = true;
      this.isContributorFound = true;
      //  this.isSaved=false;
    } else {
      this.showContributorEditMode = false;
    }
    this.bindInjuryContributorForm();
    let id;
    if (item.person.identity[0] !== null) {
      if (item.person.identity[0].idType === 'NIN') {
        id = item.person.identity[0].newNin;
      } else if (item.person.identity[0].idType === 'PASSPORT') {
        id = item.person.identity[0].passportNo;
      } else if (item.person.identity[0].idType === 'IQAMA') {
        id = item.person.identity[0].iqamaNo;
      } else if (item.person.identity[0].idType === 'BORDERNO') {
        id = item.person.identity[0].id;
      } else if (item.person.identity[0].idType === 'GCCID') {
        id = item.person.identity[0].id;
      }
    }
    this.searchContributor.emit(id);
  }
  bindInjuryContributorForm() {
    bindToForm(this.contributorGroupInjuryForm, this.contributorInjuryToEdit);
    this.contributorGroupInjuryForm
      .get('emergencyContactNo')
      .get('primary')
      .setValue(this.contributorInjuryToEdit.emergencyContactNo.primary);
    this.contributorInjuryToEdit.treatmentCompleted
      ? this.contributorGroupInjuryForm.get('treatmentCompleted.english').setValue('Yes')
      : this.contributorGroupInjuryForm.get('treatmentCompleted.english').setValue('No');
    if (this.contributorInjuryToEdit.allowancePayee === 2) {
      this.contributorGroupInjuryForm.get('payeeType.english').setValue('Contributor');
      this.contributorGroupInjuryForm.get('payeeType.arabic').setValue(' مشترك');
    } else if (this.contributorInjuryToEdit.allowancePayee === 1) {
      this.contributorGroupInjuryForm.get('payeeType.english').setValue('Establishment');
      this.contributorGroupInjuryForm.get('payeeType.arabic').setValue('منشأة');
    }
    this.person = this.contributorInjuryToEdit.person;
    this.payeeT = this.contributorInjuryToEdit.allowancePayee;
    this.emergencyContactNo = this.contributorInjuryToEdit.emergencyContactNo.primary;
    this.contributorGroupInjuryForm.get('searchForm')?.get('nin').setValue(this.searchByValue);
    this.contributorGroupInjuryForm.updateValueAndValidity();
  }
  showModal(template: TemplateRef<HTMLElement>) {
    this.alertService.clearAlerts();
    this.modalRef = this.modalService.show(template);
  }
  decline() {
    this.showContributorEditMode = false;
    this.modalRef.hide();
  }
  onDeleteContributor(item) {
    this.alertService.clearAlerts();
    this.contributorInjuryDetails.forEach(contributor => {
      if (contributor.contributorId === item.contributorId) {
        item.isDeleted = true;
        contributor.isDeleted = true;
      }
    });
    this.showContributorEditMode = false;
    this.checkIfContributorsAdded();
    this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.GROUP-INJURY.CONTRIBUTOR_DELETED_SUCCESSFULLY');
    this.modalRef.hide();
  }
  addAnotherContrbutor() {
    this.showContributor = true;
    this.showContributorEditMode = false;
    this.isContributorFound = false;
    this.contributorGroupInjuryForm = this.createContributorGroupInjuryForm();
    this.emergencyContactNo = null;
  }
  showSelectContributor() {
    this.showContributor = true;
    this.showContributorEditMode = false;
  }
  search(searchValue) {
    this.searchContributor.emit(searchValue);
  }
  submitContributorDetails() {
    this.contributorInjuryDetails.forEach(contributor => {
      if (contributor.injuryReason === null) {
        this.hasMandatoryDetails = false;
        this.isInjuryReasonNull = true;
        contributor.isInjuryReasonNull = true;
      } else {
        contributor.isInjuryReasonNull = false;
      }
    });
    if (this.isSaved && this.hasMandatoryDetails) {
      this.saveContributorDetails.emit(this.contributorInjuryDetails);
      this.fail = false;
    } else {
      if (this.isContributorFound) {
        this.alertService.showMandatoryErrorMessage();
        this.fail = true;
      }
    }
    if (!this.hasMandatoryDetails && this.isInjuryReasonNull) {
      this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.GROUP-INJURY.INJURY-REASON-NOT-AVAILABLE');
      this.fail = true;
    }
  }
  resetContributorDetails(contributorList: GroupInjury[]) {
    this.hasMandatoryDetails = true;
    this.showContributor = false;
    this.showContributorEditMode = false;
    this.isContributorFound = false;
    this.contributorGroupInjuryForm = this.createContributorGroupInjuryForm();
    if (contributorList) {
      this.contributorListDetails = [];
      contributorList.forEach(contributor => {        
          this.contributorListDetails.push(contributor);        
      });
      this.contributorInjuryDetails = this.contributorListDetails;
      this.noResults = false;
    }
    if (this.contributorListDetails.length > 1) {
      this.isMinimumContributorsPresent = true;
    } else {
      this.isMinimumContributorsPresent = false;
    }
    if (this.isContributorFound) {
      this.isSaved = false;
    } else {
      this.isSaved = true;
      this.fail = false;
    }
    this.resetContributorList.emit(this.contributorInjuryDetails);
  }
  savecheck(contributorInjury: GroupInjury) {
    this.isSaved = true;
    this.saveInjuredContributor.emit(contributorInjury);
  }
  createContributorGroupInjuryForm() {
    return this.fb.group({
      accidentType: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      injuryReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      occupation: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      treatmentCompleted: this.fb.group({
        english: ['No', { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      injuryLeadsToDeathIndicator: [false, { updateOn: blur }],
      deathDate: this.fb.group({
        gregorian: [null],
        hijiri: [null]
      }),
      payeeType: this.fb.group({
        english: ['Contributor', { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      emergencyContactNo: this.fb.group({
        primary: [
          null,
          {
            validators: Validators.compose([Validators.required, Validators.pattern('[0-9]+')]),
            updateOn: 'blur'
          }
        ],
        isdCodePrimary: ['sa', { updateOn: 'blur' }],
        secondary: [null],
        isdCodeSecondary: [null, { updateOn: 'blur' }]
      })
    });
  }
  /**
   * This method is to navigate to the previous section of the form
   */
  previousSection() {
    this.previous.emit();
  }
  showCancelTemplate() {
    this.template.emit();
  }
}
