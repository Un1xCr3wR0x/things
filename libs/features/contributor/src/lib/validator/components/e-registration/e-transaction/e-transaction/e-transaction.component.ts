import { Component, Inject, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { tap, switchMap } from 'rxjs/operators';
import { iif, Observable, of } from 'rxjs';
import {
  AlertService,
  BilingualText,
  checkBilingualTextNull,
  convertToStringDDMMYYYY,
  DocumentService,
  LookupService,
  LovList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  scrollToTop,
  TransactionService
} from '@gosi-ui/core';
import {
  
} from '../../../shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContributorService,EngagementDetails,
  EstablishmentService,
  EngagementService,
  ContributorTypesEnum,
  getGccIdentity,
  DocumentTransactionId,
  getTransactionType,
  DocumentTransactionType,
  ContributorConstants, 
  Contributor,
  PersonalInformation} from '@gosi-ui/features/contributor/lib/shared';
import { TransactionBaseScComponent } from '@gosi-ui/features/contributor/lib/transactions/components';
import { SaveEngagementPayload } from '@gosi-ui/features/contributor/lib/shared/models/e-inspection-saveEngagement';


@Component({
  selector: 'cnt-e-transaction',
  templateUrl: './e-transaction.component.html',
  styleUrls: ['./e-transaction.component.scss']
})
export class ETransactionComponent extends TransactionBaseScComponent implements OnInit {
  engagement: EngagementDetails;
  isContractRequired = false;
  legalEntityChanged = false;
  isOpen = false;
  isEmpty = false;
  booleanList: LovList;
  isActive: boolean;
  engagementStatus: string;

  /**Input variables */
  @Input() canEdit: boolean;
  @Input() conType: string;
  @Input() canEditPenalty: boolean;
  @Input() heading: string = null;
  @Input() badge: string = null;
  /**Input variables */

  contTypeEnum = ContributorTypesEnum;

  /**Local variables */
  person: PersonalInformation;
  employmentDetailsViewForm: FormGroup;
  documentUploadForm: FormGroup;
  isPrivate: boolean;
  personNin = [];


  /**Input variables */

  /**Local Variables */
  AdminDetailsForm: FormGroup;
  engDetailsCsr:SaveEngagementPayload;

  engagementDetailsViewForm: FormGroup;
  @Input() cntValidatorForm: FormGroup;
  @Input() parentForm: FormGroup;
  joiningDate: any;
  leavingDate: any;

  constructor(
    private fb: FormBuilder,
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly alertService: AlertService,
    readonly router: Router,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {
    super(
      contributorService,
      establishmentService,
      engagementService,
      lookupService,
      documentService,
      transactionService,
      alertService,
      router
    );
  }

  ngOnInit(): void {
    this.alertService.clearAlerts();
    //console.log('val ', this.engDetailsCsr);
    this.getPersonDetails(1234567897); 
    this.getDataForView1();

    this.AdminDetailsForm = this.createDetailsForm();
    this.booleanList = {
      items: [
        { value: { english: 'Agree', arabic: 'نعم' }, sequence: 0 },
        { value: { english: 'Disagree', arabic: 'لا' }, sequence: 1 }
      ]
    };
    this.documentUploadForm = this.createCommentsForm();
    this.parentForm.addControl('documentsForm', this.documentUploadForm);
    // console.log(this.AdminDetailsForm);
   
  }

  
  /**
   * Method to detect changes in input variables
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {

    // if (!this.employmentDetailsViewForm) {
    //   this.employmentDetailsViewForm = this.createEmplymentDetailsViewForm();
    // }
    // if (changes.engagement && changes.engagement.currentValue && this.employmentDetailsViewForm) {
    //   this.employmentDetailsViewForm.get('isContributorActive').setValue(this.engagement.isContributorActive);
    //   this.employmentDetailsViewForm.get('isContributorActive').disable();
    // }
    // if (!this.engagementDetailsViewForm) {
    //   this.engagementDetailsViewForm = this.createEmplymentDetailsViewForm1();
    // }
    // if (changes.engagement && changes.engagement.currentValue && this.engagementDetailsViewForm) {
    //   this.engagementDetailsViewForm.get('applyLateFee').setValue(this.engagement.penaltyIndicator);
    //   this.engagementDetailsViewForm.get('applyLateFee').disable();
    // }
  }

  getDataForView1() {
    this.contributorService.getEinspectionEngagementDetails(1234554325, 197478).subscribe(
      res => {
      this.engDetailsCsr = res;
      this.joiningDate = convertToStringDDMMYYYY((this.engDetailsCsr?.engagementRequestDto?.joiningDate?.gregorian).toString())
      if(this.engDetailsCsr?.engagementRequestDto?.leavingDate) {
        this.leavingDate = convertToStringDDMMYYYY((this.engDetailsCsr?.engagementRequestDto?.leavingDate?.gregorian).toString())
      }
      this.isActive = this.engDetailsCsr?.engagementRequestDto?.isActive;
      if (this.isActive) {
        this.engagementStatus = 'CONTRIBUTOR.ACTIVE';
      } else {
        this.engagementStatus = 'CONTRIBUTOR.INACTIVE';
      }
      },
    
    // err => this.showAlertDetails(err)
    );
  }
  createCommentsForm(): FormGroup {
    return this.fb.group({
      comments: '',
      checkBoxFlag: [, { validators: !this.isPrivate ? Validators.requiredTrue : null }]
    });
  }
  createDetailsForm() {
    return this.fb.group({
      student: this.fb.group({
        english: ['No', { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      }),
      comments: '',
      checkBoxFlag: [, { validators: !this.isPrivate ? Validators.requiredTrue : null }]
    });
  }
  submitDetails(){
    // console.log(this.AdminDetailsForm);
    
    // console.log("submitted successfully");
  }

  saveCancellationDetails() {

    this.router.navigate([RouterConstants.ROUTE_INBOX]);
    
  }

  /** Method to get vic contributor details. */
  getVicContributorDetails(): Observable<Contributor> {
    return this.contributorService
      .getContributorBySin(460800765, new Map().set('checkBeneficiaryStatus', true))
      .pipe(tap(res => ((this.contributor = res), (this.isBeneficiary = this.contributor.isBeneficiary))));
  }


  showError(error) {
    if (error?.error) {
      scrollToTop();
      this.alertService.showError(error.error.message, error.error.details);
    }
  }



   /** Method to search vic person. */
   getPersonDetails(nin) {
    const queryParams: string = `NIN=${nin}`
    this.contributorService
    .getPersonDetails(queryParams, new Map().set('fetchAddressFromWasel', true)).pipe(
        tap(res => {
          this.contributor = new Contributor();
          if (res) {
            this.person = this.contributor.person = res;
            this.socialInsuranceNo=res.socialInsuranceNumber[0];
            //console.log("Social Insurance number:",res.socialInsuranceNumber);
          }
        }),
        switchMap(res => {
          if (res.personId)
            //To check sin for existing contributor
            return this.contributorService.setSin(this.person.personId).pipe(
              tap(response => {
                if (response) {
                  this.socialInsuranceNo = response.socialInsuranceNo;
                }
              })
            );
        })
      )
      .subscribe({
        next: () => {
          this.alertService.clearAllErrorAlerts();
        },
        error: err => this.showError(err)
      });
  }


  /**
   * Check if the coverage has annuity
   * @param engagementPeriod
   */
  isAnnuityCoverage(coverages: BilingualText[]) {
    if (coverages) {
      for (const coverage of coverages) {
        if (coverage.english === 'Annuity') {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if the coverage has OH
   * @param engagementPeriod
   */
  isOHCoverage(coverages: BilingualText[]) {
    if (coverages) {
      for (const coverage of coverages) {
        if (coverage.english === 'Occupational Hazard') {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if the coverage has UI
   * @param engagementPeriod
   */
  isUICoverage(coverages: BilingualText[]) {
    if (coverages) {
      for (const coverage of coverages) {
        if (coverage.english === 'Unemployment Insurance') {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * This method is to check if the data is null or not
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }
  /** Method to get engagement. */
  getEngagement(isCoverageRequired: boolean, isTransactionView?: boolean) {
    return this.engagementService.getEngagementDetails(
      this.registrationNo,
      this.socialInsuranceNo,
      this.engagementId,
      undefined,
      isCoverageRequired,
      isTransactionView
    );
  }

  /** Method to check change in legal entity of establishment. */
  checkChangeInLegalEntity(legalEntity: string) {
    // To check whether establishment legal entity changed from private to government or semi government
    if (legalEntity && ContributorConstants.GOVERNMENT_LEGAL_ENTITIES.indexOf(legalEntity) === -1) {
      if (
        this.establishment.legalEntity.english !== legalEntity &&
        ContributorConstants.GOVERNMENT_LEGAL_ENTITIES.indexOf(this.establishment.legalEntity.english) !== -1
      )
        this.legalEntityChanged = true;
    }
  }

  /** Method to set engagement details. */
  setEngagementDetails(engagement: EngagementDetails) {
    this.engagement = engagement;
    this.engagement.isContributorActive = this.engagement.leavingDate?.gregorian ? false : true; //api removed this property so workaround
  }
  /*
   * This methode is to View contract details in new tab
   */
  onViewContractsClick() {
    const url = '#' + `/validator/preview/${this.registrationNo}/${this.socialInsuranceNo}/${this.engagementId}`;
    window.open(url, '_blank');
  }

  /** Method to check whether contract preview is required. */
  checkContractPreviewRequired() {
    //show contract if contributor contributor is active and establishment legal entity is not govt and semi govt
    //if legal entity changed from private to government and contributor is active show contract
    if (
      this.engagement?.isContributorActive &&
      !this.establishment?.gccEstablishment?.gccCountry &&
      this.contributor?.contributorType === ContributorTypesEnum.SAUDI &&
      ContributorConstants.GOVERNMENT_LEGAL_ENTITIES.indexOf(this.engagement?.establishmentLegalEntity?.english) ===
        -1 &&
      !this.engagement.backdatingIndicator
    ) {
      this.isContractRequired = true;
    }
  }
}

