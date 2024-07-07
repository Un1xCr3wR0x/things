import { Component, Input, OnChanges, SimpleChanges, TemplateRef, OnDestroy, ElementRef, Inject } from '@angular/core';
import { EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import {
  Lov,
  LovList,
  OccupationList,
  LookupService,
  LovCategoryList,
  scrollToTop,
  AlertService,
  LanguageToken,
  BilingualText,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  RouterData
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  OccupationDetails,
  EngagementDTO,
  EngagementDetailsDTO,
  EngagementDetailsList,
  EngagementPeriod,
  OccupationEngagementDetails,
  deepCopy,
  ProcessType,
  OhService,
  OccupationDetail
} from '../../shared';
import { DiseaseConstants } from '../../shared/constants/disease-constants';
@Component({
  selector: 'oh-select-occupation-dc',
  templateUrl: './select-occupation-dc.component.html',
  styleUrls: ['./select-occupation-dc.component.scss']
})
export class SelectOccupationDcComponent implements OnInit, OnChanges, OnDestroy {
  // input variables
  @Input() occupationDetailsForm: FormGroup = new FormGroup({});
  @Input() engagementDetailsForm: FormArray = new FormArray([]);
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() disableEst: boolean;
  @Input() isOccupationsLoaded: boolean;
  @Input() isOccupation = true;
  @Input() establishmentName$: LovList;
  @Input() routerData: RouterData;
  @Input() processType = '';
  @Input() occupationsList: LovCategoryList;
  @Input() occupationsCausedDisease: OccupationDetails[];
  @Input() engagementOccupationDetails: EngagementDTO[];
  @Input() registeredOccupatonsList: { items: any[] };
  // output variables
  @Output() addEngagement: EventEmitter<null> = new EventEmitter();
  @Output() remove: EventEmitter<number> = new EventEmitter();
  @Output() onDelete: EventEmitter<EngagementDetailsDTO[]> = new EventEmitter();
  @Output() onRemove: EventEmitter<null> = new EventEmitter();
  @Output() getOccupationDetails: EventEmitter<EngagementDetailsDTO[]> = new EventEmitter();
  @Output() getEngagementDetails: EventEmitter<OccupationDetail> = new EventEmitter();
  @Output() select = new EventEmitter<{ establishmentName$: Lov; index: number }>();
  @Output() edited: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('mainContainer') container: ElementRef;

  newOccupationForm: FormGroup;
  occupationForm: FormGroup;
  maxDate: Date;
  modalRef: BsModalRef;
  occupationList$: Observable<OccupationList>;
  engagementForm = new FormControl();
  occupationFormFlag: FormGroup = new FormGroup({});
  isDisabled: boolean;
  isOccupationSelected: boolean;
  engagementDetailsToSave: EngagementDetailsDTO[] = [];
  engagementDetailsCopy: EngagementDetailsDTO[] = [];
  engagementDetailsToDisplay: OccupationEngagementDetails[] = [];
  occupationDetailsToEdit: OccupationEngagementDetails;
  occupationToEdit = '';
  index = 0;
  editedOccupation = false;
  noOccupationResults = true;
  noEngagementResults = true;
  noEngagementsLoaded = true;
  establishmentsList = [];
  occupationEngagements = [];
  occupationEngagementids = [];
  showOccupation = false;
  showAnotherOccupation = false;
  textAreaVisible = false;
  showEstablishmentTable = false;
  showEngagementList = false;
  showOccupationEditMode = false;
  establishmentName: string;
  selectedOccupation: string;
  selectedOccupationType: string;
  oldOccupationValue: string;
  engagementId = 0;
  disableOccupation: boolean;
  occupationEngagementId = 0;
  engagementResults: EngagementDetailsList[] = [];
  establishmentOccupationKey: string;
  lang: string;
  canReplaceExistingOccupation = false;
  occupation: BilingualText = new BilingualText();
  occupationType: BilingualText = new BilingualText();
  @ViewChild('addExistingOccupation') addExistingOccupation: TemplateRef<HTMLElement>;

  constructor(
    readonly fb: FormBuilder,
    readonly lookUpService: LookupService,
    private modalService: BsModalService,
    private alertService: AlertService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private ohService: OhService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}
  ngOnInit(): void {
    //Method to initialize changes
    this.isOccupationSelected = false;
    this.createOccupationForm();
    this.maxDate = new Date();
    this.occupationFormFlag = this.createOccupationFormFlag();
    this.language.subscribe(language => (this.lang = language));
    if (
      this.appToken === ApplicationTypeEnum.PUBLIC &&
      (this.processType === ProcessType.RE_OPEN || this.processType === ProcessType.EDIT) &&
      this.routerData.taskId !== null &&
      this.routerData.taskId !== undefined
    ) {
      this.disableOccupation = true;
    } else {
      this.disableOccupation = false;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.occupationsCausedDisease && changes.occupationsCausedDisease.currentValue) {
      this.occupationsCausedDisease = changes.occupationsCausedDisease.currentValue;
      if (this.occupationsCausedDisease.length > 0) {
        this.noOccupationResults = false;
      } else {
        this.noOccupationResults = true;
      }
    }
    if (changes.disableEst && changes.disableEst.currentValue) {
      this.disableEst = changes.disableEst.currentValue;
    }

    if (changes.engagementOccupationDetails && changes.engagementOccupationDetails.currentValue) {
      this.engagementOccupationDetails = changes.engagementOccupationDetails.currentValue;
    }
    if (this.engagementOccupationDetails && this.engagementOccupationDetails.length > 0) {
      this.noEngagementResults = false;
      this.populateEngagementTabelData(this.engagementOccupationDetails);
    } else {
      this.noEngagementResults = true;
      this.engagementResults = [];
    }
    if (this.processType === ProcessType.MODIFY || this.processType === ProcessType.EDIT ||  this.processType === ProcessType.RE_OPEN) {
      if (this.occupationDetailsToEdit) {
        this.occupationToEdit =
          this.occupationDetailsToEdit.establishmentName.english +
          '-' +
          this.occupationDetailsToEdit.occupationName.english;
      }

      if (this.occupationsCausedDisease && this.occupationsCausedDisease.length > 0 && !this.showAnotherOccupation) {
        this.engagementDetailsToDisplay = [];

        this.convertToEngagementDetails(this.occupationsCausedDisease);
      }
    }
  }
  convertToEngagementDetails(occupationsCausedDisease: OccupationDetails[]) {
    this.engagementResults = [];
    occupationsCausedDisease.forEach(engagement => {
      if (engagement.diseaseOccupationDetails && engagement.diseaseOccupationDetails.length > 0) {
        engagement.diseaseOccupationDetails.forEach(element => {
          const engagementToSave = new EngagementDetailsDTO();
          engagementToSave.endDate = element.endDate;
          engagementToSave.startDate = element.startDate;
          engagementToSave.establishmentRegNo = element.registrationNo;
          if(element.engagementId){
            engagementToSave.engagementId = element.engagementId;
          }         
          engagementToSave.establishmentName = element.establishmentName;
          if (!engagementToSave.establishmentName.english) {
            engagementToSave.establishmentName.english = engagementToSave.establishmentName.arabic;
          }
          engagementToSave.isExpanded = false;
          engagementToSave.isRemoved = false;
          engagementToSave.occupationName = element.occupation;
          if (element.manual) {
            engagementToSave.occupationType.english = DiseaseConstants.MANUAL_OCCUPATION;
          } else {
            if (this.checkIfRegisteredCategory(engagementToSave.occupationName.english)) {
              engagementToSave.occupationType.english = DiseaseConstants.REGISTERED_OCCUPATION;
            } else {
              engagementToSave.occupationType.english = DiseaseConstants.NONREGISTERED_OCCUPATION;
            }
          }
          engagementToSave.establishmentOccupationKey =
            element.establishmentName.english + '-' + element.occupation.english;
          this.engagementDetailsToSave.push(engagementToSave);
        });
      }
    });
    this.engagementDetailsToSave = this.engagementDetailsToSave.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          i =>
            i.startDate === item.startDate &&
            i.endDate === item.endDate &&
            i.establishmentName.english === item.establishmentName.english
        )
    );
    if (this.engagementDetailsToSave.length > 0) {
      let index = 0;
      this.engagementDetailsToSave.forEach(engagement => {
        const occupationDetails: OccupationEngagementDetails = new OccupationEngagementDetails();
        occupationDetails.establishmentName = engagement.establishmentName;
        if(engagement.engagementId){
          occupationDetails.engagementId = engagement.engagementId;
        }      
        occupationDetails.occupationName = engagement.occupationName;
        occupationDetails.startDate = engagement.startDate;
        occupationDetails.endDate = engagement.endDate;
        occupationDetails.occupationType = engagement.occupationType;
        occupationDetails.occupationEngagementId = index++;
        occupationDetails.occupationEngagementValue = engagement.occupationName.english;
        if (!engagement.isRemoved) {
          if (this.engagementDetailsToDisplay.length > 0) {
            if (!this.containsObject(engagement, this.engagementDetailsToDisplay)) {
              this.engagementDetailsToDisplay.push(occupationDetails);
            }
          } else {
            this.engagementDetailsToDisplay.push(occupationDetails);
          }
        }
      });
    }

    this.getOccupationDetails.emit(this.engagementDetailsToSave);
  }

  onDeleteOccupation(index: number) {
    this.alertService.clearAlerts();
    let occupation = this.engagementDetailsToDisplay[index].occupationName.english;
    let establishment = this.engagementDetailsToDisplay[index].establishmentName.english;
    this.establishmentOccupationKey = establishment + '-' + occupation;
    this.engagementDetailsToSave = this.engagementDetailsToSave.filter(
      item => item.establishmentOccupationKey !== this.establishmentOccupationKey
    );
    this.engagementDetailsToDisplay.splice(index, 1);
    if (this.engagementDetailsToDisplay.length === 0) {
      this.occupationDetailsForm?.get('occupationForm')?.get('occupation').reset();
      this.occupationDetailsForm.updateValueAndValidity();
      this.noOccupationResults = true;
      this.showOccupation = false;
      this.showEstablishmentTable = false;
      this.noEngagementsLoaded = true;
      this.engagementResults = [];
      this.engagementDetailsToSave = [];
      this.loadEngagement(this.establishmentName, this.oldOccupationValue, this.establishmentOccupationKey);
    }
    this.showOccupationEditMode = false;
    this.modalRef.hide();
    this.onDelete.emit(this.engagementDetailsToSave);
  }
  showModal(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  decline() {
    this.showOccupationEditMode = false;
    this.modalRef.hide();
  }
  onAddEngagement() {
    //Method to Add Another engagement
    if (this.engagementDetailsForm.valid) {
      this.engagementDetailsForm.push(this.createEngagementDetailsForm());
      this.addEngagement.emit();
    }
  }
  onSelect(establishmentName: Lov, index: number) {
    //Method to add a row of establishment
    this.select.emit({ establishmentName$: establishmentName, index: index });
  }
  createEngagementDetailsForm() {
    return this.fb.group({
      establishmentName: this.fb.group({
        english: [null, { Validators: Validators.required }],
        arabic: [null]
      }),
      engagementPeriod: this.fb.group({
        english: [null, { Validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  createOccupationForm() {
    this.occupationForm = this.fb.group({
      occupation: this.fb.group({
        english: [null, { Validators: Validators.required }],
        arabic: [null]
      })
    });
    this.occupationDetailsForm.addControl('occupationForm', this.occupationForm);
    if (this.occupationDetailsForm.get('newOccupationForm')) {
      this.occupationDetailsForm.removeControl('newOccupationForm');
    }
  }
  createNewOccupation() {
    this.newOccupationForm = this.fb.group({
      newOccupation: [null, Validators.compose([Validators.required, Validators.maxLength(100)])]
    });
    this.occupationDetailsForm.addControl('newOccupationForm', this.newOccupationForm);
    if (this.occupationDetailsForm.get('occupationForm')) {
      this.occupationDetailsForm.removeControl('occupationForm');
    }
  }
  createOccupationFormFlag() {
    return this.fb.group({
      checkBoxFlag: [false]
    });
  }
  setIndex(i: number) {
    if (this.isOccupation) return i + 1;
  }
  editOccupation(engagement: EngagementDetailsDTO) {
    engagement.isExpanded = !engagement.isExpanded;
  }
  showTextArea(event) {
    if (event === 'true') {
      this.textAreaVisible = true;
      this.createNewOccupation();
      if (this.occupationDetailsForm.get('occupationForm')) {
        this.occupationDetailsForm.get('occupationForm').get('occupation').reset();
      }
      this.isDisabled = true;
      this.getEngagementDetails.emit(null);
    } else {
      this.resetOccupationForm();
    }
    this.isOccupationSelected = false;
  }
  cancel() {
    //close select occupation section
    this.showOccupation = false;
    this.showOccupationEditMode = false;
    if (this.engagementDetailsToDisplay && this.engagementDetailsToDisplay.length > 0) {
      this.engagementDetailsToDisplay.forEach(element => {
        element.isExpanded = false;
      });
      this.noOccupationResults = false;
    } else {
      this.noOccupationResults = true;
    }
    this.occupationDetailsForm.reset();
    this.engagementResults = [];
    this.resetOccupationForm();
    this.occupationFormFlag.get('checkBoxFlag').setValue(false);
  }
  resetOccupationForm() {
    this.createOccupationForm();
    if (this.occupationDetailsForm.get('newOccupationForm')) {
      this.occupationDetailsForm.removeControl('newOccupationForm');
    }
    this.isDisabled = false;
    this.textAreaVisible = false;
  }
  resetEngagements() {
    if (this.engagementDetailsToSave.length > 0) {
      this.engagementResults.forEach(newEngagement => {
        const newOccupationEstablishment =
          newEngagement.establishmentName.english + '-' + newEngagement.occupation.english;
        this.engagementDetailsToSave = this.engagementDetailsToSave.filter(
          x => x.establishmentOccupationKey !== newOccupationEstablishment
        );
      });
    }
  }
  saveOccupationDetails() {
    this.alertService.clearAlerts();
    this.showEstablishmentTable = true;
    if (this.occupationDetailsForm.get('newOccupationForm')) {
      this.occupationDetailsForm.get('newOccupationForm').markAllAsTouched();
      this.occupation.english = this.occupationDetailsForm.get('newOccupationForm').get('newOccupation').value;
      this.occupation.arabic = this.occupationDetailsForm.get('newOccupationForm').get('newOccupation').value;
      this.occupationType.english = DiseaseConstants.MANUAL_OCCUPATION;
    } else if (this.occupationDetailsForm.get('occupationForm')) {
      this.occupationDetailsForm.get('occupationForm').markAllAsTouched();
      this.occupation = this.occupationDetailsForm.get('occupationForm').get('occupation').value;
      if (this.checkIfRegisteredCategory(this.occupation.english)) {
        this.occupationType.english = DiseaseConstants.REGISTERED_OCCUPATION;
      } else {
        this.occupationType.english = DiseaseConstants.NONREGISTERED_OCCUPATION;
      }
      //this.occupationType = this.ohService.getSelectedOccType();
    }
    if (this.occupation && this.occupation.english) {
      if (
        this.occupationType.english === DiseaseConstants.MANUAL_OCCUPATION &&
        this.checkIfOccupationInList(this.occupation.english)
      ) {
        this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.DISEASE.OCCUPATION_ALREADY_PRESENT');
      } else {
        if (!this.showOccupationEditMode) {
          if (!this.checkIfOccupationAlreadyAdded(this.occupation.english)) {
            this.engagementResults.forEach(element => {
              const engagement = new EngagementDetailsDTO();
              if(element.engagementId){
                engagement.engagementId = element.engagementId;
              }             
              engagement.establishmentName = element.establishmentName;
              engagement.establishmentRegNo = element.establishmentRegNo;
              engagement.startDate = element.engagementPeriod[0].startDate;
              engagement.endDate = element.engagementPeriod[0].endDate;
              engagement.isExpanded = false;
              if (element.isRemoved) {
                engagement.isRemoved = element.isRemoved;
                engagement.isSavedAfterDelete = element.isRemoved;
              } else {
                engagement.isRemoved = false;
              }
              engagement.occupationName = deepCopy(this.occupation);
              engagement.occupationType = deepCopy(this.occupationType);
              engagement.establishmentOccupationKey =
                engagement.establishmentName.english + '-' + engagement.occupationName.english;
              this.engagementDetailsToSave.push(engagement);
            });
            if (this.engagementDetailsToSave.length > 0) {
              let index = 0;
              this.engagementDetailsToSave.forEach(engagement => {
                const occupationDetails: OccupationEngagementDetails = new OccupationEngagementDetails();
                occupationDetails.establishmentName = engagement.establishmentName;
                if(engagement.engagementId){
                  occupationDetails.engagementId = engagement.engagementId;
                }              
                occupationDetails.occupationName = engagement.occupationName;
                occupationDetails.startDate = engagement.startDate;
                occupationDetails.endDate = engagement.endDate;
                occupationDetails.occupationType = engagement.occupationType;
                occupationDetails.occupationEngagementId = index++;
                occupationDetails.occupationEngagementValue = engagement.occupationName.english;
                if (!engagement.isRemoved) {
                  if (this.engagementDetailsToDisplay.length > 0) {
                    if (!this.containsObject(engagement, this.engagementDetailsToDisplay)) {
                      this.engagementDetailsToDisplay.push(occupationDetails);
                    }
                  } else {
                    this.engagementDetailsToDisplay.push(occupationDetails);
                  }
                }
              });
            }
            if (this.processType === ProcessType.EDIT || this.processType === ProcessType.RE_OPEN ) {
              this.editedOccupation = true;
              this.edited.emit(this.editedOccupation);
            }
            this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.DISEASE.OCCUPATION_ADDED_SUCCESSFULLY');
          } else {
            this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.DISEASE.OCCUPATION_ALREADY_ADDED');
          }
        } else {
          if (!this.checkIfOccupationAlreadyAdded(this.occupation.english)) {
            if (this.establishmentName) {
              const engagementEntitiesToUpdate = this.engagementDetailsToSave.filter(
                x =>
                  x.establishmentName.english === this.establishmentName &&
                  x.occupationName.english === this.oldOccupationValue
              );
              if (engagementEntitiesToUpdate && engagementEntitiesToUpdate.length > 0) {
                this.engagementDetailsToSave = this.engagementDetailsToSave.filter(
                  x => x.establishmentOccupationKey !== this.establishmentOccupationKey
                );
              }
              this.engagementResults.forEach(element => {
                const engagement = new EngagementDetailsDTO();
                if(element.engagementId){
                  engagement.engagementId = element.engagementId;
                }                
                engagement.establishmentName = element.establishmentName;
                engagement.establishmentRegNo = element.establishmentRegNo;
                engagement.startDate = element.engagementPeriod[0].startDate;
                engagement.endDate = element.engagementPeriod[0].endDate;
                engagement.isExpanded = false;
                if (element.isRemoved) {
                  engagement.isRemoved = element.isRemoved;
                  engagement.isSavedAfterDelete = element.isRemoved;
                } else {
                  engagement.isRemoved = false;
                }
                engagement.occupationName = deepCopy(this.occupation);
                engagement.occupationType = deepCopy(this.occupationType);
                engagement.establishmentOccupationKey =
                  engagement.establishmentName.english + '-' + engagement.occupationName.english;
                this.engagementDetailsToSave.push(engagement);
              });
              this.engagementDetailsToDisplay.forEach(engagementEntity => {
                if (
                  engagementEntity.establishmentName.english === this.establishmentName &&
                  engagementEntity.occupationName.english === this.oldOccupationValue
                ) {
                  this.establishmentName = engagementEntity.establishmentName.english;
                  this.oldOccupationValue = engagementEntity.occupationName.english;
                  const index: number = this.engagementDetailsToDisplay.indexOf(engagementEntity);
                  this.engagementDetailsToDisplay.splice(index, 1);
                }
              });
              if (this.engagementDetailsToSave.length > 0) {
                let index = 0;
                this.engagementDetailsToSave.forEach(engagement => {
                  const occupationDetails: OccupationEngagementDetails = new OccupationEngagementDetails();
                  occupationDetails.establishmentName = engagement.establishmentName;
                  occupationDetails.occupationName = engagement.occupationName;
                  occupationDetails.occupationType = engagement.occupationType;
                  if(engagement.engagementId){
                    occupationDetails.engagementId = engagement.engagementId;
                  }                 
                  occupationDetails.isRemoved = engagement.isRemoved;
                  occupationDetails.occupationEngagementId = index++;
                  occupationDetails.occupationEngagementValue = engagement.occupationName.english;
                  if (!engagement.isRemoved) {
                    if (this.engagementDetailsToDisplay.length > 0) {
                      if (this.oldOccupationValue !== this.occupation.english) {
                        if (
                          !this.containsObject(engagement, this.engagementDetailsToDisplay) &&
                          occupationDetails.occupationName.english !== this.oldOccupationValue
                        ) {
                          this.engagementDetailsToDisplay.push(occupationDetails);
                        }
                      } else {
                        if (!this.containsObject(engagement, this.engagementDetailsToDisplay)) {
                          this.engagementDetailsToDisplay.push(occupationDetails);
                        }
                      }
                    } else {
                      this.engagementDetailsToDisplay.push(occupationDetails);
                    }
                  }
                });
              }
              this.editedOccupation = true;
              this.edited.emit(this.editedOccupation);
              this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.DISEASE.OCCUPATION_UPDATED_SUCCESSFULLY');
            }
          } else {
            this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.DISEASE.OCCUPATION_ALREADY_ADDED');
          }
        }
      }
      this.getOccupationDetails.emit(this.engagementDetailsToSave);
      scrollToTop();
    } else {
      this.showEstablishmentTable = false;
      this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.DISEASE.OCCUPATIONS_NOT_ADDED');
    }
    this.occupationDetailsForm.reset();
  }
  containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (
        list[i].establishmentName.english === obj.establishmentName.english &&
        list[i].occupationName.english === obj.occupationName.english
      ) {
        return true;
      }
    }
    return false;
  }
  checkIfOccupationInList(occupation: string) {
    let exists = false;
    this.occupationsList.items.forEach(item => {
      if (
        occupation === item.value.arabic ||
        (item.value.english && occupation.toLowerCase() === item.value.english.toLowerCase())
      ) {
        exists = true;
        this.showEstablishmentTable = false;
      }
    });
    return exists;
  }
  checkIfOccupationAlreadyAdded(occupation: string) {
    let exists = false;
    if (!this.canReplaceExistingOccupation) {
      this.occupationEngagements = [];
      this.occupationEngagementids = [];
      this.occupationEngagements = this.engagementDetailsToDisplay.filter(
        res => res.occupationEngagementValue === occupation
      );
      this.engagementDetailsToDisplay.forEach(engagement => {
        if (this.showOccupationEditMode) {
          if (this.occupationEngagements.length > 0) {
            this.occupationEngagements.forEach(item => {
              this.occupationEngagementids.push(item.occupationEngagementId);
            });
          }
          if (
            this.occupationEngagementids.length > 0 &&
            !this.occupationEngagementids.includes(this.occupationDetailsToEdit.occupationEngagementId)
          ) {
            exists = true;
            // this.showAddConfirmationModal(this.addExistingOccupation);
          }
        } else {
          if (occupation === engagement.occupationName.english) {
            exists = true;
            // this.showAddConfirmationModal(this.addExistingOccupation);
          }
        }
      });
    }
    return exists;
  }
  checkIfEngagementAlreadyAdded(engagement: EngagementDetailsDTO, list: OccupationEngagementDetails[]) {
    let exists = false;
    list.forEach(item => {
      if (
        engagement.startDate === item.startDate &&
        engagement.endDate === item.endDate &&
        engagement.occupationName === item.occupationName &&
        engagement.establishmentName === item.establishmentName
      ) {
        exists = true;
      }
    });
    return exists;
  }
  expand(item) {
    this.occupationDetailsToEdit = item;
    this.alertService.clearAlerts();
    this.engagementDetailsToDisplay.forEach(element => {
      if (element.engagementId !== item.engagementId) {
        element.isExpanded = false;
      }
    });
    item.isExpanded = !item.isExpanded;
    this.engagementId = item.engagementId;
    this.occupationEngagementId = item.occupationEngagementId;
    if (item.isExpanded) {
      this.showOccupationEditMode = true;
      if (item.occupationName && item.occupationName.english) {
        if (item.occupationType.english === DiseaseConstants.MANUAL_OCCUPATION) {
          this.textAreaVisible = true;
          this.occupationFormFlag.get('checkBoxFlag').setValue(true);
          this.isDisabled = true;
          this.occupationDetailsForm.get('occupationForm')?.get('occupation').reset();
          this.createNewOccupation();
          this.occupationDetailsForm.get('newOccupationForm')?.get('newOccupation').reset();
          this.occupationDetailsForm
            .get('newOccupationForm')
            ?.get('newOccupation')
            .patchValue(item.occupationName.english);
        } else {
          this.textAreaVisible = false;
          this.occupationFormFlag.get('checkBoxFlag').setValue(false);
          this.isDisabled = false;
          this.isOccupationSelected = true;
          this.createOccupationForm();        
          this.occupationDetailsForm.get('occupationForm')?.get('occupation').reset();
          this.occupationDetailsForm.get('occupationForm')?.get('occupation').patchValue(item.occupationName);
        }
      }
      this.establishmentName = item.establishmentName.english;
      this.oldOccupationValue = item.occupationName.english;
      this.establishmentOccupationKey = this.establishmentName + '-' + this.oldOccupationValue;
      this.loadEngagement(this.establishmentName, this.oldOccupationValue, this.establishmentOccupationKey); //load engagement table data
    } else {
      this.showOccupationEditMode = false;
    }
    this.occupationType = item.occupationType;
  }
  loadEngagement(establishmentName, occupationValue, establishmentOccupationKey) {
    this.engagementResults = [];
    let engagementResults = [];
    engagementResults = this.engagementDetailsToSave.filter(function (obj) {
      return obj.establishmentOccupationKey === establishmentOccupationKey;
    });
    if (engagementResults && engagementResults.length > 0) {
      engagementResults.forEach(engagement => {
        const engagementDetails: EngagementDetailsList = new EngagementDetailsList();
        const engagementPeriod: EngagementPeriod = new EngagementPeriod();
        engagementDetails.establishmentName = engagement.establishmentName;
        engagementDetails.establishmentRegNo = engagement.establishmentRegNo;
        engagementDetails.occupation = engagement.occupationName;
        engagementDetails.occupationType = engagement.occupationType;
        engagementDetails.engagementId = engagement.engagementId;
        engagementDetails.isRemoved = engagement.isRemoved;
        engagementPeriod.startDate = engagement.startDate;
        engagementPeriod.endDate = engagement.endDate;
        engagementDetails.engagementPeriod = [];
        engagementDetails.engagementPeriod.push(engagementPeriod);
        /* if(this.engagementResults.length>0)  {
          this.engagementResults.forEach(element => {
            if(element.engagementPeriod[0].startDate !== engagementDetails.engagementPeriod[0].startDate && 
              element.engagementPeriod[0].endDate !== engagementDetails.engagementPeriod[0].endDate){
                this.engagementResults.push(engagementDetails);
              }
          });
        } else { */
        this.engagementResults.push(engagementDetails);
        //  }
        this.noEngagementResults = false;
      });
    }
    this.engagementResults = this.engagementResults.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          i =>
            i.engagementPeriod[0].startDate === item.engagementPeriod[0].startDate &&
            i.engagementPeriod[0].endDate === item.engagementPeriod[0].endDate &&
            i.establishmentName.english === item.establishmentName.english &&
            i.engagementId === item.engagementId
        )
    );
  }
  showSelectOccupation() {
    this.showOccupation = true;
    this.showEstablishmentTable = false;
  }
  selectAnotherOccupation() {
    this.showTextArea(event);
    this.occupationFormFlag.get('checkBoxFlag').reset();
    this.alertService.clearAlerts();
    this.showOccupation = true;
    this.showAnotherOccupation = true;
    this.showEngagementList = true;
    this.showOccupationEditMode = false;
    this.showEstablishmentTable = false;
    this.occupationDetailsForm?.get('occupationForm')?.get('occupation').reset();
    this.occupationDetailsForm?.get('newOccupationForm')?.get('newOccupation').reset();
    this.occupationDetailsForm.reset();
    this.engagementResults = [];
    this.noEngagementResults = false;
    this.isOccupationSelected = false;
  }
  getEngagements(occupation: OccupationDetail) {
    this.isOccupationSelected = true;
    if (this.checkIfRegisteredCategory(occupation.occupationName.english)) {
      this.getEngagementDetails.emit(occupation);
    } else {
      this.getEngagementDetails.emit(null);
    }
    this.noEngagementsLoaded = false;
    this.selectedOccupation = occupation.occupationName.english;
    this.selectedOccupationType = occupation.occupationType.english;
    this.ohService.setSelectedOccType(occupation.occupationType);
  }
  checkIfRegisteredCategory(occupation: string) {
    let registered = false;
    if (this.occupationsList && this.occupationsList.items) {
      this.occupationsList.items.forEach(lov => {
        if (lov.value.english === occupation) {
          if (lov?.category?.english === 'Unregistered Occupations') {
            registered = false;
          } else {
            registered = true;
          }
        }
      });
    }
    return registered;
  }
  populateEngagementTabelData(engagementOccupationDetails: EngagementDTO[]) {
    this.engagementResults = [];
    if (engagementOccupationDetails && engagementOccupationDetails.length > 0) {
      engagementOccupationDetails.forEach(engagement => {
        if (engagement.engagementPeriod && engagement.engagementPeriod.length > 0) {
          engagement.engagementPeriod.forEach(period => {
            const engagementDetails: EngagementDetailsList = new EngagementDetailsList();
            const engagementPeriod: EngagementPeriod = new EngagementPeriod();
            if (engagement.establishmentName.english === null && engagement.establishmentName.arabic) {
              engagement.establishmentName.english = engagement.establishmentName.arabic;
            }
            if(engagement.engagementId){
              engagementDetails.engagementId = engagement.engagementId;
            }           
            engagementDetails.establishmentName = engagement.establishmentName;
            engagementDetails.establishmentRegNo = engagement.registrationNo;
            engagementPeriod.startDate = period.startDate;
            engagementPeriod.endDate = period.endDate;
            engagementDetails.engagementPeriod.push(engagementPeriod);
            if (!this.textAreaVisible) {
              engagementDetails.occupation = period.occupation;
            }
            this.engagementResults.push(engagementDetails);
          });
        }
      });
    }
  }
  /** Method to show modal. */
  showAddConfirmationModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, { class: 'modal-lg modal-dialog-centered' });
  }
  onAddOccupation() {
    this.canReplaceExistingOccupation = true;
    this.saveOccupationDetails();
  }
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    if(this.ohService.getIsMessageForOcc()){
      this.alertService.clearAllSuccessAlerts();
    }
  }
}
