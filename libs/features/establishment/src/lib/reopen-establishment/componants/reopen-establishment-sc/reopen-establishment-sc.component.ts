import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentItem,
  DocumentService,
  Establishment,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  LovList,
  Person,
  RouterConstants,
  TransactionInterface,
  TransactionMixin,
  WizardItem,
  WorkflowService,
  markFormGroupTouched,
  startOfDay
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  ChangeEstablishmentService,
  ChangeGroupEstablishmentService,
  EstablishmentConstants,
  EstablishmentRoutesEnum,
  EstablishmentService,
  NavigationIndicatorEnum,
  ReopenEstablishment,
  ReopenEstablishmentScBaseComponent,
  filterIdentities,
  getDocumentContentIds,
  getReopenEstablishmentWizard,
  isDocumentsValid,
  isEstablishmentTokenValid,
  selectWizard
} from '../../../shared';

@Component({
  selector: 'est-reopen-establishment-sc',
  templateUrl: './reopen-establishment-sc.component.html',
  styleUrls: ['./reopen-establishment-sc.component.scss']
})
export class ReopenEstablishmentScComponent
  extends TransactionMixin(ReopenEstablishmentScBaseComponent)
  implements TransactionInterface, OnInit
{
  establishmentReopenReason$: Observable<LovList>;
  nationalityList$: Observable<LovList>;
  reopenPeriods$: Observable<LovList>;
  genderList$: Observable<LovList>;
  activeTab = 0;
  regNo: number;
  establishmentAfterChange: Establishment = new Establishment();
  reopenWizardItems: WizardItem[] = [];
  @ViewChild('reopenEstablishmentWizard', { static: false })
  reopenEstablishmentWizard: ProgressWizardDcComponent;
  cancelTemplate: TemplateRef<HTMLElement>;
  reopenForm: FormGroup = new FormGroup({});
  reopenReasonForm: FormGroup;
  authorizationForm: FormGroup;
  commentForm: FormGroup;
  reopenEstablishmentData: ReopenEstablishment;
  referenceNo: number;
  registrationNo: number;
  personDetails: Person;
  personResponse: Person;
  filteredPersonResponse: Person;
  newlyEnteredPerson: Person;
  establishment: Establishment;
  routeToView: string;
  isValidator: boolean;
  resetClicked: boolean = false;
  personExists: boolean = false;
  isVerified: boolean = false;
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly alertService: AlertService,
    readonly bsModalService: BsModalService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly lookUpService: LookupService,
    readonly router: Router,
    private fb: FormBuilder,
    readonly activatedroute: ActivatedRoute,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly changeGrpEstablishmentService: ChangeGroupEstablishmentService,
    readonly location: Location,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(establishmentService, alertService, bsModalService, documentService, workflowService);
  }

  ngOnInit(): void {
    this.initializeWizard();
    this.setRouteParams();
    this.setLookUpLists();
    this.createForms();
    if (isEstablishmentTokenValid(this.estRouterData, RouterConstants.TRANSACTION_REOPEN_ESTABLISHMENT)) {
      this.referenceNo = this.estRouterData.referenceNo ? this.estRouterData.referenceNo : null;
      this.isValidator = true;
      this.routeToView = EstablishmentRoutesEnum.VALIDATOR_RE_OPEN;
      this.getWorkflowDetails(this.estRouterData);
    } else {
      this.registrationNo = this.establishmentService.registrationNo;
      this.getEstablishmentDetails(this.registrationNo);
    }
  }

  initializeWizard() {
    this.reopenWizardItems = getReopenEstablishmentWizard();
    this.reopenWizardItems[0].isActive = true;
    this.reopenWizardItems[0].isDisabled = false;
  }
  setRouteParams() {
    this.activatedroute.params.subscribe(param => {
      if (param) {
        this.regNo = Number(param.regno);
      }
    });
  }
  setLookUpLists() {
    this.establishmentReopenReason$ = this.lookUpService.getReopenReasonList();
    this.reopenPeriods$ = this.lookUpService.getReopenPeriodList();
    this.nationalityList$ = this.lookUpService.getNationalityList();
    this.genderList$ = this.lookUpService.getGenderList();
  }
  /**
   * Event emitted method from progress wizard to make form navigation
   * @param index
   */
  selectedWizard(tabIndex: number) {
    this.alertService.clearAlerts();
    this.activeTab = tabIndex;
    this.reopenWizardItems = selectWizard(this.reopenWizardItems, tabIndex);
  }

  //Create Forms for reason and date
  createForms() {
    this.reopenForm = this.fb.group({});
    this.reopenReasonForm = this.createReasonForm();
    this.commentForm = this.createCommentForm();
  }

  createReasonForm() {
    return this.fb.group({
      reason: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      period: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      })
    });
  }

  createCommentForm() {
    return this.fb.group({
      comments: null
    });
  }

  //SAVE details before final submit

  saveEstablishmentDetails(isFinalSave: boolean) {
    this.alertService.clearAlerts();
    markFormGroupTouched(this.reopenReasonForm);
    if (this.reopenReasonForm.invalid) {
      this.alertService.showMandatoryErrorMessage();
    } else if (!isFinalSave) {
      this.reopenForm?.addControl('reopenReasonForm', this.reopenReasonForm);
      if (this.setReasonDataFromForm()) {
        this.saveDetails(this.reopenEstablishmentData, false);
      }
    } else {
      this.saveWithAuthPersonDetails();
    }
  }

  // Save and next after authperson
  saveWithAuthPersonDetails() {
    this.reopenForm.get('authorizationForm').markAllAsTouched();
    if (this.reopenForm.get('authorizationForm').get('isVerified').value === true) {
      this.filteredPersonResponse = this.personResponse;
      if (this.personExists) this.filteredPersonResponse.identity = filterIdentities(this.personResponse?.identity);
      this.reopenEstablishmentData.person =
        this.isValidator && this.reopenForm?.get('authorizationForm')?.get('resetClicked').value !== true
          ? this.establishmentAfterChange?.reopenEstablishment?.person
          : this.filteredPersonResponse;
      if (this.reopenForm.get('authorizationForm').get('person').valid && !this.personExists) {
        this.reopenEstablishmentData.person = (
          this.reopenForm?.get('authorizationForm')?.get('person') as FormGroup
        ).getRawValue();
        this.reopenEstablishmentData.person.birthDate = (
          this.reopenForm?.get('authorizationForm')?.get('search')?.get('birthDate') as FormGroup
        ).getRawValue();
        this.reopenEstablishmentData.person.nationality = (
          this.reopenForm?.get('authorizationForm')?.get('search')?.get('nationality') as FormGroup
        ).getRawValue();
        this.reopenEstablishmentData.person.identity = (
          this.reopenForm?.get('authorizationForm')?.get('search')?.get('identity') as FormGroup
        ).getRawValue();
        this.reopenEstablishmentData.person.identity = filterIdentities(this.reopenEstablishmentData?.person?.identity);
      }
      this.reopenEstablishmentData.person.birthDate.gregorian = startOfDay(
        this.reopenEstablishmentData?.person?.birthDate?.gregorian
      );
      if (this.reopenForm.get('authorizationForm').get('contactDetail').valid) {
        this.reopenEstablishmentData.person.contactDetail = (
          this.reopenForm.get('authorizationForm').get('contactDetail') as FormGroup
        ).getRawValue();
      }
      this.reopenEstablishmentData.referenceNo = this.referenceNo;
      this.reopenEstablishmentData.navigationIndicator = this.isValidator
        ? NavigationIndicatorEnum.VALIDATOR_REOPEN_EST_SECOND_SAVE_AND_NEXT
        : NavigationIndicatorEnum.REOPEN_EST_SECOND_SAVE_AND_NEXT;
      this.setContentAndCommentsNull();
      this.reopenForm.get('authorizationForm').get('contactDetail').markAllAsTouched();
      if (this.reopenForm.get('authorizationForm').get('contactDetail').valid) {
        this.saveDetails(this.reopenEstablishmentData, false);
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }

  //Final Submit
  saveReopenDetails() {
    const isDocumentsSubmitted = isDocumentsValid(this.reopenDocuments);
    if (isDocumentsSubmitted) {
      this.reopenForm?.addControl('commentForm', this.commentForm);
      this.reopenEstablishmentData.comments = this.commentForm?.get('comments').value;
      this.reopenEstablishmentData.contentId = getDocumentContentIds(this.reopenDocuments);
      this.reopenEstablishmentData.navigationIndicator = this.isValidator
        ? NavigationIndicatorEnum.VALIDATOR_REOPEN_ESTABLISHMENT_FINAL_SUBMIT
        : NavigationIndicatorEnum.REOPEN_FINAL_SUBMIT;
      this.saveDetails(this.reopenEstablishmentData, true);
    } else {
      this.alertService.showMandatoryDocumentsError();
    }
  }

  setReasonDataFromForm() {
    let isValid = false;
    this.reopenEstablishmentData = new ReopenEstablishment();
    this.reopenForm?.get('reopenReasonForm').markAllAsTouched();
    let reasonForm = this.reopenForm?.get('reopenReasonForm');
    if (reasonForm?.get('reason').valid && reasonForm?.get('period').valid) {
      isValid = true;
      this.reopenEstablishmentData.reopenReason = reasonForm?.get('reason').value;
      this.reopenEstablishmentData.periodOfReopening = parseInt(reasonForm?.get('period')?.get('english').value);
      this.reopenEstablishmentData.person = null;
      this.reopenEstablishmentData.referenceNo = !this.referenceNo ? null : this.referenceNo;
      this.reopenEstablishmentData.navigationIndicator = this.isValidator
        ? NavigationIndicatorEnum.VALIDATOR_REOPEN_EST_FIRST_SAVE_AND_NEXT
        : NavigationIndicatorEnum.REOPEN_EST_FIRST_SAVE_AND_NEXT;
      this.setContentAndCommentsNull();
      return isValid;
    } else {
      return isValid;
    }
  }

  // Method to pass data to BE
  saveDetails(reopenEstablishmentData: ReopenEstablishment, isFinalWizard: boolean) {
    this.establishmentService
      .saveReopenEstablishment(this.registrationNo, reopenEstablishmentData)
      .pipe(
        catchError(err => this.handleError(err)),
        tap(res => {
          if (res?.transactionTraceId) {
            this.referenceNo = res?.transactionTraceId;
            if (!isFinalWizard) {
              this.activeTab++;
              if (this.reopenEstablishmentWizard) {
                this.reopenEstablishmentWizard.setNextItem(this.activeTab);
              }
            }
          }
          if (this.isValidator && isFinalWizard) {
            this.updateBpmTransaction(this.estRouterData, this.commentForm.get('comments').value).subscribe(() => {
              this.setTransactionComplete();
              this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]),
                this.alertService.showSuccess(res?.transactionMessage);
            });
          }
          if (res?.transactionMessage) {
            this.alertService.showSuccess(res?.transactionMessage);
            this.location.back();
          }
          if (this.activeTab == 2) this.getDocuments().subscribe();
        })
      )
      .subscribe();
  }

  /**
   * Method to verify person
   */
  verifyPerson(personData) {
    this.alertService.clearAlerts();
    this.personDetails = personData;
    if (this.reopenForm.valid) {
      this.establishmentService
        .verifyPersonDetails(this.personDetails)
        .pipe(
          catchError(err => this.handleError(err)),
          tap(personRes => {
            this.personResponse = personRes;
            if (this.personResponse?.personId) {
              this.reopenForm.get('authorizationForm').get('personExists').setValue(true);
              this.personExists = true;
            } else {
              this.reopenForm.get('authorizationForm').get('personExists').setValue(false);
              this.personExists = false;
            }
            this.reopenForm.get('authorizationForm').get('isVerified').setValue(true);
            this.resetClicked = this.reopenForm?.get('authorizationForm')?.get('resetClicked').value;
            this.isVerified = true;
            this.setIfNewpersonAdded();
          })
        )
        .subscribe();
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
  setIfNewpersonAdded() {
    if (!this.personResponse && this.isVerified) {
      this.newlyEnteredPerson = new Person();
      this.newlyEnteredPerson.birthDate = (
        this.reopenForm.get('authorizationForm')?.get('search')?.get('birthDate') as FormGroup
      ).getRawValue();
      this.newlyEnteredPerson.identity = (
        this.reopenForm.get('authorizationForm')?.get('search')?.get('identity') as FormGroup
      ).getRawValue();
      this.newlyEnteredPerson.nationality = (
        this.reopenForm.get('authorizationForm')?.get('search')?.get('nationality') as FormGroup
      ).getRawValue();
      console.log(this.newlyEnteredPerson?.birthDate?.gregorian);
    }
  }

  resetPerson() {
    this.isVerified = false;
  }

  /**
   * Method to handle errors
   * @param err
   */
  handleError(err) {
    this.alertService.showError(err?.error?.message, err?.error?.details);
    return throwError(null);
  }

  /**
   * Method to get all documents
   */
  getDocuments(): Observable<DocumentItem[]> {
    return this.changeGrpEstablishmentService
      .getDocuments(
        this.documentTransactionKey,
        this.documentTransactionType,
        this.registrationNo,
        this.referenceNo,
        null
      )
      .pipe(
        tap(res => (this.reopenDocuments = res)),
        catchError(err => {
          this.alertService.showError(err.error?.message, err.error?.details);
          return throwError(err);
        })
      );
  }

  // Method to set contentId and comments null
  setContentAndCommentsNull() {
    this.reopenEstablishmentData.contentId = [];
    this.reopenEstablishmentData.comments = null;
  }

  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.cancelTransaction();
  }

  /**
   * Method to cancel the transaction
   */
  cancelTransaction() {
    if (this.referenceNo) {
      this.changeEstablishmentService.revertTransaction(this.registrationNo, this.referenceNo).subscribe(
        () => {
          this.setTransactionComplete();
          if (this.isValidator) {
            this.router.navigate([RouterConstants.ROUTE_INBOX]);
          } else {
            this.location.back();
          }
        },
        err => this.alertService.showError(err?.error?.message)
      );
    } else {
      this.setTransactionComplete();
      this.changeEstablishmentService.navigateToProfile(this.establishment.registrationNo);
    }
  }

  askForCancel() {
    this.showModal(this.cancelTemplate);
  }
  /**
   * Method to get establishment with reference number from workflow
   * @param referenceNo
   */
  getWorkflowDetails(routerData: EstablishmentRouterData) {
    this.fetchComments(routerData);
    this.fetchEstWithRefNo(routerData.registrationNo, routerData.referenceNo);
  }

  /**
   * Method to fetch establishment with reference number
   */
  fetchEstWithRefNo(regNo: number, referenceNo: number) {
    this.changeEstablishmentService
      .getEstablishmentFromTransient(regNo, referenceNo)
      .pipe(
        tap(res => {
          this.establishmentAfterChange = res;
          this.registrationNo = this.establishmentAfterChange.registrationNo;
          this.reopenReasonForm
            .get('reason')
            .setValue(this.establishmentAfterChange?.reopenEstablishment?.reopenReason);
          this.reopenReasonForm
            .get('period')
            .get('english')
            .setValue(this.establishmentAfterChange?.reopenEstablishment?.periodOfReopening.toString());
          this.reopenReasonForm
            .get('period')
            .get('arabic')
            .setValue(this.establishmentAfterChange?.reopenEstablishment?.periodOfReopening.toString());
          this.reopenForm.get('authorizationForm').get('isVerified').setValue(true);
          this.reopenForm.get('authorizationForm').get('personExists').setValue(true);
        })
      )
      .subscribe(
        () => {
          this.intialiseView();
        },
        () => {
          this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_RE_OPEN]);
        }
      );
  }
  // to initialize the view
  intialiseView() {
    this.getDocuments();
  }
}
