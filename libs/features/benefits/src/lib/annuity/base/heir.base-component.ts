import { Directive, OnInit, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { LovList } from '@gosi-ui/core/lib/models/lov-list';
import { BenefitValues } from '../../shared/enum/benefit-values';
import {
  PersonalInformation,
  DependentDetails,
  PersonBankDetails,
  ValidateHeir,
  SearchPerson,
  BankAccountList,
  HeirDetailsRequest,
  ValidateRequest,
  UnbornEdit,
  CalendarTypeHijiriGregorian,
  DependentModify,
  HeirEvent
} from '../../shared/models';
import { SystemParameter } from '@gosi-ui/features/contributor/lib/shared/models/system-parameter';
import { DependentHeirConstants, PersonConstants } from '../../shared/constants';
import { BsModalRef } from 'ngx-bootstrap/modal/ngx-bootstrap-modal';
import { IdentityTypeEnum } from '@gosi-ui/core/lib/enums/identity-type';
import { IdentifierLengthEnum } from '@gosi-ui/core/lib/enums/identifier-length';
import moment from 'moment';
import {
  BilingualText,
  scrollToTop,
  startOfDay,
  Name,
  ArabicName,
  LookupCategory,
  LookupDomainName,
  ApplicationTypeEnum
} from '@gosi-ui/core';
import {
  showErrorMessage,
  populateHeirDropDownValues,
  getIdRemoveNullValue,
  getHeirBenefitType,
  calendarWithStartOfDay,
  getServiceType,
  isHeirLumpsum,
  deepCopy,
  getRequestDateFromForm
} from '../../shared/utils/benefitUtil';

import {
  getNewBornRelationships,
  getEligibilityStatusForHeirPensionLumpsumFromValidateApi
} from '../../shared/utils/heirOrDependentUtils';
import {
  getDuplicateEvents,
  getEventTypesForQuestion,
  getLatestEventByStatusDate,
  getOldestEventFromResponse
} from '../../shared/utils/eventsUtils';
import { buildQueryParamForSearchPerson } from '../../shared/utils/person';
import { GosiCalendar, CommonIdentity, Lov } from '@gosi-ui/core';
import { getObjForValidate, getObjForValidateUnborn } from '../../shared/utils/validateDependentUtils';
import { BehaviorSubject, throwError } from 'rxjs';
import { ActionType, DependentEventSource, EventAddedFrom } from '../../shared/enum';
import { RequestEventType, AddEvent } from '../../shared/models/questions';
import { catchError, map, tap } from 'rxjs/operators';
import { BenefitBaseScComponent } from '../../shared/component/base/benefit-base-sc.component';

@Directive()
export abstract class HeirBaseComponent extends BenefitBaseScComponent implements OnInit {
  // local variables
  // isUnborn = false;
  nationalityList$: Observable<LovList> = new Observable<LovList>(null);
  showSearch = true;
  page: string; //To know modify or add page;
  //Identity types
  ninType = IdentityTypeEnum.NIN;
  iqamaType = IdentityTypeEnum.IQAMA;
  gccType = IdentityTypeEnum.NATIONALID;
  passportType = IdentityTypeEnum.PASSPORT;
  passportLength = IdentifierLengthEnum.PASSPORT;
  requestHeirForm: FormGroup;
  deductionPlanList$: Observable<LovList>;

  queryParams: string;
  searchResult: PersonalInformation;
  annuityRelationShip$: Observable<LovList>;
  heirStatus$: Observable<LovList>;
  // heirList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(null);
  commonModalRef: BsModalRef;
  isSmallScreen: boolean;
  //TODO: remove
  heirStatusArr = ['disabled', 'student', 'pregnant', 'active', 'divorced', 'orphan'];
  guardians = ['Mother', 'Father', 'Grand Father', 'Brother'];
  listOfGuardians: DependentDetails[] = [];
  // addDependent = false;
  cityList$: Observable<LovList>;
  countryList$: Observable<LovList>;
  maritalStatus$: Observable<LovList>;
  isNewHeirStatus = false;
  // highlightInvalid = false;
  totalWage: number;
  relationShipselected: BilingualText;
  isSaveNextDisabled = true;
  modalRef: BsModalRef;
  addedEvent: AddEvent;
  genderList$: Observable<LovList>;
  searchPersonData: SearchPerson;
  calcHijiriAgeInMonths: number;
  copyOfHeirDetailsArray: DependentDetails[];
  authorizationId: number;

  /**
   * Input variables
   */
  @Input() sin: number;
  @Input() lang = 'en';
  @Input() isValidator: boolean;
  @Input() isPension = false;
  @Input() heirDetails: DependentDetails[] = [];
  @Input() benefitRequestId: number;
  @Input() referenceNo: number;
  @Input() parentForm: FormGroup;
  @Input() heirStatus: string[];
  @Input() requestDate: GosiCalendar;
  @Input() benefitType: string;
  //TODO: make system parameter and rundate local variable
  @Input() systemParameter: SystemParameter;
  @Input() systemRunDate: GosiCalendar;
  @Input() heirList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(null);
  @Input() dependentDetails: DependentDetails;
  @Input() isDraft = false;
  @Input() eligibilityStartDate: GosiCalendar;
  //For Modify Heir
  @Input() benefitStartDate: GosiCalendar;
  @Input() eligibleForPensionReform = false;
  /**
   * Output variables
   */
  @Output() save: EventEmitter<HeirDetailsRequest> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  //For Heir Add
  @Output() referenceNoChanged: EventEmitter<number> = new EventEmitter<number>();
  // systemParameter: SystemParameter;
  // systemRunDate: GosiCalendar;
  heirDetailsData: HeirDetailsRequest;
  eventTypeList: Lov[] = [];
  validateApiResponse: ValidateRequest;
  singleDepHeirDetails: DependentDetails;
  bankName: BilingualText;
  bankNameArray: BilingualText[] = [];
  eventAddedFor: RequestEventType;
  // bankDetails: BankAccountList;
  firstHeirAddedOrUpdated = false;
  showAddHeirButton = true;
  disableVerify: boolean;

  ngOnInit() {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
  }

  initializeParameters() {
    this.nationalityList$ = this.lookUpService.getNationalityList();
    this.initPaymentMethod();
    this.initialisePayeeType();
    this.initialiseCityLookup();
    this.initialiseCountryLookup();
    this.getSystemParamAndRundate();
    // this.initRelationShipLookup();
    this.initMaritalStatusLookup();
    this.initHeirStatusLookup();
    this.initYesOrNoLookup();
    this.searchResult = new PersonalInformation();
  }

  /* This method is to get dependent details */
  getSystemParamAndRundate() {
    this.manageBenefitService.getSystemParams().subscribe(res => {
      this.systemParameter = new SystemParameter().fromJsonToObject(res);
    });
    this.manageBenefitService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
    });
  }

  /*  This method is to get heir details  */
  // getHeirDetails(sin: number, heirDetailsData) {
  //   if (this.dependentService.getDependents()) {
  //     this.heirDetails = this.dependentService.getDependents();
  //     this.heirList = populateHeirDropDownValues(this.heirDetails);
  //   } else {
  //     this.heirBenefitService.getAllHeirDetails(sin, heirDetailsData, this.benefitType, 'true').subscribe(
  //       res => {
  //         this.heirDetails = setStatusForNicDependents(res);
  //         this.heirList = populateHeirDropDownValues(this.heirDetails);
  //         // this.heirDetails.forEach(eachHeir =>
  //         //   {
  //         //     eachHeir.showMandatoryDetails = true;
  //         //   });
  //       },
  //       err => {
  //         showErrorMessage(err, this.alertService);
  //       }
  //     );
  //   }
  //   this.manageBenefitService.getSystemParams().subscribe(res => {
  //     this.systemParameter = new SystemParameter().fromJsonToObject(res);
  //   });
  //   this.manageBenefitService.getSystemRunDate().subscribe(res => {
  //     this.systemRunDate = res;
  //   });
  // }
  /** Initializing cityList variable */
  initialiseCityLookup() {
    this.cityList$ = this.lookUpService.getCityList();
  }

  /** Initializing countryList variable */
  initialiseCountryLookup() {
    this.countryList$ = this.lookUpService.getCountryList();
  }

  /*  This method is to initialise  annuity RelationShip */
  initMaritalStatusLookup() {
    this.maritalStatus$ = this.lookUpService.getMaritalStatusLookup();
  }

  /**
   *
   * @param heir
   * Calling this funciton for adding new Heir/Unborn
   * After validation success payment details to be added
   */
  validateHeir(heir: DependentDetails) {
    if (
      this.pensionModify &&
      this.systemParameter?.OLD_LAW_DATE &&
      this.eligibilityStartDate?.gregorian &&
      moment(this.eligibilityStartDate?.gregorian).isBefore(moment(this.systemParameter?.OLD_LAW_DATE.toString())) &&
      moment(this.benefitStartDate?.gregorian).isBefore(moment(this.systemParameter?.OLD_LAW_DATE.toString()))
    ) {
      // Only applicable of old law
      // this.validateApiResponse = new ValidateRequest();
      // this.validateApiResponse.surplus = true;
      // return;
      const oldestEvent = getOldestEventFromResponse(
        heir.events.filter(item => {
          if (this.isValidator) {
            return item.actionType === ActionType.ADD || item.actionType === ActionType.REMOVE;
          }
          return (
            item.eventOrigin === EventAddedFrom.UI ||
            item.eventOrigin === EventAddedFrom.API ||
            item.dependentEventSource === DependentEventSource.UI_EVENT
          );
          // return !item.actionType &&
          //   item.actionType !== ActionType.NO_ACTION &&
          //   item.dependentEventSource === DependentEventSource.UI_EVENT
        })
      );
      this.heirBenefitService
        .validateSurplusEligibility(
          this.sin,
          this.benefitRequestId,
          heir.personId,
          oldestEvent?.eventStartDate,
          heir.relationship
        )
        .subscribe(
          surplus => {
            if (surplus.ineligibleHeir) {
              this.validateApiResponse = new ValidateRequest();
              this.validateApiResponse.surplus = true;
            } else {
              this.validate(heir);
            }
          },
          err => {
            showErrorMessage(err, this.alertService);
            scrollToTop();
          }
        );
    } else {
      this.validate(heir);
    }
  }

  validate(heir: DependentDetails) {
    let duplicate = [];
    if (!heir.editMode) {
      duplicate = this.heirDetails?.filter(eachDependent => {
        if(eachDependent.personId && heir.personId){
          return eachDependent.personId === heir.personId;
        }
      });
    }
    if (duplicate?.length && heir.relationship.english !== BenefitValues.unborn) {
      this.alertService.showErrorByKey('BENEFITS.HIER-ALREADY-ADDED');
    } else {
      heir.dependentSource = heir.dependentSource ? heir.dependentSource : BenefitValues.gosi;
      const arrayOfHeirs = getObjForValidate(this.heirDetails, heir.editMode ? [heir.personId] : []);
      const validateHeir = getObjForValidate([heir]);
      const data = this.getHeirValidateObjWithPensionReason();
      data.heirs = arrayOfHeirs;
      data.validateHeir = validateHeir[0];
      // this.addExistingEventsForModify(data.validateHeir);
      if (!this.sin) {
        this.sin = this.coreBenefitService.savedActiveBenefit?.sin;
      }
      if (!this.benefitRequestId) {
        this.benefitRequestId = this.coreBenefitService.savedActiveBenefit?.benefitRequestId;
      }
      if (this.page === 'modify') {
        data.validateHeir.benefitRequestId = this.benefitRequestId;
      }
      // const success = { valid: true, events: [] } as ValidateRequest;
      const benefitType = getHeirBenefitType(this.isPension, this.heirDetailsData?.reason?.english, this.benefitType);
      this.heirBenefitService.validateHeir(this.sin, data, this.page, this.benefitRequestId, benefitType).subscribe(
        success => {
          if (success[0]?.valid) {
            this.addedEvent = null;
          }
          if (heir.unborn) {
            heir.name = {
              arabic: { firstName: 'جنين', secondName: '', thirdName: '', familyName: '' } as ArabicName,
              english: { name: 'Unborn Child' }
            } as Name; // { arabic: 'حمل مستكن', english: 'Unborn' }
          }
          this.validateApiResponse = success[0];
          if (this.validateApiResponse) this.validateApiResponse.validatedHeir = deepCopy(heir);
        },
        err => {
          // this.validateApiResponse = err;
          showErrorMessage(err, this.alertService);
          scrollToTop();
        }
      );
    }
  }

  private addExistingEventsForModify(validateHeir: DependentModify | DependentDetails) {
    if (validateHeir.actionType === ActionType.MODIFY) {
      const existingEvents = this.copyOfHeirDetailsArray.filter(item => item.personId === validateHeir.personId)[0]
        ?.events;
      if (existingEvents?.length) {
        existingEvents?.forEach((event: HeirEvent) => {
          const duplicateEvents = getDuplicateEvents(event, validateHeir.events);
          if (!duplicateEvents.length) {
            validateHeir.events.push(event);
          }
        });
      }
    }
  }

  addHeir(heir: DependentDetails) {
    // this.heirAddSuccess(heir);
    this.alertService.clearAlerts();
    heir.backdated = true;
    const refNo = this.pensionModify && !this.isValidator && !this.firstHeirAddedOrUpdated ? null : this.referenceNo;
    const tempValidateResponse = heir.validateApiResponse;
    delete heir.validateApiResponse;
    heir.events = heir.events.filter(item => {
      return !item.odmRemovedEvent;
    });
    if (heir.bankAccount) {
      delete heir.bankAccount.verificationStatus;
      delete heir.bankAccount.approvalStatus;
      //if (heir.editMode)
      //heir.bankAccount.isNewlyAdded = false;
    }
    // this.addExistingEventsForModify(heir);
    // http://expapplvd09.gosi.ins:8030/clm-api/swagger-ui/#/Benefit/updateHeirDetails
    this.heirBenefitService
      .addHeir(this.sin, this.benefitRequestId, refNo, heir, this.isValidator || this.firstHeirAddedOrUpdated)
      .subscribe(
        res => {
          this.referenceNo = res.referenceNo;
          this.referenceNoChanged.emit(res.referenceNo);
          heir.validateApiResponse = tempValidateResponse;
          heir.eligibleHeir = res.eligibleHeir;
          heir.eligibleForBackdated = res.eligibleForBackdated;
          this.heirAddSuccess(heir, heir.editMode);
          this.alertService.showSuccess(res.message);
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
  }

  heirAddSuccess(heir: DependentDetails, update = false) {
    this.firstHeirAddedOrUpdated = true;
    heir.showGreenBorder = true;
    heir.editable = false;
    heir.showMandatoryDetails = false;
    this.bankName = null;
    heir.newlyAdded = heir.actionType === ActionType.MODIFY ? false : true;
    heir.newlyUpdated = update;
    heir.statusDateSelectedFromUi = heir.statusDate;
    // if (heir.validateApiResponse) {
    //passing eligibleHeir boolean for displaying not eligible status after adding heir
    heir.statusAfterValidation = getEligibilityStatusForHeirPensionLumpsumFromValidateApi(
      heir.validateApiResponse ? heir.validateApiResponse.events : heir.eligibilityList,
      heir.validateApiResponse ? heir.validateApiResponse.valid : heir.valid,
      this.benefitType,
      this.systemRunDate,
      !heir.eligibleHeir ? (!heir.eligibleForBackdated ? false : true) : true
    );
    //(!heir.eligibleHeir && !heir.eligibleForBackdated) ? false : true
    if (heir.validateApiResponse) {
      this.setValidatedValues(heir);
    }
    // } else {
    //   heir.statusAfterValidation = getEligibilityStatusForHeirPensionLumpsum(
    //     heir.eligibilityList,
    //     heir.valid,
    //     this.benefitType,
    //     this.systemRunDate,
    //     heir.eligibleHeir
    //   );
    // }
    if (update || heir.replaceItemWithIndex >= 0) {
      let index: number;
      if (heir.replaceItemWithIndex >= 0) {
        //For adding new born child to replace the child with user data
        index = heir.replaceItemWithIndex;
      } else {
        index = this.heirDetails.findIndex(element => {
          return element.personId === heir.personId;
        });
      }
      this.heirDetails[index] = heir;
    } else {
      if (heir.validateApiResponse) this.setValidatedValues(heir);
      this.heirDetails.push(heir);
      this.searchResult = new PersonalInformation();
      this.guardianDetails = new PersonalInformation();
      // this.resetSearch();
    }
    this.resetSearch();
    this.alertService.clearAlerts();
    this.listOfGuardians = this.getListOfGuardians(this.heirDetails, false);
    this.heirList = populateHeirDropDownValues(this.heirDetails);
    this.isSaveNextDisabled = false;
    this.showAddHeirButton = true;
  }

  delete(heirDetail: DependentDetails) {
    this.alertService.clearAlerts();
    this.heirBenefitService.deleteHeir(this.sin, this.benefitRequestId, heirDetail, this.referenceNo).subscribe(
      res => {
        //TODO: Delete from list
        this.heirDetails = this.heirDetails.filter(eachHier => {
          return eachHier.personId !== heirDetail.personId;
        });
        this.alertService.showSuccess(res);
        this.resetSearch();
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  validateUnborn(unborn: UnbornEdit) {
    // death action type is MODIFY, birth action type is REMOVE and no validate api, both will b having add heir api
    // test data 1052194345, 1011476502
    const unbornDetails = deepCopy(unborn.unbornDetails);
    unbornDetails.deathDate = unborn.deathDate;
    unbornDetails.dateOfBirth = unborn.dateOfBirth;
    unbornDetails.noOfChildren = unborn.noOfChildren;
    unbornDetails.unbornModificationReason = unborn.unbornModificationReason;
    unbornDetails.dependentSource = BenefitValues.gosi;
    unbornDetails.modificationRequestDate = getRequestDateFromForm(this.parentForm);
    // unborn.unbornDetails. = unborn.deathDate;
    const refNo = this.pensionModify && !this.firstHeirAddedOrUpdated ? null : this.referenceNo;
    const unbornIndexInList = this.heirDetails.findIndex(
      obj => obj.motherId === unbornDetails.motherId && obj.relationship.english === BenefitValues.unborn
    );
    if (unborn.deathDate) {
      unbornDetails.actionType = ActionType.MODIFY;
      unbornDetails.backdated = true;
      const arrayOfHeirs = getObjForValidateUnborn(this.heirDetails, [unbornDetails?.motherId]);
      // arrayOfHeirs[index].actionType = ActionType.MODIFY;
      const validateHeir = getObjForValidate([unbornDetails]);
      const data = this.getHeirValidateObjWithPensionReason();
      data.heirs = arrayOfHeirs;
      data.validateHeir = validateHeir[0];
      data.validateHeir.benefitRequestId = this.benefitRequestId;
      const benefitType = getHeirBenefitType(this.isPension, this.heirDetailsData?.reason?.english, this.benefitType);
      this.heirBenefitService.validateHeir(this.sin, data, this.page, this.benefitRequestId, benefitType).subscribe(
        validateResp => {
          this.heirBenefitService
            .addHeir(this.sin, this.benefitRequestId, refNo, unbornDetails, this.firstHeirAddedOrUpdated)
            .subscribe(
              res => {
                this.heirDetails = this.heirDetails.filter(
                  item =>
                    (!item.newBorn && item.motherId !== unbornDetails.motherId) ||
                    item.relationship?.english === BenefitValues.unborn
                );
                this.firstHeirAddedOrUpdated = true;
                this.referenceNo = res.referenceNo;
                this.referenceNoChanged.emit(res.referenceNo);
                this.heirDetails[unbornIndexInList].editable = false;
                this.heirDetails[unbornIndexInList].deathDate = unborn.deathDate;
                this.heirDetails[unbornIndexInList].eligibilityStatus = validateResp[0].status;
                this.heirDetails[unbornIndexInList].statusAfterValidation = validateResp[0].valid
                  ? DependentHeirConstants.eligible()
                  : DependentHeirConstants.notEligible();
                this.heirDetails[unbornIndexInList].lastStatusDate = validateResp[0].statusDate;
                this.heirDetails[unbornIndexInList].unbornModificationReason = unborn.unbornModificationReason;
                this.isSaveNextDisabled = false;
                this.alertService.showSuccess(res.message);
              },
              err => {
                showErrorMessage(err, this.alertService);
              }
            );
        },
        err => {
          // this.validateApiResponse = err;
          showErrorMessage(err, this.alertService);
          scrollToTop();
        }
      );
    } else {
      this.heirDetails = this.heirDetails.filter(
        item =>
          //clear the alredy added children if any
          (!item.newBorn && item.motherId !== unbornDetails.motherId) ||
          item.relationship?.english === BenefitValues.unborn
      );
      unbornDetails.actionType = ActionType.REMOVE;
      this.heirBenefitService
        .addHeir(this.sin, this.benefitRequestId, refNo, unbornDetails, this.firstHeirAddedOrUpdated)
        .subscribe(
          res => {
            this.firstHeirAddedOrUpdated = true;
            this.referenceNo = res.referenceNo;
            this.referenceNoChanged.emit(res.referenceNo);
            this.heirDetails[unbornIndexInList].editable = false;
            this.heirDetails[unbornIndexInList].dateOfBirth = unborn.dateOfBirth;
            this.heirDetails[unbornIndexInList].noOfChildren = unborn.noOfChildren;
            this.heirDetails[unbornIndexInList].unbornModificationReason = unborn.unbornModificationReason;
            this.isSaveNextDisabled = false;
            this.addBornChildesToTheList(unborn);
            this.alertService.showSuccess(res.message);
          },
          err => {
            showErrorMessage(err, this.alertService);
          }
        );
    }
  }

  /**
   * Set Heir pension reason to validate the heir
   */
  getHeirValidateObjWithPensionReason(): ValidateHeir {
    const data = new ValidateHeir();
    if (this.heirDetailsData?.eventDate?.gregorian)
      this.heirDetailsData.eventDate.gregorian = startOfDay(this.heirDetailsData?.eventDate?.gregorian);
    if (
      this.heirDetailsData?.reason?.english === BenefitValues.missingContributor ||
      this.heirDetailsData?.reason?.english === BenefitValues.ohMissingContributor
    ) {
      data.missingDate = this.heirDetailsData?.eventDate;
    } else {
      data.deathDate = this.heirDetailsData?.eventDate;
    }
    return data;
  }

  /* This method is to get deduction plan.  */
  initAdditionalContributionPlanLookup() {
    this.deductionPlanList$ = this.lookUpService.getAdditionalContributionPlan();
  }

  search(data: SearchPerson, benefitStartDate?: GosiCalendar) {
    this.disableVerify = true;
    if (benefitStartDate) {
      //Modify Scenario
      this.searchPerson(data, benefitStartDate);
    } else {
      //TODO: only to be called one time
      this.dependentService
        .getBenefitStartAndEligibilityDate(
          this.sin,
          this.benefitType,
          null,
          this.heirDetailsData,
          getRequestDateFromForm(this.parentForm)
        )
        .subscribe(
          res => {
            this.searchPerson(data, res.benefitStartDate, res.benefitEligibilityDate);
          },
          err => {
            this.disableVerify = false;
            showErrorMessage(err, this.alertService);
          }
        );
    }
  }

  searchPerson(data: SearchPerson, benefitStartDate: GosiCalendar, benefitEligibilityDate?: GosiCalendar) {
    const endDate = this.parentForm.get('requestDate')
      ? { gregorian: this.parentForm.get('requestDate.gregorian').value }
      : this.systemRunDate;
    const startDate = this.heirDetailsData.eventDate;
    let queryParams = buildQueryParamForSearchPerson(data);
    const effectiveDate = moment(benefitStartDate?.gregorian).format('YYYY-MM-DD');
    const eligibilityDate = benefitEligibilityDate?.gregorian
      ? moment(benefitEligibilityDate.gregorian).format('YYYY-MM-DD')
      : null;
    queryParams = queryParams.set('effectiveDate', effectiveDate);
    queryParams = queryParams.set('startDate', moment(startDate.gregorian).format('YYYY-MM-DD'));
    queryParams = queryParams.set('endDate', moment(endDate.gregorian).format('YYYY-MM-DD'));
    this.totalWage = null;
    this.manageBenefitService.getPersonDetailsApi(queryParams.toString()).subscribe(
      personalDetails => {
        this.disableVerify = false;
        this.searchResult = personalDetails.listOfPersons[0];
        if (this.searchResult.identity) {
          this.getAttorneyList(this.searchResult.identity, true);
        }
        if (data.newBorn) {
          this.annuityRelationShip$ = getNewBornRelationships();
        } else {
          this.annuityRelationShip$ = this.getRelationShipByGender(this.searchResult.sex, this.eligibleForPensionReform);
        }
        if (this.searchResult.personId) {
          this.manageBenefitService
            .getContributorDetails(this.searchResult.personId, eligibilityDate || effectiveDate)
            .subscribe(response => {
              if (response) this.totalWage = response.totalWage;
            });
          this.listOfGuardians = this.getListOfGuardians(this.heirDetails, data.isUnborn);
          //getGuardianDetails()
          if (this.heirDetailsData && this.heirDetailsData.eventDate) {
            this.calendarService
              .getHijiriAge(this.searchResult.birthDate, this.heirDetailsData.eventDate)
              .subscribe((res: any) => {
                this.searchResult.ageOnEligibilityDate = res;
              });
            this.events$ = this.qcs
              .getEventsFromApi(
                this.searchResult.personId,
                this.sin,
                this.heirDetailsData.eventDate,
                this.systemRunDate,
                this.benefitType
              )
              .pipe(
                tap(resp => {
                  Object.keys(resp).forEach(key => {
                    resp[key].map(event => {
                      event.eventOrigin = EventAddedFrom.API;
                      event.actionType = ActionType.ADD;
                      return resp;
                    });
                  });
                }),
                catchError(err => {
                  showErrorMessage(err, this.alertService);
                  return throwError(err);
                })
              );
          }
        }
        this.alertService.clearAlerts();
      },
      err => {
        this.disableVerify = false;
        if (err.status === 400 && err.error.code !== 'NIC-ERR-001' && err.error.code !== 'PM-ERR-4077') {
          this.searchPersonData = data;
          this.genderList$ = this.lookUpService.getGenderList();
          this.searchPersonData.birthDate = data.dob;
          if (this.heirDetailsData && this.heirDetailsData.eventDate) {
            this.calendarService
              .getHijiriAge(data?.dob ? data.dob : data?.birthDate, this.heirDetailsData.eventDate)
              .subscribe((res: any) => {
                this.searchPersonData.ageOnEligibilityDate = res;
              });
          }
          if (data.dob.calendarType === 'gregorian') {
            this.getHijiriAgeInMonths(data.dob as CalendarTypeHijiriGregorian, null);
          } else {
            this.getHijiriAgeInMonths(null, data.dob as CalendarTypeHijiriGregorian);
          }
          //this.annuityRelationShip$ = this.getRelationShipByGender(this.parentForm.get('personValues.gender')?.value);
        } else {
          showErrorMessage(err, this.alertService);
        }
      }
    );
  }

  /* This method is to initialise  heirStatus   */
  initHeirStatusLookup() {
    this.heirStatus$ = this.lookUpService.getHeirStatusList();
  }

  getBankForHeirs(identifier: number) {
    const heir = this.heirDetails.find(
      item =>
        item.personId === identifier || item.authorizedPersonId === identifier || item.guardianPersonId === identifier
    );
    //heir variable will be null for new Heir add
    let bankAccount = null;
    if (heir?.payeeType?.english === BenefitValues.authorizedPerson && heir.authorizedPersonId === identifier) {
      bankAccount = heir.bankAccount;
    } else if (heir?.payeeType?.english === BenefitValues.guardian && heir.guardianPersonId === identifier) {
      bankAccount = heir.bankAccount;
    } else if (heir?.payeeType?.english === BenefitValues.contributor && identifier === heir.personId) {
      bankAccount = heir.bankAccount;
    }
    this.getBankDetails(identifier, bankAccount);
  }
  getBankAtIndex(details) {
    const heir = this.heirDetails.find(
      item =>
        item.personId === details?.id ||
        item.authorizedPersonId === details?.id ||
        item.guardianPersonId === details?.id
    );
    //heir variable will be null for new Heir add
    let bankAccount = null;
    if (heir?.payeeType?.english === BenefitValues.authorizedPerson && heir.authorizedPersonId === details?.id) {
      bankAccount = heir.bankAccount;
    } else if (heir?.payeeType?.english === BenefitValues.guardian && heir.guardianPersonId === details?.id) {
      bankAccount = heir.bankAccount;
    } else if (heir?.payeeType?.english === BenefitValues.contributor && details?.id === heir.personId) {
      bankAccount = heir.bankAccount;
    }
    this.getBankDetails(details?.id, bankAccount, details?.index);
  }
  getBankDetailsOfHeir(personDetails: { personId: number; index: number }, benefitType?: string) {
    // const serviceType = benefitType ? getServiceType(benefitType) : null;
    // this.bankService.getBankAccountList(personDetails.personId, null).subscribe(res => {
    //   this.heirDetails[personDetails.index].existingIbanList = new PersonBankDetails();
    //   this.heirDetails[personDetails.index].existingIbanList.bankAccountList = res?.bankAccountList;
    // });
  }

  cancelTransaction() {
    this.cancel.emit();
  }

  //This method is to decline cancellation of transaction
  decline() {
    this.commonModalRef.hide();
  }

  getListOfGuardians(list: DependentDetails[] = [], isUnborn: boolean) {
    if (isUnborn) {
      this.guardians.push('Wife');
    }
    const guardianList = list.filter(eachItem => {
      return this.guardians.includes(eachItem.relationship?.english);
    });
    return guardianList;
  }

  resetSearch() {
    this.addedEvent = null;
    this.showAddHeirButton = true;
    this.showSearch = true; // as per Defect 466486 changed to true
    this.searchResult = new PersonalInformation();
    this.searchPersonData = null;
    this.validateApiResponse = null;
  }

  searchForGuardian(data: SearchPerson) {
    const idObjHeir: CommonIdentity | null = data?.identity.length ? getIdRemoveNullValue(data?.identity) : null;
    this.heirBenefitService.checkCustodian(idObjHeir.id, data.heirNin).subscribe(
      () => {
        const queryParams = buildQueryParamForSearchPerson(data);
        this.manageBenefitService.getPersonDetailsApi(queryParams.toString()).subscribe(
          personalDetails => {
            this.guardianDetails = null;
            this.guardianDetails = personalDetails.listOfPersons[0];
          },
          err => {
            showErrorMessage(err, this.alertService);
          }
        );
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  addEventPopup(templateRef: TemplateRef<HTMLElement>, event: RequestEventType) {
    event.sin = this.sin;
    this.eventAddedFor = event;
    // this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
    this.eventTypeList = [];
    if(event.heirPersonId){
      this.qcs.getEventTypes(event, this.eligibleForPensionReform).subscribe(
        eventTypes => {
          if (eventTypes.length) {
            eventTypes.forEach((value, index) => {
              const lov = new Lov();
              lov.sequence = index;
              lov.value = value;
              this.eventTypeList.push(lov);
            });
            this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
          }
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
    } else {
      this.eventTypeList = getEventTypesForQuestion(event.questionObj);
      this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
    }
  }

  closePopup() {
    this.modalRef.hide();
  }

  addEvent(event: AddEvent) {
    this.addedEvent = event;
    this.addedEvent.eventStartDate = calendarWithStartOfDay(event.eventStartDate);
    this.closePopup();
  }

  showIneligibilityDetails(templateRef: TemplateRef<HTMLElement>, details: DependentDetails) {
    this.singleDepHeirDetails = details;
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
  }

  getBankName(bankCode: number) {
    this.lookUpService.getBank(bankCode).subscribe(
      res => {
        if (res.items[0]) {
          this.bankName = res.items[0].value;
        }
      },
      err => showErrorMessage(err, this.alertService)
    );
  }
  getBankNameIban(bank) {
    this.lookUpService.getBank(bank.id).subscribe(
      res => {
        if (res.items[0]) {
          this.bankNameArray[bank.index] = res.items[0].value;
        }
      },
      err => showErrorMessage(err, this.alertService)
    );
  }
  setValidatedValues(dependentDetails: DependentDetails) {
    dependentDetails.heirStatus = dependentDetails.validateApiResponse.status;
    dependentDetails.status = dependentDetails.validateApiResponse.pensionStatus;
    dependentDetails.statusDate = dependentDetails.validateApiResponse.statusDate;
    dependentDetails.lastStatusDate = dependentDetails.validateApiResponse.statusDate;
    dependentDetails.valid = dependentDetails.validateApiResponse.valid;
    dependentDetails.birthDate = dependentDetails.nonSaudiHeirAdded
      ? dependentDetails?.dateOfBirth
      : dependentDetails.birthDate;
    dependentDetails.gender = dependentDetails?.sex || dependentDetails?.gender;
  }

  addBornChildesToTheList(data: UnbornEdit) {
    const unbornObj = new DependentDetails();
    unbornObj.name = {
      arabic: { firstName: 'طفل', secondName: '', thirdName: '', familyName: '' } as ArabicName,
      english: { name: 'Child' }
    } as Name;
    unbornObj.showMandatoryDetails = true;
    unbornObj.newBorn = true;
    // unbornObj.newlyAdded = true;
    unbornObj.dateOfBirth = data.dateOfBirth;
    unbornObj.motherId = data.unbornDetails?.motherId;
    unbornObj.beneficiaryId = data.unbornDetails?.beneficiaryId;
    unbornObj.unbornModificationReason = data.unbornDetails?.unbornModificationReason;
    for (let i = 0; i < data.noOfChildren; i++) {
      this.heirDetails.push(deepCopy(unbornObj));
    }
  }

  getRelationshipListByGender(gender: BilingualText) {
    this.lookUpService.clearLovMap(LookupCategory.ANNUITIES, LookupDomainName.ANNUITY_RELATIONSHIP);
    this.annuityRelationShip$ = this.lookUpService.getAnnuitiesRelationshipByGender(gender?.english);
  }

  getHijiriAgeInMonths(dobGregorian: CalendarTypeHijiriGregorian, dobHijiri: CalendarTypeHijiriGregorian) {
    this.calendarService
      .getHijiriAgeInMonths(dobGregorian, dobHijiri)
      .subscribe(res => (this.calcHijiriAgeInMonths = res));
  }

  getEventsForModify(personId) {
    const heir = this.heirDetails.filter(dep => dep.personId === personId)[0];
    let benefitStartDate = this.heirDetailsData.eventDate;
    if (!heir.newlyAdded && !this.isDraft) {
      const latestEventByStatusDate = heir?.events
        ? getLatestEventByStatusDate(heir.events.filter(item => item.statusDate))
        : null;
      if(latestEventByStatusDate){
        benefitStartDate = latestEventByStatusDate?.statusDate;
      }
    }
    this.events$ = this.qcs
      .getEventsFromApi(
        personId,
        this.sin,
        benefitStartDate,
        this.systemRunDate || {gregorian: new Date()},
        this.benefitType,
        this.pensionModify &&
          (!heir.actionType || heir.actionType === ActionType.MODIFY || heir.actionType === ActionType.NO_ACTION)
          ? true
          : false,
        this.eligibilityStartDate
      )
      .pipe(
        // map(val => {
        //   heir.editable = true;
        //   return val;
        // }),
        tap(resp => {
          heir.editable = true;
          Object.keys(resp).forEach(key => {
            resp[key].map(event => {
              event.eventOrigin = EventAddedFrom.API;
              event.actionType = ActionType.ADD;
              return resp;
            });
          });
        }),
        catchError(err => {
          showErrorMessage(err, this.alertService);
          return throwError(err);
        })
      );
  }

  get requestDateRawValue() {
    return (this.parentForm?.get('requestDate') as FormGroup).getRawValue();
  }
}
