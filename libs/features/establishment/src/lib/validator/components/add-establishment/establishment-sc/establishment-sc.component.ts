/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  Autobind,
  BilingualText,
  DocumentItem,
  DocumentService,
  Establishment,
  EstablishmentRouterData,
  EstablishmentToken,
  LanguageToken,
  LookupService,
  LovList,
  markFormGroupTouched,
  Person,
  Role,
  RouterConstants,
  TransactionReferenceData,
  WorkflowService
} from '@gosi-ui/core';
import { EstablishmentScBaseComponent } from '@gosi-ui/features/establishment/lib/shared/base/establishment-sc.base-component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, iif, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  ActionTypeEnum,
  AddEstablishmentService,
  Admin,
  ErrorCodeEnum,
  EstablishmentOwnerDetails,
  EstablishmentOwnersWrapper,
  EstablishmentQueryKeysEnum,
  EstablishmentRoutesEnum,
  EstablishmentService,
  EstablishmentTypeEnum,
  getParams,
  isEstRegPending,
  isGovOrSemiGov,
  Owner,
  QueryParam
} from '../../../../shared';
import { checkForFieldChanges, setEstablishmentDetails } from './establishment-sc-helper';

/**
 * This is the wrapper component to display the all the establishment details
 *
 * @export
 * @class EstablishmentScComponent
 * @extends {EstablishmentScBaseComponent}
 */
@Component({
  selector: 'est-establishment-sc',
  templateUrl: './establishment-sc.component.html',
  styleUrls: ['./establishment-sc.component.scss']
})
export class EstablishmentScComponent extends EstablishmentScBaseComponent implements OnInit {
  //Local Variables

  //Local Variables
  documentList: DocumentItem[] = [];
  establishment: Establishment = new Establishment();
  establishmentAdminDetails: Admin = new Admin();
  establishmentOwnerDetails: EstablishmentOwnerDetails = new EstablishmentOwnerDetails();
  person: Person = new Person();
  registrationNo: number;
  validatorForm: FormGroup;
  hasAdmin = false;
  hasOwner = false;
  lang: string;
  isGCC = false;
  validator2 = false;
  show = 2;
  isOrgGcc = false;
  isReturnToAdmin = false;
  heading = 'ESTABLISHMENT.VERIFY-ESTABLISHMENT';
  hasLateFeeIndicator = false;
  establishmentOwners: EstablishmentOwnersWrapper;

  //Fields to be highlighted
  highlightLicense = false;
  highlightLicenseNo = false;
  highlightLicenseAuth = false;
  highlightLicenseIssDate = false;
  highlightLiceseExpDate = false;
  highlightLegalEntity = false;
  highlightActivityType = false;
  highlightEstEngName = false;
  highlightMailingAddressChange = false;
  highlightNationalAddress = false;
  highlightPoAddress = false;
  highlightEmail: boolean;
  highlightMobileNo: boolean;
  highlightTelephone: boolean;
  highlightExtension: boolean;
  highlightIban = false;
  highlightMof = false;
  highlightPaymentStartDate: boolean;
  highlightLateFee = false;
  ownersToHighlight = []; //Owner to be highlighted
  hasOwnerDeleted = false;
  highlightUnifiedNaionalNumber: boolean;
  highlightCrNumber: boolean;

  //LookUp Value
  establishmentRejectReasonList: Observable<LovList> = null;
  establishmentReturnReasonList: Observable<LovList> = null;
  isTransactionReturned: boolean;
  showMofPayment: boolean;
  showPaymentSection = true;
  isEstablishmentFromMci: boolean;
  isBranch: boolean;
  comments$: Observable<TransactionReferenceData[]>;
  highlightStartDate: boolean;
  isEstProactive: boolean;
  isPpa: boolean;

  /**
   * Creates an instance of EstablishmentScComponent
   * @memberof  EstablishmentScComponent
   *
   */
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly validatorService: AddEstablishmentService,
    readonly workflowService: WorkflowService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    public modalService: BsModalService,
    public alertService: AlertService,
    @Inject(EstablishmentToken) readonly estRouterData: EstablishmentRouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    private fb: FormBuilder,
    readonly router: Router
  ) {
    super(modalService, workflowService);
    this.language.subscribe(res => (this.lang = res));
  }

  /**
   * This method handles the initialization tasks.
   * @memberof  ValidatorScComponent
   */
  ngOnInit() {
    this.initialiseLookups();
    this.initialiseForm();
    if (this.estRouterData.registrationNo) {
      this.intialiseView(this.estRouterData.registrationNo);
    } else {
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    }
  }

  /**
   * Method to intialise the form
   */
  initialiseForm() {
    this.validatorForm = this.fb.group({
      taskId: [null, { updateOn: 'blur' }],
      registrationNo: [null, { updateOn: 'blur' }],
      user: [null, { updateOn: 'blur' }]
    });

    this.validatorForm.patchValue({
      registrationNo: this.estRouterData.registrationNo,
      taskId: this.estRouterData.taskId,
      user: this.estRouterData.user
    });
  }

  /**
   * Method to initialise lookups
   */
  initialiseLookups() {
    this.establishmentRejectReasonList = this.lookupService.getEstablishmentRejectReasonList();
    this.establishmentReturnReasonList = this.lookupService.getRegistrationReturnReasonList();
  }

  /**
   * Method to fetch details intialise view
   */
  intialiseView(registrationNo: number) {
    if (this.estRouterData.assignedRole === Role.VALIDATOR_2) {
      this.validator2 = true;
    }
    this.establishmentService
      .getEstablishment(registrationNo)
      .pipe(
        switchMap(res => {
          this.isPpa = res.ppaEstablishment;
          if (isEstRegPending(res)) {
            this.isEstProactive = true;
            this.heading = 'ESTABLISHMENT.COMPLETE-ESTABLISHMENT-DETAILS';
            return this.getEstWithRefNo(this.estRouterData.registrationNo, this.estRouterData.referenceNo).pipe(
              tap(estInTransient => {
                checkForFieldChanges(this, res, estInTransient);
              })
            );
          } else {
            return of(res);
          }
        })
      )
      .subscribe(
        res => {
          this.alertService.clearAlerts();
          setEstablishmentDetails(this, res);
        },
        err => {
          if (err.error) {
            this.showErrorMessage(err);
          }
        }
      );
  }

  /**
   * Method to get the establishment detail from transient table with referenceNo
   * @param referenceNo
   */
  getEstWithRefNo(regNo: number, referenceNo: number): Observable<Establishment> {
    return this.establishmentService.getEstablishmentFromTransient(regNo, referenceNo);
  }

  /**
   * Show contributor payment only for Govt or SemiGovt Establishments
   */
  showPayment() {
    /**
     * if it is GCC we should dhow Payment Deatils section
     */
    /**  this.establishment.gccCountry === true
     * ? !this.establishment.establishmentAccount?.bankAccount?.ibanAccountNo: false
     */
    if (this.establishment.gccCountry === true) {
      this.showPaymentSection = true;
    }
    if (isGovOrSemiGov(this.establishment?.legalEntity?.english)) {
      this.showMofPayment = true;
      this.hasLateFeeIndicator = true;
    }
  }

  getComments() {
    this.comments$ = this.getAllComments(this.estRouterData).pipe(catchError(() => of([])));
  }

  /**
   * This method is to edit the the current tab details by navgiating to CSR view
   * @param tabIndex
   */
  navigateToCsrView(tabIndex: number) {
    if (tabIndex === 3) {
      if (
        this.establishment.establishmentType.english === EstablishmentTypeEnum.BRANCH &&
        !this.establishment.adminRegistered
      ) {
        tabIndex = 2;
      }
    }
    if (this.validator2 === false) {
      this.estRouterData.tabIndicator = tabIndex;
      this.router.navigate([EstablishmentRoutesEnum.VALIDATE_REGISTER_ESTABLISHMENT]);
    }
  }

  /**
   * This method is used to fetch the admin details of the establishment
   */
  fetchAdminDetails() {
    this.isGCC = this.establishment.gccEstablishment ? true : false;
    if (this.establishment.registrationNo) {
      if (this.establishment.establishmentType.english === EstablishmentTypeEnum.BRANCH) {
        this.registrationNo = this.establishment.mainEstablishmentRegNo;
      } else {
        this.registrationNo = this.establishment.registrationNo;
      }
      this.establishmentService.getSuperAdminDetails(this.registrationNo).subscribe(
        res => {
          this.establishmentAdminDetails.person.identity = [];
          this.hasAdmin = true;
          this.establishmentAdminDetails.person = this.validatorService.setAdminDetails(
            this.establishmentAdminDetails.person,
            res.person
          );
        },
        err => {
          if (err.error) {
            if (err.error.code === ErrorCodeEnum.ADMIN_NO_RECORD) {
              this.hasAdmin = false;
            } else {
              this.hasAdmin = true;
              this.showErrorMessage(err);
            }
          }
        }
      );
    }
  }

  /**
   * This method is used to fetch the owner details of the establishment
   */
  fetchOwnerDetails() {
    if (this.establishment.registrationNo) {
      const getOwners$ = this.establishmentService.getOwnerDetails(this.establishment?.registrationNo);
      getOwners$
        .pipe(
          map(res =>
            res?.owners?.length > 0
              ? {
                  molOwnerPersonId: res?.molOwnerPersonId,
                  owners: res?.owners?.filter(owner => !owner.endDate?.gregorian)
                }
              : { molOwnerPersonId: res?.molOwnerPersonId, owners: [] }
          ),
          switchMap(res =>
            iif(
              () => isEstRegPending(this.establishment),
              this.getOwnerWithReferenceNo(this.estRouterData.referenceNo).pipe(
                map(tranOwners => {
                  if (tranOwners) {
                    const owners = [...res.owners];
                    const deletedOwners = [...tranOwners.filter(owner => owner.recordAction === ActionTypeEnum.REMOVE)];
                    if (deletedOwners?.length > 0) {
                      this.hasOwnerDeleted = true;
                    }
                    res.owners = [
                      ...owners.filter(
                        owner =>
                          deletedOwners
                            .map(deleteOwner => deleteOwner.person.personId)
                            .indexOf(owner.person.personId) === -1
                      ),
                      ...tranOwners.filter(owner => owner.recordAction !== ActionTypeEnum.REMOVE)
                    ];
                  }
                  return res;
                })
              ),
              of(res)
            )
          )
        )
        .subscribe(
          res => {
            this.establishmentOwnerDetails = new EstablishmentOwnerDetails();
            this.hasOwner = true;
            res.owners.forEach(owner => {
              this.establishmentOwnerDetails.persons.push(owner.person);
            });
            if (this.isEstProactive) {
              this.ownersToHighlight = this.establishmentOwnerDetails?.persons
                ?.map(owner => owner.personId)
                .filter(id => res.molOwnerPersonId.indexOf(id) === -1);
            }
          },
          err => {
            if (err.error) {
              if (err.error.code === ErrorCodeEnum.OWNER_NO_RECORD) {
                this.hasOwner = false;
              } else {
                this.hasOwner = true;
                this.showErrorMessage(err);
              }
            }
          }
        );
    }
  }
  fetchEstOwnerDetails() {
    const queryParams: QueryParam[] = [];
    queryParams.push({ queryKey: EstablishmentQueryKeysEnum.ESTABLISHMENT_OWNERS, queryValue: true });
    this.establishmentService.getOwnerDetails(this.establishment?.registrationNo, queryParams).subscribe(
      res => {
        this.hasOwner = true;
        this.establishmentOwners = res;
        this.establishmentOwnerDetails = new EstablishmentOwnerDetails();
        res?.owners.forEach(owner => {
          this.establishmentOwnerDetails?.persons.push(owner?.person);
        });
      },
      err => {
        if (err?.error) {
          if (err?.error?.code === ErrorCodeEnum.OWNER_NO_RECORD) {
            this.hasOwner = false;
          } else {
            this.showErrorMessage(err);
            this.hasOwner = true;
          }
        }
      }
    );
  }

  getOwnerWithReferenceNo(refNo: number): Observable<Owner[]> {
    return this.establishmentService.searchOwnerWithQueryParams(
      this.establishment.registrationNo,
      getParams(undefined, { referenceNo: refNo }, new HttpParams())
    );
  }

  confirmCancel() {
    this.hideModal();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  /**
   * This method is to appove the establishment for registration
   * @memberof ValidatorScComponent
   */
  approveEstablishment(template: TemplateRef<HTMLElement>) {
    this.validatorForm.updateValueAndValidity();
    this.showModal(template);
  }

  confirmApprove() {
    markFormGroupTouched(this.validatorForm);
    if (this.validatorForm.valid) {
      this.approveBpmTransaction(this.estRouterData, this.validatorForm).pipe(this.bpmCallBack).subscribe();
    }
  }

  /**
   * This method is to reject the establishment registration
   * @memberof ValidatorScComponent
   */
  rejectEstablishment(template: TemplateRef<HTMLElement>) {
    this.validatorForm.updateValueAndValidity();
    this.showModal(template);
  }

  // * This method is to return the establishment registration

  returnEstablishment(template: TemplateRef<HTMLElement>) {
    this.validatorForm.updateValueAndValidity();
    this.showModal(template);
  }

  //* This method is to reset the form
  confirmRejection(): void {
    markFormGroupTouched(this.validatorForm);
    if (this.validatorForm.valid) {
      this.rejectBpmTransaction(this.estRouterData, this.validatorForm).pipe(this.bpmCallBack).subscribe();
    }
  }

  //* This method is to reset the form

  confirmReturn(): void {
    markFormGroupTouched(this.validatorForm);
    if (this.validatorForm.valid) {
      this.returnBpmTransaction(this.estRouterData, this.validatorForm).pipe(this.bpmCallBack).subscribe();
    }
  }

  @Autobind
  bpmCallBack(bpmResponse: Observable<BilingualText>): Observable<BilingualText> {
    return bpmResponse.pipe(
      tap(res => {
        this.alertService.showSuccess(res);
        this.router.navigate([RouterConstants.ROUTE_INBOX]);
      }),
      catchError(err => {
        if (err.error) {
          this.showErrorMessage(err);
          return of(null);
        } else {
          this.alertService.showError(err);
          return of(null);
        }
      }),
      tap(() => {
        this.hideModal();
      })
    );
  }

  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    this.alertService.showError(err.error.message, err.error.details);
  }
}
