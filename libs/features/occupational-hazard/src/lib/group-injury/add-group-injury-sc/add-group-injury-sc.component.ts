import { PlatformLocation, Location } from '@angular/common';
import { Component, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  BPMUpdateRequest,
  CoreContributorService,
  DocumentItem,
  DocumentService,
  FeedbackStatus,
  LanguageToken,
  LookupService,
  Role,
  RouterConstants,
  RouterData,
  RouterDataToken,
  scrollToTop,
  startOfDay,
  StorageService,
  TransactionService,
  TransactionStatus,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/lib/search/services';
import {
  OhService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  DiseaseService,
  ComplicationService,
  ProcessType,
  NavigationIndicator,
  ContributorSearchResult,
  Person,
  DocumentDcComponent,
  OHTransactionType,
  RouteConstants,
  GroupInjuryPayload,
  RejectedContributor,
  ConfirmationModalDcComponent,
  OhConstants
} from '../../shared';
import { GroupInjuryConstants } from '../../shared/constants/group-injury-constants';
import { GroupInjury } from '../../shared/models/group-injury-details';
import { GroupInjuryService } from '../../shared/services/group-injury.service';
import { GroupInjuryBaseComponent } from '../base/group-injury-base.sc.component';

@Component({
  selector: 'oh-add-group-injury-sc',
  templateUrl: './add-group-injury-sc.component.html',
  styleUrls: ['./add-group-injury-sc.component.scss']
})
export class AddGroupInjuryScComponent extends GroupInjuryBaseComponent implements OnInit {
  //local variables
  hasSearchResult = false;
  contributors: ContributorSearchResult[];
  reportGroupInjuryForm: FormGroup;
  person: Person;
  hasMandatoryDetails = true;
  checkContributorsEligibility = false;
  length = 0;
  rejectedContrbutors: RejectedContributor[] = [];
  emergencyContactNo: string;
  type: string;
  isInjuryDetailsModified = false;
  contributorInjury: GroupInjury;
  contributorInjuryToUpdate: GroupInjury;
  contributorInjuryDetails: GroupInjury[] = [];
  isUpdateConfirmed = false;
  contributorDetails: GroupInjuryPayload = new GroupInjuryPayload();
  contributorDetailsToSave: GroupInjuryPayload[] = [];
  @Input() isPoMandatory: Boolean;
  @Input() emergencyContact: number;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly ohService: OhService,
    readonly contributorService: ContributorService,
    readonly coreContributorService: CoreContributorService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly establishmentService: EstablishmentService,
    readonly injuryService: InjuryService,
    readonly groupInjuryService: GroupInjuryService,
    readonly diseaseService: DiseaseService,
    readonly lookupService: LookupService,
    readonly complicationService: ComplicationService,
    readonly router: Router,
    readonly storageService: StorageService,
    readonly fb: FormBuilder,
    readonly route: ActivatedRoute,
    readonly transactionService: TransactionService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly activatedRoute: ActivatedRoute,
    readonly location: Location,
    readonly pLocation: PlatformLocation,
    readonly dashboardSearchService: DashboardSearchService
  ) {
    super(
      language,
      alertService,
      complicationService,
      contributorService,
      documentService,
      establishmentService,
      injuryService,
      groupInjuryService,
      diseaseService,
      lookupService,
      ohService,
      router,
      appToken,
      fb,
      location,
      pLocation,
      modalService,
      transactionService
    );
    pLocation.onPopState(() => {
      if (this.routerData.taskId && this.appToken === ApplicationTypeEnum.PUBLIC) {
        this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
        this.alertService.clearAlerts();
      }
    });
  }
  @ViewChild('cancelGroupInjury', { static: false })
  private cancelGroupInjuryModal: TemplateRef<Object>;
  @ViewChild('updateGroupInjury', { static: false })
  private updateGroupInjury: TemplateRef<Object>;

  @ViewChild('documentDetailsForm', { static: false })
  documentDetailsForm: DocumentDcComponent;
  ngOnInit(): void {
    this.payeeInfo = false;
    this.isInjuryDetailsModified = false;
    this.type = OhConstants.GROUP_INJURY_TRANSACTION_KEY;
    this.referenceNo = this.ohService.getTransactionRefId();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC ? true : false;
    const url = this.router.url;
    if (url.indexOf('/edit') >= 0) {
      this.isEdit = true;
    }
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.ohservice.setSuccessMessageDisplay(false);
    if(this.ohservice.getIsNewTransaction()){
      this.groupInjuryId = null;
    }  
    this.alertService.clearAlerts();         
    this.resetValues();
    this.processType = url.substr(url.lastIndexOf('/') + 1);
    this.initializeWizardItems();
    this.initializeLookups();
    this.taskid = this.routerData.taskId;
    this.getRouteParam(this.route.paramMap);
    if (this.routerData) {
      if (this.routerData.taskId !== null && this.routerData.taskId !== undefined) {
        this.comment = this.routerData.comments;
        if (this.routerData.assignedRole === Role.VALIDATOR_1) {
          this.isValidator1 = true;
        }
        if (this.routerData.assignedRole === Role.EST_ADMIN_OH) {
          this.isValidator2 = true;
        }
        this.isWorkflow = true;
        this.setValues();
      }
    }
    if (
      (this.processType === ProcessType.MODIFY || this.processType === ProcessType.REOPEN) &&
      !this.routerData.taskId
    ) {
      this.isWorkflow = true;
      this.isValidator1 = true;
      if (this.processType === ProcessType.MODIFY) {
        this.groupInjuryService.setNavigationIndicator(NavigationIndicator.CSR_EDITS);
      }
    }
    if (this.processType === ProcessType.REOPEN) {
      if (this.isAppPrivate) {
        this.groupInjuryService.setNavigationIndicator(NavigationIndicator.CSR_REOPEN_INJURY);
      } else {
        this.groupInjuryService.setNavigationIndicator(NavigationIndicator.EST_ADMIN_REOPEN_GROUP_INJURY);
      }
    }
    if (this.routerData.resourceType === GroupInjuryConstants.GROUP_INJURY && this.processType === ProcessType.EDIT) {
      this.injuryService.setNavigationIndicator(NavigationIndicator.VALIDATOR1_EDITS_REPORT);
    }
    this.getData();
    if (!this.contributorGroupInjuryForm) {
      this.contributorGroupInjuryForm = this.createContributorGroupInjuryForm();
    }
    if (this.registrationNo && this.groupInjuryId) {
      this.getGroupInjuryDetails();
    }
    this.checkIfContributorsAdded();
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
  showEstablishmentValidation(searchEstablishmentForm: FormGroup) {
    this.formStatus = searchEstablishmentForm.invalid;
  }
  checkFormUpdated(status: boolean) {
    if (this.groupInjuryId) {
      this.isInjuryDetailsModified = status;
    }
  }
  checkEstablishementMatch() {
    let match = true;
    if (this.ohservice.getRegistrationNumber() !== this.ohservice.getNewRegistrationNumber()) {
      match = false;
    }
    return match;
  }

  /**
   * Method forSaving Group Injury Details
   */
  saveGroupInjuryDetails(reportGroupInjuryDetails) {   
    if(this.groupInjuryService.cancelTransaction){
      this.groupInjuryId = null;
    }
    this.reportedGroupInjuryInformation = reportGroupInjuryDetails;
    this.reportedDate = reportGroupInjuryDetails.injuryDate;
    this.ohService.setInjuryDate(this.reportedDate);
    this.reportedGroupInjuryInformation.navigationIndicator = 0;
    this.registrationNo = this.ohService.getRegistrationNumber();
    this.getNavigationIndicator(this.routerData);
    if (this.routerData.resourceType === GroupInjuryConstants.GROUP_INJURY && this.processType === ProcessType.EDIT) {
      this.reportedGroupInjuryInformation.navigationIndicator = NavigationIndicator.VALIDATOR1_EDITS_REPORT;
    }
   // reportGroupInjuryDetails.longitude = 46.1243213;
  //reportGroupInjuryDetails.latitude - 27.32432;
    if (this.reportGroupInjuryMainForm.get('reportGroupInjury')) {
      this.reportGroupInjuryMainForm.markAllAsTouched();
      this.reportGroupInjuryMainForm.updateValueAndValidity();      
    if (this.reportGroupInjuryMainForm.valid && !this.formStatus) {
        this.alertService.clearAlerts();
        if (this.groupInjuryId) {
          reportGroupInjuryDetails.groupInjuryId = this.groupInjuryId;
          let length = 0;
          if (this.contributorInjuryDetails && this.contributorInjuryDetails.length > 0) {
            this.contributorInjuryDetails.forEach(contributor => {
              if (!contributor.isDeleted) {
                length++;
              }
            });
          }
          if (this.isInjuryDetailsModified && length > 0) {
            if (!this.isUpdateConfirmed) {
              this.contributorInjuryToUpdate = reportGroupInjuryDetails;
              this.showUpdateTemplate();
            } else {
              this.updateGroupInjuryDetails(reportGroupInjuryDetails);
            }
          } else {
            this.updateGroupInjuryDetails(reportGroupInjuryDetails);
          }
        } else {
          this.groupInjuryService.reportGroupInjuryService(reportGroupInjuryDetails).subscribe(
            response => {
              this.groupInjuryService.cancelTransaction = false;
              this.ohService.setISNewTransaction(false);
              this.groupInjuryId = response;
              this.groupInjuryService.setGroupInjuryId(this.groupInjuryId);
              this.groupInjuryService.setInjuryDate(this.reportedDate);
              this.groupInjuryService.setWorkDisabilityDate(reportGroupInjuryDetails.workDisabilityDate.gregorian);
              this.nextForm();
            },
            err => {
              this.showError(err);
            }
          );
        }
     } else {
       this.alertService.showMandatoryErrorMessage();
     }
    }   
  }
  updateGroupInjuryDetails(reportGroupInjuryDetails) {
    this.groupInjuryService.updateGroupInjuryService(reportGroupInjuryDetails).subscribe(
      response => {
        this.groupInjuryId = response;
        this.groupInjuryService.setGroupInjuryId(this.groupInjuryId);
        this.groupInjuryService.setWorkDisabilityDate(reportGroupInjuryDetails.workDisabilityDate.gregorian);

        if(this.modifyIndicator === true) {
          this.getDocs(this.reportedGroupInjuryInformation.governmentSector.english);   
          console.log("save injury");
        }else {
          this.getDocs(this.groupInjury.governmentSector.english);
          console.log("save injury2");
        }


        this.nextForm();
      },
      err => {
        this.showError(err);
      }
    );
  }
  saveContributors() {
    this.alertService.clearAlerts();
    this.contributorDetailsToSave = [];
    this.contributorInjuryDetails.forEach(element => {
      this.contributorDetails = new GroupInjuryPayload();
      this.contributorDetails.accidentType = element.accidentType;
      this.contributorDetails.allowancePayee = element.allowancePayee;
      this.contributorDetails.contributorId = element.contributorId;
      if(element.deathDate){
        this.contributorDetails.deathDate.gregorian = startOfDay(element.deathDate.gregorian);
      }      
      this.contributorDetails.emergencyContactNo = element.emergencyContactNo;
      this.contributorDetails.injuryLeadsToDeathIndicator = element.injuryLeadsToDeathIndicator;
      this.contributorDetails.injuryReason = element.injuryReason;
      this.contributorDetails.occupation = element.occupation;
      this.contributorDetails.socialInsuranceNo = element.socialInsuranceNo;
      this.contributorDetails.treatmentCompleted = element.treatmentCompleted;
      if(element.isEdited){
        this.contributorDetails.isEdited = element.isEdited;
      }else{
        this.contributorDetails.isEdited = false;
      }     
      if(element.isDeleted){
        this.contributorDetails.isDeleted = element.isDeleted;
      }else{
        this.contributorDetails.isDeleted = false;
      }     
      this.contributorDetails.bulkInjuryRequestItemId = element.bulkInjuryRequestItemId;
      this.contributorDetailsToSave.push(this.contributorDetails);
    });
    if (this.checkContributorsEligibility) {
      this.checkIfAnyContributorsAreRejected();
    } else {
      this.updateContributors();
    }

  }
  saveInjuredContributorDetails(contributorInjury: GroupInjury) {
    this.alertService.clearAlerts();
    contributorInjury.deathDate.gregorian = startOfDay(contributorInjury.deathDate.gregorian);
    //this.contributorInjuryDetails.push(contributorInjury);
    this.groupInjuryService.injuryEligibility(contributorInjury).subscribe(
      response => {
        this.injuryNumber = response;
        this.groupInjuryService.setBulkInjuryRequestItemId(this.injuryNumber);
        contributorInjury.bulkInjuryRequestItemId = this.injuryNumber;
        contributorInjury.isDeleted = false;
        contributorInjury.isEdited = false;

        this.alertService.showSuccessByKey('OCCUPATIONAL-HAZARD.GROUP-INJURY.CONTRIBUTOR_ADDED_SUCCESSFULLY');
        this.checkIfContributorsAdded();

      },
      err => {
        this.contributorInjuryDetails = this.contributorInjuryDetails.filter(item => item.contributorId !== contributorInjury.contributorId);
        this.showError(err);
      }
    );
  }
  updateContributors() {
    this.contributorDetailsToSave.forEach(contributor => {
      contributor.deathDate.gregorian=startOfDay(contributor.deathDate.gregorian);
    });
    if(this.rejectedContrbutors && this.rejectedContrbutors.length>0){
      this.rejectedContrbutors.forEach(rejectedContrbutor => {
        this.contributorDetailsToSave.forEach(contributor => {
            if(rejectedContrbutor.contributorId === contributor.contributorId){
              contributor.isDeleted = true;
            }
        });
      });
      this.rejectedContrbutors.forEach(rejectedContrbutor => {
        this.contributorInjuryDetails.forEach(contributorDetails => {
            if(rejectedContrbutor.contributorId === contributorDetails.contributorId){
              contributorDetails.isDeleted = true;
            }
        });
      });
    }
    this.groupInjuryService.updateContributorDetails(this.contributorDetailsToSave).subscribe(
      response => {
        this.injuryNumber = response;
        let injurycount = this.contributorInjuryDetails.length;
        if (this.contributorInjuryDetails.length > 0) {
          this.contributorInjuryDetails.forEach(injury => {
            if (injury.person.contactDetail &&
              injury.person.contactDetail.addresses &&
              injury.person.contactDetail.addresses.length > 0) {
              this.saveAddress(injury.person);
            }
            injurycount = injurycount - 1;
            if (injurycount === 0) {
              this.nextForm();
            }
        });
       }       
       this.checkIfContributorsAdded();
      },
      err => {
        this.showError(err);
      }
    );
  }
  saveGroupInjury(personalDetails) {
    this.injuryService.saveEmergencyContactInjury(personalDetails.contactDetail.mobileNo).subscribe(
      response => {
        this.injuryNumber = response;
        if (personalDetails.personDetails !== null && personalDetails.personDetails !== undefined) {
          personalDetails.personDetails.contactDetail.emergencyContactNo =
            personalDetails.contactDetail.mobileNo.primary.toString();
        }
        if (this.socialInsuranceNo) {
          this.ohservice.setSocialInsuranceNo(this.socialInsuranceNo);
          this.getInjuryStatistics();
        }
        if (this.processType !== ProcessType.MODIFY && this.processType !== ProcessType.REOPEN) {
          this.saveAllowancePayee(personalDetails.allowancePayee);
        }
        if (
          !this.isAddressPresent &&
          personalDetails.personDetails &&
          personalDetails.personDetails.contactDetail &&
          personalDetails.personDetails.contactDetail.addresses &&
          personalDetails.personDetails.contactDetail.addresses.length > 0
        ) {
          this.saveAddress(personalDetails.personDetails);
        } else {
          this.nextForm();
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  getInjuryReasonValue(injuryType){
    this.getInjuryReason(injuryType, false);
  }

  getInjuryReason(injuryType, modifyScenario: boolean) {
    this.injuryReasonList$ = this.lookupService.getInjuryReasonList(injuryType);
    if (this.groupInjuryId) {
      if (this.groupInjuryService.getAccidentType() !== injuryType && this.contributorInjuryDetails && this.contributorInjuryDetails.length > 0) {
        this.contributorInjuryDetails.forEach(contributor => {
          if(!modifyScenario){
            contributor.injuryReason = null;
            contributor.isInjuryReasonNull = true;
            this.hasMandatoryDetails = false;
          }
        });
      }
    }
  }
  checkInjuryDateChange(injuryDate) {
    if (this.groupInjuryId) {
      if (this.groupInjuryService.getInjuryDate() !== injuryDate && this.contributorInjuryDetails && this.contributorInjuryDetails.length > 0) {
        this.checkContributorsEligibility = true;
      }
    }
  }
  checkIfAnyContributorsAreRejected() {
    this.groupInjuryService.rejectedContributorDetails(this.contributorDetailsToSave).subscribe(
      response => {
        this.rejectedContrbutors = response;
        if (this.rejectedContrbutors && this.rejectedContrbutors.length > 0) {
          this.checkIfContributorsAdded();
          this.showRejectedContributorTemplate(this.rejectedContrbutors);
        } else {
          this.updateContributors();
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  getGroupInjuryDetails() {
    let isChangeRequired = false;
    this.groupInjuryService.setGroupInjuryId(this.groupInjuryId);
    if (
      this.routerData.taskId &&
      (this.processType === ProcessType.MODIFY || this.processType === ProcessType.REOPEN)
    ) {
      isChangeRequired = true;
    }
    if (this.isEdit && (this.processType === ProcessType.MODIFY || this.processType === ProcessType.REOPEN)) {
      isChangeRequired = true;
    }
    if (this.isEdit) {
      isChangeRequired = true;
    }
    this.groupInjuryService
      .getGroupInjuryDetails(this.registrationNo, this.groupInjuryId)
      .subscribe(
        response => {
          this.groupInjuryDetailsWrapper = response;
          if (this.groupInjuryDetailsWrapper.groupInjuryResponseDto.status?.english === 'pending') {
            this.isValidator1 = true;
            this.isWorkflow = true;
          }
          if (this.processType === ProcessType.MODIFY && this.routerData.taskId !== null) {
            this.groupInjuryService.setNavigationIndicator(NavigationIndicator.CSR_EDITS);
          } else if (
            this.processType === ProcessType.REOPEN &&
            this.routerData.taskId !== null &&
            this.routerData.taskId !== undefined
          ) {
            this.groupInjuryService.setNavigationIndicator(NavigationIndicator.VALIDATOR1_REOPEN_EDITS);
          }
          if (this.routerData.resourceType === GroupInjuryConstants.GROUP_INJURY && this.processType === ProcessType.EDIT) {
            this.groupInjuryService.setNavigationIndicator(NavigationIndicator.VALIDATOR1_EDITS_REPORT);
          }
          this.groupInjury = this.groupInjuryDetailsWrapper.groupInjuryResponseDto;
          if (this.groupInjuryDetailsWrapper.groupInjuryContributorDetails) {
            this.contributorInjuryDetails = this.groupInjuryDetailsWrapper.groupInjuryContributorDetails;
          }
          if (this.groupInjury.requiredDocuments && this.groupInjury.requiredDocuments.length > 0) {
            this.documentsList = this.groupInjury.requiredDocuments;
          }
          this.establishmentName = this.groupInjury.establishmentName;
          this.establishmentPresent.name = this.establishmentName;
          this.establishmentPresent.registrationNo = this.registrationNo;
          this.groupInjuryService.setAccidentType(this.groupInjury.accidentType);
          this.getInjuryReason(this.groupInjury.accidentType.english, true);
          this.getDocs(this.groupInjury.governmentSector.english);
          this.emergencyContactNo = this.groupInjury.emergencyContactNo?.primary;
          this.payeeT = this.groupInjury.allowancePayee;
          this.isdControl = this.groupInjury.emergencyContactNo?.isdCodePrimary;
          if (
            (this.isValidator2 === true && !this.isEdit) ||
            (this.previousOutcome === 'RETURN' && this.isEdit && this.isValidator2 === true)
          ) {
            this.documentService
              .getDocuments(OHTransactionType.DOCUMENT_TRANSACTION_KEY, OHTransactionType.GroupInjury, this.groupInjuryId)
              .subscribe(documentResponse => {
                this.documentItem = documentResponse.filter(item => item.documentContent !== null);
                if (this.documentsList) {
                  for (const doc of this.documentsList) {
                    this.reqdocumentTemp = documentResponse.filter(item => item.name.english === doc.english);
                    this.reqdocumentTemp = this.reqdocumentTemp.filter(item => (item.required = true));
                    this.reqdocumentList.push(this.reqdocumentTemp);
                  }
                }
              });
          }
        },
        err => {
          this.showError(err);
        }
      );
  }
  //Set values from Router Data
  setValues() {
    this.groupInjuryId = Number(this.routerData.resourceId);
    this.groupInjuryRequest = Number(this.routerData.resourceId);
    const payload = JSON.parse(this.routerData.payload);
    this.channel = payload.channel;
    this.registrationNo = payload.registrationNo;
    this.socialInsuranceNo = payload.socialInsuranceNo;
    this.transactionNumber = payload.referenceNo;
    this.groupInjuryId = payload.id;
    this.previousOutcome = payload.previousOutcome;
    this.groupInjuryService.setGroupInjuryId(this.groupInjuryId);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    if (this.registrationNo) {
      this.ohService.setRegistrationNo(this.registrationNo);
    }
    this.ohService.setInjuryNumber(this.groupInjuryRequest);
  }
  //Getting data from services
  getData() {
    this.referenceNo = this.ohService.getTransactionRefId();
    this.socialInsuranceNo = this.ohService.getSocialInsuranceNo();
    if (this.dashboardSearchService.registrationNo) {
      this.registrationNo = this.dashboardSearchService.registrationNo;
      this.ohService.setRegistrationNo(this.registrationNo);
    } else if (this.ohService.getRegistrationNumber()) {
      this.registrationNo = this.ohService.getRegistrationNumber();
    } else {
      this.registrationNo = Number(this.storageService.getLocalValue('registerationNumber'));
    }
    this.storageService.setLocalValue('registerationNumber', this.registrationNo);
    this.groupInjuryId = this.groupInjuryService.getGroupInjuryId();
    // this.getManageGroupInjuryDocumentList();
    if (this.isAppPrivate) {
      this.person = this.ohService.getPersonDetails();
    }
    if (!this.isAppPrivate || this.isValidator1 || this.isEdit) {
      if (this.socialInsuranceNo) {
        this.getEngagementDetails(this.registrationNo, this.socialInsuranceNo);
      }
    }
    if (this.socialInsuranceNo) {
      this.ohservice.setSocialInsuranceNo(this.socialInsuranceNo);
      this.getInjuryStatistics();
    }

    this.initializeLookups();
  }
  setEngagement() {
    this.getEngagementDetails(this.registrationNo, this.socialInsuranceNo);
  }
  /**
   * Method to cancel the Group Injury details template
   */
  showUpdateTemplate() {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(this.updateGroupInjury, config);
  }
  showCancelTemplate() {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(this.cancelGroupInjuryModal, config);
  }

    /**Show confirmation pop up */
    showRejectedContributorTemplate(contributors: RejectedContributor[]): void {
      contributors.forEach(contributor => {
        if(!contributor.contributorName.arabic.firstName){
          contributor.contributorName.arabic.firstName ='';
        }
        if(!contributor.contributorName.arabic.secondName){
          contributor.contributorName.arabic.secondName ='';
        }
        if(!contributor.contributorName.arabic.thirdName){
          contributor.contributorName.arabic.thirdName ='';
        }
        if(!contributor.contributorName.arabic.familyName){
          contributor.contributorName.arabic.familyName ='';
        }     

      });
      const initialState = {
        contributors: contributors,
        warningMessage:
         'OCCUPATIONAL-HAZARD.GROUP-INJURY.CONFIRM-REJECTED-CONTRIBUTORS',
         lang : this.lang
      };
      this.modalRef = this.modalService.show(ConfirmationModalDcComponent, {
        backdrop: true,
        ignoreBackdropClick: true,
        initialState
      });
      this.modalRef.content.update.subscribe((value: boolean) => {
        if (value === true) this.confirmUpdateContributors();
      });
    }
  confirmUpdateCancel(){
    this.modalRef.hide();
  }
  confirmUpdate(){
    this.modalRef.hide();
    this.updateGroupInjuryDetails(this.contributorInjuryToUpdate);
  }
  confirmUpdateContributors(){
    this.modalRef.hide();
    this.updateContributors();
  }
  confirmCancel() {
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    if (this.registrationNo) {
      this.ohService.setRegistrationNo(this.registrationNo);
    }
    this.groupInjuryId = null;
    this.resetValues();
    this.groupInjuryService.cancelTransaction = true;
    this.modalRef.hide();
    if (this.processType !== ProcessType.ADD) {
      this.ohService.deleteTransactionDetails(this.transactionNumber).subscribe(res => {
        res = res;
        this.alertService.clearAlerts();
      });
    }
    const transactionStatus = this.ohService.getTransactionStatus();
    if (transactionStatus?.english === TransactionStatus.DRAFT) {
      this.router.navigate(['home/transactions/list/history']);
    } else {
      this.location.back();
    }
  }
  setModifyIndicator(modifyIndicator: boolean) {
    this.modifyIndicator = modifyIndicator;
  }
  setReopenReason(reopenReason: BilingualText) {
    if (reopenReason.english !== 'Others') {
      this.isSelectedReasonOthers = false;
    } else {
      this.isSelectedReasonOthers = true;
    }
  }
  submitDocument(comments: string) {
    let actionFlag = false;
    if (this.routerData.taskId === null || this.routerData.taskId === undefined) {
      actionFlag = true;
    }
    if (this.processType === ProcessType.REOPEN) {
      this.groupInjuryRequest = this.groupInjuryId;
    }
    if (this.documentForm.get('uploadDocument')) {
      this.documentForm.markAllAsTouched();
      if (this.documentForm.valid) {
        this.groupInjuryService.submitGroupInjury(this.groupInjuryRequest,
          actionFlag,
          comments,
          this.registrationNo,
          this.isAppPrivate).subscribe(
          response => {
            this.feedbackdetails = response;
            this.groupInjuryService.setGroupInjuryId(null);
            let status = 'modified';
            if (this.processType === ProcessType.REOPEN) {
              status = 're-open';
            }
            const transactionStatus = this.ohService.getTransactionStatus();
            this.groupInjuryService.setNavigationIndicator(NavigationIndicator.ADD_GROUP_INJURY);
            if (
              this.isWorkflow &&
              (this.processType === ProcessType.MODIFY || this.processType === ProcessType.REOPEN) &&
              (this.routerData.taskId === null || this.routerData.taskId === undefined)
            ) {
              if (transactionStatus?.english === TransactionStatus.DRAFT) {
                this.router.navigate(['home/transactions/list/history']);
              } else {
                this.router.navigate(
                  [RouteConstants.ROUTE_REPORT_TYPE],
                  {
                    queryParams: {
                      status: status
                    }
                  }
                );
              }
              this.alertService.showSuccess(this.feedbackdetails.transactionMessage);
            } else if (
              (this.processType === ProcessType.MODIFY ||
                this.processType === ProcessType.REOPEN ||
                this.processType === ProcessType.EDIT) &&
              this.routerData.taskId
            ) {
              const workflowData = new BPMUpdateRequest();
              workflowData.isExternalComment = true;
              workflowData.comments = this.documentForm.get('uploadDocument').get('comments').value;
              workflowData.taskId = this.routerData.taskId;
              workflowData.outcome = WorkFlowActions.UPDATE;
              workflowData.user = this.routerData.assigneeId;
              this.workflowService.updateTaskWorkflow(workflowData).subscribe(
                () => {
                  if (this.isAppPrivate && this.isWorkflow) {
                    this.router.navigate([RouteConstants.ROUTE_INBOX]);
                  } else if (!this.isAppPrivate && this.isWorkflow) {
                    this.router.navigate([RouteConstants.ROUTE_INBOX_PUBLIC]);
                  } else {
                    this.location.back();
                  }
                  this.alertService.showSuccess(this.feedbackdetails.transactionMessage);
                },
                error => {
                  this.showError(error);
                }
              );
            } else {
              this.ohService.resetValues();
              this.groupInjuryId = null;
              this.groupInjuryRequest = null;
              this.location.back();
              if (this.feedbackdetails.status.english === FeedbackStatus.REJECTED) {
                this.alertService.showError(this.feedbackdetails.transactionMessage);
              } else if (
                this.feedbackdetails.status.english === FeedbackStatus.APPROVED ||
                this.feedbackdetails.status.english === FeedbackStatus.PENDING ||
                this.feedbackdetails.status.english === FeedbackStatus.INPROGRESS
              ) {
                this.router.navigate(
                  [RouteConstants.ROUTE_REPORT_TYPE]);
                this.alertService.clearAllErrorAlerts();
                this.alertService.showSuccess(this.feedbackdetails.transactionMessage);
                this.ohservice.setSuccessMessageDisplay(true);
              }
            }
          },
          error => {
            this.showError(error);
          }
        );
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    }
  }

  showMandatoryDocErrorMessage($event) {
    this.showErrorMessage($event);
  }
  deleteDocument(document: DocumentItem) { }
  resetContributors(contributorDetails: GroupInjury[]) {
    this.contributorInjuryDetails = contributorDetails;
    this.hasMandatoryDetails = true;
  }
  showFormValidation() {
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.alertService.clearAlerts();
    }
    this.alertService.showMandatoryErrorMessage();
  }
  decline() {
    this.modalRef.hide();
  }
  /**
   * @param searchValue Search using NIN/BORDER NUMBER/SIN/PASSPORT NO
   */
  searchContributor(searchValue) {
    this.contributorService.getContributorSearch(searchValue, this.ohService.getRegistrationNumber()).subscribe(
      response => {
        if (this.appToken === ApplicationTypeEnum.PRIVATE) {
          this.contributors = response;
        } else if (this.appToken === ApplicationTypeEnum.PUBLIC) {
          this.contributors = response.contributors;
        }
        if (this.contributors.length <= 0) {
          this.contributorSearchError();
          this.hasSearchResult = false;
        } else {
          this.alertService.clearAlerts();
          this.hasSearchResult = true;
          this.ohService.setSocialInsuranceNo(this.contributors[0].socialInsuranceNo);
          this.socialInsuranceNo = this.contributors[0].socialInsuranceNo;
          this.person = this.contributors[0].person;
          this.isAddressPresent = this.getAddressAvailability(this.person);
          this.injuryId = null;
          if (this.socialInsuranceNo) {
            this.ohservice.setSocialInsuranceNo(this.socialInsuranceNo);
             this.getInjuryStatistics();
          }
          if (this.socialInsuranceNo) {
            // this.getManageGroupInjuryDocumentList();
            this.getEngagementDetails(this.registrationNo, this.socialInsuranceNo);
          }
        }
      },
      err => {
        this.hasSearchResult = false;
        this.alertService.showError(err.error.message);
      }
    );
  }
  checkIfContributorsAdded() {
    this.length = 0;
    if (this.contributorInjuryDetails && this.contributorInjuryDetails.length > 0) {
      this.contributorInjuryDetails.forEach(contributor => {
        if (!contributor.isDeleted) {
          this.length++;
        }
      });
    }
  }
  /**
   * Method to show error message in person identity is not available in contributor
   */
  contributorSearchError() {
    scrollToTop();
    this.hasSearchResult = false;
    this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.REQUESTED-DETAILS-NOT-AVAILABLE');
  }
  // Service call for injury statistics
  getInjuryStatistics() {
    this.injuryId = null;
    this.injuryService.getInjuryStatistics(this.injuryId).subscribe(
      response => {
        this.injuryStatistics = response;
      },
      err => {
        this.showError(err);
      }
    );
  }
  resetValues() {
    this.contributorDetails = new GroupInjuryPayload();
    this.contributorDetailsToSave = [];
    this.contributorInjuryDetails = [];
  }
  ngOnDestroy() {
    if(!this.ohService.getSuccessMessageDisplay){
      this.alertService.clearAllSuccessAlerts();
    }
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllInfoAlerts();
    this.alertService.clearAllWarningAlerts();
   this.resetValues();
  }
}

