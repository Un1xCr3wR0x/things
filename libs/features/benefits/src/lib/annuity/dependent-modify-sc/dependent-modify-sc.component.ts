/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, HostListener, Input } from '@angular/core';
import {
  DependentDetails,
  TableHeadingAndParamName,
  SearchPerson,
  HeirStatus,
  deepCopy,
  PersonalInformation,
  showErrorMessage,
  getLatestEventByStatusDate,
  QuestionTypes,
  AnnualNotificationCertificate,
  getRequestDateFromForm
} from '../../shared';
import { DependentBaseComponent } from '../base/dependent.base-component';
import { IdentifierLengthEnum, GosiCalendar, scrollToTop, startOfDay, downloadFile } from '@gosi-ui/core';
import { getObjForValidate } from '../../shared/utils/validateDependentUtils';
import { FormControl, FormArray } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import moment from 'moment-timezone';
import { ReportConstants } from '@gosi-ui/features/collection/billing/lib/shared/constants';

@Component({
  selector: 'bnt-dependent-modify-sc',
  templateUrl: './dependent-modify-sc.component.html',
  styleUrls: ['./dependent-modify-sc.component.scss']
})
export class DependentModifyScComponent extends DependentBaseComponent implements OnInit {
  @Input() benefitStartDate: GosiCalendar; //Modify screen
  @Input() personDetails: PersonalInformation;
  @Input() isPension: boolean;
  @Input() isLumpsum = false;

  isUnborn = false;
  isToggleDisabled = false;
  unbornToggleControl = new FormControl();

  maxLength = 10;
  isSmallScreen: boolean;
  iqamaLength = IdentifierLengthEnum.IQAMA;
  ninLength = IdentifierLengthEnum.NIN;
  tableHeadingAndParams: TableHeadingAndParamName[];

  @Input() actionType: string;
  heading: string;

  ngOnInit(): void {
    this.nationalityList$ = this.lookUpService.getNationalityList();
    this.page = 'modify';
    this.pensionModify = true;
    this.getScreenSize();
    this.getStystemParamAndRundate();
    // this.initRelationShipLookup();
    this.initMaritalStatusLookup();
    this.initHeirStatusLookup();
    this.setTableHeading();
    this.setHeading();
    // this.initModificationReasonForDependentsLookup();
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }

  addAnotherDependent() {
    this.addDependent = true;
  }
  /*
   * This method it to delete dependent
   */
  deleteDependent(perDetails: DependentDetails) {
    this.listOfDependents = this.listOfDependents.filter(dependentObj => {
      return dependentObj.personId !== perDetails.personId;
    });
  }

  searchDependent(event: SearchPerson) {
    const eligibilityStartDate = this.parentForm.get('requestDate')
      ? getRequestDateFromForm(this.parentForm)
      : this.eligibilityStartDate;
    //Defect 622865,621698,621712 In case of adding a dependent : (A), params to be passed when calling event api are,Effective start date should be modification request date,Effective end date should be run date(current date).
    this.search(event, null, eligibilityStartDate, true);
  }

  setTableHeading() {
    if (this.actionType) {
      //TODO: Change heading params for dep
      this.tableHeadingAndParams = [
        {
          heading: 'BENEFITS.DEPENDENT-NAME',
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
          heading: 'BENEFITS.DEPENDENT-STATUS',
          parameterName: 'heirStatus'
        },
        {
          heading: 'BENEFITS.STATUS-DATE',
          parameterName: 'lastStatusDate'
        },
        {
          heading: 'BENEFITS.OTHER-BENEFITS',
          parameterName: 'otherBenefits'
        }
      ];
    } else {
      this.tableHeadingAndParams = [
        {
          heading: 'BENEFITS.DEPENDENT-NAME',
          parameterName: 'name'
        },
        {
          heading: 'BENEFITS.RELATIONSHIP-WITH-CONTRIBUTOR',
          parameterName: 'relationship'
        },
        {
          heading: 'BENEFITS.DATE-OF-BIRTH-AGE-CAP',
          parameterName: 'ageWithDob'
        },
        {
          heading: 'BENEFITS.DEPENDENT-STATUS',
          parameterName: 'heirStatus'
        },
        {
          heading: 'BENEFITS.STATUS-DATE',
          parameterName: 'lastStatusDate'
        },
        {
          heading: 'BENEFITS.DEPENDANCY-STATUS',
          parameterName: 'status'
        }
      ];
    }
  }

  checkForUnborn() {
    this.isUnborn = !this.isUnborn;
  }

  getReasonForModification(index: number) {
    if (this.listOfDependents[index].editable) {
      this.listOfDependents[index].editable = false;
    } else {
      this.getModificationReason(this.listOfDependents[index].personId, index, this.actionType);
    }

    // this.parentForm?.value?.listOfDependents.forEach(element => {
    //   if (element?.checkBoxFlag === true) {
    //     this.isSaveNextDisabled = false;
    //   } else {
    //     this.isSaveNextDisabled = true;
    //   }
    // });
  }

  /**
   * Update status date from dependent-modify-status-dc
   * @param dep
   */
  updateStatusDateForDependent(dep) {
    const index = this.listOfDependents.findIndex(eachDependent => eachDependent.personId === dep.personId);
    this.listOfDependents[index].actionType = dep.actionType;
    this.listOfDependents[index].statusDate = dep.statusDate;
    this.listOfDependents[index].reasonForModification = dep.reasonForModification;
    this.listOfDependents[index].editable = false;
    this.listOfDependents[index].valid = true;
    if (dep.heirStatus) this.listOfDependents[index].heirStatus = dep.heirStatus;
    if (dep.status) this.listOfDependents[index].status = dep.status;
    this.listOfDependents[index].showGreenBorder = true;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 768 ? true : false;
  }

  setHeading() {
    if (this.actionType === HeirStatus.HOLD) {
      this.heading = 'BENEFITS.SELECT-DEPENDENTS-HOLD-BENEFIT';
    } else if (this.actionType === HeirStatus.RESTART) {
      this.heading = 'BENEFITS.SELECT-DEPENDENTS-RESTART-BENEFIT';
    } else if (this.actionType === HeirStatus.STOP) {
      this.heading = 'BENEFITS.SELECT-DEPENDENTS-STOP-BENEFIT';
    } else {
      this.heading = 'BENEFITS.DEP-DETAILS';
    }
  }

  applyForBenefit() {
    if (this.actionType) {
      let formValid = true;
      //If form is invalid and editing the status again
      const dependentListCopy = deepCopy(this.listOfDependents);
      const formArray: FormArray = this.parentForm.get('listOfDependents') as FormArray;
      const selectedDependents = formArray.controls.filter(control => control.get('checkBoxFlag')?.value);
      if (selectedDependents.length > 0) {
        formArray.controls.forEach((control, index) => {
          if (control.get('checkBoxFlag') && control.get('checkBoxFlag').value) {
            //Selected for modify
            if (control.get('eachPerson.statusChange') && control.get('eachPerson.statusChange').valid) {
              const changedStatus = control.get('eachPerson.statusChange').value;
              dependentListCopy[index].actionType = this.actionType;
              // dependentListCopy[index].personId = this.heirDetail.personId,
              if (this.actionType === HeirStatus.HOLD || this.actionType === HeirStatus.RESTART) {
                dependentListCopy[index].statusDate = new GosiCalendar();
                dependentListCopy[index].statusDate.gregorian = moment(this.systemRunDate?.gregorian).toDate();
              } else {
                dependentListCopy[index].statusDate = changedStatus.statusDate;
              }

              // dependentListCopy[index].statusDate?.gregorian = startOfDay(dependentListCopy[index].statusDate?.gregorian);
              dependentListCopy[index].reasonForModification = changedStatus.reasonSelect;
              dependentListCopy[index].notes = changedStatus?.reasonNotes;
            } else {
              formValid = false;
              this.alertService.showMandatoryErrorMessage();
              this.parentForm.updateValueAndValidity();
              scrollToTop();
            }
          }
        });
      } else {
        formValid = false;
      }
      if (formValid) {
        // this.listOfDependents = dependentListCopy;
        // this.saveDependent(getObjForValidate(dependentListCopy), true);
        this.saveDependent(getObjForValidate(dependentListCopy));
      } else {
        this.parentForm.markAllAsTouched();
        this.parentForm.updateValueAndValidity();
        this.alertService.showMandatoryErrorMessage();
        scrollToTop();
      }
    } else {
      this.saveEvents();
      if (
        !(
          this.listOfDependents.findIndex(dependent => (dependent.actionType ? true : false)) >= 0 ||
          this.parentForm?.get('extendAnnualNotification')?.dirty
        )
      ) {
        this.alertService.showErrorByKey('BENEFITS.MANDATORY-FIELDS');
        return;
      }
      // this.saveDependent(getObjForValidate(this.listOfDependents), true);
      if (!this.actionType && this.parentForm?.get('extendAnnualNotification')) {
        if (this.parentForm.get('extendAnnualNotification')?.get('comments').valid) {
          //notes of extend annual notification is manadatory
          this.saveDependent(getObjForValidate(this.listOfDependents));
        } else {
          this.parentForm.markAllAsTouched();
          this.alertService.showErrorByKey('BENEFITS.MANDATORY-FIELDS');
        }
      } else {
        this.saveDependent(getObjForValidate(this.listOfDependents));
      }
    }
  }

  saveEvents() {
    return this.listOfDependents.map(dep => {
      this.savedDependents.forEach(saved => {
        if (dep.personId === saved.personId) {
          dep.events = saved.events;
          dep.actionType = saved.actionType;
        }
      });
    });
  }

  downloadPdf(notificationFormValue: any) {
    const data: AnnualNotificationCertificate = {
      dependents: this.listOfDependents,
      notificationDate: notificationFormValue.date
    };
    this.dependentService.getBankCommitmentCertificate(this.sin, this.benefitRequestId, data).subscribe(data => {
      downloadFile(ReportConstants.PRINT_BILL_FILE_NAME, 'application/pdf', data);
    });
  }
}
