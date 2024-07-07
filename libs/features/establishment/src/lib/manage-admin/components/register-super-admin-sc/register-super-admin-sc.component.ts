import { Location } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  AlertService,
  AppConstants,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentItem,
  DocumentService,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  markFormGroupTouched,
  RoleIdEnum,
  RouterConstants,
  TransactionFeedback,
  TransactionInterface,
  TransactionMixin,
  TransactionReferenceData,
  WorkflowService
} from '@gosi-ui/core';
import { BreadcrumbDcComponent } from '@gosi-ui/foundation-theme/src';
import { BsModalService } from 'ngx-bootstrap/modal';
import { noop, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { routerData } from 'testing';
import {
  activateWizard,
  Admin,
  DocumentTransactionIdEnum,
  DocumentTransactionTypeEnum,
  eligibleInternalRolesForAdminView,
  EstablishmentAdminService,
  EstablishmentConstants,
  EstablishmentErrorKeyEnum,
  EstablishmentRoutesEnum,
  EstablishmentService,
  filterIdentities,
  getAdminRole,
  getDocumentContentIds,
  getRegisterSuperAdminWizards,
  isEstablishmentTokenValid,
  isTransactionDraft,
  ManageAdminScBaseComponent,
  NavigationIndicatorEnum
} from '../../../shared';
import { incorrectRoute } from '../admin-sc/admin-sc.component';

@Component({
  selector: 'est-register-super-admin-sc',
  templateUrl: './register-super-admin-sc.component.html',
  styleUrls: ['./register-super-admin-sc.component.scss']
})
export class RegisterSuperAdminScComponent
  extends TransactionMixin(ManageAdminScBaseComponent)
  implements TransactionInterface, OnInit, AfterViewInit
{
  comments$: Observable<TransactionReferenceData[]>;
  isValidators = false;
  documentKey = DocumentTransactionTypeEnum.ADD_SUPER_ADMIN;
  documentType = DocumentTransactionTypeEnum.ADD_SUPER_ADMIN;
  transactionId = DocumentTransactionIdEnum.ADD_SUPER_ADMIN;
  commentsMaxLength = AppConstants.MAXLENGTH_COMMENTS;
  adminDocuments: DocumentItem[];
  loggedInAdminRole: string;
  adminId: number;
  mainRegNo: number;
  admins: Admin[] = [];
  adminRoleId: number;
  currentTab = 0;
  referenceNo: number;
  registrationNo: number;
  transactionFeedback: TransactionFeedback;
  heading = 'ESTABLISHMENT.REGISTER-BRANCH-MANAGER';
  isGCC: boolean;
  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;
  @ViewChild('brdcmb', { static: false })
  addAdminBrdcmb: BreadcrumbDcComponent;

  constructor(
    readonly bsModalService: BsModalService,
    readonly lookupService: LookupService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location,
    readonly workflowService: WorkflowService,
    readonly documentService: DocumentService,
    readonly adminService: EstablishmentAdminService,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    readonly route: ActivatedRoute,
    readonly router: Router
  ) {
    super(bsModalService, lookupService, alertService, establishmentService, appToken, location, workflowService);
    this.estAdminForm = this.createEstAdminForm();
  }

  ngOnInit(): void {
    if (this.estRouterData.resourceType) {
      this.isGCC = this.estRouterData.resourceType === RouterConstants.TRANSACTION_ADD_GCC_ADMIN;
    }
    if (
      isTransactionDraft(
        this.estRouterData,
        this.isGCC ? DocumentTransactionIdEnum.ADD_GCC_ADMIN : DocumentTransactionIdEnum.ADD_SUPER_ADMIN
      )
    ) {
      this.setForEdit(true);
    } else if (
      isEstablishmentTokenValid(
        this.estRouterData,
        this.isGCC ? RouterConstants.TRANSACTION_ADD_GCC_ADMIN : RouterConstants.TRANSACTION_ADD_SUPER_ADMIN
      )
    ) {
      this.setForEdit(false);
    } else {
      this.initialiseParams(this.route.paramMap);
    }
    this.initialiseView();
    if (this.isGCC) {
      this.heading = 'ESTABLISHMENT.REGISTER-GCC-ADMIN';
      this.documentKey = DocumentTransactionTypeEnum.ADD_GCC_ADMIN;
      this.documentType = DocumentTransactionTypeEnum.ADD_SUPER_ADMIN;
      this.transactionId = DocumentTransactionIdEnum.ADD_GCC_ADMIN;
    }
  }
  ngAfterViewInit() {
    if (this.route.routeConfig) {
      this.route.routeConfig.data = { breadcrumb: this.heading };
      this.addAdminBrdcmb.breadcrumbs = this.addAdminBrdcmb.buildBreadCrumb(this.route.root);
    }
  }

  setForEdit(isDraft = false) {
    this.isValidators = !isDraft;
    this.referenceNo = this.estRouterData.referenceNo;
    this.registrationNo = this.estRouterData.registrationNo;
    this.initialiseEdit(this.estRouterData);
  }

  initialiseView() {
    this.intialiseLookUpValues();
    this.initialiseWizards(this.currentTab);
    if (!this.estRouterData.resourceType) {
      this.isGCC = this.establishmentService.isUserEligible(
        eligibleInternalRolesForAdminView?.filter(item => item === RoleIdEnum.GCC_CSR),
        undefined
      );
    }
  }
  /**
   * @param paramMap
   * map adminid and registrationno from route
   */
  initialiseParams(paramMap: Observable<ParamMap>) {
    paramMap
      .pipe(
        tap(params => {
          if (params && params.get('registrationNo')) {
            this.mainRegNo = +params.get('registrationNo');
          } else {
            throwError(incorrectRoute);
          }
        })
      )
      .subscribe(noop, err => this.alertService.showError(err?.error?.message));
  }
  /**
   * method to initialise edit
   * @param estToken
   */
  initialiseEdit(estToken: EstablishmentRouterData) {
    if (estToken) {
      this.mainRegNo = estToken.registrationNo;
      this.estAdminForm.get('referenceNo').setValue(estToken?.referenceNo);
      this.estAdminForm.updateValueAndValidity();
      this.fetchComments(estToken);
      this.establishmentService
        .getAdminsOfEstablishment(estToken.registrationNo, estToken.referenceNo)
        .pipe(
          map(res => res.admins),
          tap(res => {
            this.admins = res;
            this.estAdmin = new Admin();
            this.estAdmin.person.fromJsonToObject(this.admins[0].person);
            this.estAdmin.roles = this.admins[0].roles;
            this.bindPersonFormModel(this.estAdmin);
            this.estAdminForm.get('personExists').setValue(true);
            this.estAdminForm.get('isVerified').setValue(true);
            this.initialiseParams(this.route.paramMap);
          })
        )
        .subscribe(noop, err => {
          return this.alertService.showError(err?.error?.message);
        });

      this.adminWizards = getRegisterSuperAdminWizards().map(wizard => {
        wizard.isDisabled = false;
        wizard.isActive = false;
        wizard.isDone = true;
        return wizard;
      });
      if (estToken.tabIndicator !== null && estToken.tabIndicator < this.adminWizards.length) {
        this.currentTab = estToken.tabIndicator;
        this.adminWizards[estToken.tabIndicator].isActive = true;
      } else {
        this.adminWizards[this.currentTab].isActive = true;
      }
    }
  }
  initialiseWizards(currentTab: number) {
    this.adminWizards = getRegisterSuperAdminWizards(currentTab);
  }
  /**
   * Method to select the tab
   * @param tabIndex
   */
  selectedWizard(tabIndex: number, restrictNextWizards: boolean = false) {
    this.currentTab = tabIndex;
    this.adminWizards = activateWizard(this.adminWizards, tabIndex, restrictNextWizards);
  }
  /**
   * Method to fetch comments
   */
  fetchComments(data: EstablishmentRouterData) {
    this.comments$ = this.getAllComments(data);
  }

  saveSuperAdmin() {
    this.alertService.clearAlerts();
    markFormGroupTouched(this.estAdminForm);
    if (this.estAdminForm.get('isVerified').value === true) {
      const superAdmin = new Admin();
      superAdmin.person = this.estAdmin.person;
      const roles = this.isGCC ? 'GCC Admin' : 'Branches Account Manager';
      superAdmin.roles = getAdminRole([roles]);
      if (this.estAdminForm.get('contactDetail').valid && this.estAdminForm.get('person').valid) {
        superAdmin.person?.fromJsonToObject((this.estAdminForm.get('person') as FormGroup)?.getRawValue());
        superAdmin.person.contactDetail = (this.estAdminForm.get('contactDetail') as FormGroup).getRawValue();
        this.estAdmin = superAdmin;
        this.estAdmin.person.identity = filterIdentities(this.estAdmin.person.identity);
        this.adminService
          .saveAsNewAdmin(this.estAdmin)
          .pipe(
            tap(res => {
              this.estAdmin.person.personId = res;
            }),
            switchMap(() =>
              this.adminService.saveSuperAdminDetails(
                this.mainRegNo,
                false,
                this.estAdmin,
                this.getNavIndicator(false),
                null,
                null,
                this.estAdminForm.get('referenceNo').value
              )
            ),
            tap(res => {
              if (res?.transactionId) {
                this.estAdminForm.get('referenceNo').setValue(res?.transactionId);
                this.referenceNo = res?.transactionId;
              }
              this.getDocuments();
            })
          )
          .subscribe(noop, err => {
            this.alertService.showError(err?.error?.message, err?.error?.details);
          });
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    } else {
      this.alertService.showErrorByKey(EstablishmentErrorKeyEnum.VERIFY_ADMIN);
    }
  }
  submitTransaction() {
    if (!this.documentService.checkMandatoryDocuments(this.adminDocuments)) {
      this.alertService.showMandatoryDocumentsError();
    } else {
      this.adminService
        .saveSuperAdminDetails(
          this.mainRegNo,
          false,
          this.estAdmin,
          this.getNavIndicator(true),
          this.estAdminForm.get('comments').value,
          getDocumentContentIds(this.adminDocuments),
          this.estAdminForm.get('referenceNo').value
        )
        .subscribe(
          res => {
            this.transactionFeedback = res;
            if (this.isValidators) {
              this.updateBpmTransaction(this.estRouterData, this.estAdminForm.get('comments').value).subscribe(() => {
                this.setTransactionComplete();
                this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
                this.alertService.showSuccess(this.transactionFeedback.successMessage);
              });
            } else {
              this.setTransactionComplete();
              this.location.back();
              this.alertService.showSuccess(this.transactionFeedback.successMessage);
            }
          },
          err => this.alertService.showError(err?.error?.message)
        );
    }
  }

  /**
   * Method to get the document content
   * @param document
   * @param identifier
   * @param documentType
   */
  refreshDoc(document: DocumentItem, identifier: number, documentType: string) {
    this.documentService
      .refreshDocument(
        document,
        identifier,
        this.documentKey,
        documentType,
        this.estRouterData.referenceNo || this.estAdminForm.get('referenceNo').value
      )
      .subscribe(res => {
        document = res;
      });
  }

  /**
   * Method to get navigation indicator
   */
  getNavIndicator(isFinalSubmit = false): number {
    if (this.isValidators) {
      return isFinalSubmit
        ? NavigationIndicatorEnum.VALIDATOR_ADD_SUPER_ADMIN_FINAL_SUBMIT
        : NavigationIndicatorEnum.VALIDATOR_ADD_SUPER_ADMIN_SUBMIT;
    } else {
      return isFinalSubmit
        ? NavigationIndicatorEnum.CSR_ADD_SUPER_ADMIN_FINAL_SUBMIT
        : NavigationIndicatorEnum.CSR_ADD_SUPER_ADMIN_SUBMIT;
    }
  }
  /**
   * Method to get documents
   */
  getDocuments() {
    this.documentService
      .getDocuments(
        this.documentKey,
        this.documentType,
        this.mainRegNo,
        this.estRouterData.referenceNo || this.estAdminForm.get('referenceNo').value
      )
      .pipe(
        catchError(err => {
          this.alertService.showError(err?.error?.message, err.error?.details);
          return of([]);
        })
      )
      .subscribe(docs => {
        this.adminDocuments = docs;
        this.currentTab++;
        this.selectedWizard(1);
      });
  }
  /**
   * Method to confirm cancel
   */
  cancelModal() {
    this.cancelTransactionDetails();
    this.alertService.clearAlerts();
    this.hideModal();
  }
  /**
   * Method to cancel transaction
   */
  cancelTransactionDetails() {
    if (this.estAdminForm.get('referenceNo').value || this.isValidators) {
      this.establishmentService
        .revertTransaction(this.mainRegNo, this.estAdminForm.get('referenceNo').value)
        .pipe(
          tap(() => {
            this.setTransactionComplete();
            if (this.reRoute) {
              this.router.navigate([this.reRoute]);
            } else {
              if (this.isValidators) {
                if (this.appToken === ApplicationTypeEnum.PUBLIC) {
                  this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
                } else {
                  this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_REGISTER_SUPER_ADMIN]);
                }
              } else {
                this.location.back();
              }
            }
          })
        )
        .subscribe(noop, err => this.alertService.showError(err?.error?.message));
    } else {
      this.setTransactionComplete();
      this.reRoute ? this.router.navigate([this.reRoute]) : this.location.back();
    }
  }
  askForCancel() {
    this.showModal(this.cancelTemplate);
  }
}
