/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  SimpleChanges,
  HostListener,
  OnChanges,
  Input,
  ViewChild,
  TemplateRef
} from '@angular/core';

import {
  DependentDetails,
  TableHeadingAndParamName,
  HeirPersonIds,
  ActionType,
  HeirStatus,
  populateHeirDropDownValues,
  PersonalInformation,
  showErrorMessage,
  deepCopy,
  HeirDetailsRequest,
  DependentModify,
  getObjForValidate,
  ValidateHeir,
  BenefitValues,
  ValidateRequest,
  AnnuityResponseDto,
  HeirStatusType,
  DependentHeirConstants,
  UnbornEdit,
  setPaymentDetailsToObjectFromForm,
  getLatestEventByStatusDate,
  AnnualNotificationCertificate,
  EligibilityRulesBenefitModificationDcComponent,
  EventAddedFrom,
  EventResponseDto
} from '../../shared';
import {
  IdentifierLengthEnum,
  ContactDetails,
  GosiCalendar,
  Lov,
  scrollToTop,
  startOfDay,
  LovList,
  Name,
  downloadFile,
  RouterData
} from '@gosi-ui/core';
import {FormGroup, FormArray} from '@angular/forms';
import {HeirBaseComponent} from '../base/heir.base-component';
import {Observable, BehaviorSubject, throwError} from 'rxjs';
import moment from 'moment-timezone';
import {catchError, tap} from 'rxjs/operators';
import {ReportConstants} from '@gosi-ui/features/collection/billing/lib/shared/constants';
import {ProgressWizardDcComponent} from '@gosi-ui/foundation-theme';

@Component({
  selector: 'bnt-heir-modify-sc',
  templateUrl: './heir-modify-sc.component.html',
  styleUrls: ['./heir-modify-sc.component.scss']
})
export class HeirModifyScComponent extends HeirBaseComponent implements OnInit, OnChanges {
  isToggleDisabled = false;
  maxLength = 10;
  isSmallScreen: boolean;
  dependentForm: FormGroup;
  iqamaLength = IdentifierLengthEnum.IQAMA;
  ninLength = IdentifierLengthEnum.NIN;
  tableHeadingAndParams: TableHeadingAndParamName[];
  unbornToggleForm: FormGroup;
  // addUnbornForm: FormGroup;
  isActionStatus = false;
  heading: string;
  heirStatusUpdated: ValidateRequest;
  annualNotificationDate: GosiCalendar;
  isOpenPopOver = false;

  @Input() heirActionType: string;
  @Input() contributorDeathOrMissingDate: GosiCalendar;
  @Input() appliedBenefitDetails: AnnuityResponseDto;
  @Input() isHeir = false;
  @Input() routerData: RouterData=null;
  @Input() addOrModifyHeir:boolean=false;
  reasonsList$: Observable<LovList>;

  ngOnInit(): void {
    super.ngOnInit();
    this.initializeParameters();
    this.page = 'modify';
    this.pensionModify = true;
    this.setActionType();
    this.setTableHeading();
    this.getScreenSize();
    // this.unbornToggleForm = this.createToggleForm();
    // this.addUnbornForm = this.createUnbornForm();
    this.setHeading();
    if (this.heirActionType === HeirStatus.START_WAIVE) {
      //this.initialiseWaivedTowardsLookup();
      this.initialiseWaivedHeirTowardsLookup();
    }
    // this.initModificationReasonForDependentsLookup();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.heirDetails && changes.heirDetails.currentValue) {
      // this.heirDetails = changes.heirDetails.currentValue;
      this.copyOfHeirDetailsArray = deepCopy(this.heirDetails);
      // this.heirDetails.forEach(eachDep => {
      //   if (eachDep.notificationDate && !this.annualNotificationDate)
      //     this.annualNotificationDate = eachDep.notificationDate;
      // });
      // if(!this.annualNotificationDate) {
      const heirsWithNotificationDate = this.heirDetails.filter(
        heir => heir.notificationDate && heir.notificationDate?.gregorian
      );
      if (heirsWithNotificationDate.length) {
        this.annualNotificationDate = heirsWithNotificationDate.reduce((r, o) =>
          moment(o.notificationDate?.gregorian) < moment(r.notificationDate?.gregorian) ? o : r
        ).notificationDate;
      }

      // }

      this.heirList = populateHeirDropDownValues(this.heirDetails);
      //To Remove
      // const data = new UnbornEdit()
      // data.noOfChildren = 4;
      // this.addBornChildesToTheList(data);
    }
    if (
      changes.appliedBenefitDetails &&
      changes.appliedBenefitDetails.currentValue &&
      changes.appliedBenefitDetails.currentValue.contributorId
    ) {
      this.heirDetailsData = new HeirDetailsRequest();
      this.heirDetailsData.reason = this.appliedBenefitDetails.heirBenefitReason;
      if (
        this.appliedBenefitDetails.heirBenefitReason.english === BenefitValues.missingContributor ||
        this.appliedBenefitDetails.heirBenefitReason.english === BenefitValues.ohMissingContributor
      ) {
        this.heirDetailsData.eventDate = this.appliedBenefitDetails?.missingDate;
      } else {
        this.heirDetailsData.eventDate = this.appliedBenefitDetails?.deathDate;
      }
    }
  }

  addAnotherDependent() {
    // Old law
    this.heirDetails.forEach(element => {
      element.editable = false;
    });
    if (
      this.systemParameter?.OLD_LAW_DATE &&
      this.eligibilityStartDate?.gregorian &&
      moment(this.eligibilityStartDate?.gregorian).isBefore(moment(this.systemParameter?.OLD_LAW_DATE.toString())) &&
      this.heirDetails.filter(item => {
        return !item.unbornModificationReason && (item.newlyAdded || item.newlyUpdated);
      }).length
    ) {
      this.isOpenPopOver = true;
    } else {
      this.showAddHeirButton = false;
    }
  }

  checkSaveAndNextDisable() {
    return (
      !this.isValidator &&
      this.isSaveNextDisabled &&
      (this.parentForm?.get('extendAnnualNotification') ? this.parentForm?.get('extendAnnualNotification')?.pristine : true)
    );
  }

  getDependentHeirEligibilityStatusModify(status: string) {
    switch (status) {
      case HeirStatusType.ACTIVE:
        return DependentHeirConstants.eligible();
      case HeirStatusType.ON_HOLD:
        return DependentHeirConstants.eligible();
      case HeirStatusType.WAIVED_TOWARDS_GOSI:
        return DependentHeirConstants.eligible();
      case HeirStatusType.WAIVED_TOWARDS_HEIR:
        return DependentHeirConstants.eligible();
      default:
        return DependentHeirConstants.notEligible();
    }
  }

  getModificationReason(personId: number, index: number) {
    this.heirDetails[index].editable = true;
    if (this.heirActionType === HeirStatus.HOLD) {
      this.reasonsList$ = this.lookUpService.getHeirHoldReasonList();
    } else if (this.heirActionType === HeirStatus.RESTART) {
      this.reasonsList$ = this.lookUpService.getRestartReasonList();
      if (this.heirDetails[index]?.identity) {
        this.getAttorneyList(this.heirDetails[index]?.identity);
      }
    } else if (this.heirDetails[index].relationship?.english === BenefitValues.unborn) {
      this.reasonsList$ = this.lookUpService.getUnbornModificationReasonList();
    }
  }

  /*
   * This method it to delete dependent
   */
  deleteDependent(perDetails: DependentDetails) {
    this.heirDetails = this.heirDetails.filter(dependentObj => {
      return dependentObj.personId !== perDetails.personId;
    });
  }

  setTableHeading() {
    if (
      this.heirActionType === HeirStatus.HOLD ||
      this.heirActionType === HeirStatus.RESTART ||
      this.heirActionType === HeirStatus.STOP ||
      this.heirActionType === HeirStatus.STOP_WAIVE ||
      this.heirActionType === HeirStatus.START_WAIVE
    ) {
      this.isSaveNextDisabled = false;
      this.tableHeadingAndParams = [
        {
          heading: 'BENEFITS.HEIR_NAME',
          parameterName: 'name'
        },
        {
          heading: 'BENEFITS.RELATIONSHIP-WITH-CONTRI',
          parameterName: 'relationship'
        },
        {
          heading: 'BENEFITS.DATE-OF-BIRTH-AGE-CAP',
          parameterName: 'ageWithDob'
        },
        {
          heading: 'BENEFITS.HEIR-STATUS-CAP',
          parameterName: 'heirStatus'
        },
        {
          heading: 'BENEFITS.STATUS-DATE',
          parameterName: 'lastStatusDate'
        },
        // Benefit amount not in new VD, Story 486338
        // {
        //   heading: 'BENEFITS.BENEFIT-AMOUNT-SAR-MONTH',
        //   parameterName: 'benefitAmount'
        // },
        {
          heading: 'BENEFITS.OTHER-BENEFITS',
          parameterName: 'otherBenefits'
        }
      ];
    } else {
      this.tableHeadingAndParams = [
        {
          heading: 'BENEFITS.HEIR_NAME',
          parameterName: 'name'
        },
        {
          heading: 'BENEFITS.RELATIONSHIP-WITH-CONTRI',
          parameterName: 'relationship'
        },
        {
          heading: 'BENEFITS.DATE-OF-BIRTH-AGE-CAP',
          parameterName: 'ageWithDob'
        },
        {
          heading: 'BENEFITS.HEIR-STATUS-CAP',
          parameterName: 'heirStatus'
        },
        {
          heading: 'BENEFITS.STATUS-DATE',
          parameterName: 'lastStatusDate'
        },
        {
          heading: 'BENEFITS.BENEFIT-STATUS',
          parameterName: 'eligibilityStatus'
        },
        {
          heading: 'BENEFITS.ELIGIBLITY-STATUS-CAP',
          parameterName: 'statusAfterValidation'
        }
      ];
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 768 ? true : false;
  }

  showHeader() {
    const listWithOutModify = this.heirDetails?.filter(eachDep => {
      return eachDep.actionType !== ActionType.REMOVE;
    });
    return listWithOutModify?.length;
  }

  applyForBenefit() {
    //For modify action hold/stop/restartwaiveBenefit
    const heirRequestDetails = new HeirDetailsRequest();
    // for only annual notif updated scenerio in add/modify heir
    heirRequestDetails.anyHeirAddedOrModified = this.heirDetails.findIndex(
      heir => heir.actionType === ActionType.ADD ||
        heir.actionType === ActionType.MODIFY
    ) >= 0;

   /*  if(this.routerData.channel !== 'taminaty' && this.routerData?.payload?.titleEnglish !== 'Add/Modify Heirs'){
      this.parentForm.markAllAsTouched();
    } */
    
    if (this.heirActionType) {
      let formValid = true;
      //If form is invalid and editing the status again
      const heirDetailsCopy = deepCopy(this.heirDetails);
      const formArray: FormArray = this.parentForm.get('listOfHeirs') as FormArray;
      formArray.controls.forEach((control, index) => {
        if (control.get('checkBoxFlag') && control.get('checkBoxFlag').value) {
          //Selected for modify
          if (control.get('eachPerson.statusChange') && control.get('eachPerson.statusChange').valid && control.get('eachPerson.statusChange.payeeForm.paymentMode.english')?.value !== BenefitValues.cheque) {
            const changedStatus = control.get('eachPerson.statusChange').value;
            heirDetailsCopy[index].actionType = this.heirActionType;
            // heirDetailsCopy[index].personId = this.heirDetail.personId,
            if (this.heirActionType === HeirStatus.HOLD || this.heirActionType === HeirStatus.RESTART) {
              heirDetailsCopy[index].statusDate = new GosiCalendar();
              heirDetailsCopy[index].statusDate.gregorian = startOfDay(this.systemRunDate?.gregorian);
            } else {
              heirDetailsCopy[index].statusDate = changedStatus.statusDate;
            }
            heirDetailsCopy[index].reasonForModification = changedStatus.reasonSelect;
            heirDetailsCopy[index].notes = changedStatus?.reasonNotes;
            if (control.get('eachPerson.statusChange.payeeForm')) {
              //Payment details for restart Heir benefit
              setPaymentDetailsToObjectFromForm(
                control.get('eachPerson.statusChange') as FormGroup,
                heirDetailsCopy[index]
              );
            }
          } else if (control.get('eachPerson.waiveBenefit') && control.get('eachPerson.waiveBenefit').valid) {
            const waiveHeirValues = control.get('eachPerson.waiveBenefit').value;
            heirDetailsCopy[index].actionType = waiveHeirValues.action;
            heirDetailsCopy[index].statusDate =
              this.heirActionType === HeirStatus.STOP_WAIVE ? waiveHeirValues.stopDate : waiveHeirValues.startDate;
            heirDetailsCopy[index].notes = waiveHeirValues.notes;
            heirDetailsCopy[index].benefitWaivedTowards = waiveHeirValues?.benefitWaivedTowards?.english;
          } else {
            formValid = false;
          }
        } else if (control.get('checkBoxFlag')) {
          heirDetailsCopy[index].actionType = ActionType.NO_ACTION;
        }
      });
      if (formValid) {
        // this.heirDetails = heirDetailsCopy;
        // heirRequestDetails.heirDetails = this.heirDetails;
        heirRequestDetails.heirDetails = heirDetailsCopy;
      
        this.save.emit(heirRequestDetails);
      } else {
        this.parentForm.markAllAsTouched();
        scrollToTop();
      }
    } else {
      // heirRequestDetails.heirDetails = this.heirDetails;
      if (this.heirDetails?.filter(eachHeir => eachHeir.showMandatoryDetails).length) {
        this.alertService.showErrorByKey('BENEFITS.ENTER-MANDATORY-DETAILS');
        scrollToTop();
      } else {
        if(this.addOrModifyHeir){
          this.parentForm.removeControl('extendAnnualNotification');
        }
        // heirRequestDetails to be passed in add/modify to get anyHeirAddedOrModified
        this.save.emit(heirRequestDetails);
      }
    }
  }

  getAuthPeronContactDetails(ids: HeirPersonIds) {
    this.manageBenefitService.getPersonDetailsWithPersonId(ids.authPersonId.toString()).subscribe(personalDetails => {
      if (personalDetails.contactDetail) {
        this.setContactDetail(personalDetails.contactDetail, ids.HeirId);
      } else {
        this.setContactDetail(null, ids.HeirId);
      }
    });
  }

  setContactDetail(contactDetail: ContactDetails, heirId: number) {
    if (this.searchResult.personId) {
      this.searchResult.agentContactDetails = contactDetail;
    } else {
      this.heirDetails.forEach((item, index) => {
        if (item.personId === heirId) {
          this.heirDetails[index].agentContactDetails = contactDetail;
        }
      });
    }
  }

  // method to edit dependent
  edit(index: number) {
    this.searchResult = null;
    this.addedEvent = null;
    this.validateApiResponse = null;
    this.events$ = new BehaviorSubject(new EventResponseDto());
    if (this.heirDetails[index].editable) {
      this.heirDetails[index].editable = false;
    } else {
      this.heirDetails.forEach(element => {
        element.editable = false;
      });
      if (this.heirDetails[index].newlyAdded || this.heirDetails[index].actionType === ActionType.ADD) {
        //relationship and attorney list
        this.calendarService
          .getHijiriAge(
            this.heirDetails[index].dateOfBirth || this.heirDetails[index].birthDate,
            this.heirDetailsData.eventDate
          )
          .subscribe((res: any) => {
              this.heirDetails[index].ageOnEligibilityDate = res;
              this.getDropdownsPopulated(this.heirDetails[index]);
              this.getEventsForModify(this.heirDetails[index].personId);
            },
            err => {
              showErrorMessage(err, this.alertService);
              scrollToTop();
            }
          );
      } else if (this.heirDetails[index].newBorn) {
        this.heirDetails[index].editable = true;
      } else if (!this.heirActionType && this.heirDetails[index].relationship?.english !== BenefitValues.unborn) {
        this.calendarService
          .getHijiriAge(
            this.heirDetails[index].dateOfBirth || this.heirDetails[index].birthDate,
            this.heirDetailsData.eventDate
          )
          .subscribe((res: any) => {
              this.heirDetails[index].ageOnEligibilityDate = res;
              this.heirDetails[index].editable = true;
            },
            err => {
              showErrorMessage(err, this.alertService);
              scrollToTop();
            }
          );
      } else {
        this.getModificationReason(this.heirDetails[index].personId, index);
      }
    }
  }

  getDropdownsPopulated(heir: DependentDetails) {
    if (heir.gender) {
      this.annuityRelationShip$ = this.lookUpService.getAnnuitiesRelationshipByGender(
        heir.gender.english.toUpperCase()
      );
    } else if (heir.sex) {
      this.annuityRelationShip$ = this.lookUpService.getAnnuitiesRelationshipByGender(heir.sex.english.toUpperCase());
    }
    //Get authorized persons list
    if (heir.identity) {
      this.getAttorneyList(heir.identity);
    }
  }

  getReasonForModification(index: number) {
    if (this.heirDetails[index].editable) {
      this.heirDetails[index].editable = false;
    } else {
      // this.heirDetails[index].editable = true;
      // if (this.heirActionType !== HeirStatus.START_WAIVE && this.heirActionType !== HeirStatus.STOP_WAIVE)
      //   this.getModificationReason(this.heirDetails[index].personId);
      if (this.heirActionType === HeirStatus.START_WAIVE || this.heirActionType === HeirStatus.STOP_WAIVE) {
        this.heirDetails[index].editable = true;
      } else {
        //Make it editable after getting the reason
        this.getModificationReason(this.heirDetails[index].personId, index);
      }
    }
  }

  setHeading() {
    if (this.heirActionType === HeirStatus.HOLD) {
      this.heading = 'BENEFITS.SELECT-HEIRS-HOLD-BENEFIT';
    } else if (this.heirActionType === HeirStatus.RESTART) {
      this.heading = 'BENEFITS.SELECT-HEIRS-RESTART-BENEFIT';
    } else if (this.heirActionType === HeirStatus.STOP) {
      this.heading = 'BENEFITS.SELECT-HEIRS-STOP-BENEFIT';
    } else if (this.heirActionType === HeirStatus.STOP_WAIVE) {
      this.heading = 'BENEFITS.SELECT-HEIRS-STOP-WAIVE';
    } else if (this.heirActionType === HeirStatus.START_WAIVE) {
      this.heading = 'BENEFITS.SELECT-HEIRS-START-WAIVE';
    } else {
      this.heading = 'BENEFITS.HEIR_DETAILS';
    }
  }

  /**
   * when reason for modification drop down selected from modificaiton-dc and when saved the status
   * with disability
   * @param heir
   */
  editHeirModifyReason(heir: DependentModify) {
    let heirs = getObjForValidate(this.heirDetails);
    heirs = heirs.filter(eachHeir => {
      return heir.personId !== eachHeir.personId;
    });
    const data = new ValidateHeir();
    data.heirs = heirs;
    data.validateHeir = heir;
    this.heirBenefitService.validateHeir(this.sin, data, this.page, this.benefitRequestId, this.benefitType).subscribe(
      res => {
        this.heirStatusUpdated = res[0];
        if (
          (heir.reasonForModification?.english === BenefitValues.changeInMonthlyWage && heir.income) ||
          (heir.reasonForModification?.english === BenefitValues.disabled && heir.statusDate)
        ) {
          /**
           * statusDate & income check in if condition to make sure that
           * the validate api is calling 2ns time when save button is clicked.
           *
           */

          this.setHeirStatus(heir);
        }
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  updateStatusDateForHeir(heir) {
    let heirs = getObjForValidate(this.heirDetails);
    heirs = heirs.filter(eachHeir => {
      return heir.personId !== eachHeir.personId;
    });
    const data = new ValidateHeir();
    data.heirs = heirs;
    data.validateHeir = heir;
    this.heirBenefitService.validateHeir(this.sin, data, this.page, this.benefitRequestId, this.benefitType).subscribe(
      res => {
        this.heirStatusUpdated = res[0];
        this.setHeirStatus(heir);
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  /**
   * when save button clicked from modificaton-dc (reason for modification),
   * after validating disable, change in monthly wage reasion for modification
   * @param heir
   */
  setHeirStatus(heir) {
    const index = this.heirDetails.findIndex(eachHier => eachHier.personId === heir.personId);
    this.heirDetails[index].actionType = heir.actionType;
    if (heir.statusDate) {
      this.heirDetails[index].statusDate = heir.statusDate;
      this.heirDetails[index].statusDate.gregorian = startOfDay(heir.statusDate.gregorian);
    }
    this.heirDetails[index].reasonForModification = heir.reasonForModification;
    this.heirDetails[index].editable = false;
    this.heirDetails[index].valid = true;
    this.heirDetails[index].income = heir.income;
    this.heirDetails[index].dependentSource = heir.dependentSource;
    this.heirDetails[index].existingIncome = heir.existingIncome;
    //For add/modify
    this.heirDetails[index].lastStatusDate = this.heirStatusUpdated.statusDate;
    this.heirDetails[index].eligibilityStatus = this.heirStatusUpdated.pensionStatus;

    this.heirDetails[index].heirStatus = this.heirStatusUpdated ? this.heirStatusUpdated.status : heir.heirStatus;
    this.heirDetails[index].status = this.heirStatusUpdated ? this.heirStatusUpdated.pensionStatus : heir.status;
    this.heirDetails[index].showGreenBorder = true;
    this.isSaveNextDisabled = false;
    this.heirStatusUpdated = null;
  }

  updateHeirStatus(data) {
    this.heirDetails.forEach(heir => {
      if (heir.personId === data.personId) {
        heir.newHeirStatus = data.newDependentStatus.status;
        this.isNewHeirStatus = true;
      } else {
        this.isNewHeirStatus = false;
      }
    });
    this.setTableHeading();
  }

  setActionType() {
    this.route.queryParams.subscribe(params => {
      this.heirActionType = params.actionType;
      if (
        this.heirActionType === HeirStatus.HOLD ||
        this.heirActionType === HeirStatus.RESTART ||
        this.heirActionType === HeirStatus.STOP
      ) {
        this.isActionStatus = true;
      }
      this.setTableHeading();
    });
  }

  // getEventsForModify(personId) {
  //   const index = this.heirDetails.findIndex(dep => dep.personId === personId)[0];
  //   const heir = this.heirDetails[index]
  //   let benefitStartDate = this.heirDetailsData.eventDate;
  //   if (!heir.newlyAdded) {
  //     const latestEventByStatusDate = getLatestEventByStatusDate(heir.events.filter(item => item.statusDate));
  //     benefitStartDate = latestEventByStatusDate?.statusDate;
  //   }
  //   this.events$ = this.qcs
  //     .getEventsFromApi(
  //       personId,
  //       this.sin,
  //       benefitStartDate,
  //       this.systemRunDate,
  //       this.benefitType,
  //       (
  //         !heir.actionType ||
  //         heir.actionType === ActionType.MODIFY ||heir.actionType === ActionType.NO_ACTION
  //       ) ? true : false,
  //       this.eligibilityStartDate
  //     )
  //     .pipe(
  //       tap(resp => {
  //         Object.keys(resp).forEach(key => {
  //           resp[key].map(event => {
  //             event.eventOrigin = EventAddedFrom.API;
  //             event.actionType = ActionType.ADD;
  //             return resp;
  //           })
  //         })
  //       }),
  //       catchError(err => {
  //         showErrorMessage(err, this.alertService);
  //         return throwError(err);
  //       })
  //     );
  // }

  downloadPdf(notificationFormValue: any) {
    // const data: AnnualNotificationDetailsDto = {
    //   dependents: this.heirDetails,
    //   notificationDate: notificationFormValue.date
    // };
    const data: AnnualNotificationCertificate = {
      dependents: this.heirDetails,
      notificationDate: notificationFormValue.date
    };
    this.dependentService.getBankCommitmentCertificate(this.sin, this.benefitRequestId, data).subscribe(
      response => {
        downloadFile(ReportConstants.PRINT_BILL_FILE_NAME, 'application/pdf', response);
      },
      err => {
        // this.validateApiResponse = err;
        showErrorMessage(err, this.alertService);
        scrollToTop();
      }
    );
  }

  openEligibilityRulesPopup(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, {class: 'modal-xl'}));
  }
}
