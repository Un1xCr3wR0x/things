/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Directive, Inject, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Alert,
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  BilingualText,
  BpmHeaders,
  BPMUpdateRequest,
  ContactDetails,
  Contributor,
  CoreContributorService,
  DocumentItem,
  DocumentService,
  GenderEnum,
  getAlertSuccess,
  getAlertWarning,
  getArabicName,
  getPersonIdentifier,
  IdentityTypeEnum,
  PayloadKeyEnum,
  Person,
  Role,
  RouterData,
  RouterDataToken,
  scrollToTop,
  TransactionReferenceData,
  UuidGeneratorService,
  WorkFlowActions,
  WorkflowItem,
  WorkflowService
} from '@gosi-ui/core';
import { noop, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { ManagePersonConstants } from '../constants/manage-person-constants';
import { RevertTransaction } from '../models';
import { ManagePersonRoutingService, ManagePersonService } from '../services';
interface BPM {
  body: BPMUpdateRequest;
  headers: HttpHeaders;
}
@Directive()
export abstract class ManagePersonScBaseComponent extends BaseComponent implements OnDestroy {
  //Local Variables
  contributor: Contributor = new Contributor();
  person: Person;
  registrationNo: number;
  comments$: Observable<TransactionReferenceData[]> = of([]);
  socialInsuranceNo: number;
  borderReferenceNo: number;
  iqamaReferenceNo: number;
  active = false;
  isContributor = false;
  iconLocation = ManagePersonConstants.MALE_ICON_LOCATION;
  iconName: string;
  hasIqama: boolean;
  hasBorder: boolean;
  iqamaDocuments: DocumentItem[] = [];
  borderDocuments: DocumentItem[] = [];
  comments: TransactionReferenceData[] = [];
  iqamaForm: FormGroup = new FormGroup({});
  borderForm: FormGroup = new FormGroup({});
  personArabicName = '';
  isDocumentUploaded: boolean;
  workFlowInfo: Alert = new Alert();
  hasBorderWorkFlow = false;
  hasIqamaWorkFlow = false;
  iqamaType = IdentityTypeEnum.IQAMA;
  borderType = IdentityTypeEnum.BORDER;
  showFeedback = false;
  feedBackMessage: Alert;
  revertTransaction: RevertTransaction = new RevertTransaction();
  editTransaction = false; // This flag is to check the transaction if for admin reenter or validator 1 modify
  iqamaComments = [];
  borderComments = [];
  isComments = false;
  currentTab = 0;
  isAppPrivate: boolean;
  isIqamaReturned = false;
  isBorderReturned = false;
  subHeadings: { label: string; value: number | Date; isDate: boolean }[];
  documents$: Observable<DocumentItem[]>;
  uuid: string;
  isBeneficiary: Boolean;
  isIndividual: Boolean;
  constructor(
    public contributorService: CoreContributorService,
    public manageService: ManagePersonService,
    readonly alertService: AlertService,
    public documentService: DocumentService,
    @Inject(RouterDataToken)
    readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    public managePersonRoutingService: ManagePersonRoutingService,
    readonly uuidService: UuidGeneratorService,
    readonly location: Location
  ) {
    super();
  }
  //Method to populate data for html
  initialiseTheView(isBorder?: boolean) {
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isAppPrivate = true;
    } else {
      this.isAppPrivate = false;
    }
    if (this.manageService.contributor$) {
      return this.manageService.contributor$.pipe(
        takeUntil(this.destroy$),
        take(1),
        switchMap(contributor => {
          return this.initialiseForContributor(contributor, isBorder).pipe(
            switchMap(() => {
              return of(contributor);
            })
          );
        }),
        switchMap(res => {
          if (res && res.socialInsuranceNo === null) {
            this.isContributor = false;
            return this.manageService.person$;
          } else {
            return of(res);
          }
        }),
        tap(response => {
          if (this.isContributor === false) {
            if (response && (response as Person).personId) {
              this.initialisePersonDetails(response as Person);
            } else {
              this.managePersonRoutingService.navigateToContributorSearch();
            }
          }
        })
      );
    }
  }
  initialiseForContributor(contributor: Contributor, isBorder: boolean) {
    if (contributor?.socialInsuranceNo) {
      this.contributor = contributor;
      this.isBeneficiary = contributor.isBeneficiary;
      this.socialInsuranceNo = contributor.socialInsuranceNo;
      this.isContributor = true;
      this.active = contributor.hasLiveEngagement;
      if (this.isIndividual) {
        return this.getWorkFlowStatus(this.socialInsuranceNo, isBorder).pipe(
          tap(() => {
            this.initialisePersonDetails(contributor.person);
            this.fetchComments(this.routerDataToken);
            this.getDocuments(isBorder);
          })
        );
      }
      return this.manageService.establishmentProfile$.pipe(
        takeUntil(this.destroy$),
        switchMap(res => {
          this.registrationNo = res.registrationNo;
          return this.getWorkFlowStatus(this.socialInsuranceNo, isBorder);
        }),
        tap(() => {
          this.initialisePersonDetails(contributor.person);
          this.fetchComments(this.routerDataToken);
          this.getDocuments(isBorder);
        })
      );
    }
  }
  // Method to initialise person details
  initialisePersonDetails(person: Person): void {
    if (person && person !== null) {
      this.person = person;
      if (this.person) {
        if (this.person.sex?.english === GenderEnum.MALE) {
          this.iconLocation = ManagePersonConstants.MALE_ICON_LOCATION;
        } else {
          this.iconLocation = ManagePersonConstants.FEMALE_ICON_LOCATION;
        }
      }
      if (!this.person.contactDetail) {
        this.person.contactDetail = new ContactDetails();
        this.person.contactDetail.addresses = [];
      }
      if (!this.person.contactDetail.addresses) {
        this.person.contactDetail.addresses = [];
      }
      this.personArabicName = getArabicName(this.person.name.arabic);
      this.enableFunctionalitites();
    }
  }
  // This method is to check if validator 1 or admin re-enter is viewing
  checkIfEdit(isBorder?: boolean) {
    if (
      this.routerDataToken.taskId !== null &&
      (this.routerDataToken.assignedRole === Role.VALIDATOR_1 ||
        this.routerDataToken.assignedRole === Role.EST_ADMIN_OH)
    ) {
      const regNo = +this.routerDataToken.idParams.get(PayloadKeyEnum.REGISTRATION_NO);
      const sin = +this.routerDataToken.idParams.get(PayloadKeyEnum.ID);
      this.editTransaction = true;
      this.manageService
        .getEstablishmentProfile(regNo)
        .pipe(
          switchMap(() => this.manageService.searchContributor(regNo, sin)),
          tap(() => {
            this.manageService.registrationNo = regNo;
            this.initialiseTheView(isBorder).subscribe();
          })
        )
        .subscribe(noop, err => this.showErrorMessage(err));
    }
  }
  // This method is to fetch the active status if a contributor has logged in
  getActiveStatusIfContributor(personId: number) {
    if (personId) {
      this.alertService.clearAllErrorAlerts();
      return this.manageService.getActiveStatus(personId).pipe(
        tap(engagement => {
          if (engagement && engagement !== null) {
            this.socialInsuranceNo = engagement.socialInsuranceNo;
            this.active = engagement.active;
            this.isContributor = true;
          } else {
            this.isContributor = false;
          }
        }),
        catchError(err => {
          this.showErrorMessage(err);
          this.isContributor = false;
          return throwError(err);
        })
      );
    }
  }
  // This method is enable the various functionalities according to the person role viewing the screen
  enableFunctionalitites() {
    if (this.person) {
      this.contributor.person.identity = [...getPersonIdentifier(this.person)];
      this.person.identity = [...getPersonIdentifier(this.person)];
    }
  }
  // Method to set workflow status
  getWorkFlowStatus(sin: number, isBorder?: boolean) {
    this.hasBorderWorkFlow = false;
    this.hasIqamaWorkFlow = false;
    this.workFlowInfo = new Alert();
    const socialInsuranceNo = sin;
    if (this.registrationNo && this.registrationNo !== null && socialInsuranceNo !== null) {
      return this.manageService.getWorkFlowDetails(this.registrationNo, socialInsuranceNo).pipe(
        tap(res => {
          this.workFlowInfo = getAlertWarning(new BilingualText(), []) as Alert;
          if (res) {
            res.map(item => {
              if (item.message && item.message !== null) {
                if (item.type === IdentityTypeEnum.IQAMA) {
                  this.hasIqamaWorkFlow = true;
                  this.iqamaReferenceNo = item.referenceNo;
                  if (item.status === ManagePersonConstants.STATUS_RETURNED) {
                    this.isIqamaReturned = true;
                  } else {
                    this.isIqamaReturned = false;
                  }
                  this.iqamaComments = item.transactionData;
                  if (this.iqamaForm.get('iqamaAdd') && (this.editTransaction || this.manageService.isEdit)) {
                    this.iqamaForm.get('iqamaAdd').get('iqamaNo').setValue(item.newValue);
                  }
                  if (this.hasIqamaWorkFlow && isBorder === false) {
                    this.initialiseForEditTransaction(item);
                  }
                } else if (item.type === IdentityTypeEnum.BORDER) {
                  this.hasBorderWorkFlow = true;
                  this.borderReferenceNo = item.referenceNo;
                  if (item.status === ManagePersonConstants.STATUS_RETURNED) {
                    this.isBorderReturned = true;
                  } else {
                    this.isBorderReturned = false;
                  }
                  this.borderComments = item.transactionData;
                  if (this.borderForm.get('borderAdd') && (this.editTransaction || this.manageService.isEdit)) {
                    this.borderForm.get('borderAdd').get('borderNo').setValue(item.newValue);
                    this.borderForm.get('borderAdd').get('borderNo').updateValueAndValidity();
                  }
                  if (this.hasBorderWorkFlow && isBorder === true) {
                    this.initialiseForEditTransaction(item);
                  }
                }
                const alert = new Alert();
                alert.message = item.message;
                this.workFlowInfo.message = undefined;
                this.workFlowInfo.details.push(alert);
              }
            });
          }
        }),
        catchError(err => {
          this.showErrorMessage(err);
          return of(null);
        })
      );
    }
    return of(null);
  }
  initialiseForEditTransaction(item: WorkflowItem) {
    if ((this.manageService.isEdit || this.editTransaction) && item) {
      this.subHeadings = [
        {
          label: 'CUSTOMER-INFORMATION.TRANSACTION-NO',
          value: item.referenceNo,
          isDate: false
        },
        {
          label: 'CUSTOMER-INFORMATION.TRANSACTION-SUBMISSION-DATE',
          value: item.submissionDate ? item.submissionDate.gregorian : null,
          isDate: true
        }
      ];
    }
  }
  initialiseTransaction(isBorder: boolean) {
    this.alertService.clearAlerts();
    scrollToTop();
    this.checkIfEdit(isBorder);
    if (!this.editTransaction) {
      this.uuid = this.uuidService.getUuid();
      return this.initialiseTheView(isBorder);
    }
    return of(null);
  }
  clearErrorAndHide(type) {
    this.setNavigationIndicator();
    this.revertTransaction.workflowType = type;
    this.manageService.revertTransaction(this.revertTransaction, this.socialInsuranceNo).subscribe(
      () => {
        if (!this.editTransaction || this.manageService.isEdit) {
          this.location.back();
        } else {
          if (this.routerDataToken.assignedRole === Role.EST_ADMIN_OH) {
            this.managePersonRoutingService.navigateToInbox(this.appToken);
          } else {
            this.managePersonRoutingService.navigateToValidator(type);
          }
        }
      },
      err => this.showErrorMessage(err)
    );
    this.alertService.clearAlerts();
  }
  //This method is used to set the navigation indicator for transactions
  setNavigationIndicator() {
    if (this.editTransaction === true || this.manageService.isEdit === true) {
      if (this.routerDataToken.assignedRole === Role.EST_ADMIN_OH) {
        this.revertTransaction.navigationInd = ManagePersonConstants.NAV_INDEX_RE_ENTER;
      } else {
        this.revertTransaction.navigationInd = ManagePersonConstants.NAV_INDEX_VALIDATOR_SUBMIT;
      }
    } else {
      this.revertTransaction.navigationInd = ManagePersonConstants.NAV_INDEX_SUBMIT;
    }
  }
  getDocuments(isBorder: boolean) {
    const identifiers = this.getDocumentIdentifiers(isBorder);
    this.documents$ = this.documentService
      .getDocuments(identifiers.key, identifiers.documentType, identifiers.identifier)
      .pipe(
        tap(res => {
          if (isBorder) this.borderDocuments = [...res];
          else {
            this.iqamaDocuments = [...res];
          }
        })
      );
  }
  /**
   * This method is used to get the scanned documents
   * @param isBorder
   * @param document
   */
  refreshDocument(isBorder, document: DocumentItem) {
    const identifiers = this.getDocumentIdentifiers(isBorder);
    this.documentService.refreshDocument(document, identifiers.identifier).subscribe(res => (document = res));
  }
  getDocumentIdentifiers(isBorder: boolean) {
    let key;
    let documentType;
    let identifier = null;
    if (this.person && this.person.personId) {
      identifier = this.person.personId;
    }
    if (isBorder) {
      key = ManagePersonConstants.BORDER_DOCUMENT_KEY;
      documentType = ManagePersonConstants.BORDER_DOCUMENT_TYPE;
    } else {
      key = ManagePersonConstants.IQAMA_DOCUMENT_KEY;
      documentType = ManagePersonConstants.IQAMA_DOCUMENT_TYPE;
    }
    return { key, documentType, identifier };
  }
  showErrorMessage(err) {
    if (err && err.error) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
  // method to edit and approve the transaction
  updateBpmTransaction(
    routerData: RouterData,
    comments: string,
    outcome: WorkFlowActions = WorkFlowActions.UPDATE
  ): Observable<BilingualText> {
    return this.submitWorkflow(this.assembleBpmRequest(routerData, outcome, undefined, comments)).pipe(
      tap(() => {
        routerData.fromJsonToObject(new RouterData());
      })
    );
  }
  /**
   * Method to submit the transaction to BPM with correct outcome
   * @param requestData
   */
  submitWorkflow(requestData: BPM) {
    const { body, headers } = requestData;
    return this.workflowService.updateTaskWorkflow(body, undefined, headers);
  }
  assembleBpmRequest(routerData: RouterData, outcome: WorkFlowActions, form?: FormGroup, comments?: string): BPM {
    const request = new BPMUpdateRequest();
    request.referenceNo = routerData.transactionId.toString();
    request.comments = comments || form?.get('comments')?.value;
    request.outcome = outcome;
    request.rejectionReason = form?.get('rejectionReason')?.value;
    request.returnReason = form?.get('returnReason')?.value;
    request.taskId = routerData.taskId;
    request.user = this.userRole(routerData);
    return { body: request, headers: this.assembleHttpHeaders(this.assembleBpmHeaders(routerData)) };
  }
  private assembleHttpHeaders(headers: BpmHeaders): HttpHeaders {
    return Object.keys(headers)?.reduce((headerMap, key, index) => {
      if (index === 0) {
        return headerMap.set(key, headers[key]);
      } else {
        return headerMap.append(key, headers[key]);
      }
    }, new HttpHeaders());
  }
  private userRole(taskDetails?: RouterData): string {
    return taskDetails.assigneeId;
  }
  /**
   * Method to assemble the BPM Headers
   * @param estRouterData
   */
  private assembleBpmHeaders(routerData: RouterData): BpmHeaders {
    return {
      bpmTaskId: routerData.taskId,
      workflowUser: this.userRole(routerData)
    };
  }
  /** This method is to show the success message in the same popup when saving iqama or border */
  triggerFeedbackOnSave(res, sin, comments) {
    const feedBack = res;
    if (this.editTransaction || this.manageService.isEdit) {
      this.updateBpmTransaction(this.routerDataToken, comments).subscribe(
        () => {
          this.showFeedback = true;
          this.managePersonRoutingService.resetLocalToken();
          if (feedBack.bilingualMessage) {
            this.feedBackMessage = getAlertSuccess(feedBack.bilingualMessage, null) as Alert;
          }
        },
        err => {
          this.showErrorMessage(err);
        }
      );
    } else {
      this.getWorkFlowStatus(sin).subscribe();
      this.showFeedback = true;
      if (res.bilingualMessage) {
        this.feedBackMessage = getAlertSuccess(res.bilingualMessage, null) as Alert;
      }
    }
  }
  getComments(estRouterData: RouterData) {
    this.getAllComments(estRouterData).subscribe(
      res => (this.comments = res),
      err => {
        this.alertService.showError(err?.error?.message);
      }
    );
  }
  //Method to get the comments from BPM
  getAllComments(estRouterData: RouterData): Observable<TransactionReferenceData[]> {
    return of(estRouterData.comments);
  }
  // Method to fetch comments
  fetchComments(routerData: RouterData) {
    this.comments$ = this.getAllComments(routerData);
  }

  navigateToInitialPage(router: Router, isFromProfile: boolean) {
    if (isFromProfile) {
      router.navigate([ManagePersonConstants.ROUTE_CONTRIBUTOR_PROFILE(this.registrationNo, this.socialInsuranceNo)]);
    } else {
      router.navigate([ManagePersonConstants.ROUTE_TO_INBOX(this.appToken)]);
    }
  }
}
