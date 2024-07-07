/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, Inject } from '@angular/core';
import {
  SearchPersonComponent,
  showModal,
  ManageBenefitService,
  BenefitConstants,
  HeirBenefitService,
  buildQueryParamForSearchPerson,
  showErrorMessage,
  BenefitValues,
  HeirVerifyRequest,
  SearchPerson,
  HeirAccountProfile,
  getIdRemoveNullValue
} from '../../../shared';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { Observable } from 'rxjs/internal/Observable';
import { LovList } from '@gosi-ui/core/lib/models/lov-list';
import { startOfDay, hijiriToJSON } from '@gosi-ui/core/lib/utils';
import {
  GosiCalendar,
  DocumentItem,
  LookupService,
  LanguageToken,
  AlertService,
  UuidGeneratorService,
  CommonIdentity,
  DocumentService,
  ApplicationTypeToken,
  ApplicationTypeEnum
} from '@gosi-ui/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Location } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'bnt-heir-register-sc',
  templateUrl: './heir-register-sc.component.html',
  styleUrls: ['./heir-register-sc.component.scss']
})
export class HeirRegisterScComponent extends SearchPersonComponent implements OnInit, OnDestroy {
  annuityRelationShip$: Observable<LovList>;
  commonModalRef: BsModalRef;
  systemRunDate: GosiCalendar;
  isAppPrivate: boolean;
  isMissing: boolean;
  documentList: DocumentItem[];
  isHeirVerified = false;

  @ViewChild('confirmTemplate', { static: false })
  private confirmTemplate: TemplateRef<HTMLElement>;
  heirForm: FormGroup;
  lang: string;
  transactionId: string;
  uuid: string;
  idValue = 'heir-registration';
  benefitReasonList$: Observable<LovList>;
  maxDate: Date;
  idObjContributor: CommonIdentity | null;
  heirAccountDetails: HeirAccountProfile;
  constructor(
    readonly fb: FormBuilder,
    readonly manageBenefitService: ManageBenefitService,
    readonly lookUpService: LookupService,
    readonly router: Router,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly location: Location,
    readonly uuidGeneratorService: UuidGeneratorService,
    readonly heirBenefitService: HeirBenefitService,
    public route: ActivatedRoute,
    readonly documentService: DocumentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    super(fb, manageBenefitService, lookUpService, router);
  }

  ngOnInit(): void {
    this.initializeRegister();
  }

  initializeRegister() {
    this.route.queryParams.subscribe(params => {
      this.heirId = params.heirId;
    });
    this.heirForm = this.createHeirForm();
    this.maxDate = moment(new Date()).toDate();
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.initializeForms();
    this.transactionId = BenefitConstants.REQUEST_HEIR_ACCOUNT;
    this.uuid = this.uuidGeneratorService.getUuid();
    this.nationalityList$ = this.lookUpService.getNationalityList();
    this.manageBenefitService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
    });
    this.initRelationShipLookup();
    this.benefitReasonList$ = this.heirBenefitService.getBenefitReasonList();
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  createHeirForm(): FormGroup {
    return this.fb.group({
      registration: this.fb.group({
        missingDate: this.fb.group({
          gregorian: [null],
          hijiri: [null]
        }),
        deathDate: this.fb.group({
          gregorian: [null, { updateOn: 'blur' }],
          hijiri: [null, { updateOn: 'blur' }]
        }),
        relationship: this.fb.group({
          english: [null, { validators: Validators.required, updateOn: 'blur' }],
          arabic: [null]
        }),
        reason: this.fb.group({
          english: [null, { updateOn: 'blur' }],
          arabic: [null]
        })
      })
    });
  }

  reset() {
    if (this.heirForm.get('registration')) {
      this.heirForm.get('registration').get('missingDate').get('gregorian').clearValidators();
      this.heirForm.get('registration').get('missingDate').get('gregorian').setErrors(null);
      this.heirForm.get('registration').get('reason').patchValue({ english: '', arabic: '' });
      this.heirForm.get('registration').get('deathDate').get('gregorian').reset();
      this.heirForm.get('registration').updateValueAndValidity();
    }
    this.isMissing = null;
  }

  verifyHeirDetails() {
    if (this.heirForm.valid && this.searchForm.valid) {
      if (this.heirId) {
        this.verifyContributorDetails();
      } else {
        this.searchAndVerifyHeir();
      }
    } else {
      this.heirForm.markAllAsTouched();
      this.searchForm.markAllAsTouched();
    }
  }

  verifyContributorDetails() {
    const contributerValues = this.searchForm.getRawValue();
    this.heirBenefitService.getHeirLinkedContributors(this.heirId).subscribe(
      personalDetails => {
        this.alertService.clearAlerts();
        this.heirAccountDetails = personalDetails;
        const queryParamsContributor = buildQueryParamForSearchPerson(contributerValues);
        this.manageBenefitService.getPersonDetailsApi(queryParamsContributor.toString()).subscribe(
          contributorDetails => {
            if (contributorDetails.listOfPersons[0].personId) {
              if (contributorDetails.listOfPersons[0].deathDate) {
                this.isMissing = false;
                this.heirForm
                  .get('registration')
                  .get('reason')
                  .get('english')
                  .patchValue(BenefitValues.deathOfTheContributor);
                this.heirForm
                  .get('registration')
                  .get('deathDate')
                  .get('gregorian')
                  .patchValue(new Date(contributorDetails.listOfPersons[0].deathDate.gregorian));
              } else {
                this.isMissing = true;
                this.heirForm
                  .get('registration')
                  .get('reason')
                  .get('english')
                  .patchValue(BenefitValues.missingContributor);
                this.heirForm
                  .get('registration')
                  .get('missingDate')
                  .get('gregorian')
                  .setValidators([Validators.required]);
                this.heirForm.get('registration').get('missingDate').setErrors(null);
                this.heirForm.get('registration').updateValueAndValidity();
              }
              this.verifyHeir(contributerValues, null);
            }
          },
          error => {
            showErrorMessage(error, this.alertService);
          }
        );
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  initRelationShipLookup() {
    this.annuityRelationShip$ = this.lookUpService.getAnnuitiesRelationshipList();
  }

  decline() {
    this.commonModalRef.hide();
  }

  routeBack() {
    this.location.back();
  }

  cancelTransaction() {
    this.alertService.clearAlerts();
    this.commonModalRef = showModal(this.modalService, this.confirmTemplate);
  }

  searchAndVerifyHeir() {
    const heirSearchValues = this.heirForm.getRawValue();
    const contributerValues = this.searchForm.getRawValue();
    if (heirSearchValues.search) {
      const queryParams = buildQueryParamForSearchPerson(heirSearchValues.search);
      this.manageBenefitService.getPersonDetailsApi(queryParams.toString()).subscribe(
        personalDetails => {
          this.alertService.clearAlerts();
          if (personalDetails?.listOfPersons[0].sex?.english) {
            this.annuityRelationShip$ = this.lookUpService.getAnnuitiesRelationshipByGender(
              personalDetails.listOfPersons[0].sex?.english.toUpperCase()
            );
          }
          const queryParamsContributor = buildQueryParamForSearchPerson(contributerValues);
          this.manageBenefitService.getPersonDetailsApi(queryParamsContributor.toString()).subscribe(
            contributorDetails => {
              if (contributorDetails.listOfPersons[0].personId) {
                if (contributorDetails.listOfPersons[0].deathDate) {
                  this.isMissing = false;
                  this.heirForm
                    .get('registration')
                    .get('reason')
                    .get('english')
                    .patchValue(BenefitValues.deathOfTheContributor);
                  this.heirForm
                    .get('registration')
                    .get('deathDate')
                    .get('gregorian')
                    .patchValue(new Date(contributorDetails.listOfPersons[0].deathDate.gregorian));
                } else {
                  this.isMissing = true;
                  this.heirForm
                    .get('registration')
                    .get('reason')
                    .get('english')
                    .patchValue(BenefitValues.missingContributor);
                  this.heirForm
                    .get('registration')
                    .get('missingDate')
                    .get('gregorian')
                    .setValidators([Validators.required]);
                  this.heirForm.get('registration').get('missingDate').setErrors(null);
                  this.heirForm.get('registration').updateValueAndValidity();
                }
                this.verifyHeir(contributerValues, heirSearchValues.search);
              }
            },
            error => {
              showErrorMessage(error, this.alertService);
            }
          );
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
    }
  }

  verifyHeir(contributerValues: SearchPerson, heirValues: SearchPerson) {
    if (heirValues) {
      const idObjHeir: CommonIdentity | null = heirValues?.identity.length
        ? getIdRemoveNullValue(heirValues?.identity)
        : null;
      const verifyHeirParams = this.getVerifyParams(contributerValues, heirValues);
      this.heirBenefitService.verifyHeir(idObjHeir.id, verifyHeirParams).subscribe(
        (documents: DocumentItem[]) => {
          this.documentList = documents;
          this.documentList.forEach(doc => {
            doc.canDelete = true;
          });
        },
        err => {
          showErrorMessage(err, this.alertService);
          this.reset();
        }
      );
    } else if (this.heirId) {
      const verifyHeirParams = this.getVerifyParams(contributerValues, null);
      this.heirBenefitService.verifyHeir(this.heirId, verifyHeirParams).subscribe(
        (documents: DocumentItem[]) => {
          this.documentList = documents;
          this.documentList.forEach(doc => {
            doc.canDelete = true;
          });
        },
        err => {
          showErrorMessage(err, this.alertService);
          this.reset();
        }
      );
    }
  }
  getVerifyParams(contributerValues: SearchPerson, heirValues: SearchPerson): HeirVerifyRequest {
    const verifyHeirParams = new HeirVerifyRequest();
    this.idObjContributor = contributerValues.identity.length ? getIdRemoveNullValue(contributerValues.identity) : null;

    verifyHeirParams.contributorIdentifier = Number(this.idObjContributor.id);
    verifyHeirParams.relationship = this.heirForm.get('registration').get('relationship').value;
    if (heirValues) {
      verifyHeirParams.heirNationality = heirValues.nationality ? heirValues.nationality : null;
    } else if (
      this.heirAccountDetails &&
      this.heirAccountDetails.heirPersonalDetails &&
      this.heirAccountDetails.heirPersonalDetails.nationality
    ) {
      verifyHeirParams.heirNationality = this.heirAccountDetails.heirPersonalDetails.nationality;
    }
    verifyHeirParams.contributorNationality = contributerValues.nationality ? contributerValues.nationality : null;
    if (this.heirForm.get('search') && this.heirForm.get('search').get('dob')) {
      verifyHeirParams.dateOfBirth.gregorian = this.heirForm.get('search').get('dob').get('gregorian')
        ? this.heirForm.get('search').get('dob').get('gregorian').value
        : null;
      verifyHeirParams.dateOfBirth.hijiri = this.heirForm.get('search').get('dob').get('hijiri')
        ? hijiriToJSON(this.heirForm.get('search').get('dob').get('hijiri').value)
        : null;
    } else if (
      this.heirAccountDetails &&
      this.heirAccountDetails.heirPersonalDetails &&
      this.heirAccountDetails.heirPersonalDetails.dateOfBirth
    ) {
      verifyHeirParams.dateOfBirth.gregorian = this.heirAccountDetails.heirPersonalDetails.dateOfBirth.gregorian;
      verifyHeirParams.dateOfBirth.hijiri = this.heirAccountDetails.heirPersonalDetails.dateOfBirth.hijiri;
    }
    verifyHeirParams.uuid = this.uuid;
    verifyHeirParams.benefitRequestReason = this.heirForm.get('registration').get('reason').value;
    if (this.heirForm.get('registration').get('reason').value.english === BenefitValues.missingContributor) {
      verifyHeirParams.eventDate = this.heirForm.get('registration').get('missingDate').value;
      verifyHeirParams.eventDate.gregorian = startOfDay(
        this.heirForm.get('registration').get('missingDate').get('gregorian').value
      );
    } else {
      verifyHeirParams.eventDate = this.heirForm.get('registration').get('deathDate').value;
      verifyHeirParams.eventDate.gregorian = this.heirForm.get('registration').get('deathDate').get('gregorian').value;
    }
    return verifyHeirParams;
  }

  registerHeir() {
    if (this.heirForm.valid) {
      this.alertService.clearAllErrorAlerts();
      const heirSearchValues = this.heirForm.getRawValue();
      const contributerValues = this.searchForm.getRawValue();
      const idObjHeir: CommonIdentity | null = heirSearchValues.search.identity.length
        ? getIdRemoveNullValue(heirSearchValues.search.identity)
        : null;
      const verifyHeirParams = this.getVerifyParams(contributerValues, heirSearchValues.search);
      this.heirBenefitService.registerHeir(idObjHeir.id, verifyHeirParams).subscribe(
        res => {
          //display the success message
          this.reset();
          this.alertService.showSuccess(res);
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
    } else {
      this.heirForm.markAllAsTouched();
    }
  }

  /**
   * Method to perform feedback call after scanning.
   * @param document
   */
  refreshDocument(document: DocumentItem) {
    if (document && document.name) {
      this.documentService
        .refreshDocument(document, this.idObjContributor.id, undefined, undefined, undefined, undefined, this.uuid)
        .subscribe(res => {
          if (res) {
            document = res;
          }
        });
    }
  }
  getGenderDetails(data) {
    if (data.target) {
      this.heirIdentifier = data.target.value;
    }
    if (this.heirDOB && this.heirIdentifier) {
      this.populateRelationShipByGender();
    }
  }

  getDobHeir(data) {
    if (data.target) {
      this.heirDOB = data.target.value;
    } else {
      this.heirDOB = data;
    }
    if (this.heirDOB && this.heirIdentifier) {
      this.populateRelationShipByGender();
    }
  }

  populateRelationShipByGender() {
    const heirSearchValues = this.heirForm.getRawValue();
    const queryParams = buildQueryParamForSearchPerson(heirSearchValues.search);
    this.manageBenefitService.getPersonDetailsApi(queryParams.toString()).subscribe(personalDetails => {
      this.alertService.clearAlerts();
      if (personalDetails.listOfPersons[0]?.sex?.english) {
        this.annuityRelationShip$ = this.lookUpService.getAnnuitiesRelationshipByGender(
          personalDetails.listOfPersons[0].sex?.english.toUpperCase()
        );
      }
    });
  }

  /** Method to handle c;aring alerts before component destroyal . */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
    this.alertService.clearAllSuccessAlerts();
  }
}
