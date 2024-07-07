import {
  DependentDetails,
  PersonalInformation,
  DependentModify,
  ValidateDependent,
  SearchPerson,
  ValidateRequest,
  AnnuityResponseDto,
  EventValidated,
  CalendarTypeHijiriGregorian,
  EventResponseDto
} from '../../shared/models';
import {OnInit, ViewChild, Directive, Input, EventEmitter, Output, TemplateRef} from '@angular/core';
import {Observable, throwError, BehaviorSubject} from 'rxjs';
import {SystemParameter} from '@gosi-ui/features/contributor';
import moment from 'moment';
import {
  buildQueryParamForSearchPerson,
  showErrorMessage,
  getImprissionmentDetailsFromForm,
  getDependentHeirEligibilityStatus,
  calendarWithStartOfDay,
  isJailedBenefit,
  getLatestEventByStatusDate,
  getRequestDateFromForm
} from '../../shared/utils';

import {getObjForValidate} from '../../shared/utils/validateDependentUtils';
import {BenefitValues} from '../../shared/enum/benefit-values';
import {
  scrollToTop,
  GosiCalendar,
  LovList,
  Lov,
  BilingualText,
  LookupCategory,
  LookupDomainName
} from '@gosi-ui/core';
import {BenefitBaseScComponent} from '../../shared/component/base/benefit-base-sc.component';
import {
  DependentAddEditDcComponent,
  HeirAddEditDcComponent,
  ActionType,
  DependentHeirConstants,
  BenefitStatus,
  HeirStatus,
  BenefitType,
  QuestionTypes,
  EventAddedFrom
} from '../../shared';
import {FormGroup} from '@angular/forms';
import {catchError, map, tap} from 'rxjs/operators';
import {RequestEventType, AddEvent} from '../../shared/models/questions';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {HijiriCalendar} from '@gosi-ui/foundation-theme/src/lib/components/widgets/input-hijiri-dc/models';

@Directive()
export abstract class DependentBaseComponent extends BenefitBaseScComponent implements OnInit {
  //Local variables
  nationalityList$: Observable<LovList>;
  searchResult: PersonalInformation;
  saveDepeDetailsAction: boolean;
  queryParams: string;
  annuityRelationShip$: Observable<LovList>;
  // reasonForModifyLov: Lov[] = [];
  heirStatus$: Observable<LovList>;
  canceldepndent: boolean;
  systemParameter: SystemParameter;
  systemRunDate: GosiCalendar;
  dependentStatusResp: ValidateRequest;
  addDependent = false;
  modalRef: BsModalRef;
  addedEvent: AddEvent;
  isSaveNextDisabled = true;
  isEligibleForBackdated: boolean;
  requestType: string;
  disableSave = false;
  // newDependentStatus: BilingualText;
  // isNewDependentStatus = false;
  heirStatusArr = [
    QuestionTypes.DISABLED,
    QuestionTypes.STUDENT,
    QuestionTypes.MARRIED,
    'divorced',
    'active',
    'widowed',
    QuestionTypes.EMPLOYED,
    QuestionTypes.DIVORCED_OR_WIDOWED,
    QuestionTypes.MARRIED_WIFE
  ];
  singleDepHeirDetails: DependentDetails;
  validateResponse: ValidateRequest;
  savedDependents: DependentModify[] = [];
  benefitStatusEnum = BenefitStatus;
  genderList$: Observable<LovList>;
  searchPersonData: SearchPerson;
  calcHijiriAgeInMonths: number;

  @ViewChild('addDependentChildComp')
  addDependentChildComp: DependentAddEditDcComponent;

  @ViewChild('addHeirChildComp')
  addHeirChildComp: HeirAddEditDcComponent;

  maritalStatus$: Observable<LovList>;
  page: string; //To know modify or add page;

  @Input() listOfDependents: DependentDetails[];
  @Input() sin: number;
  @Input() benefitType: string;
  @Input() requestDate: GosiCalendar;
  @Input() benefitRequestId: number;
  @Input() parentForm: FormGroup;
  @Input() isValidator = false;
  @Input() eligibilityStartDate: GosiCalendar;
  @Input() eligibleForBenefit = false;
  @Input() benefitStartDate: GosiCalendar;
  @Input() annuityResponse: AnnuityResponseDto;
  @Input() benefitStatus: BilingualText;
  @Input() isDraft = false;

  /**
   * Output
   */

  @Output() save: EventEmitter<DependentModify[]> = new EventEmitter();
  @Output() cancel = new EventEmitter();
  // highlightInvalid = false;
  eventTypeList: Lov[] = [];
  validateApiResponse: ValidateRequest;
  eventAddedFor: RequestEventType;
  reasonsList$: Observable<LovList>;
  eachEventFiltered: EventValidated[] = [];
  disableVerify = false;


  ngOnInit() {
  }

  /*
   * This method is to get dependent details
   */
  getStystemParamAndRundate() {
    this.manageBenefitService.getSystemParams().subscribe(res => {
      this.systemParameter = new SystemParameter().fromJsonToObject(res);
    });
    this.manageBenefitService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
    });
  }
  //Defect 622865,621698,621712 In case of adding a dependent : (A), params to be passed when calling event api are,Effective start date should be modification request date,Effective end date should be run date(current date).
  search(data: SearchPerson, benefitsForm: FormGroup, benefitStartDate?: GosiCalendar, isDepModify?: boolean) {
    // response from start-date api required for early retirement pension
    this.disableVerify = true;
    if (benefitStartDate) {
      this.searchPerson(data, benefitStartDate, isDepModify);
    } else {
      if (benefitsForm && benefitsForm.get('imprisonmentForm') && benefitsForm.get('imprisonmentForm').valid) {
        const imprissionmentDetails = getImprissionmentDetailsFromForm(
          benefitsForm.get('imprisonmentForm') as FormGroup
        );
        if (
          imprissionmentDetails.enteringDate === null &&
          this.dependentService.imprisonmentDetails &&
          this.dependentService.imprisonmentDetails.enteringDate
        ) {
          imprissionmentDetails.enteringDate = this.dependentService.imprisonmentDetails.enteringDate;
        }

        this.dependentService
          .getBenefitStartAndEligibilityDate(this.sin, this.benefitType, imprissionmentDetails)
          .subscribe(
            res => {
              this.searchPerson(data, res.benefitEligibilityDate);
            },
            err => {
              this.disableVerify = false;
              showErrorMessage(err, this.alertService);
            }
          );
      } else if (this.isAppPrivate && benefitsForm && benefitsForm.get('requestDate')) {
        //Early Retirement
        if (benefitsForm.get('requestDate').valid) {
          //api call
          this.dependentService
            .getBenefitStartAndEligibilityDate(
              this.sin,
              this.benefitType,
              null,
              null,
              (benefitsForm.get('requestDate') as FormGroup).getRawValue()
            )
            .subscribe(
              res => {
                this.searchPerson(data, res.benefitEligibilityDate);
              },
              err => {
                this.disableVerify = false;
                showErrorMessage(err, this.alertService);
              }
            );
        } else {
          benefitsForm.get('requestDate').markAllAsTouched();
          scrollToTop();
        }
      } else {
        this.dependentService.getBenefitStartAndEligibilityDate(this.sin, this.benefitType).subscribe(
          res => {
            this.eligibilityStartDate = res?.benefitEligibilityDate;
            this.searchPerson(data, res?.benefitEligibilityDate);
          },
          err => {
            this.disableVerify = false;
            showErrorMessage(err, this.alertService);
          }
        );
      }
    }
  }

  searchPerson(data: SearchPerson, benefitStartDate: GosiCalendar, isDepModify?: boolean) {
    let queryParams = buildQueryParamForSearchPerson(data);
    let endDate;
    if(isDepModify){
      endDate = this.systemRunDate || {gregorian: new Date()};
    }else{
      endDate = this.parentForm.get('requestDate')
      ? {gregorian: this.parentForm.get('requestDate.gregorian').value}
      : this.systemRunDate;
    }   
    if (benefitStartDate) {
      const effectiveDate = moment(benefitStartDate.gregorian).format('YYYY-MM-DD');
      queryParams = queryParams.set('effectiveDate', effectiveDate);
    }
    queryParams = queryParams.set('startDate', moment(benefitStartDate?.gregorian).format('YYYY-MM-DD'));
    queryParams = queryParams.set('endDate', moment(endDate?.gregorian).format('YYYY-MM-DD'));
    this.manageBenefitService.getPersonDetailsApi(queryParams.toString()).subscribe(
      personalDetails => {
        this.searchResult = personalDetails.listOfPersons[0];
        this.disableVerify = false;
        this.annuityRelationShip$ = this.getRelationShipByGender(this.searchResult?.sex);
        this.calendarService
          .getHijiriAge(
            this.searchResult.birthDate,
            this.eligibilityStartDate
          )
          .subscribe((res: number) => {
            this.searchResult.ageOnEligibilityDate = res;
          });
        //benefitStartDate not mandatory
        this.events$ = this.qcs
          .getEventsFromApi(
            this.searchResult.personId,
            this.sin,
            benefitStartDate || this.systemRunDate || {gregorian: new Date()},
            endDate,
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
        this.alertService.clearAlerts();
      },
      err => {
        this.disableVerify = false;
        if (err.status === 400 && err.error.code !== 'NIC-ERR-001' && err.error.code !== 'PM-ERR-4077') {
          this.searchPersonData = data;
          this.searchPersonData.birthDate = data.dob;
          this.genderList$ = this.lookUpService.getGenderList();
          this.calendarService
            .getHijiriAge(
              this.searchPersonData?.dob || this.searchPersonData?.birthDate,
              this.eligibilityStartDate
            )
            .subscribe((res: number) => {
              this.searchPersonData.ageOnEligibilityDate = res;
            });
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

  /*
   * This method is to initialise  annuity RelationShip
   */
  // initRelationShipLookup() {
  //   this.annuityRelationShip$ = this.lookUpService.getAnnuitiesRelationshipList();
  // }

  /*
   * This method is to initialise  annuity RelationShip
   */
  initMaritalStatusLookup() {
    this.maritalStatus$ = this.lookUpService.getMaritalStatusLookup();
  }

  /*
   * This method is to initialise  heirStatus
   */
  initHeirStatusLookup() {
    this.heirStatus$ = this.lookUpService.getHeirStatusList();
  }

  updateDependent(data: ValidateDependent) {
    const index = this.listOfDependents.findIndex(element => element.personId === data.validateDependent.personId);
    this.dependentService.updateDependent(this.sin, data, this.eligibilityStartDate, this.requestDate).subscribe(
      success => {
        this.alertService.clearAlerts();
        this.savedDependents.push(data.validateDependent);
        // const invalidEvents = success.events?.filter(event => !event.valid && event.eventCategory);
        // if (success.valid || !invalidEvents.length) {
        if (success.validEvent) {
          this.addedEvent = null;
          this.listOfDependents[index].statusAfterValidation = getDependentHeirEligibilityStatus(
            success.events,
            success.valid,
            this.systemRunDate,
            false,
            data.validateDependent
          );
          this.listOfDependents[index].studyStartDate = data.validateDependent.studyStartDate;
          this.listOfDependents[index].monthlyWage = data.validateDependent.monthlyWage;
          this.listOfDependents[index].disabilityStartDate = data.validateDependent.disabilityStartDate;
          this.listOfDependents[index].notificationDate = data.validateDependent.notificationDate;
          this.listOfDependents[index].maritalStatus = data.validateDependent.maritalStatus;
          this.listOfDependents[index].maritalStatusDate = data.validateDependent.maritalStatusDate;
          this.listOfDependents[index].deathDate = data.validateDependent.deathDate;
          this.listOfDependents[index].events = data.validateDependent.events;
          this.listOfDependents[index].relationship = data.validateDependent.relationship;
          this.listOfDependents[index].editable = false;
          this.listOfDependents[index].valid = success.valid;
          this.listOfDependents[index].actionType = data.validateDependent.actionType;
          this.listOfDependents[index].showGreenBorder = true;
          this.listOfDependents[index].hasMandatoryDetails = true;
          this.listOfDependents[index].heirStatus = success.status;
          this.listOfDependents[index].status = success.pensionStatus;
          this.listOfDependents[index].statusDate = data.validateDependent.statusDate;
          this.listOfDependents[index].statusDateSelectedFromUi = data.validateDependent.statusDate;
          this.listOfDependents[index].disabilityDescription = data.validateDependent.disabilityDescription;
          this.listOfDependents[index].lastStatusDate = success.statusDate;
          this.listOfDependents[index].showMandatoryDetails = false;
          this.listOfDependents[index].validateApiResponse = success;
          this.listOfDependents[index].personId = success?.personId;
          for (const status of this.heirStatusArr) {
            this.listOfDependents[index][status] = data.validateDependent[status];
          }
        } else {
          this.validateApiResponse = success;
          this.listOfDependents[index].errorMsg = success.message;
          this.listOfDependents[index].showGreenBorder = false;
        }
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  delete(dependent: DependentDetails) {
    // const index = this.listOfDependents.findIndex(eachDependent => eachDependent.personId === dependent.personId);
    // if (
    //     //   !dependent.receivedFromApi &&
    //     //   !this.listOfDependents[index].savedToDB &&
    //     //   dependent.newlyAdded &&
    //     //   dependent.actionType === ActionType.ADD
    //     // ) {
    if (
      dependent.newlyAdded ||
      dependent.actionType === ActionType.ADD
    ) {
      this.listOfDependents = this.listOfDependents.filter(dep => dep.personId !== dependent.personId);
    } else {
      // this.listOfDependents = this.listOfDependents.map(dep => dep.actionType = ActionType.REMOVE)
      // this.listOfDependents[index].actionType = ActionType.REMOVE;
      this.listOfDependents.forEach(eachDep => {
        if (eachDep.personId === dependent.personId) {
          eachDep.actionType = ActionType.REMOVE;
        }
      });
    }
  }

  /*
   * This method  is to validate dependent
   */
  validate(dep: DependentModify) {
    const duplicate = this.listOfDependents.filter(eachDependent => {
      return (
        eachDependent.personId === dep.personId &&
        eachDependent.actionType !== ActionType.MODIFY &&
        eachDependent.actionType !== ActionType.REMOVE
      );
    });
    if (duplicate.length) {
      this.alertService.showErrorByKey('BENEFITS.DEPENDENT-ALREADY-ADDED');
    } else {
      dep.dependentSource = dep.dependentSource ? dep.dependentSource : BenefitValues.gosi;
      dep.backdated = true;
      if (this.pensionModify) {
        dep.benefitRequestId = this.benefitRequestId;
      }
      const arrayOfDependents = getObjForValidate(this.listOfDependents);
      const data = {validateDependent: dep, dependents: arrayOfDependents};
      this.dependentService.updateDependent(this.sin, data, this.eligibilityStartDate, this.requestDate).subscribe(
        success => {
          // const invalidEvents = success.events?.filter(event => !event.valid && event.eventCategory);
          // if (success.valid || !invalidEvents.length) {
          if (success.validEvent) {
            //No error in events so add the dependent to list
            this.disableSave = true;
            this.alertService.clearAlerts();
            this.addedEvent = null;
            const dependent = new DependentDetails(this.searchResult?.identity || this.searchPersonData?.identity);
            dependent.showGreenBorder = true;
            const searchPersonDataVal = new PersonalInformation();
            searchPersonDataVal.identity = this.searchPersonData?.identity;
            searchPersonDataVal.name = dep?.name;
            searchPersonDataVal.sex = dep?.sex;
            searchPersonDataVal.birthDate = dep?.dateOfBirth;
            searchPersonDataVal.nationality = dep?.nationality;
            dep?.nonSaudiDependentAdded
              ? dependent.setValidatedValues(data.validateDependent, searchPersonDataVal)
              : dependent.setValidatedValues(data.validateDependent, this.searchResult);
            dependent.setSelectedStatus(data.validateDependent, this.heirStatusArr);
            dependent.statusAfterValidation = getDependentHeirEligibilityStatus(
              success.events,
              success.valid,
              this.systemRunDate,
              false,
              dependent
            );
            dependent.showMandatoryDetails = false;
            dependent.maritalStatus = dep.maritalStatus;
            dependent.deathDate = dep.deathDate;
            dependent.events = dep.events;
            // dependent.eligibleForBenefit = success.valid;
            // dependent.events = success.events;
            dependent.newlyAdded = true;
            dependent.heirStatus = success.status;
            dependent.status = success.pensionStatus;
            dependent.lastStatusDate = success.statusDate;
            dependent.statusDate = success.statusDate;
            dependent.valid = success.valid;
            dependent.statusDateSelectedFromUi = dep.statusDate;
            dependent.editable = false;
            dependent.validateApiResponse = success;
            dependent.nonSaudiDependentAdded = dep.nonSaudiDependentAdded;
            dependent.personId = success.personId;
            dependent.ageOnEligibilityDate = this.searchPersonData?.ageOnEligibilityDate;
            this.listOfDependents.push(dependent);
            this.searchResult = new PersonalInformation();
            this.searchPersonData = new SearchPerson();
            this.validateApiResponse = null;
            this.addDependent = false;
            this.alertService.clearAlerts();
            this.validateResponse = success;
            // this.eachEventFiltered = success.events.filter(eachEvent => eachEvent.eventType !== null);
            // if (this.eachEventFiltered[0].message) {
            //   this.alertService.showWarning(this.eachEventFiltered[0].message);
            // }
          } else {
            // this.eachEventFiltered = success.events.filter(eachEvent => eachEvent.eventType !== null);
            // if (this.eachEventFiltered[0]?.message) {
            //   this.alertService.showWarning(this.eachEventFiltered[0].message);
            // }
            this.disableSave = false;
            this.validateApiResponse = success;
          }
        },
        err => {
          this.validateApiResponse = err;
          showErrorMessage(err, this.alertService);
          scrollToTop();
        }
      );
    }
  }

  // method to reset search
  resetSearch() {
    this.addedEvent = null;
    this.searchResult = new PersonalInformation();
    this.searchPersonData = null;
    this.validateApiResponse = null;
  }

  // method to cancel edit
  cancelEdit(index: number) {
    this.listOfDependents[index].editable = false;
  }

  //This method is to decline cancellation of transaction
  decline() {
    this.commonModalRef.hide();
  }

  saveDependent(event: DependentModify[]) {
    // let invalidDependents = [];
    // if (!skipInvalidCheck) {
    //   invalidDependents = event.filter(dependent => {
    //     return (
    //       (dependent.valid === false &&
    //         dependent.actionType !== ActionType.MODIFY &&
    //         dependent.actionType !== ActionType.REMOVE) ||
    //       dependent.hasMandatoryDetails === false
    //     );
    //   });
    // }
    // if (invalidDependents.length === 0) {
    const invalidHeirs = this.listOfDependents.filter(eachHeir => {
      return eachHeir.showMandatoryDetails && (eachHeir?.actionType === ActionType.REMOVE ? false : true);
    });
    if (invalidHeirs.length) {
      // this.highlightInvalid = true;
      invalidHeirs.forEach(heir => {
        heir.showBorder = true;
      });

      this.alertService.showErrorByKey('BENEFITS.ENTER-MANDATORY-DETAILS');
      scrollToTop();
      return;
    }
    if (this.page === 'modify') {
      this.save.emit(event);
    } else if (
      (this.requestType === BenefitType.jailedContributorPension ||
        this.requestType === BenefitType.jailedContributorLumpsum) &&
      this.listOfDependents.length
    ) {
      const validDependents = this.listOfDependents.filter(eachDep => {
        return (
          eachDep.statusAfterValidation?.english === DependentHeirConstants.eligibleString &&
          eachDep.actionType !== ActionType.REMOVE
        );
      });
      if (validDependents.length) {
        this.save.emit(event);
      }
    } else {
      this.save.emit(event);
    }
    // } else {
    //   this.highlightInvalid = true;
    // }
  }

  cancelTransaction() {
    this.cancel.emit();
  }

  // method to update dependent
  update(dep: DependentModify) {
    let arrayOfDependents = getObjForValidate(this.listOfDependents);
    if (dep.actionType === ActionType.MODIFY || dep.actionType === ActionType.ADD) {
      arrayOfDependents = arrayOfDependents.filter(eachDep => {
        return dep.personId !== eachDep.personId;
      });
    }
    dep.backdated = true;
    this.updateDependent({validateDependent: dep, dependents: arrayOfDependents});
  }

  // this function will validate and update the reason for modification for the dependent
  validateDependentModifyReason(dep: DependentModify) {
    let arrayOfDependents = getObjForValidate(this.listOfDependents);
    arrayOfDependents = arrayOfDependents.filter(eachDep => {
      return dep.personId !== eachDep.personId;
    });
    //TODO: check if eligibilityStartDate needed to pass    this.dependentService

    this.dependentService
      .updateDependent(this.sin, {validateDependent: dep, dependents: arrayOfDependents}, null)
      .subscribe(res => {
        //dependentStatusResp variable will be passed down to the dc component to display new status
        this.dependentStatusResp = res;
      });
  }

  // method to edit dependent
  edit(index: number, requestDateChangedByValidator = false) {
    this.addedEvent = null;
    this.validateApiResponse = null;
    this.events$ = new BehaviorSubject(new EventResponseDto());

    if (this.listOfDependents[index].editable) {
      this.listOfDependents[index].editable = false;
    } else {
      this.listOfDependents.forEach(element => {
        element.editable = false;
      });
      if (
        this.page === 'modify' &&
        !this.listOfDependents[index].newlyAdded &&
        this.listOfDependents[index].actionType !== ActionType.ADD
      ) {
        this.getModificationReason(this.listOfDependents[index].personId, index);
      } else {
        this.calendarService
          .getHijiriAge(
            this.listOfDependents[index].dateOfBirth || this.listOfDependents[index].birthDate,
            this.eligibilityStartDate
          )
          .subscribe((res: any) => {
              this.getRelationshipByGender(index);
              this.listOfDependents[index].ageOnEligibilityDate = res;
              if (
                this.listOfDependents[index].dependentSource === BenefitValues.moj ||
                this.listOfDependents[index].dependentSource === BenefitValues.nic ||
                (this.isValidator && !this.isDraft)
              ) {
                // const requestDate = getRequestDateFromForm(this.parentForm);
                if (
                  requestDateChangedByValidator
                  // this.isValidator &&
                  // this.annuityResponse?.requestDate?.gregorian && requestDate.gregorian &&
                  // !moment(requestDate.gregorian).isSame(this.annuityResponse.requestDate.gregorian) ? true : false
                ) {
                  this.getEventsForModify(this.listOfDependents[index].personId, true);
                } else {
                  this.listOfDependents[index].editable = true;
                }
              } else {
                this.getEventsForModify(this.listOfDependents[index].personId);
              }
            },
            err => {
              showErrorMessage(err, this.alertService);
              scrollToTop();
            });
      }
    }
  }

  getRelationshipByGender(index: number) {
    const gender = this.listOfDependents[index].gender
      ? this.listOfDependents[index].gender.english
      : this.listOfDependents[index].sex
        ? this.listOfDependents[index].sex.english
        : '';
    this.annuityRelationShip$ = this.lookUpService.getAnnuitiesRelationshipByGender(gender.toUpperCase());
  }

  getModificationReason(personId: number, index: number, actionType?: string) {
    this.listOfDependents[index].editable = true;
    if (actionType === HeirStatus.HOLD) {
      this.reasonsList$ = this.lookUpService.getDepHoldReasonList();
    } else if (actionType === HeirStatus.RESTART) {
      this.reasonsList$ = this.lookUpService.getRestartReasonList();
    } else if (actionType) {
      this.manageBenefitService.getModificationReason(this.sin, this.benefitRequestId, personId, actionType).subscribe(
        reason => {
          const reasonForModifyLov: Lov[] = [];
          reason.forEach((value, reasonIndex) => {
            const lovReason = new Lov();
            lovReason.sequence = reasonIndex;
            lovReason.value = value;
            reasonForModifyLov.push(lovReason);
          });
          // this.listOfDependents[index].reasonForModifyLov = reasonForModifyLov;
          // this.listOfDependents[index].editable = true;
          const lov = new BehaviorSubject(new LovList(reasonForModifyLov));
          this.reasonsList$ = lov.asObservable();
        },
        err => {
          showErrorMessage(err, this.alertService);
          scrollToTop();
        }
      );
    }
  }

  addEventPopup(templateRef: TemplateRef<HTMLElement>, event: RequestEventType) {
    event.sin = this.sin;
    // this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
    this.eventAddedFor = event;
    this.eventTypeList = [];
    this.qcs.getEventTypesForDependent(event).subscribe(
      eventTypes => {
        if (eventTypes.length) {
          eventTypes.forEach((value, index) => {
            const lov = new Lov();
            lov.sequence = index;
            lov.value = value;
            this.eventTypeList.push(lov);
          });
          this.modalRef = this.modalService.show(templateRef, Object.assign({}, {class: 'modal-md'}));
        }
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  getHijiriAgeInMonths(dobGregorian: CalendarTypeHijiriGregorian, dobHijiri: CalendarTypeHijiriGregorian) {
    this.calendarService
      .getHijiriAgeInMonths(dobGregorian, dobHijiri)
      .subscribe(res => (this.calcHijiriAgeInMonths = res));
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
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, {class: 'modal-md'}));
    // this.modalRef.content["details"] = details;
  }

  getRelationShipByGender(sex: BilingualText) {
    return this.lookUpService.getAnnuitiesRelationshipByGender(sex?.english.toUpperCase());
  }

  getEventsForModify(personId, requestDateChanged = false) {
    const depDetails = this.listOfDependents.filter(dep => dep.personId === personId)[0];
    let benefitStartDate = getRequestDateFromForm(this.parentForm);
    if (!depDetails.newlyAdded && !requestDateChanged) {
      const latestEventByStatusDate = getLatestEventByStatusDate(
        depDetails.events?.filter(item => item.statusDate?.gregorian)
      );
      benefitStartDate = latestEventByStatusDate?.statusDate;
    }
    // As per confirmation from BE, getEventsFromApi is not to be called in validator edit screen when editing the dependent
    // when adding dependent from validator screen getEventsFromApi is required (in searchPerson)
    this.events$ = this.qcs.getEventsFromApi(
      personId,
      this.sin,
      benefitStartDate,
      this.systemRunDate || {gregorian: new Date()},
      this.benefitType,
      this.pensionModify && (
        !depDetails.actionType ||
        depDetails.actionType === ActionType.MODIFY ||
        depDetails.actionType === ActionType.NO_ACTION
      ) ? true : false,
      this.eligibilityStartDate
    ).pipe(
      tap(val => {
        depDetails.editable = true;
        Object.keys(val).forEach(key => {
          val[key].map(event => {
            event.eventOrigin = EventAddedFrom.API;
            event.actionType = ActionType.ADD;
            return val;
          })
        });
        return val;
      }),
      catchError(err => {
        showErrorMessage(err, this.alertService);
        return throwError(err);
      })
    );
  }

  getRelationshipListByGender(gender: BilingualText) {
    this.lookUpService.clearLovMap(LookupCategory.ANNUITIES, LookupDomainName.ANNUITY_RELATIONSHIP);
    this.annuityRelationShip$ = this.lookUpService.getAnnuitiesRelationshipByGender(gender?.english);
  }
}
