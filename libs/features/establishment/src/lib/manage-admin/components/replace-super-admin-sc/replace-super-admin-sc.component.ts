/**
 * ~ Copyright GOSI. All Rights Reserved.
  ~  This software is the proprietary information of GOSI.
  ~  Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  AlertService,
  AppConstants,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  BorderNumber,
  Channel,
  DocumentItem,
  DocumentService,
  Establishment,
  EstablishmentRouterData,
  EstablishmentToken,
  IdentityTypeEnum,
  Iqama,
  LookupService,
  NIN,
  NationalId,
  Passport,
  RoleIdEnum,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionFeedback,
  TransactionInterface,
  TransactionMixin,
  TransactionService,
  WorkflowService,
  getIdentityByType,
  markFormGroupTouched
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, noop, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  Admin,
  AdminRoleEnum,
  DocumentTransactionIdEnum,
  DocumentTransactionTypeEnum,
  EstablishmentAdminService,
  EstablishmentConstants,
  EstablishmentErrorKeyEnum,
  EstablishmentRoutesEnum,
  EstablishmentService,
  LegalEntityEnum,
  NavigationIndicatorEnum,
  Owner,
  activateWizard,
  filterIdentities,
  getChangeSuperAdminWizards,
  getDocumentContentIds,
  isEstablishmentTokenValid
} from '../../../shared';
import { ManageAdminScBaseComponent } from '../../../shared/base/manage-admin-sc.base-component';
import {
  getAdminRole,
  isLegalEntityPartnershipMci,
  isTransactionDraft,
  mapAdminRolesToId
} from '../../../shared/utils';
import { incorrectRoute } from '../admin-sc/admin-sc.component';

@Component({
  selector: 'est-replace-super-admin-sc',
  templateUrl: './replace-super-admin-sc.component.html',
  styleUrls: ['./replace-super-admin-sc.component.scss']
})
export class ReplaceSuperAdminScComponent
  extends TransactionMixin(ManageAdminScBaseComponent)
  implements TransactionInterface, OnInit
{
  /**
   * Local variables
   */
  selectedAdmin: Admin;
  documentKey = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_GCC_TYPE;
  documentType = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_GCC_TYPE;
  transactionId = DocumentTransactionIdEnum.REPLACE_SUPER_ADMIN;
  commentsMaxLength = AppConstants.MAXLENGTH_COMMENTS;
  adminDocuments: DocumentItem[];
  loggedInAdminRole: string;
  adminId: number;
  mainRegNo: number;
  adminRoleId: number;
  roleId: Array<BilingualText | number> = [];
  currentAdmin: Admin;
  newAdmin: Admin;
  admins: Admin[] = [];
  transactionFeedback: TransactionFeedback;
  isValidator = false;
  admin: Admin;
  routeToView: string;
  roles: BilingualText[] = [];
  isMainOwner = false;
  isIndividual = false;
  isDirectChange = false;
  isReplaceAdminDirectChange: boolean = false;
  documents$: Observable<DocumentItem[]>;
  currentOwners: any[] = [];
  isGOL:boolean=false;
  showSaveButton:boolean=true;
  payload;
  taskId:string;

  @ViewChild('cancelTemplate', { static: false }) cancelTemplate: TemplateRef<HTMLElement>;

  //input
  @Input() newPersonId: number;

  /**
   * Initialising the component
   */
  constructor(
    readonly lookUpService: LookupService,
    readonly bsModalService: BsModalService,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly adminService: EstablishmentAdminService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    @Inject(ApplicationTypeToken) readonly appToken: string, //TODO remove apptoken
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(ApplicationTypeToken) readonly appType: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly location: Location,
    readonly transactionService:TransactionService
  ) {
    super(bsModalService, lookUpService, alertService, establishmentService, appType, location, workflowService);
    this.estAdminForm = this.createEstAdminForm();
  }

  /**
   * Method to initialise component
   */
  ngOnInit() {
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.isGOL = true;
    }
    if (
      isTransactionDraft(this.estRouterData, DocumentTransactionIdEnum.REPLACE_SUPER_ADMIN) ||
      isTransactionDraft(this.estRouterData, DocumentTransactionIdEnum.REPLACE_GCC_ADMIN)
    ) {
      this.initialiseForEdit(this.estRouterData, true);
    } else if (
      isEstablishmentTokenValid(this.estRouterData, RouterConstants.TRANSACTION_REPLACE_SUPER_ADMIN) ||
      isEstablishmentTokenValid(this.estRouterData, RouterConstants.TRANSACTION_REPLACE_GCC_ADMIN)
    ) {
      this.initialiseForEdit(this.estRouterData);
    } else if (this.establishmentService.selectedAdmin) {
      this.selectedAdmin = this.establishmentService.selectedAdmin;
      this.initialiseParams(this.route.paramMap);
    } else {
      this.router.navigate(['/home']);
    }
    this.setRouterData();
    this.initialiseTabWizards(this.currentTab);
    this.intialiseLookUpValues();
  }

  /** method to initiate direct change for replace SA for MCI establishments **/

  private initialiseOwners(regNo: number): void {
    if (this.appToken === ApplicationTypeEnum.PUBLIC && this.isReplaceAdminDirectChange) {
      this.establishmentService.getMciOwners(regNo).subscribe(res => {
        this.currentOwners = res;
        this.currentOwners = this.splitOwners[0];
      });
    }
  }
  // Method to get router data for claim pool
  setRouterData(){
    if (this.routerDataToken.payload) {
      this.payload = JSON.parse(this.routerDataToken.payload);
      this.taskId = this.routerDataToken.taskId;
      this.isUnclaimed = this.payload?.isPool;
      this.showSaveButton=this.isValidator 
                         ? this.isUnclaimed ? false : true
                         : true ;
    }
  }
  assignClicked(){
    this.showSaveButton=true;
  }
  releaseClicked(){
    this.showSaveButton=false;
  }

  /**
   * method to initialise edit
   * @param estToken
   */
  initialiseForEdit(estToken: EstablishmentRouterData, isDraft: boolean = false) {
    if (estToken) {
      this.isValidator = !isDraft;
      this.mainRegNo = estToken.registrationNo;
      this.initialiseOwners(estToken.registrationNo);
      this.referenceNo = estToken?.referenceNo;
      this.estAdminForm.get('referenceNo').setValue(estToken?.referenceNo);
      this.estAdminForm.updateValueAndValidity();
      this.establishmentService
        .getAdminsOfEstablishment(estToken.registrationNo, estToken.referenceNo)
        .pipe(
          map(res => res.admins),
          tap(res => {
            this.admins = res;
            this.selectedAdmin = this.admins[0];
            this.loggedInAdminRole = this.admins[0].roles[0].english;
            this.roles = getAdminRole([this.loggedInAdminRole]);
            const roleId = mapAdminRolesToId(this.roles) ? mapAdminRolesToId(this.roles)[0] : undefined;
            this.adminRoleId = roleId;
            if (this.adminRoleId === RoleIdEnum.GCC_ADMIN) {
              this.heading = 'ESTABLISHMENT.REPLACE-GCC-ADMIN';
            } else if (this.adminRoleId === RoleIdEnum.SUPER_ADMIN) {
              this.heading = 'ESTABLISHMENT.REPLACE-BRANCH-MANAGER';
            }
            this.estAdmin = new Admin();
            this.estAdmin.person.fromJsonToObject(this.admins[1].person);
            this.estAdmin.roles = this.admins[1].roles;
            this.bindPersonFormModel(this.estAdmin);
            this.estAdminForm.get('personExists').setValue(true);
            this.estAdminForm.get('isVerified').setValue(true);
            this.initialiseParams(this.route.paramMap);
          })
        )
        .subscribe(noop, err => {
          return this.alertService.showError(err?.error?.message);
        });

      this.fetchComments(estToken);
      this.adminWizards = getChangeSuperAdminWizards().map(wizard => {
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

  /**
   * map adminid and registrationno from route
   * @param paramMap
   */
  initialiseParams(paramMap: Observable<ParamMap>) {
    let establishmentObservable: Observable<Establishment>;
    paramMap
      .pipe(
        switchMap(params => {
          if (params && params.get('registrationNo')) {
            establishmentObservable = this.getEstablishmentObservable(+params.get('registrationNo'));
            return establishmentObservable;
          } else {
            throwError(incorrectRoute);
          }
        }),
        switchMap(est => {
          this.initialiseOwners(est.registrationNo);
          if (this.mainRegNo !== est.registrationNo) {
            return this.getEstablishmentObservable(this.mainRegNo);
          }
          return establishmentObservable;
        }),
        tap(() => {
          this.adminId = getIdentityByType(
            this.selectedAdmin.person.identity,
            this.selectedAdmin.person.nationality?.english
          )?.id;
          if (this.establishmentService.loggedInAdminRole) {
            this.roles = getAdminRole([this.establishmentService.loggedInAdminRole]);
            const roleId = mapAdminRolesToId(this.roles) ? mapAdminRolesToId(this.roles)[0] : undefined;
            this.adminRoleId = roleId;
            if (this.adminRoleId === RoleIdEnum.GCC_ADMIN) {
              this.heading = 'ESTABLISHMENT.REPLACE-GCC-ADMIN';
            } else if (this.adminRoleId === RoleIdEnum.SUPER_ADMIN) {
              this.heading = 'ESTABLISHMENT.REPLACE-BRANCH-MANAGER';
            }
            this.loggedInAdminRole = this.establishmentService.loggedInAdminRole;
          }
          if (!this.loggedInAdminRole) {
            this.location.back();
          }
          this.routeToView = this.isValidator
            ? EstablishmentRoutesEnum.VALIDATOR_REPLACE_SUPER_ADMIN
            : EstablishmentConstants.GROUP_ADMINS_ADMIN_ID_ROUTE(this.mainRegNo, this.adminId);
        })
      )
      .subscribe(noop, err => this.alertService.showError(err?.error?.message));
  }

  /**
   * Method to initialise current tab
   * @param currentTab
   */
  initialiseTabWizards(currentTab: number) {
    this.adminWizards = getChangeSuperAdminWizards(currentTab);
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
   * Method to save the new admin
   */
  saveAdmin() {
    this.alertService.clearAlerts();
    markFormGroupTouched(this.estAdminForm);
    if (this.estAdminForm.get('isVerified').value === true) {
      const newAdmin = new Admin();
      newAdmin.person = this.estAdmin.person;
      this.estAdmin.roles = [];
      if (this.estAdminForm.get('contactDetail').valid && this.estAdminForm.get('person').valid) {
        newAdmin.person?.fromJsonToObject((this.estAdminForm.get('person') as FormGroup)?.getRawValue());
        newAdmin.person.contactDetail = (this.estAdminForm.get('contactDetail') as FormGroup).getRawValue();
        this.estAdmin = newAdmin;
        this.estAdmin.person.identity = filterIdentities(this.estAdmin.person.identity);
        this.estAdmin.roles = this.roles;
        this.adminService
          .saveAsNewAdmin(this.estAdmin)
          .pipe(
            tap(res => {
              this.estAdmin.person.personId = res;
              this.selectedAdmin.roles = this.roles;
            }),
            switchMap(() =>
              this.adminService.replaceAdminDetails(this.adminId, this.mainRegNo, {
                currentAdmin: this.selectedAdmin,
                newAdmin: this.estAdmin,
                navigationIndicator: this.getNavIndicator(false),
                comments: null,
                contentIds: null,
                referenceNo: this.estAdminForm.get('referenceNo').value
              })
            ),
            tap(res => {
              this.transactionFeedback = res;
              if (this.isDirectChange) {
                this.setTransactionComplete();
                this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
                this.alertService.showSuccess(this.transactionFeedback.successMessage);
                return of(res);
              } else if (res?.transactionId) {
                this.referenceNo = res?.transactionId;
                this.estAdminForm.get('referenceNo').setValue(res?.transactionId);
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
  /**
   * Method to get documents
   */
  getDocuments() {
    if (this.loggedInAdminRole === AdminRoleEnum.GCC_ADMIN) {
      this.transactionId = DocumentTransactionIdEnum.REPLACE_GCC_ADMIN;
      this.documentKey = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_GCC_TYPE;
      this.documentType = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_GCC_TYPE;
    } else {
      this.transactionId = DocumentTransactionIdEnum.REPLACE_SUPER_ADMIN;
      this.documentKey = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_KEY;
      if (this.estRouterData?.channel === Channel.GOSI_ONLINE ? true : this.appType === ApplicationTypeEnum.PUBLIC) {
        this.documentType = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_GCC_TYPE;
      } else {
        this.documentType = DocumentTransactionTypeEnum.REPLACE_SUPER_ADMIN_FO_TYPE;
      }
    }
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
        }),
        tap(docs => {
          this.adminDocuments = docs;
          this.currentTab++;
          this.selectedWizard(1);
        })
      )
      .subscribe();
  }

  /**
   * Method to get the document content
   * @param document
   * @param identifier
   * @param documentType
   */
  refreshDocumentContent(document: DocumentItem, identifier: number, documentType: string) {
    this.documentService
      .refreshDocument(document, identifier, this.documentKey, documentType, this.estRouterData.referenceNo)
      .subscribe(res => {
        document = res;
      });
  }

  /**
   * Method for final submit transaction
   */
  submitTransaction() {
    if (!this.documentService.checkMandatoryDocuments(this.adminDocuments)) {
      this.alertService.showMandatoryDocumentsError();
    } else {
      this.adminService
        .replaceAdminDetails(this.adminId, this.mainRegNo, {
          currentAdmin: this.selectedAdmin,
          newAdmin: this.estAdmin,
          navigationIndicator: this.getNavIndicator(true),
          comments: this.estAdminForm.get('comments').value,
          contentIds: getDocumentContentIds(this.adminDocuments),
          referenceNo: this.estAdminForm.get('referenceNo').value
        })
        .pipe(
          switchMap(res => {
            this.transactionFeedback = res;
            if (this.isValidator) {
              return this.updateBpmTransaction(this.estRouterData, this.estAdminForm.get('comments').value).pipe(
                catchError(err => {
                  this.alertService.showError(err?.error?.message);
                  return throwError(err);
                }),
                tap(() => {
                  this.setTransactionComplete();
                  this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
                  this.alertService.showSuccess(this.transactionFeedback.successMessage);
                })
              );
            } else {
              this.setTransactionComplete();
              this.location.back();
              this.alertService.showSuccess(this.transactionFeedback.successMessage);
              return of(res);
            }
          })
        )
        .subscribe(noop, err => this.alertService.showError(err?.error?.message));
    }
  }

  /**
   * Method to get navigation indicator
   */
  getNavIndicator(isFinalSubmit = false): number {
    if (this.isValidator) {
      if (this.appType === ApplicationTypeEnum.PUBLIC) {
        return isFinalSubmit
          ? NavigationIndicatorEnum.ESTADMIN_REPLACE_SUPER_ADMIN_FINAL_SUBMIT
          : NavigationIndicatorEnum.ESTADMIN_REPLACE_SUPER_ADMIN;
      }
      return isFinalSubmit
        ? NavigationIndicatorEnum.VALIDATOR_REPLACE_SUPER_ADMIN_FINAL_SUBMIT
        : NavigationIndicatorEnum.VALIDATOR_REPLACE_SUPER_ADMIN;
    } else if (this.appType === ApplicationTypeEnum.PUBLIC && this.isDirectChange) {
      return NavigationIndicatorEnum.ESTADMIN_REPLACE_ADMIN_DIRECT_CHANGE_SUBMIT;
    } else if (this.appType === ApplicationTypeEnum.PUBLIC) {
      return isFinalSubmit
        ? NavigationIndicatorEnum.ESTADMIN_REPLACE_SUPER_ADMIN_FINAL_SUBMIT
        : NavigationIndicatorEnum.ESTADMIN_REPLACE_SUPER_ADMIN;
    } else {
      return isFinalSubmit
        ? NavigationIndicatorEnum.CSR_REPLACE_SUPER_ADMIN_FINAL_SUBMIT
        : NavigationIndicatorEnum.CSR_REPLACE_SUPER_ADMIN;
    }
  }

  /**
   * Method to fetch comments
   */
  fetchComments(routerData: EstablishmentRouterData) {
    this.comments$ = this.getAllComments(routerData);
  }
  /**
   * Method to confirm cancel
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.cancelTransaction();
  }
  /**
   * Method to cancel transaction
   */
  cancelTransaction() {
    if (this.estAdminForm.get('referenceNo').value || this.isValidator) {
      this.establishmentService
        .revertTransaction(this.mainRegNo, this.estAdminForm.get('referenceNo').value)
        .pipe(
          tap(() => {
            this.setTransactionComplete();
            if (this.reRoute) {
              this.router.navigate([this.reRoute]);
            } else {
              if (this.isValidator) {
                if (this.appToken === ApplicationTypeEnum.PUBLIC) {
                  this.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(this.appToken)]);
                } else {
                  this.router.navigate([EstablishmentRoutesEnum.VALIDATOR_REPLACE_SUPER_ADMIN]);
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

  getEstablishmentObservable(regNo: number) {
    return this.establishmentService.getEstablishment(regNo).pipe(
      tap(res => {
        this.mainRegNo = res.mainEstablishmentRegNo;
        this.isIndividual = res.legalEntity.english === LegalEntityEnum.INDIVIDUAL;

        //check if establishmnet has crn, unn and LE= Ind or partnership
        this.isReplaceAdminDirectChange =
          isLegalEntityPartnershipMci(res.legalEntity.english) &&
          res?.crn?.number != null &&
          res.unifiedNationalNumber != null;
      })
    );
  }

  askForCancel() {
    this.showModal(this.cancelTemplate);
  }

  resetDetails(estAdminForm: FormGroup) {
    this.isMainOwner = false;
    this.isDirectChange = false;
    this.handleDocumentSection();
    this.resetEventDetails(estAdminForm);
  }

  verifyAdmin(mainRegNo: number, adminId: number) {
    this.verifyEstAdmin(mainRegNo, adminId);
    if (this.appType === ApplicationTypeEnum.PUBLIC) {
      const newAdmin = new Admin();
      newAdmin.person?.fromJsonToObject((this.estAdminForm.get('search') as FormGroup)?.getRawValue());
      if (!this.checkIfSameAdmin(newAdmin)) {
        this.checkIfMainOwner(mainRegNo, newAdmin);
        this.isDirectChange =
          (this.isDirectChange || this.existInMci(newAdmin.person.identity[0])) && this.isIndividual;
        this.adminWizards = getChangeSuperAdminWizards(this.currentTab, !this.isDirectChange);
      }
    }
  }

  checkIfSameAdmin(newAdmin: Admin) {
    const newAdminId = newAdmin.person.identity[0];
    switch (newAdmin.person.identity[0].idType) {
      case IdentityTypeEnum.IQAMA:
        return Number((newAdminId as Iqama).iqamaNo) === Number(this.adminId);
      case IdentityTypeEnum.NIN:
        return Number((newAdminId as NIN).newNin) === Number(this.adminId);
      case IdentityTypeEnum.NATIONALID:
        return Number((newAdminId as NationalId).id) === Number(this.adminId);
    }
  }

  checkIfMainOwner(mainRegNo: number, newAdmin: Admin) {
    this.establishmentService
      .getPersonDetailsOfOwners(mainRegNo)
      .pipe(
        tap(res => {
          let owners = res;
          owners = owners.filter(owner => {
            return this.compareIdNum(newAdmin.person.identity[0], owner.person.identity[0]);
          });
          if (owners.length === 1 && owners[0].endDate === null) {
            this.isMainOwner = true;
            this.isDirectChange = this.isMainOwner && this.isIndividual;
            this.handleDocumentSection();
          }
        })
      )
      .subscribe(noop, err => {
        return this.alertService.showError(err?.error?.message);
      });
  }

  compareIdNum(
    newAdminId: NIN | Iqama | NationalId | Passport | BorderNumber,
    mainAdminId: NIN | Iqama | NationalId | Passport | BorderNumber
  ): boolean {
    switch (mainAdminId.idType) {
      case IdentityTypeEnum.IQAMA:
        return Number((newAdminId as Iqama).iqamaNo) === Number((mainAdminId as Iqama).iqamaNo);
      case IdentityTypeEnum.NIN:
        return Number((newAdminId as NIN).newNin) === Number((mainAdminId as NIN).newNin);
      case IdentityTypeEnum.NATIONALID:
        return Number((newAdminId as NationalId).id) === Number((mainAdminId as NationalId).id);
      case IdentityTypeEnum.PASSPORT:
        return (newAdminId as Passport).passportNo === (mainAdminId as Passport).passportNo;
      case IdentityTypeEnum.BORDER:
        return (newAdminId as BorderNumber).id === (mainAdminId as BorderNumber).id;
    }
  }

  handleDocumentSection() {
    const docSection = this.adminWizards.find(wizard => wizard.key === EstablishmentConstants.SEC_DOCUMENT_DETAILS);
    if (docSection) {
      if (this.isDirectChange) {
        docSection.hide = true;
      } else {
        docSection.hide = false;
      }
    }
  }
  // Method to split owners into active and inactive owners respectively
  get splitOwners(): [Owner[], Owner[]] {
    const activeOwners: Owner[] = [];
    const inactiveOwners: Owner[] = [];
    if (this.currentOwners) {
      return this.currentOwners.reduce(
        (result, owner) => {
          result[
            owner.endDate?.gregorian !== null && owner.endDate?.gregorian !== undefined // for inactive owners end date is not null
              ? 1
              : 0
          ].push(owner);
          return result;
        },
        [activeOwners, inactiveOwners]
      );
    } else {
      return [activeOwners, inactiveOwners];
    }
  }

  existInMci(identity: NIN | Iqama | NationalId | Passport | BorderNumber) {
    let exists = false;
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      exists = this.currentOwners.some(mciId => {
        switch (identity.idType) {
          case IdentityTypeEnum.IQAMA:
            if (Number((mciId as Iqama).iqamaNo) === Number((identity as Iqama).iqamaNo)) {
              return true;
            }
            break;
          case IdentityTypeEnum.NIN:
            if (Number((mciId as NIN).newNin) === Number((identity as NIN).newNin)) {
              return true;
            }
            break;
          case IdentityTypeEnum.NATIONALID:
            if (Number((mciId as NationalId).id) === Number((identity as NationalId).id)) {
              return true;
            }
            break;
          default:
            return false;
        }
      });
    }

    return exists;
  }
}
